import axios from 'axios';
import { IOrder } from './order.model';
import { logger } from '../../common/utils/logger';
import { CustomError } from '../../common/middleware/errorHandler';
import NodeCache from 'node-cache';

const shiprocketCache = new NodeCache({ stdTTL: 82800 }); // 23 hours (token expires in 24)

export class ShiprocketService {
  private baseUrl = 'https://apiv2.shiprocket.in/v1/external';

  private async getAuthToken(): Promise<string> {
    const cachedToken = shiprocketCache.get<string>('token');
    if (cachedToken) return cachedToken;

    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      });

      const token = response.data.token;
      shiprocketCache.set('token', token);
      return token;
    } catch (error: any) {
      logger.error('Shiprocket Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Shiprocket');
    }
  }

  async createOrder(order: IOrder): Promise<any> {
    const token = await this.getAuthToken();

    // Map Order Items
    const orderItems = order.items.map(item => {
      // Ensure we get a valid SKU string
      let skuStr = 'SKU-GEN';
      if ((item.variant as any)?.sku) {
        skuStr = (item.variant as any).sku;
      } else if (typeof item.product === 'object' && (item.product as any)._id) {
        skuStr = (item.product as any)._id.toString();
      } else {
        skuStr = item.product.toString();
      }

      return {
        name: item.name,
        sku: skuStr,
        units: item.quantity,
        selling_price: item.price,
        hsn: 3307 // Default HSN for Candles/Home Decor if not provided
      };
    });

    // Format order date to YYYY-MM-DD HH:mm
    const formattedDate = new Date(order.createdAt).toISOString().replace('T', ' ').substring(0, 16);

    const payload = {
      order_id: order.orderNumber,
      order_date: formattedDate,
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
      billing_customer_name: order.shippingAddress.name,
      billing_last_name: '',
      billing_address: order.shippingAddress.address,
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: 'India',
      billing_email: order.shippingAddress.email || 'customer@example.com',
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      sub_total: Number(order.subtotal),
      length: 10,
      breadth: 10,
      height: 10,
      weight: Number(order.packageWeight) || 0.5
    };

    try {
      logger.info('Sending Shiprocket Payload:', JSON.stringify(payload, null, 2));
      const response = await axios.post(`${this.baseUrl}/orders/create/adhoc`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // SHIPROCKET VALIDATION: Even 200/201 can be a failure message
      if (response.data.status_code === 0 || response.data.message?.includes('Wrong Pickup location')) {
        throw new CustomError(response.data.message || 'Shiprocket validation failed', 400);
      }

      return response.data;
    } catch (error: any) {
      if (error instanceof CustomError) throw error;

      if (error.response?.data) {
        logger.error('Shiprocket API Error Detail:', error.response.data);
      }
      
      const fieldErrors = error.response?.data?.errors;
      const errorMsg = fieldErrors ? 
        Object.entries(fieldErrors).map(([f, m]: any) => `${f}: ${m}`).join(', ') : 
        (error.message || 'Failed to sync');
        
      throw new CustomError(errorMsg, 400);
    }
  }

  async generateAWB(shipmentId: number): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.post(`${this.baseUrl}/courier/assign/awb`, {
        shipment_id: shipmentId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      logger.error('Shiprocket AWB Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to generate AWB');
    }
  }

  async getLabel(shipmentIds: number[]): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.post(`${this.baseUrl}/courier/generate/label`, {
        shipment_id: shipmentIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      logger.error('Shiprocket Label Error:', error.response?.data || error.message);
      throw new Error('Failed to generate shipping label');
    }
  }

  async cancelOrder(shiprocketOrderId: number): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.post(`${this.baseUrl}/orders/cancel`, {
        ids: [shiprocketOrderId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      logger.error('Shiprocket Cancel Error:', error.response?.data || error.message);
      throw new Error('Failed to cancel Shiprocket order');
    }
  }

  async printInvoice(shiprocketOrderIds: number[]): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.post(`${this.baseUrl}/orders/print/invoice`, {
        ids: shiprocketOrderIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      logger.error('Shiprocket Invoice Error:', error.response?.data || error.message);
      throw new Error('Failed to generate Shiprocket invoice');
    }
  }
}

export const shiprocketService = new ShiprocketService();

import { Request, Response, NextFunction } from 'express';
import { Order } from './order.model';
import { orderService } from './order.service';
import { shiprocketService } from './shiprocket.service';
import { AuthRequest } from '../../common/middleware/auth';
import { CustomError } from '../../common/middleware/errorHandler';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;

    // Payload Transformation: Map frontend fields to backend schema
    const orderPayload = {
      ...req.body,
      shippingAddress: {
        ...req.body.shippingAddress,
        name: req.body.shippingAddress.fullName,
      }
    };

    const order = await orderService.createOrder(userId, orderPayload, ipAddress);

    res.status(201).json({
      success: true,
      data: {
        order,
        message: 'Order created successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId, paymentId, signature, razorpayOrderId } = req.body;

    if (!orderId || !paymentId || !signature || !razorpayOrderId) {
      throw new Error('Missing payment verification details');
    }

    const order = await orderService.verifyPayment(orderId, paymentId, signature, razorpayOrderId);
    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const orders = await orderService.getUserOrders(req.user.id, req.user.phone);
    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.role === 'admin' ? undefined : req.user?.id;
    const phone = req.user?.role === 'admin' ? undefined : req.user?.phone;
    const order = await orderService.getOrderById(req.params.id, userId, phone);

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const order = await orderService.cancelOrder(req.params.id, req.user.id);
    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await orderService.getAllOrders(Number(page), Number(limit));
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const updateShippingDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courierName, awbNumber, trackingUrl, packageWeight } = req.body;
    const order = await orderService.updateShippingDetails(req.params.id, {
      courierName,
      awbNumber,
      trackingUrl,
      packageWeight
    });
    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const manualVerifyOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new CustomError('Admin authorization required', 403);
    }
    const { isVerified } = req.body;
    const order = await orderService.manualVerifyOrder(req.params.id, req.user.id, isVerified);
    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await orderService.deleteOrder(req.params.id);
    res.json({
      success: true,
      data: { message: 'Order deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};

export const razorpayWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawBody = (req as any).rawBody;
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!rawBody || !signature) {
      res.status(400).json({ success: false, message: 'Invalid webhook request' });
      return;
    }

    const { paymentService } = await import('./payment.service');
    const isValid = paymentService.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid signature' });
      return;
    }

    const body = req.body;
    const event = body.event;

    // Handle payment.captured or payment.authorized
    if (event === 'payment.captured' || event === 'payment.authorized') {
      const paymentEntity = body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      if (razorpayOrderId) {
        const { Order } = await import('./order.model');
        const order = await Order.findOne({ razorpayOrderId });
        
        // If order exists and is not already verified
        if (order && order.paymentStatus !== 'verified') {
          order.paymentStatus = 'verified';
          order.status = 'pending_verification';
          order.razorpayPaymentId = razorpayPaymentId;
          await order.save();
        }
      }
    }

    // Webhook should always return 200 OK
    res.status(200).json({ success: true, message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Webhook Error:', error);
    // Still return 200 so Razorpay doesn't keep retrying unnecessarily if it's our internal logic error
    // but in a production system it's better to log it properly.
    res.status(200).json({ success: false, message: 'Webhook error handled' });
  }
};

// Shiprocket Integration Handlers
export const createShiprocketOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) throw new CustomError('Order not found', 404);

    const shiprocketData = await shiprocketService.createOrder(order as any);
    
    console.log('Shiprocket Response:', shiprocketData);

    // Update order with Shiprocket IDs
    const updatedOrder = await orderService.updateShippingDetails(req.params.id, {
      shiprocketOrderId: shiprocketData.order_id,
      shiprocketShipmentId: shiprocketData.shipment_id
    } as any);

    console.log('Updated Order with Shiprocket IDs:', {
      id: updatedOrder._id,
      sr_order: updatedOrder.shiprocketOrderId,
      sr_shipment: updatedOrder.shiprocketShipmentId
    });

    res.json({
      success: true,
      data: { 
        shiprocket: shiprocketData,
        order: updatedOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

export const generateShiprocketAWB = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) throw new CustomError('Order not found', 404);
    if (!order.shiprocketShipmentId) throw new CustomError('Shiprocket shipment not created for this order', 400);

    const awbData = await shiprocketService.generateAWB(order.shiprocketShipmentId);
    console.log('Shiprocket AWB Response:', JSON.stringify(awbData, null, 2));

    // SHIPROCKET VALIDATION: Check for assignment success
    if (awbData.awb_assign_status !== 1) {
      const errorMsg = awbData.message || awbData.response?.data?.awb_assign_error || 'AWB Assignment Failed';
      throw new CustomError(errorMsg, 400);
    }
    
    // Update order with AWB info
    const updatedOrder = await orderService.updateShippingDetails(req.params.id, {
      awbNumber: awbData.response?.data?.awb_code,
      courierName: awbData.response?.data?.courier_name,
      status: 'shipped'
    } as any);

    console.log('Saved Order AWB:', updatedOrder.awbNumber, 'Status:', updatedOrder.status);

    res.json({
      success: true,
      data: { 
        awb: awbData,
        order: updatedOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getShiprocketLabel = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shipmentId = Number(req.params.shipmentId);
    if (!shipmentId) throw new CustomError('Invalid shipment ID', 400);

    const labelData = await shiprocketService.getLabel([shipmentId]);
    
    res.json({
      success: true,
      data: labelData
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerInvoice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new CustomError('Order not found', 404);

    // Verify ownership
    if (order.user?.toString() !== req.user?.id && req.user?.role !== 'admin') {
      throw new CustomError('Unauthorized', 403);
    }

    // INDUSTRY STANDARD: Only allow invoice after shipping
    if (!['shipped', 'delivered'].includes(order.status)) {
      throw new CustomError('Invoice is available only after order is shipped', 400);
    }

    if (!order.shiprocketOrderId) {
      throw new CustomError('Official invoice not available for this order yet', 400);
    }

    const invoiceData = await shiprocketService.printInvoice([order.shiprocketOrderId]);
    
    res.json({
      success: true,
      data: {
        invoice_url: invoiceData.is_invoice_created ? invoiceData.invoice_url : null,
        message: invoiceData.is_invoice_created ? 'Success' : 'Invoice generation in progress'
      }
    });
  } catch (error) {
    next(error);
  }
};

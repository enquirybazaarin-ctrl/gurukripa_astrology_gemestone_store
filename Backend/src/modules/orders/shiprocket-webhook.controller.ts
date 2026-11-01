import { Request, Response, NextFunction } from 'express';
import { Order } from './order.model';
import { orderService } from './order.service';
import { logger } from '../../common/utils/logger';

/**
 * Shiprocket Webhook Controller
 * Handles real-time shipment status updates
 */
export const handleShiprocketWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = req.body;
    logger.info('Received Shiprocket Webhook:', {
      shipment_id: payload.shipment_id,
      awb: payload.awb,
      current_status: payload.current_status,
      status_code: payload.status_code
    });

    // 1. Find Order (by Shipment ID or AWB)
    const order = await Order.findOne({
      $or: [
        { shiprocketShipmentId: payload.shipment_id },
        { awbNumber: payload.awb }
      ]
    });

    if (!order) {
      logger.warn('Order not found for Shiprocket Webhook:', { shipment_id: payload.shipment_id, awb: payload.awb });
      // Still return 200 to Shiprocket so they stop retrying
      res.status(200).json({ success: true, message: 'Order not found, but acknowledged' });
      return;
    }

    // 2. Map Shiprocket Status to Internal Status
    // Mapping: https://www.shiprocket.in/blog/shiprocket-order-status-codes/
    // 6: Shipped, 7: Delivered, 17: Out for Delivery, 11: Returned, 13: Canceled
    let internalStatus: string | undefined;
    const statusCode = Number(payload.status_code);

    if (statusCode === 7) {
      internalStatus = 'delivered';
    } else if (statusCode === 6) {
      internalStatus = 'shipped';
    } else if (statusCode === 17) {
      // Keep 'shipped' internally but tracking will show "Out for Delivery"
      internalStatus = 'shipped';
    } else if (statusCode === 13) {
      internalStatus = 'cancelled';
    }

    // 3. Add to Tracking History
    await orderService.addTrackingHistory(
      order._id.toString(),
      {
        status: payload.current_status || 'Update',
        activity: payload.current_status_remark || payload.current_status || 'Shipment status updated',
        location: payload.current_location || 'Transit',
        timestamp: payload.current_timestamp ? new Date(payload.current_timestamp) : new Date()
      },
      internalStatus
    );

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error in Shiprocket Webhook:', error);
    // Return 200 anyway to prevent Shiprocket from retrying indefinitely on logic errors
    res.status(200).json({ success: false, message: 'Error processed' });
  }
};

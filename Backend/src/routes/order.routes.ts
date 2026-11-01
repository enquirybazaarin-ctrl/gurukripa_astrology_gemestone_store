import { Router } from 'express';
import { authenticate, authorizeAdmin, optionalAuthenticate } from '../common/middleware/auth';
import { orderRateLimiter } from '../common/middleware/rateLimiter';
import * as orderController from '../modules/orders/order.controller';
import { handleShiprocketWebhook } from '../modules/orders/shiprocket-webhook.controller';

const router = Router();

// Public Order Creation & Payment Verification
router.post('/', optionalAuthenticate, orderController.createOrder);
router.post('/verify-payment', orderController.verifyPayment);
router.post('/webhook', orderController.razorpayWebhook);
router.post('/shiprocket-webhook', handleShiprocketWebhook);

// Protected Routes
router.use(authenticate);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.get('/:id/invoice', orderController.getCustomerInvoice);
router.patch('/:id/cancel', orderController.cancelOrder);

// Admin Routes
router.get('/admin/all', authorizeAdmin, orderController.getAllOrders);
router.patch('/:id/status', authorizeAdmin, orderController.updateOrderStatus);
router.patch('/:id/shipping', authorizeAdmin, orderController.updateShippingDetails);
router.post('/:id/verify', authorizeAdmin, orderController.manualVerifyOrder);
router.delete('/:id', authorizeAdmin, orderController.deleteOrder);

// Shiprocket Admin Routes
router.post('/admin/shiprocket/create-order/:id', authorizeAdmin, orderController.createShiprocketOrder);
router.post('/admin/shiprocket/generate-awb/:id', authorizeAdmin, orderController.generateShiprocketAWB);
router.get('/admin/shiprocket/label/:shipmentId', authorizeAdmin, orderController.getShiprocketLabel);

export default router;

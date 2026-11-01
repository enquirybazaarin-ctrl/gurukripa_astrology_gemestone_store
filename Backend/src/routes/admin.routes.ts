import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../common/middleware/auth';
import * as adminController from '../modules/admin/admin.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorizeAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Products
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.patch('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Orders
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Bulk Enquiries
router.get('/bulk-enquiries', adminController.getAllBulkEnquiries);
router.patch('/bulk-enquiries/:id/status', adminController.updateBulkEnquiryStatus);
router.delete('/bulk-enquiries/:id', adminController.deleteBulkEnquiry);

// Reviews
router.patch('/reviews/:id/status', adminController.moderateReview);

// Analytics
router.get('/analytics/revenue', adminController.getRevenueAnalytics);
router.get('/analytics/products', adminController.getProductAnalytics);

export default router;

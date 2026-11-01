import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import bulkEnquiryRoutes from './bulkEnquiry.routes';
import reviewRoutes from './review.routes';
import adminRoutes from './admin.routes';
import bannerRoutes from './banner.routes';
import couponRoutes from './coupon.routes';
import addressRoutes from './address.routes';
import wishlistRoutes from './wishlist.routes';
import storyRoutes from './story.routes';
import settingsRoutes from '../modules/settings/settings.routes';

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/banners', bannerRoutes);
router.use('/stories', storyRoutes);
router.use('/reviews', reviewRoutes);
router.use('/settings', settingsRoutes);

// Protected routes (require authentication)
router.use('/orders', orderRoutes);
router.use('/addresses', addressRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/bulk-enquiries', bulkEnquiryRoutes);

// Admin routes
router.use('/admin', adminRoutes);
router.use('/admin/coupons', couponRoutes);

export default router;

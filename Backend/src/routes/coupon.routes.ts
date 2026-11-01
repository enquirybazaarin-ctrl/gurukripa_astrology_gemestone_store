import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../common/middleware/auth';
import * as couponController from '../modules/coupons/coupon.controller';

const router = Router();

// Public routes
router.post('/validate', couponController.validateCoupon);

// Admin routes
router.use(authenticate);
router.use(authorizeAdmin);

router.post('/', couponController.createCoupon);
router.get('/', couponController.getAllCoupons);
router.patch('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);

export default router;

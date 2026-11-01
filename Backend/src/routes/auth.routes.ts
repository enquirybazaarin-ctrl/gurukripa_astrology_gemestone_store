import { Router } from 'express';
import { authRateLimiter } from '../common/middleware/rateLimiter';
import { authenticate } from '../common/middleware/auth';
import * as authController from '../modules/auth/auth.controller';

const router = Router();

// Public Auth Routes
router.post('/login', authRateLimiter, authController.login);
router.post('/send-otp', authRateLimiter, authController.sendOTP);
router.post('/verify-otp', authRateLimiter, authController.verifyOTP);
router.post('/identify', authRateLimiter, authController.identify);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, authController.updateProfile);
router.get('/csrf-token', authenticate, authController.getCsrfTokenController);

export default router;

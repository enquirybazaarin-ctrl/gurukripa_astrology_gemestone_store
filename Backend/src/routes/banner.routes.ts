import { Router } from 'express';
import * as bannerController from '../modules/banners/banner.controller';

import { authenticate, authorizeAdmin } from '../common/middleware/auth';

const router = Router();

// Public routes
router.get('/', bannerController.getActiveBanners);

// Admin routes
router.use(authenticate);
router.use(authorizeAdmin);

router.get('/all', bannerController.getAllBanners);
router.post('/', bannerController.createBanner);
router.patch('/:id', bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

export default router;

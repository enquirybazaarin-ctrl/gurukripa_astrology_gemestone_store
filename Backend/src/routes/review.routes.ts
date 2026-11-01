import { Router } from 'express';
import { authenticate } from '../common/middleware/auth';
import * as reviewController from '../modules/reviews/review.controller';

const router = Router();

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes (User)
router.use(authenticate);
router.post('/', reviewController.createReview);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

// Admin Routes (Should use authorizeAdmin middleware)
import { authorizeAdmin } from '../common/middleware/auth';
const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use(authorizeAdmin);

adminRouter.get('/admin/all', reviewController.getAllReviews); // /api/v1/reviews/admin/all
adminRouter.post('/admin/create', reviewController.createManualReview);
adminRouter.patch('/admin/:id/approve', reviewController.toggleApproval);
adminRouter.put('/admin/:id', reviewController.adminUpdateReview);
adminRouter.delete('/admin/:id', reviewController.adminDeleteReview);

router.use('/', adminRouter);

export default router;

import { Router } from 'express';
import * as wishlistController from '../modules/wishlist/wishlist.controller';
import { authenticate } from '../common/middleware/auth';

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.post('/clear', wishlistController.clearWishlist);
router.get('/check/:productId', wishlistController.checkWishlist);

export default router;

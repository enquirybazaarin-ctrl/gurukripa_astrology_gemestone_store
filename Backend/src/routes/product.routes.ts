import { Router } from 'express';
import * as productController from '../modules/products/product.controller';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/autocomplete', productController.autocomplete);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);

import { authenticate, authorizeAdmin } from '../common/middleware/auth';

// Admin Routes (Protected)
router.post('/', authenticate, authorizeAdmin, productController.createProduct);
router.patch('/:id', authenticate, authorizeAdmin, productController.updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

export default router;

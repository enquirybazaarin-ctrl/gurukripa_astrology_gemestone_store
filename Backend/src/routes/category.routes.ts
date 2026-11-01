import { Router } from 'express';
import * as categoryController from '../modules/categories/category.controller';
import { authenticate, authorizeAdmin } from '../common/middleware/auth';

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, categoryController.createCategory);
router.put('/:id', authenticate, authorizeAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, authorizeAdmin, categoryController.deleteCategory);

export default router;

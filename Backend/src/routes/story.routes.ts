import { Router } from 'express';
import * as storyController from '../modules/stories/story.controller';
import { authenticate, authorizeAdmin } from '../common/middleware/auth';
import { upload } from '../common/utils/fileUpload';

const router = Router();

// Public routes
router.get('/', storyController.getActiveStories);
router.post('/:id/view', storyController.incrementViews);

// Admin routes (require admin authentication)
router.get('/all', authenticate, authorizeAdmin, storyController.getAllStories);

const storyUpload = upload.fields([
    { name: 'story-video', maxCount: 1 },
    { name: 'story-logo', maxCount: 1 }
]);

router.post('/', authenticate, authorizeAdmin, storyUpload, storyController.createStory);
router.put('/:id', authenticate, authorizeAdmin, storyUpload, storyController.updateStory);
router.delete('/:id', authenticate, authorizeAdmin, storyController.deleteStory);
router.post('/reorder', authenticate, authorizeAdmin, storyController.reorderStories);

export default router;


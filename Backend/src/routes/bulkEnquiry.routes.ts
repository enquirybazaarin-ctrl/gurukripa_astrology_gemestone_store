import { Router } from 'express';
import { authenticate } from '../common/middleware/auth';
import * as bulkEnquiryController from '../modules/bulk-enquiries/bulkEnquiry.controller';

const router = Router();

// Public route (customers can submit without login)
router.post('/', bulkEnquiryController.createBulkEnquiry);

// Protected route (to view own enquiries)
router.get('/my-enquiries', authenticate, bulkEnquiryController.getMyEnquiries);

export default router;

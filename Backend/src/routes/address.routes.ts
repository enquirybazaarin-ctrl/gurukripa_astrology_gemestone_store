import { Router } from 'express';
import { authenticate } from '../common/middleware/auth';
import * as addressController from '../modules/addresses/address.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', addressController.createAddress);
router.get('/', addressController.getUserAddresses);
router.patch('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.patch('/:id/set-default', addressController.setDefaultAddress);

export default router;

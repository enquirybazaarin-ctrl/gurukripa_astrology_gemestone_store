import express from 'express';
import { getSetting, updateSetting } from './settings.controller';
import { authenticate, authorizeAdmin } from '../../common/middleware/auth';

const router = express.Router();

// --- Public Routes ---
router.get('/public/:key', getSetting);

// --- Admin Routes ---
// Apply auth middleware to all routes below
router.use(authenticate);
router.use(authorizeAdmin);

router.get('/:key', getSetting);
router.put('/:key', updateSetting);

export default router;

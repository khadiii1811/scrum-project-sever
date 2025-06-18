import express from 'express';
import { getLeaveDaysLeft } from '../controllers/leaveBalanceController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route GET /leave-balance/left
 * @desc Get leave days left for current user (requires authentication token)
 * @access Private
 */
router.get('/leave-balance/left', authenticate, getLeaveDaysLeft);

export default router; 
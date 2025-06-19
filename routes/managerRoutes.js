import express from 'express';
import { authenticate, requireManager } from '../middlewares/auth.js';
import { getAllEmployeesLeaveRequests } from '../controllers/managerController.js';

const router = express.Router();

/**
 * @route GET /manager/employees-leave-requests
 * @desc Get all employees' leave requests with user info (manager only)
 * @access Private (manager)
 */
router.get('/employees-leave-requests', authenticate, requireManager, getAllEmployeesLeaveRequests);

export default router; 
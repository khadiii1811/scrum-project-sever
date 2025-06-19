import express from 'express';
import { authenticate, requireManager } from '../middlewares/auth.js';
import { getAllEmployeesLeaveRequests } from '../controllers/managerController.js';
import { approveLeaveRequest } from '../controllers/managerController.js';

const router = express.Router();

/**
 * @route GET /manager/employees-leave-requests
 * @desc Get all employees' leave requests with user info (manager only)
 * @access Private (manager)
 */
router.get('/employees-leave-requests', authenticate, requireManager, getAllEmployeesLeaveRequests);

/**
 * @route PUT /manager/leave-requests/:id/approve
 * @desc Approve leave request (manager only)
 * @access Private (manager)
 */
router.put('/leave-requests/:id/approve', authenticate, requireManager, approveLeaveRequest);

export default router; 
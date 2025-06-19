import express from 'express';
import { authenticate, requireManager } from '../middlewares/auth.js';
import { getAllEmployeesLeaveRequests } from '../controllers/managerController.js';
import { approveLeaveRequest, rejectLeaveRequest } from '../controllers/managerController.js';
import { carryOverLeaveDays } from '../jobs/carryOverLeave.js';

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

/**
 * @route PUT /manager/leave-requests/:id/reject
 * @desc Reject leave request (manager only)
 * @access Private (manager)
 */
router.put('/leave-requests/:id/reject', authenticate, requireManager, rejectLeaveRequest);

/**
 * @route POST /manager/test-carry-over
 * @desc Test carry over leave days manually
 * @access Private (manager)
 */
router.post('/test-carry-over', async (req, res) => {
  await carryOverLeaveDays();
  res.json({ success: true, message: 'Carry over leave days executed!' });
});

export default router; 
import express from 'express';
import { 
  createLeaveRequest, 
  getAllLeaveRequests, 
  getLeaveRequestById, 
  getLeaveRequestsByUser,
  approveLeaveRequest,
  rejectLeaveRequest,
  deleteLeaveRequest
} from '../controllers/leaveRequestController.js';
import { authenticate, requireManager, requireEmployee } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route GET /leave-requests
 * @desc Get leave requests for current user (employee) or all requests (manager)
 * @access Private
 */
router.get('/leave-requests', authenticate, async (req, res) => {
  try {
    // If user is manager, get all requests
    if (req.user.role === 'manager') {
      return getAllLeaveRequests(req, res);
    }
    
    // If user is employee, get only their requests
    req.params = { user_id: req.user.user_id };
    return getLeaveRequestsByUser(req, res);
  } catch (error) {
    console.error('Error getting leave requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @route GET /leave-requests/all
 * @desc Get all leave requests (manager only)
 * @access Private (manager)
 */
router.get('/leave-requests/all', authenticate, requireManager, getAllLeaveRequests);

/**
 * @route GET /leave-requests/:id
 * @desc Get leave request by ID
 * @access Private
 */
router.get('/leave-requests/:id', authenticate, getLeaveRequestById);

/**
 * @route GET /leave-requests/user/:user_id
 * @desc Get leave requests by user ID
 * @access Private
 */
router.get('/leave-requests/user/:user_id', authenticate, getLeaveRequestsByUser);

/**
 * @route POST /leave-requests
 * @desc Create a new leave request
 * @access Private (employee)
 */
router.post('/leave-requests', authenticate, requireEmployee, createLeaveRequest);

/**
 * @route PUT /leave-requests/:id/approve
 * @desc Approve leave request
 * @access Private (manager)
 */
router.put('/leave-requests/:id/approve', authenticate, requireManager, approveLeaveRequest);

/**
 * @route PUT /leave-requests/:id/reject
 * @desc Reject leave request
 * @access Private (manager)
 */
router.put('/leave-requests/:id/reject', authenticate, requireManager, rejectLeaveRequest);

/**
 * @route DELETE /leave-requests/:id
 * @desc Delete leave request
 * @access Private (employee - own requests, manager - all requests)
 */
router.delete('/leave-requests/:id', authenticate, deleteLeaveRequest);

export default router;
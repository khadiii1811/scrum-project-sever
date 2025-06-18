import LeaveRequest from '../models/leave-requests.js';
import LeaveBalance from '../models/leave-balances.js';

/**
 * Create a new leave request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createLeaveRequest = async (req, res) => {
  try {
    // Lấy user_id từ middleware auth
    const user_id = req.user.user_id;
    const { reason, leave_dates } = req.body;

    // Validate required fields
    if (!reason || !leave_dates) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: reason, leave_dates'
      });
    }

    // Validate leave_dates is array
    if (!Array.isArray(leave_dates) || leave_dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'leave_dates must be a non-empty array'
      });
    }

    // Validate tất cả ngày xin nghỉ phải là ngày trong tương lai (so sánh local date)
        const now = new Date();
      const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // local 00:00:00
      const invalidDate = leave_dates.find(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const leaveDate = new Date(year, month - 1, day); // local 00:00:00
        console.log('todayLocal:', todayLocal, 'leaveDate:', leaveDate, 'dateStr:', dateStr);
        return leaveDate <= todayLocal;
      });
    if (invalidDate) {
      return res.status(400).json({
        success: false,
        message: `The selected leave date (${invalidDate}) must be a future date.`
      });
    }

    // Lấy năm hiện tại
    const year = new Date(leave_dates[0]).getFullYear();

    // Truy vấn leave_balances
    const balance = await LeaveBalance.getByUserAndYear(user_id, year);
    if (!balance) {
      return res.status(400).json({
        success: false,
        message: 'No leave balance found for this year.'
      });
    }

    // Tính remaining
    const remaining = balance.total_days + balance.carried_over_days - balance.used_days;
    if (leave_dates.length > remaining) {
      return res.status(400).json({
        success: false,
        message: `Not enough leave quota. Remaining: ${remaining}, requested: ${leave_dates.length}`
      });
    }

    // Create leave request
    const leaveRequest = await LeaveRequest.create({
      user_id,
      reason,
      leave_dates,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Leave request created successfully',
      data: leaveRequest.toJSON()
    });
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get all leave requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.getAll();
    
    res.status(200).json({
      success: true,
      message: 'Leave requests retrieved successfully',
      data: leaveRequests.map(request => request.toJSON())
    });
  } catch (error) {
    console.error('Error getting leave requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get leave request by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.getById(parseInt(id));

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Leave request retrieved successfully',
      data: leaveRequest.toJSON()
    });
  } catch (error) {
    console.error('Error getting leave request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get leave requests by user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getLeaveRequestsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const leaveRequests = await LeaveRequest.getByUser(parseInt(user_id));

    res.status(200).json({
      success: true,
      message: 'User leave requests retrieved successfully',
      data: leaveRequests.map(request => request.toJSON())
    });
  } catch (error) {
    console.error('Error getting user leave requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Approve leave request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const approveLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved_days } = req.body;

    const leaveRequest = await LeaveRequest.getById(parseInt(id));
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    await leaveRequest.approve(approved_days);

    res.status(200).json({
      success: true,
      message: 'Leave request approved successfully',
      data: leaveRequest.toJSON()
    });
  } catch (error) {
    console.error('Error approving leave request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Reject leave request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const rejectLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const leaveRequest = await LeaveRequest.getById(parseInt(id));
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    await leaveRequest.reject(reason);

    res.status(200).json({
      success: true,
      message: 'Leave request rejected successfully',
      data: leaveRequest.toJSON()
    });
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Delete leave request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LeaveRequest.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Leave request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

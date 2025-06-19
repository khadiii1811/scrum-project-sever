import LeaveRequest from '../models/leave-requests.js';

/**
 * Get all employees' leave requests with user info
 * @route GET /employees-leave-requests
 * @access Private (manager)
 */
export const getAllEmployeesLeaveRequests = async (req, res) => {
  try {
    // Lấy tất cả đơn nghỉ phép
    const leaveRequests = await LeaveRequest.getAll();
    // Lấy danh sách user_id duy nhất
    const userIds = [...new Set(leaveRequests.map(r => r.user_id))];
    // Lấy thông tin user
    const User = (await import('../models/user.js')).default;
    const users = await Promise.all(userIds.map(id => User.getById(id)));
    const userMap = {};
    users.forEach(u => { if (u) userMap[u.user_id] = u; });
    // Gắn thông tin user vào từng request
    const data = leaveRequests.map(request => {
      const reqObj = request.toJSON();
      const user = userMap[request.user_id];
      return {
        ...reqObj,
        user: user ? user.toJSON() : null
      };
    });
    res.status(200).json({
      success: true,
      message: 'All employees leave requests retrieved successfully',
      data
    });
  } catch (error) {
    console.error('Error getting all employees leave requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Approve leave request
 * @route PUT /manager/leave-requests/:id/approve
 * @access Private (manager)
 */
export const approveLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.getById(parseInt(id));
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }
    await leaveRequest.approve();
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

export const rejectLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Reject reason is required',
      });
    }

    const leaveRequest = await LeaveRequest.getById(parseInt(id));
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
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
      message: error.message || 'Internal server error',
    });
  }
};
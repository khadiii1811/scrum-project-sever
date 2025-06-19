import LeaveBalance from '../models/leave-balances.js';

export const getLeaveDaysLeft = async (req, res) => {
  try {
    // Lấy user_id từ req.user (sau khi đã xác thực qua middleware authenticate)
    const user_id = req.user.user_id;

    const year = new Date().getFullYear();

    const balance = await LeaveBalance.getByUserAndYear(user_id, year);
    if (!balance) {
      return res.status(404).json({
        success: false,
        message: 'No leave balance found for this year.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        total_days: balance.total_days,
        used_days: balance.used_days,
        carried_over_days: balance.carried_over_days,
        remaining_days: balance.getRemainingDays()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
}; 
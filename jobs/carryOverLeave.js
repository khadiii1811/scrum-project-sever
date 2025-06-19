import LeaveBalance from '../models/leave-balances.js';

export const carryOverLeaveDays = async () => {
  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 1;

  // Lấy tất cả leave_balances của năm trước
  const prevBalances = await LeaveBalance.getByYear(prevYear);

  for (const balance of prevBalances) {
    const unused = balance.total_days + balance.carried_over_days - balance.used_days;
    if (unused > 0) {
      // Tìm hoặc tạo leave_balance cho năm mới
      let nextBalance = await LeaveBalance.getByUserAndYear(balance.user_id, currentYear);
      if (!nextBalance) {
        nextBalance = await LeaveBalance.create({
          user_id: balance.user_id,
          year: currentYear,
          total_days: 12, // hoặc giá trị mặc định của bạn
          used_days: 0,
          carried_over_days: unused,
        });
      } else {
        // Nếu đã có, cộng dồn carried_over_days
        nextBalance.carried_over_days += unused;
        await nextBalance.save();
      }
    }
  }
  console.log('Carry over leave days completed!');
}; 
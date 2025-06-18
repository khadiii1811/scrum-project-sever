import db from '../utils/db.js';

class LeaveBalance {
  constructor({ id, user_id, year, total_days, used_days, carried_over_days }) {
    this.id = id;
    this.user_id = user_id;
    this.year = year;
    this.total_days = total_days;
    this.used_days = used_days;
    this.carried_over_days = carried_over_days;
  }

  // Lấy hoặc tạo mới leave balance cho user và năm (default total_days=12, used_days=0, carried_over_days=0)
  static async getOrCreateByUserAndYear(user_id, year) {
    let data = await db('leave_balances').where({ user_id, year }).first();
    if (!data) {
      const [inserted] = await db('leave_balances')
        .insert({
          user_id,
          year,
          total_days: 12,
          used_days: 0,
          carried_over_days: 0,
        })
        .returning('*');
      data = inserted;
    }
    return new LeaveBalance(data);
  }

  // Cập nhật số ngày đã dùng, tăng thêm amount ngày (vd: amount = số ngày nghỉ được duyệt)
  async updateUsedDays(amount) {
    await db('leave_balances')
      .where({ user_id: this.user_id, year: this.year })
      .increment('used_days', amount);
    this.used_days += amount;
  }

  // Cập nhật carried_over_days (ngày dư chuyển sang năm sau)
  async updateCarriedOverDays(days) {
    await db('leave_balances')
      .where({ user_id: this.user_id, year: this.year })
      .update({ carried_over_days: days });
    this.carried_over_days = days;
  }

  // Lưu bản ghi (thường dùng khi tạo mới)
  async save() {
    const [result] = await db('leave_balances')
      .insert({
        user_id: this.user_id,
        year: this.year,
        total_days: this.total_days,
        used_days: this.used_days,
        carried_over_days: this.carried_over_days,
      })
      .returning('*');
    Object.assign(this, result);
    return this;
  }

  // Có thể bổ sung hàm tính số ngày nghỉ còn lại trong năm
  getRemainingDays() {
    // Tổng ngày nghỉ trong năm + ngày chuyển sang - đã dùng
    return this.total_days + this.carried_over_days - this.used_days;
  }
}

export default LeaveBalance;

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

  static async getByUserAndYear(user_id, year) {
    const data = await db('leave_balances').where({ user_id, year }).first();
    return data ? new LeaveBalance(data) : null;
  }

  async save() {
    const [result] = await db('leave_balances')
      .insert({
        user_id: this.user_id,
        year: this.year,
        total_days: this.total_days,
        used_days: this.used_days,
        carried_over_days: this.carried_over_days
      })
      .returning('*');
    Object.assign(this, result);
    return this;
  }

  async updateUsedDays(amount) {
    await db('leave_balances')
      .where({ user_id: this.user_id, year: this.year })
      .increment('used_days', amount);
    this.used_days += amount;
  }
}

export default LeaveBalance;
import db from '../utils/db.js';

class LeaveRequest {
  constructor({ id, user_id, reason, leave_dates, approved_days, status, reject_reason, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.reason = reason;
    this.leave_dates = leave_dates;
    this.approved_days = approved_days;
    this.status = status;
    this.reject_reason = reject_reason;
    this.created_at = created_at;
  }

  static async getByUser(user_id) {
    const rows = await db('leave_requests').where({ user_id });
    return rows.map(r => new LeaveRequest(r));
  }

  static async checkOverlap(user_id, dates) {
    return db('leave_requests')
      .where({ user_id })
      .whereIn('status', ['pending', 'approved'])
      .andWhereRaw(`leave_dates && ?::date[]`, [dates]);
  }

  async save() {
    const [data] = await db('leave_requests').insert({
      user_id: this.user_id,
      reason: this.reason,
      leave_dates: this.leave_dates,
      approved_days: this.approved_days,
      status: this.status,
      reject_reason: this.reject_reason
    }).returning('*');

    Object.assign(this, data);
    return this;
  }

  async approve(approved_days) {
    const [updated] = await db('leave_requests')
      .where({ id: this.id })
      .update({ status: 'approved', approved_days })
      .returning('*');
    Object.assign(this, updated);
    return this;
  }

  async reject(reason) {
    const [updated] = await db('leave_requests')
      .where({ id: this.id })
      .update({ status: 'rejected', reject_reason: reason })
      .returning('*');
    Object.assign(this, updated);
    return this;
  }
}

export default LeaveRequest;
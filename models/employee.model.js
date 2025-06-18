import db from '../utils/db.js';

class Employee {
  constructor({ user_id, name, username, role, total_days, used_days, carried_over_days, remaining_days, leave_dates }) {
    this.user_id = user_id;
    this.name = name;
    this.username = username;
    this.role = role;
    this.total_days = total_days;
    this.used_days = used_days;
    this.carried_over_days = carried_over_days;
    this.remaining_days = remaining_days;
    this.leave_dates = leave_dates; // 👈 thêm dòng này
  }

static async getAll() {
  const rows = await db
    .with('leave_dates_lateral', (qb) => {
      qb.select('lr.user_id', db.raw('d::DATE as leave_date'))
        .from('leave_requests as lr')
        .joinRaw('JOIN LATERAL UNNEST(COALESCE(lr.leave_dates, \'{}\')) AS d ON TRUE');
        // ❌ bỏ whereRaw lọc theo năm nếu bạn không cần
    })
    .from('users as u')
    .leftJoin('leave_balances as lb', function () {
      this.on('u.user_id', '=', 'lb.user_id')
        .andOn(db.raw('lb.year = EXTRACT(YEAR FROM CURRENT_DATE)'));
    })
    .leftJoin('leave_dates_lateral as ldl', 'u.user_id', 'ldl.user_id')
    .select(
      'u.user_id',
      'u.name',
      'u.username',
      'u.role',
      'lb.total_days',
      'lb.used_days',
      'lb.carried_over_days',
      db.raw('(lb.total_days + lb.carried_over_days - lb.used_days) AS remaining_days'),
      db.raw('ARRAY_AGG(DISTINCT ldl.leave_date) FILTER (WHERE ldl.leave_date IS NOT NULL) AS leave_dates')
    )
    .where('u.role', 'employee')
    .groupBy(
      'u.user_id',
      'u.name',
      'u.username',
      'u.role',
      'lb.total_days',
      'lb.used_days',
      'lb.carried_over_days'
    )
    .orderBy('u.user_id');

  return rows.map(row => {
  // Format leave_dates nếu có
  if (row.leave_dates) {
    row.leave_dates = row.leave_dates.map(date =>
      new Date(date).toISOString().split('T')[0] // lấy YYYY-MM-DD
    );
  }
  return new Employee(row);
})}

  static async deleteById(id) {
    await db('leave_requests').where({ user_id: id }).del();
    await db('leave_balances').where({ user_id: id }).del();
    await db('users').where({ user_id: id }).del();
  }
}

export default Employee;
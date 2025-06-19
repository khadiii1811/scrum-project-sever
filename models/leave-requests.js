import db from '../utils/db.js';
import LeaveBalance from './leave-balances.js';

/**
 * LeaveRequest model class for managing leave request data
 * @class LeaveRequest
 */
class LeaveRequest {
  /**
   * Create a new LeaveRequest instance
   * @param {Object} requestData - Leave request data object
   * @param {number} [requestData.id] - Request ID
   * @param {number} requestData.user_id - User ID
   * @param {string} requestData.reason - Reason for leave
   * @param {Date[]} requestData.leave_dates - Array of leave dates
   * @param {Date[]} [requestData.approved_days] - Array of approved days
   * @param {string} [requestData.status] - Request status ('pending', 'approved', 'rejected')
   * @param {string} [requestData.reject_reason] - Reason for rejection
   * @param {Date} [requestData.created_at] - Creation timestamp
   */
  constructor({ id, user_id, reason, leave_dates, approved_days, status, reject_reason, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.reason = reason;
    this.leave_dates = leave_dates;
    this.approved_days = approved_days || [];
    this.status = status || 'pending';
    this.reject_reason = reject_reason;
    this.created_at = created_at;
  }

  /**
   * Validate leave request data
   * @private
   * @throws {Error} If validation fails
   */
  _validate() {
    if (!this.user_id || typeof this.user_id !== 'number') {
      throw new Error('Valid user ID is required');
    }
    if (!this.reason || typeof this.reason !== 'string') {
      throw new Error('Reason is required and must be a string');
    }
    if (!this.leave_dates || !Array.isArray(this.leave_dates) || this.leave_dates.length === 0) {
      throw new Error('Leave dates are required and must be a non-empty array');
    }
    if (!['pending', 'approved', 'rejected'].includes(this.status)) {
      throw new Error('Status must be pending, approved, or rejected');
    }
  }

  /**
   * Get all leave requests
   * @static
   * @returns {Promise<LeaveRequest[]>} Array of LeaveRequest instances
   * @throws {Error} If database query fails
   */
  static async getAll() {
    try {
      const requests = await db('leave_requests')
        .select('*')
        .orderBy('created_at', 'desc');
      return requests.map(request => new LeaveRequest(request));
    } catch (error) {
      throw new Error(`Failed to get all leave requests: ${error.message}`);
    }
  }

  /**
   * Get leave request by ID
   * @static
   * @param {number} id - Request ID
   * @returns {Promise<LeaveRequest|null>} LeaveRequest instance or null if not found
   * @throws {Error} If database query fails
   */
  static async getById(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Valid request ID is required');
      }

      const data = await db('leave_requests').where({ id }).first();
      return data ? new LeaveRequest(data) : null;
    } catch (error) {
      throw new Error(`Failed to get leave request by ID: ${error.message}`);
    }
  }

  /**
   * Get leave requests by user ID
   * @static
   * @param {number} user_id - User ID
   * @returns {Promise<LeaveRequest[]>} Array of LeaveRequest instances
   * @throws {Error} If database query fails
   */
  static async getByUser(user_id) {
    try {
      if (!user_id || typeof user_id !== 'number') {
        throw new Error('Valid user ID is required');
      }

      const rows = await db('leave_requests')
        .where({ user_id })
        .orderBy('created_at', 'desc');
      return rows.map(r => new LeaveRequest(r));
    } catch (error) {
      throw new Error(`Failed to get leave requests by user: ${error.message}`);
    }
  }

  /**
   * Get leave requests by status
   * @static
   * @param {string} status - Request status
   * @returns {Promise<LeaveRequest[]>} Array of LeaveRequest instances
   * @throws {Error} If database query fails
   */
  static async getByStatus(status) {
    try {
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        throw new Error('Valid status is required');
      }

      const requests = await db('leave_requests')
        .where({ status })
        .orderBy('created_at', 'desc');
      return requests.map(request => new LeaveRequest(request));
    } catch (error) {
      throw new Error(`Failed to get leave requests by status: ${error.message}`);
    }
  }

  /**
   * Check for overlapping leave dates
   * @static
   * @param {number} user_id - User ID
   * @param {Date[]} dates - Array of dates to check
   * @returns {Promise<LeaveRequest[]>} Array of overlapping requests
   * @throws {Error} If database query fails
   */
  static async checkOverlap(user_id, dates) {
    try {
      if (!user_id || typeof user_id !== 'number') {
        throw new Error('Valid user ID is required');
      }
      if (!dates || !Array.isArray(dates) || dates.length === 0) {
        throw new Error('Valid dates array is required');
      }

      const overlapping = await db('leave_requests')
        .where({ user_id })
        .whereIn('status', ['pending', 'approved'])
        .andWhereRaw(`leave_dates && ?::date[]`, [dates]);

      return overlapping.map(request => new LeaveRequest(request));
    } catch (error) {
      throw new Error(`Failed to check date overlap: ${error.message}`);
    }
  }

  /**
   * Create a new leave request
   * @static
   * @param {Object} requestData - Leave request data
   * @returns {Promise<LeaveRequest>} Created LeaveRequest instance
   * @throws {Error} If validation or database operation fails
   */
  static async create(requestData) {
    try {
      const request = new LeaveRequest(requestData);
      request._validate();

      // Check for overlapping dates
      const overlapping = await LeaveRequest.checkOverlap(request.user_id, request.leave_dates);
      if (overlapping.length > 0) {
        throw new Error('Leave dates overlap with existing requests');
      }

      const [createdRequest] = await db('leave_requests').insert({
        user_id: request.user_id,
        reason: request.reason,
        leave_dates: request.leave_dates,
        approved_days: request.approved_days,
        status: request.status,
        reject_reason: request.reject_reason
      }).returning('*');

      return new LeaveRequest(createdRequest);
    } catch (error) {
      throw new Error(`Failed to create leave request: ${error.message}`);
    }
  }

  /**
   * Update leave request data
   * @param {Object} updateData - Data to update
   * @returns {Promise<LeaveRequest>} Updated LeaveRequest instance
   * @throws {Error} If validation or database operation fails
   */
  async update(updateData) {
    try {
      if (!this.id) {
        throw new Error('Cannot update leave request without ID');
      }

      // Merge update data with current instance
      Object.assign(this, updateData);
      this._validate();

      const [updatedRequest] = await db('leave_requests')
        .where({ id: this.id })
        .update({
          user_id: this.user_id,
          reason: this.reason,
          leave_dates: this.leave_dates,
          approved_days: this.approved_days,
          status: this.status,
          reject_reason: this.reject_reason
        })
        .returning('*');

      Object.assign(this, updatedRequest);
      return this;
    } catch (error) {
      throw new Error(`Failed to update leave request: ${error.message}`);
    }
  }

  /**
   * Save leave request (create if new, update if exists)
   * @returns {Promise<LeaveRequest>} Saved LeaveRequest instance
   * @throws {Error} If validation or database operation fails
   */
  async save() {
    try {
      this._validate();

      if (this.id) {
        return await this.update({});
      } else {
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
    } catch (error) {
      throw new Error(`Failed to save leave request: ${error.message}`);
    }
  }

  /**
   * Approve leave request
   * @returns {Promise<LeaveRequest>} Updated LeaveRequest instance
   * @throws {Error} If database operation fails
   */
  async approve() {
    try {
      if (!this.id) {
        throw new Error('Cannot approve leave request without ID');
      }
      // Lấy ngày hiện tại (UTC, chỉ lấy phần ngày)
      const today = new Date();
      const yyyy = today.getUTCFullYear();
      const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(today.getUTCDate()).padStart(2, '0');
      const approvedDay = `${yyyy}-${mm}-${dd}`;

      const [updated] = await db('leave_requests')
        .where({ id: this.id })
        .update({ 
          status: 'approved', 
          approved_days: [approvedDay],
          reject_reason: null // Clear reject reason when approving
        })
        .returning('*');

      Object.assign(this, updated);

      // Cập nhật used_days cho leave_balance
      if (this.leave_dates && this.leave_dates.length > 0) {
        const year = new Date(this.leave_dates[0]).getFullYear();
        const balance = await LeaveBalance.getByUserAndYear(this.user_id, year);
        if (balance) {
          balance.used_days += this.leave_dates.length;
          await balance.save();
        }
      }

      return this;
    } catch (error) {
      throw new Error(`Failed to approve leave request: ${error.message}`);
    }
  }

  /**
   * Reject leave request
   * @param {string} reason - Reason for rejection
   * @returns {Promise<LeaveRequest>} Updated LeaveRequest instance
   * @throws {Error} If database operation fails
   */
  async reject(reason) {
    try {
      if (!this.id) {
        throw new Error('Cannot reject leave request without ID');
      }
      if (!reason || typeof reason !== 'string') {
        throw new Error('Valid rejection reason is required');
      }

      // Lấy ngày hiện tại (UTC, chỉ lấy phần ngày)
      const today = new Date();
      const yyyy = today.getUTCFullYear();
      const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(today.getUTCDate()).padStart(2, '0');
      const rejectDay = `${yyyy}-${mm}-${dd}`;

      const [updated] = await db('leave_requests')
        .where({ id: this.id })
        .update({ 
          status: 'rejected', 
          reject_reason: reason,
          approved_days: [rejectDay] // Lưu ngày reject vào approved_days
        })
        .returning('*');

      Object.assign(this, updated);
      return this;
    } catch (error) {
      throw new Error(`Failed to reject leave request: ${error.message}`);
    }
  }

  /**
   * Delete leave request by ID
   * @static
   * @param {number} id - Request ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   * @throws {Error} If database operation fails
   */
  static async delete(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Valid request ID is required');
      }

      const deletedCount = await db('leave_requests').where({ id }).del();
      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete leave request: ${error.message}`);
    }
  }

  /**
   * Delete current leave request instance
   * @returns {Promise<boolean>} True if deleted, false if not found
   * @throws {Error} If database operation fails
   */
  async delete() {
    if (!this.id) {
      throw new Error('Cannot delete leave request without ID');
    }
    return await LeaveRequest.delete(this.id);
  }

  /**
   * Get pending requests count
   * @static
   * @returns {Promise<number>} Count of pending requests
   * @throws {Error} If database query fails
   */
  static async getPendingCount() {
    try {
      const result = await db('leave_requests')
        .where({ status: 'pending' })
        .count('* as count')
        .first();
      return parseInt(result.count);
    } catch (error) {
      throw new Error(`Failed to get pending count: ${error.message}`);
    }
  }

  /**
   * Convert leave request instance to plain object
   * @returns {Object} Leave request data
   */
  toJSON() {
    return { ...this };
  }

  /**
   * Get leave duration in days
   * @returns {number} Number of days requested
   */
  getDuration() {
    return this.leave_dates ? this.leave_dates.length : 0;
  }

  /**
   * Get approved duration in days
   * @returns {number} Number of days approved
   */
  getApprovedDuration() {
    return this.approved_days ? this.approved_days.length : 0;
  }

  /**
   * Check if request is pending
   * @returns {boolean} True if status is pending
   */
  isPending() {
    return this.status === 'pending';
  }

  /**
   * Check if request is approved
   * @returns {boolean} True if status is approved
   */
  isApproved() {
    return this.status === 'approved';
  }

  /**
   * Check if request is rejected
   * @returns {boolean} True if status is rejected
   */
  isRejected() {
    return this.status === 'rejected';
  }

  /**
   * Delete leave requests by user ID
   * @static
   * @param {number} user_id - User ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   * @throws {Error} If database operation fails
   */
  static async deleteByUserId(user_id) {
    return db('leave_requests').where({ user_id }).del();
  }
}

export default LeaveRequest;
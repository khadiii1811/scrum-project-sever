import db from '../utils/db.js';

/**
 * LeaveBalance model class for managing leave balance data
 * @class LeaveBalance
 */
class LeaveBalance {
  /**
   * Create a new LeaveBalance instance
   * @param {Object} balanceData - Leave balance data object
   * @param {number} [balanceData.id] - Balance ID
   * @param {number} balanceData.user_id - User ID
   * @param {number} balanceData.year - Year
   * @param {number} [balanceData.total_days] - Total days allocated
   * @param {number} [balanceData.used_days] - Days used
   * @param {number} [balanceData.carried_over_days] - Days carried over from previous year
   */
  constructor({ id, user_id, year, total_days, used_days, carried_over_days }) {
    this.id = id;
    this.user_id = user_id;
    this.year = year;
    this.total_days = total_days || 12;
    this.used_days = used_days || 0;
    this.carried_over_days = carried_over_days || 0;
  }

  /**
   * Validate leave balance data
   * @private
   * @throws {Error} If validation fails
   */
  _validate() {
    if (!this.user_id || typeof this.user_id !== 'number') {
      throw new Error('Valid user ID is required');
    }
    if (!this.year || typeof this.year !== 'number' || this.year < 2000) {
      throw new Error('Valid year is required (must be >= 2000)');
    }
    if (this.total_days < 0 || typeof this.total_days !== 'number') {
      throw new Error('Total days must be a non-negative number');
    }
    if (this.used_days < 0 || typeof this.used_days !== 'number') {
      throw new Error('Used days must be a non-negative number');
    }
    if (this.carried_over_days < 0 || typeof this.carried_over_days !== 'number') {
      throw new Error('Carried over days must be a non-negative number');
    }
    if (this.used_days > this.total_days + this.carried_over_days) {
      throw new Error('Used days cannot exceed total available days');
    }
  }

  /**
   * Get all leave balances
   * @static
   * @returns {Promise<LeaveBalance[]>} Array of LeaveBalance instances
   * @throws {Error} If database query fails
   */
  static async getAll() {
    try {
      const balances = await db('leave_balances')
        .select('*')
        .orderBy(['year', 'desc'], ['user_id', 'asc']);
      return balances.map(balance => new LeaveBalance(balance));
    } catch (error) {
      throw new Error(`Failed to get all leave balances: ${error.message}`);
    }
  }

  /**
   * Get leave balance by ID
   * @static
   * @param {number} id - Balance ID
   * @returns {Promise<LeaveBalance|null>} LeaveBalance instance or null if not found
   * @throws {Error} If database query fails
   */
  static async getById(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Valid balance ID is required');
      }

      const data = await db('leave_balances').where({ id }).first();
      return data ? new LeaveBalance(data) : null;
    } catch (error) {
      throw new Error(`Failed to get leave balance by ID: ${error.message}`);
    }
  }

  /**
   * Get leave balance by user ID and year
   * @static
   * @param {number} user_id - User ID
   * @param {number} year - Year
   * @returns {Promise<LeaveBalance|null>} LeaveBalance instance or null if not found
   * @throws {Error} If database query fails
   */
  static async getByUserAndYear(user_id, year) {
    try {
      if (!user_id || typeof user_id !== 'number') {
        throw new Error('Valid user ID is required');
      }
      if (!year || typeof year !== 'number') {
        throw new Error('Valid year is required');
      }

      const data = await db('leave_balances').where({ user_id, year }).first();
      return data ? new LeaveBalance(data) : null;
    } catch (error) {
      throw new Error(`Failed to get leave balance by user and year: ${error.message}`);
    }
  }

  /**
   * Get all leave balances for a user
   * @static
   * @param {number} user_id - User ID
   * @returns {Promise<LeaveBalance[]>} Array of LeaveBalance instances
   * @throws {Error} If database query fails
   */
  static async getByUser(user_id) {
    try {
      if (!user_id || typeof user_id !== 'number') {
        throw new Error('Valid user ID is required');
      }

      const balances = await db('leave_balances')
        .where({user_id})
        .orderBy('year', 'desc');
      return balances.map(balance => new LeaveBalance(balance));
    } catch (error) {
      throw new Error(`Failed to get leave balances by user: ${error.message}`);
    }
  }

  /**
   * Get all leave balances for a specific year
   * @static
   * @param {number} year - Year
   * @returns {Promise<LeaveBalance[]>} Array of LeaveBalance instances
   * @throws {Error} If database query fails
   */
  static async getByYear(year) {
    try {
      if (!year || typeof year !== 'number') {
        throw new Error('Valid year is required');
      }

      const balances = await db('leave_balances')
        .where({ year })
        .orderBy('user_id', 'asc');
      return balances.map(balance => new LeaveBalance(balance));
    } catch (error) {
      throw new Error(`Failed to get leave balances by year: ${error.message}`);
    }
  }

  /**
   * Create a new leave balance
   * @static
   * @param {Object} balanceData - Leave balance data
   * @returns {Promise<LeaveBalance>} Created LeaveBalance instance
   * @throws {Error} If validation or database operation fails
   */
  static async create(balanceData) {
    try {
      const balance = new LeaveBalance(balanceData);
      balance._validate();

      // Check if balance already exists for this user and year
      const existing = await LeaveBalance.getByUserAndYear(balance.user_id, balance.year);
      if (existing) {
        throw new Error('Leave balance already exists for this user and year');
      }

      const [createdBalance] = await db('leave_balances')
        .insert({
          user_id: balance.user_id,
          year: balance.year,
          total_days: balance.total_days,
          used_days: balance.used_days,
          carried_over_days: balance.carried_over_days
        })
        .returning('*');

      return new LeaveBalance(createdBalance);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        throw new Error('Leave balance already exists for this user and year');
      }
      throw new Error(`Failed to create leave balance: ${error.message}`);
    }
  }

  /**
   * Update leave balance data
   * @param {Object} updateData - Data to update
   * @returns {Promise<LeaveBalance>} Updated LeaveBalance instance
   * @throws {Error} If validation or database operation fails
   */
  async update(updateData) {
    try {
      if (!this.id) {
        throw new Error('Cannot update leave balance without ID');
      }

      // Merge update data with current instance
      Object.assign(this, updateData);
      this._validate();

      const [updatedBalance] = await db('leave_balances')
        .where({ id: this.id })
        .update({
          user_id: this.user_id,
          year: this.year,
          total_days: this.total_days,
          used_days: this.used_days,
          carried_over_days: this.carried_over_days
        })
        .returning('*');

      Object.assign(this, updatedBalance);
      return this;
    } catch (error) {
      throw new Error(`Failed to update leave balance: ${error.message}`);
    }
  }

  /**
   * Save leave balance (create if new, update if exists)
   * @returns {Promise<LeaveBalance>} Saved LeaveBalance instance
   * @throws {Error} If validation or database operation fails
   */
  async save() {
    try {
      this._validate();

      if (this.id) {
        return await this.update({});
      } else {
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
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Leave balance already exists for this user and year');
      }
      throw new Error(`Failed to save leave balance: ${error.message}`);
    }
  }

  /**
   * Update used days
   * @param {number} amount - Amount to add to used days
   * @returns {Promise<LeaveBalance>} Updated LeaveBalance instance
   * @throws {Error} If database operation fails
   */
  async updateUsedDays(amount) {
    try {
      if (!this.id) {
        throw new Error('Cannot update used days without ID');
      }
      if (typeof amount !== 'number' || amount < 0) {
        throw new Error('Valid positive amount is required');
      }

      const newUsedDays = this.used_days + amount;
      if (newUsedDays > this.total_days + this.carried_over_days) {
        throw new Error('Cannot use more days than available');
      }

      await db('leave_balances')
        .where({ id: this.id })
        .update({ used_days: newUsedDays });

      this.used_days = newUsedDays;
      return this;
    } catch (error) {
      throw new Error(`Failed to update used days: ${error.message}`);
    }
  }

  /**
   * Add days to total allocation
   * @param {number} amount - Amount to add to total days
   * @returns {Promise<LeaveBalance>} Updated LeaveBalance instance
   * @throws {Error} If database operation fails
   */
  async addTotalDays(amount) {
    try {
      if (!this.id) {
        throw new Error('Cannot add total days without ID');
      }
      if (typeof amount !== 'number' || amount < 0) {
        throw new Error('Valid positive amount is required');
      }

      const newTotalDays = this.total_days + amount;
      await db('leave_balances')
        .where({ id: this.id })
        .update({ total_days: newTotalDays });

      this.total_days = newTotalDays;
      return this;
    } catch (error) {
      throw new Error(`Failed to add total days: ${error.message}`);
    }
  }

  /**
   * Add carried over days
   * @param {number} amount - Amount to add to carried over days
   * @returns {Promise<LeaveBalance>} Updated LeaveBalance instance
   * @throws {Error} If database operation fails
   */
  async addCarriedOverDays(amount) {
    try {
      if (!this.id) {
        throw new Error('Cannot add carried over days without ID');
      }
      if (typeof amount !== 'number' || amount < 0) {
        throw new Error('Valid positive amount is required');
      }

      const newCarriedOverDays = this.carried_over_days + amount;
      await db('leave_balances')
        .where({ id: this.id })
        .update({ carried_over_days: newCarriedOverDays });

      this.carried_over_days = newCarriedOverDays;
      return this;
    } catch (error) {
      throw new Error(`Failed to add carried over days: ${error.message}`);
    }
  }

  /**
   * Delete leave balance by ID
   * @static
   * @param {number} id - Balance ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   * @throws {Error} If database operation fails
   */
  static async delete(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Valid balance ID is required');
      }

      const deletedCount = await db('leave_balances').where({ id }).del();
      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete leave balance: ${error.message}`);
    }
  }

  /**
   * Delete current leave balance instance
   * @returns {Promise<boolean>} True if deleted, false if not found
   * @throws {Error} If database operation fails
   */
  async delete() {
    if (!this.id) {
      throw new Error('Cannot delete leave balance without ID');
    }
    return await LeaveBalance.delete(this.id);
  }

  /**
   * Get or create leave balance for user and year
   * @static
   * @param {number} user_id - User ID
   * @param {number} year - Year
   * @param {number} [defaultTotalDays] - Default total days if creating new
   * @returns {Promise<LeaveBalance>} LeaveBalance instance
   * @throws {Error} If database operation fails
   */
  static async getOrCreate(user_id, year, defaultTotalDays = 12) {
    try {
      let balance = await LeaveBalance.getByUserAndYear(user_id, year);
      
      if (!balance) {
        balance = await LeaveBalance.create({
          user_id,
          year,
          total_days: defaultTotalDays,
          used_days: 0,
          carried_over_days: 0
        });
      }
      
      return balance;
    } catch (error) {
      throw new Error(`Failed to get or create leave balance: ${error.message}`);
    }
  }

  /**
   * Convert leave balance instance to plain object
   * @returns {Object} Leave balance data
   */
  toJSON() {
    return { ...this };
  }

  /**
   * Get remaining days
   * @returns {number} Number of remaining days
   */
  getRemainingDays() {
    return this.total_days + this.carried_over_days - this.used_days;
  }

  /**
   * Get total available days
   * @returns {number} Total available days (total + carried over)
   */
  getTotalAvailableDays() {
    return this.total_days + this.carried_over_days;
  }

  /**
   * Check if user has enough days
   * @param {number} requestedDays - Number of days requested
   * @returns {boolean} True if enough days available
   */
  hasEnoughDays(requestedDays) {
    return this.getRemainingDays() >= requestedDays;
  }

  /**
   * Get usage percentage
   * @returns {number} Usage percentage (0-100)
   */
  getUsagePercentage() {
    const totalAvailable = this.getTotalAvailableDays();
    return totalAvailable > 0 ? Math.round((this.used_days / totalAvailable) * 100) : 0;
  }

  /**
   * Check if balance is exhausted
   * @returns {boolean} True if no days remaining
   */
  isExhausted() {
    return this.getRemainingDays() <= 0;
  }

  static async deleteByUserId(user_id) {
    return db('leave_balances').where({ user_id }).del();
  }
  
  async addUsedDays(days) {
    await db('leave_balances')
      .where({ id: this.id })
      .increment('used_days', days);
    this.used_days += days;
  }

}

export default LeaveBalance;

import db from '../utils/db.js';

/**
 * User model class for managing user data
 * @class User
 */
class User {
  /**
   * Create a new User instance
   * @param {Object} userData - User data object
   * @param {number} [userData.user_id] - User ID
   * @param {string} userData.username - Username
   * @param {string} userData.name - Full name
   * @param {string} userData.password - Password (should be hashed)
   * @param {string} userData.role - User role ('employee' or 'manager')
   * @param {string} userData.email - User email
   */
  constructor({ user_id, username, name, password, role, email }) {
    this.user_id = user_id;
    this.username = username;
    this.name = name;
    this.password = password;
    this.role = role;
    this.email = email;
  }

  /**
   * Validate user data
   * @private
   * @throws {Error} If validation fails
   */
  _validate() {
    if (!this.username || typeof this.username !== 'string') {
      throw new Error('Username is required and must be a string');
    }
    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Name is required and must be a string');
    }
    if (!this.password || typeof this.password !== 'string') {
      throw new Error('Password is required and must be a string');
    }
    if (!this.role || !['employee', 'manager'].includes(this.role)) {
      throw new Error('Role must be either "employee" or "manager"');
    }
    if (!this.email || typeof this.email !== 'string') {
      throw new Error('Email is required and must be a string');
    }
  }

  /**
   * Get all users
   * @static
   * @returns {Promise<User[]>} Array of User instances
   * @throws {Error} If database query fails
   */
  static async getAll() {
    try {
      const users = await db('users').select('*').orderBy('user_id', 'asc');
      return users.map(user => new User(user));
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }

  static async getAllEmployees() {
    return this.getAll().then(users => users.filter(user => user.role === 'employee'));
  }

  /**
   * Get user by ID
   * @static
   * @param {number} id - User ID
   * @returns {Promise<User|null>} User instance or null if not found
   * @throws {Error} If database query fails
   */
  static async getById(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Valid user ID is required');
      }
      
      const data = await db('users').where({ user_id: id }).first();
      return data ? new User(data) : null;
    } catch (error) {
      throw new Error(`Failed to get user by ID: ${error.message}`);
    }
  }

  /**
   * Get user by username
   * @static
   * @param {string} username - Username
   * @returns {Promise<User|null>} User instance or null if not found
   * @throws {Error} If database query fails
   */
  static async getByUsername(username) {
    try {
      if (!username || typeof username !== 'string') {
        throw new Error('Valid username is required');
      }
      
      const data = await db('users').where({ username }).first();
      return data ? new User(data) : null;
    } catch (error) {
      throw new Error(`Failed to get user by username: ${error.message}`);
    }
  }

  /**
   * Create a new user
   * @static
   * @param {Object} userData - User data
   * @returns {Promise<User>} Created User instance
   * @throws {Error} If validation or database operation fails
   */
  static async create(userData) {
    try {
      const user = new User(userData);
      user._validate();
      
      const [createdUser] = await db('users').insert({
        username: user.username,
        name: user.name,
        password: user.password,
        role: user.role,
        email: user.email
      }).returning('*');
      
      return new User(createdUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Username or email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Update user data
   * @param {Object} updateData - Data to update
   * @returns {Promise<User>} Updated User instance
   * @throws {Error} If validation or database operation fails
   */
  async update(updateData) {
    try {
      if (!this.user_id) {
        throw new Error('Cannot update user without ID');
      }

      // Merge update data with current instance
      Object.assign(this, updateData);
      this._validate();

      const [updatedUser] = await db('users')
        .where({ user_id: this.user_id })
        .update({
          username: this.username,
          name: this.name,
          password: this.password,
          role: this.role,
          email: this.email
        })
        .returning('*');

      Object.assign(this, updatedUser);
      return this;
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Username or email already exists');
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Save user (create if new, update if exists)
   * @returns {Promise<User>} Saved User instance
   * @throws {Error} If validation or database operation fails
   */
  async save() {
    try {
      this._validate();
      
      if (this.user_id) {
        return await this.update({});
      } else {
        const [user] = await db('users').insert({
          username: this.username,
          name: this.name,
          password: this.password,
          role: this.role,
          email: this.email
        }).returning('*');
        
        Object.assign(this, user);
        return this;
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Username or email already exists');
      }
      throw new Error(`Failed to save user: ${error.message}`);
    }
  }

  /**
   * Delete user by ID
   * @static
   * @param {number} id - User ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   * @throws {Error} If database operation fails
   */
  static async delete(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Valid user ID is required');
      }

      const deletedCount = await db('users').where({ user_id: id }).del();
      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Delete current user instance
   * @returns {Promise<boolean>} True if deleted, false if not found
   * @throws {Error} If database operation fails
   */
  async delete() {
    if (!this.user_id) {
      throw new Error('Cannot delete user without ID');
    }
    return await User.delete(this.user_id);
  }

  /**
   * Get users by role
   * @static
   * @param {string} role - User role
   * @returns {Promise<User[]>} Array of User instances
   * @throws {Error} If database query fails
   */
  static async getByRole(role) {
    try {
      if (!role || !['employee', 'manager'].includes(role)) {
        throw new Error('Valid role is required');
      }

      const users = await db('users')
        .where({ role })
        .select('*')
        .orderBy('user_id', 'asc');
      
      return users.map(user => new User(user));
    } catch (error) {
      throw new Error(`Failed to get users by role: ${error.message}`);
    }
  }

  /**
   * Check if username exists
   * @static
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   * @throws {Error} If database query fails
   */
  static async usernameExists(username) {
    try {
      if (!username || typeof username !== 'string') {
        throw new Error('Valid username is required');
      }

      const user = await db('users').where({ username }).first();
      return !!user;
    } catch (error) {
      throw new Error(`Failed to check username existence: ${error.message}`);
    }
  }

  /**
   * Convert user instance to plain object (exclude password)
   * @returns {Object} User data without password
   */
  toJSON() {
    return {
      user_id: this.user_id,
      username: this.username,
      name: this.name,
      role: this.role,
      email: this.email
    };
  }

  /**
   * Convert user instance to plain object (include password)
   * @returns {Object} Complete user data
   */
  toObject() {
    return {
      user_id: this.user_id,
      username: this.username,
      name: this.name,
      password: this.password,
      role: this.role,
      email: this.email
    };
  }
}

export default User;

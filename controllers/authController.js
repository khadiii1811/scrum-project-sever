import User from '../models/user.js';

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    // Validate required fields
    if (!user_name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Get user from database
    const user = await User.getByUsername(user_name);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // In production, you should hash and compare passwords
    // For now, we'll do simple comparison
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Return user data (without password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user_id: user.user_id,
        user_name: user.user_name,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProfile = async (req, res) => {
  try {
    const { user_id } = req.user;
    
    const user = await User.getById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get all users (for admin/manager)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users.map(user => user.toJSON())
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
}; 
import User from '../models/user.js';

/**
 * Authentication middleware that gets user from database
 * In production, this should verify JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get user_id from query parameter or header for testing
    const user_id_raw = req.query.user_id || req.headers['user-id'];
    console.log(user_id_raw)
    const user_id = parseInt(user_id_raw, 10);
    console.log('Received user_id:', user_id_raw, 'Parsed:', user_id);
    if (!user_id || isNaN(user_id)) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid user_id'
      });
    }

    // Get user from database
    const user = await User.getById(user_id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = {
      user_id: user.user_id,
      username: user.username,
      name: user.name,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Authorization middleware to check if user is manager
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'manager') {
    return res.status(403).json({
      success: false,
      message: 'Manager access required'
    });
  }
  next();
};

/**
 * Authorization middleware to check if user is employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireEmployee = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'employee') {
    return res.status(403).json({
      success: false,
      message: 'Employee access required'
    });
  }

  next();
};
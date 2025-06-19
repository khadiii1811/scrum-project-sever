import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Authentication middleware that verifies JWT token and gets user from database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header or query parameter
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.query.token || req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user_id = decoded.user_id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: missing user_id'
      });
    }

    // Get user from database
    const user = await User.getById(parseInt(user_id));
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
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
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
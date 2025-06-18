import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(password)

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const user = await User.getByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get user profile by user_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProfile = async (req, res) => {
  try {
    // Lấy user_id từ req.user (sau khi đã xác thực qua middleware authenticate)
    const user_id = req.user.user_id;
    console.log(user_id)
    const user = await User.getById(parseInt(user_id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
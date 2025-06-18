import express from 'express';
import { login, getProfile, getAllUsers } from '../controllers/authController.js';
import { authenticate, requireManager } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route POST /auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', login);

/**
 * @route GET /auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route GET /auth/users
 * @desc Get all users (admin/manager only)
 * @access Private (manager)
 */
router.get('/users', authenticate, requireManager, getAllUsers);

export default router; 
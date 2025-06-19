import express from 'express';
import { login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', login);

/**
 * @route GET /auth/profile
 * @desc Get current user profile (requires authentication token)
 * @access Private
 */
router.get('/auth/profile', authenticate, getProfile);

export default router; 
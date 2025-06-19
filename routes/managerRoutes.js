import express from 'express';
import { authenticate, requireManager } from '../middlewares/auth.js';
import {
  getAllEmployeesLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from '../controllers/managerController.js';

const router = express.Router();

router.get(
  '/employees-leave-requests',
  authenticate,
  requireManager,
  getAllEmployeesLeaveRequests
);

router.put(
  '/leave-requests/:id/approve',
  authenticate,
  requireManager,
  approveLeaveRequest
);

router.put(
  '/leave-requests/:id/reject',
  authenticate,
  requireManager, // ✅ Đúng middleware
  rejectLeaveRequest
);

export default router;

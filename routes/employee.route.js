import express from 'express';
import EmployeeController from '../controllers/employee.controller.js';

const router = express.Router();

router.get('/', EmployeeController.getAllEmployees);
router.delete('/:id', EmployeeController.deleteEmployee);

export default router;
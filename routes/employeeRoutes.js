import express from 'express';
import { addEmployee, deleteEmployee, getAllEmployees } from '../controllers/employeeController.js';

const router = express.Router();

router.post('/employee', addEmployee);
router.delete('/employee/:user_id', deleteEmployee);
router.get('/employee', getAllEmployees);

export default router; 
import employeeModel from '../models/employee.model.js';

const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.getAll();
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    await employeeModel.deleteById(id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  getAllEmployees,
  deleteEmployee,
};

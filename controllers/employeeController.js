import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import LeaveBalance from '../models/leave-balances.js';
import LeaveRequest from '../models/leave-requests.js';

function generateRandomPassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export const addEmployee = async (req, res) => {
  const { username, name, email } = req.body;
  const role = "employee";
  if (!username || !name || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (!['employee', 'manager'].includes(role)) {
    return res.status(400).json({ message: 'Role must be employee or manager.' });
  }
  try {
    const exists = await User.getByUsername(username);
    if (exists) {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    // Sinh password ngẫu nhiên
    const plainPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const newUser = await User.create({ username, password: hashedPassword, name, role, email });

    // Gửi email password cho user
    const transporter = nodemailer.createTransport({
      service: 'gmail', // hoặc cấu hình SMTP riêng
      auth: {
        user: process.env.EMAIL_USER, // email gửi
        pass: process.env.EMAIL_PASS  // mật khẩu ứng dụng
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Account Password',
      text: `Hello ${name},\n\nYour account has been created.\nUsername: ${username}\nPassword: ${plainPassword}\n\nPlease login and change your password after first login.\n\nBest regards,\nAdmin`
    });

    const { password, ...userData } = newUser;
    return res.status(201).json(userData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }
  try {
    const user = await User.getById(Number(user_id));
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Xóa dữ liệu liên quan qua model
    await LeaveBalance.deleteByUserId(Number(user_id));
    await LeaveRequest.deleteByUserId(Number(user_id));
    await user.delete();
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.getAllEmployeesWithRemandingDays();
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
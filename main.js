import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());          
app.use(cookieParser());      

// Route test
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Mock Auth (hoặc auth thực nếu có)
import mockAuth from './middlewares/authenticate.js'; // 👈 nếu chưa có auth, dùng tạm
app.use(mockAuth); // 👈 bỏ nếu bạn đã có middleware auth thật
import employeeRoutes from './routes/employee.route.js';
app.use('/employees', employeeRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

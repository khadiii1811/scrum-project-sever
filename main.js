import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import leaveRequestRoutes from './routes/leaveRequestRoutes.js';

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

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api', leaveRequestRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

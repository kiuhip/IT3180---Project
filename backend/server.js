import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import hokhauRoutes from './routes/hokhau.js';
import nhankhauRoutes from './routes/nhankhau.js';
import feesRoutes from './routes/fees.js';
import phidonggopRoutes from './routes/phidonggop.js';
import tamtruRoutes from './routes/tamtru.js';
import tamvangRoutes from './routes/tamvang.js';
import thanhtoanRoutes from './routes/thanhtoan.js';
import statisticsRoutes from './routes/statistics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hokhau', hokhauRoutes);
app.use('/api/nhankhau', nhankhauRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/phidonggop', phidonggopRoutes);
app.use('/api/tamtru', tamtruRoutes);
app.use('/api/tamvang', tamvangRoutes);
app.use('/api/thanhtoan', thanhtoanRoutes);
app.use('/api/statistics', statisticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
  res.status(statusCode).json({ 
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});


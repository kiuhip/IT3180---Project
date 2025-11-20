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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


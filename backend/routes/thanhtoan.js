import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all payments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM thanhtoan ORDER BY NgayThanhToan DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create payment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { maHoKhau, soTienThanhToan } = req.body;

    if (!maHoKhau || !soTienThanhToan) {
      return res.status(400).json({ error: 'MaHoKhau and SoTienThanhToan are required' });
    }

    await pool.execute(
      'INSERT INTO thanhtoan (MaHoKhau, SoTienThanhToan, NgayThanhToan) VALUES (?, ?, NOW())',
      [maHoKhau, soTienThanhToan]
    );

    res.status(201).json({ message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


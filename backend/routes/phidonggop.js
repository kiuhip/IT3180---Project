import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all voluntary contributions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM phidonggop');
    res.json(rows);
  } catch (error) {
    console.error('Get contributions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contribution types list
router.get('/types', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM danhsachphidonggop');
    res.json(rows);
  } catch (error) {
    console.error('Get contribution types error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create contribution
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { maHoKhau, tenPhi, soTien, ngayDongGop } = req.body;

    if (!maHoKhau || !tenPhi || !soTien || !ngayDongGop) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await pool.execute(
      'INSERT INTO phidonggop (MaHoKhau, TenPhi, SoTien, NgayDongGop) VALUES (?, ?, ?, ?)',
      [maHoKhau, tenPhi, soTien, ngayDongGop]
    );

    res.status(201).json({ message: 'Contribution recorded successfully' });
  } catch (error) {
    console.error('Create contribution error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add contribution type
router.post('/types', authenticateToken, async (req, res) => {
  try {
    const { tenPhi, soTienGoiY } = req.body;

    if (!tenPhi || !soTienGoiY) {
      return res.status(400).json({ error: 'TenPhi and SoTienGoiY are required' });
    }

    await pool.execute(
      'INSERT INTO danhsachphidonggop (TenPhi, SoTienGoiY) VALUES (?, ?)',
      [tenPhi, soTienGoiY]
    );

    res.status(201).json({ message: 'Contribution type added successfully' });
  } catch (error) {
    console.error('Add contribution type error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Contribution type already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete contribution type
router.delete('/types/:tenPhi', authenticateToken, async (req, res) => {
  try {
    const { tenPhi } = req.params;
    await pool.execute('DELETE FROM danhsachphidonggop WHERE TenPhi = ?', [tenPhi]);
    res.json({ message: 'Contribution type deleted successfully' });
  } catch (error) {
    console.error('Delete contribution type error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


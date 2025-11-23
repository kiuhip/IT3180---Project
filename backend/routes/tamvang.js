import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all temporary absence records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM tamvang');
    res.json(rows);
  } catch (error) {
    console.error('Get tam vang error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create temporary absence
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { maTamVang, soCMND_CCCD, noiTamTru, tuNgay, denNgay } = req.body;

    if (!maTamVang || !soCMND_CCCD || !noiTamTru || !tuNgay || !denNgay) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await pool.execute(
      'INSERT INTO tamvang (MaTamVang, SoCMND_CCCD, NoiTamTru, TuNgay, DenNgay) VALUES (?, ?, ?, ?, ?)',
      [maTamVang, soCMND_CCCD, noiTamTru, tuNgay, denNgay]
    );

    res.status(201).json({ message: 'Temporary absence recorded successfully' });
  } catch (error) {
    console.error('Create tam vang error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Record ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete temporary absence
router.delete('/:maTamVang', authenticateToken, async (req, res) => {
  try {
    const { maTamVang } = req.params;
    await pool.execute('DELETE FROM tamvang WHERE MaTamVang = ?', [maTamVang]);
    res.json({ message: 'Temporary absence deleted successfully' });
  } catch (error) {
    console.error('Delete tam vang error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


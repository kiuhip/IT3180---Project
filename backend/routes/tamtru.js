import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all temporary residence records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM tamtru');
    res.json(rows);
  } catch (error) {
    console.error('Get tam tru error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create temporary residence
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { maTamTru, soCMND_CCCD, lyDo, tuNgay, denNgay } = req.body;

    if (!maTamTru || !soCMND_CCCD || !lyDo || !tuNgay || !denNgay) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await pool.execute(
      'INSERT INTO tamtru (MaTamTru, SoCMND_CCCD, LyDo, TuNgay, DenNgay) VALUES (?, ?, ?, ?, ?)',
      [maTamTru, soCMND_CCCD, lyDo, tuNgay, denNgay]
    );

    res.status(201).json({ message: 'Temporary residence recorded successfully' });
  } catch (error) {
    console.error('Create tam tru error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Record ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete temporary residence
router.delete('/:maTamTru', authenticateToken, async (req, res) => {
  try {
    const { maTamTru } = req.params;
    await pool.execute('DELETE FROM tamtru WHERE MaTamTru = ?', [maTamTru]);
    res.json({ message: 'Temporary residence deleted successfully' });
  } catch (error) {
    console.error('Delete tam tru error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


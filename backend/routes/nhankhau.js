import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all residents
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM nhankhau');
    res.json(rows);
  } catch (error) {
    console.error('Get residents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resident by CCCD
router.get('/:soCCCD', authenticateToken, async (req, res) => {
  try {
    const { soCCCD } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM nhankhau WHERE SoCMND_CCCD = ?',
      [soCCCD]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get resident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create resident
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { maHoKhau, hoTen, tuoi, gioiTinh, soCMND_CCCD, soDT, quanHe } = req.body;

    if (!hoTen || !tuoi || !gioiTinh || !soCMND_CCCD || !soDT) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    await pool.execute(
      'INSERT INTO nhankhau (MaHoKhau, HoTen, Tuoi, GioiTinh, SoCMND_CCCD, SoDT, QuanHe, TamVang, TamTru) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)',
      [maHoKhau || 'Không', hoTen, tuoi, gioiTinh, soCMND_CCCD, soDT, quanHe || 'Không']
    );

    res.status(201).json({ message: 'Resident created successfully' });
  } catch (error) {
    console.error('Create resident error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'CCCD already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update resident
router.put('/:soCCCD', authenticateToken, async (req, res) => {
  try {
    const { soCCCD } = req.params;
    const { maHoKhau, hoTen, tuoi, gioiTinh, soDT, quanHe } = req.body;

    await pool.execute(
      'UPDATE nhankhau SET MaHoKhau = ?, HoTen = ?, Tuoi = ?, GioiTinh = ?, SoDT = ?, QuanHe = ? WHERE SoCMND_CCCD = ?',
      [maHoKhau, hoTen, tuoi, gioiTinh, soDT, quanHe, soCCCD]
    );

    res.json({ message: 'Resident updated successfully' });
  } catch (error) {
    console.error('Update resident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete resident
router.delete('/:soCCCD', authenticateToken, async (req, res) => {
  try {
    const { soCCCD } = req.params;
    await pool.execute('DELETE FROM nhankhau WHERE SoCMND_CCCD = ?', [soCCCD]);
    res.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Delete resident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


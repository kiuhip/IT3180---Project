import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all households
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM hokhau');
    res.json(rows);
  } catch (error) {
    console.error('Get households error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get household by ID
router.get('/:maHoKhau', authenticateToken, async (req, res) => {
  try {
    const { maHoKhau } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM hokhau WHERE MaHoKhau = ?',
      [maHoKhau]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Household not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get household error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create household
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { maHoKhau, diaChi, ngayLap, ngayChuyenDi, lyDoChuyen, dienTichHo, soXeMay, soOTo, soXeDap } = req.body;

    if (!maHoKhau || !diaChi) {
      return res.status(400).json({ error: 'MaHoKhau and DiaChi are required' });
    }

    await pool.execute(
      'INSERT INTO hokhau (MaHoKhau, DiaChi, NgayLap, NgayChuyenDi, LyDoChuyen, dienTichHo, SoXeMay, SoOTo, SoXeDap) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [maHoKhau, diaChi, ngayLap || new Date(), ngayChuyenDi || new Date(), lyDoChuyen || 'Không', dienTichHo || 0, soXeMay || 0, soOTo || 0, soXeDap || 0]
    );

    res.status(201).json({ message: 'Household created successfully' });
  } catch (error) {
    console.error('Create household error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Household ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update household
router.put('/:maHoKhau', authenticateToken, async (req, res) => {
  try {
    const { maHoKhau } = req.params;
    const { diaChi, ngayLap, ngayChuyenDi, lyDoChuyen, dienTichHo, soXeMay, soOTo, soXeDap, nam } = req.body;

    await pool.execute(
      'UPDATE hokhau SET DiaChi = ?, NgayLap = ?, NgayChuyenDi = ?, LyDoChuyen = ?, dienTichHo = ?, SoXeMay = ?, SoOTo = ?, SoXeDap = ? WHERE MaHoKhau = ?',
      [diaChi, ngayLap, ngayChuyenDi, lyDoChuyen, dienTichHo, soXeMay, soOTo, soXeDap, maHoKhau]
    );

    // Update fees if dienTichHo changed
    if (dienTichHo !== undefined && nam) {
      const [phiDichVu] = await pool.execute(
        'SELECT GiaPhi FROM phidichvu WHERE MaHoKhau = ? AND Nam = ? LIMIT 1',
        [maHoKhau, nam]
      );
      if (phiDichVu.length > 0) {
        await pool.execute(
          'UPDATE phidichvu SET TienNopMoiThang = ? WHERE MaHoKhau = ? AND Nam >= ?',
          [phiDichVu[0].GiaPhi * dienTichHo, maHoKhau, nam]
        );
      }

      const [phiQuanLy] = await pool.execute(
        'SELECT GiaPhi FROM phiquanly WHERE MaHoKhau = ? AND Nam = ? LIMIT 1',
        [maHoKhau, nam]
      );
      if (phiQuanLy.length > 0) {
        await pool.execute(
          'UPDATE phiquanly SET TienNopMoiThang = ? WHERE MaHoKhau = ? AND Nam >= ?',
          [phiQuanLy[0].GiaPhi * dienTichHo, maHoKhau, nam]
        );
      }

      // Update parking fee
      const [phiGuiXe] = await pool.execute(
        'SELECT GiaXeMay, GiaOTo, GiaXeDap FROM phiguixe WHERE MaHoKhau = ? AND Nam = ? LIMIT 1',
        [maHoKhau, nam]
      );
      if (phiGuiXe.length > 0) {
        const tienNop = phiGuiXe[0].GiaXeMay * soXeMay + phiGuiXe[0].GiaOTo * soOTo + phiGuiXe[0].GiaXeDap * soXeDap;
        await pool.execute(
          'UPDATE phiguixe SET TienNopMoiThang = ? WHERE MaHoKhau = ? AND Nam >= ?',
          [tienNop, maHoKhau, nam]
        );
      }
    }

    res.json({ message: 'Household updated successfully' });
  } catch (error) {
    console.error('Update household error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete household
router.delete('/:maHoKhau', authenticateToken, async (req, res) => {
  try {
    const { maHoKhau } = req.params;
    await pool.execute('DELETE FROM hokhau WHERE MaHoKhau = ?', [maHoKhau]);
    res.json({ message: 'Household deleted successfully' });
  } catch (error) {
    console.error('Delete household error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


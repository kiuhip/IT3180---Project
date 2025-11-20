import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get fee data by type and year
router.get('/:feeType/:year', authenticateToken, async (req, res) => {
  try {
    const { feeType, year } = req.params;
    const validTypes = ['phidichvu', 'phiquanly', 'phiguixe', 'phisinhhoat'];
    
    if (!validTypes.includes(feeType.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid fee type' });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM ${feeType} WHERE Nam = ?`,
      [year]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get fee data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update fee payment status
router.put('/:feeType/pay', authenticateToken, async (req, res) => {
  try {
    const { feeType } = req.params;
    const { maHoKhau, thang, nam } = req.body;
    const validTypes = ['phidichvu', 'phiquanly', 'phiguixe'];
    
    if (!validTypes.includes(feeType.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid fee type' });
    }

    const columnName = `Thang${thang}`;
    await pool.execute(
      `UPDATE ${feeType} SET ${columnName} = TienNopMoiThang WHERE MaHoKhau = ? AND Nam = ?`,
      [maHoKhau, nam]
    );

    res.json({ message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Update fee payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update living fee (PhiSinhHoat)
router.put('/phisinhhoat/update', authenticateToken, async (req, res) => {
  try {
    const { maHoKhau, thang, nam, tienDien, tienNuoc, tienInternet } = req.body;

    // Check if record exists for this month
    const [existing] = await pool.execute(
      'SELECT COUNT(*) as count FROM capnhatphisinhhoat WHERE MaHoKhau = ? AND Thang = ? AND Nam = ?',
      [maHoKhau, thang, nam]
    );

    if (existing[0].count > 0) {
      // Update existing record
      await pool.execute(
        'UPDATE capnhatphisinhhoat SET TienDien = ?, TienNuoc = ?, TienInternet = ? WHERE MaHoKhau = ? AND Thang = ? AND Nam = ?',
        [tienDien, tienNuoc, tienInternet, maHoKhau, thang, nam]
      );
    } else {
      // Insert new record
      await pool.execute(
        'INSERT INTO capnhatphisinhhoat (MaHoKhau, TienDien, TienNuoc, TienInternet, Thang, Nam) VALUES (?, ?, ?, ?, ?, ?)',
        [maHoKhau, tienDien, tienNuoc, tienInternet, thang, nam]
      );
    }

    // Update PhiSinhHoat
    const total = tienDien + tienNuoc + tienInternet;
    const columnName = `Thang${thang}`;
    await pool.execute(
      `UPDATE phisinhhoat SET ${columnName} = ? WHERE MaHoKhau = ? AND Nam = ?`,
      [total, maHoKhau, nam]
    );

    res.json({ message: 'Living fee updated successfully' });
  } catch (error) {
    console.error('Update living fee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update fee prices
router.put('/:feeType/price', authenticateToken, async (req, res) => {
  try {
    const { feeType } = req.params;
    const { giaPhi, nam } = req.body;
    const validTypes = ['phidichvu', 'phiquanly'];
    
    if (!validTypes.includes(feeType.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid fee type' });
    }

    // Get all households with their area
    const [households] = await pool.execute('SELECT MaHoKhau, dienTichHo FROM hokhau');
    
    for (const household of households) {
      await pool.execute(
        `UPDATE ${feeType} SET GiaPhi = ?, TienNopMoiThang = ? WHERE MaHoKhau = ? AND Nam >= ?`,
        [giaPhi, giaPhi * household.dienTichHo, household.MaHoKhau, nam]
      );
    }

    res.json({ message: 'Fee price updated successfully' });
  } catch (error) {
    console.error('Update fee price error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update parking fee prices
router.put('/phiguixe/price', authenticateToken, async (req, res) => {
  try {
    const { giaXeMay, giaOTo, giaXeDap, nam } = req.body;

    const [households] = await pool.execute('SELECT MaHoKhau, SoXeMay, SoOTo, SoXeDap FROM hokhau');
    
    for (const household of households) {
      const tienNop = giaXeMay * household.SoXeMay + giaOTo * household.SoOTo + giaXeDap * household.SoXeDap;
      await pool.execute(
        'UPDATE phiguixe SET GiaXeMay = ?, GiaOTo = ?, GiaXeDap = ?, TienNopMoiThang = ? WHERE MaHoKhau = ? AND Nam >= ?',
        [giaXeMay, giaOTo, giaXeDap, tienNop, household.MaHoKhau, nam]
      );
    }

    res.json({ message: 'Parking fee prices updated successfully' });
  } catch (error) {
    console.error('Update parking fee price error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


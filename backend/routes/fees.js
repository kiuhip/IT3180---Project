import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get fee data by type and year
router.get('/:feeType/:year', authenticateToken, async (req, res) => {
  try {
    const { feeType, year } = req.params;
    const validTypes = ['phidichvu', 'phiquanly', 'phiguixe', 'phisinhhoat'];
    const normalizedType = feeType.toLowerCase();
    
    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({ error: 'Invalid fee type. Valid types: phidichvu, phiquanly, phiguixe, phisinhhoat' });
    }

    if (!year || isNaN(year) || parseInt(year) < 2000 || parseInt(year) > 2100) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    // Use whitelist to prevent SQL injection
    const tableName = validTypes.find(t => t === normalizedType);
    const [rows] = await pool.execute(
      `SELECT * FROM ?? WHERE Nam = ?`,
      [tableName, year]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get fee data error:', error);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(400).json({ error: 'Fee type table does not exist' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update fee payment status
router.put('/:feeType/pay', authenticateToken, async (req, res) => {
  try {
    const { feeType } = req.params;
    const { maHoKhau, thang, nam } = req.body;
    const validTypes = ['phidichvu', 'phiquanly', 'phiguixe'];
    const normalizedType = feeType.toLowerCase();
    
    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({ error: 'Invalid fee type. Valid types: phidichvu, phiquanly, phiguixe' });
    }

    if (!maHoKhau || !thang || !nam) {
      return res.status(400).json({ error: 'maHoKhau, thang, and nam are required' });
    }

    if (thang < 1 || thang > 12) {
      return res.status(400).json({ error: 'Invalid month (1-12)' });
    }

    const tableName = validTypes.find(t => t === normalizedType);
    const columnName = `Thang${thang}`;
    
    // Validate column exists by checking if update affects any rows
    const [result] = await pool.execute(
      `UPDATE ?? SET ?? = TienNopMoiThang WHERE MaHoKhau = ? AND Nam = ?`,
      [tableName, columnName, maHoKhau, nam]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fee record not found for this household and year' });
    }

    res.json({ message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Update fee payment error:', error);
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(400).json({ error: 'Invalid month column' });
    }
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
    const normalizedType = feeType.toLowerCase();
    
    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({ error: 'Invalid fee type. Valid types: phidichvu, phiquanly' });
    }

    if (!giaPhi || isNaN(giaPhi) || giaPhi < 0) {
      return res.status(400).json({ error: 'Valid giaPhi (price per unit) is required' });
    }

    if (!nam || isNaN(nam) || parseInt(nam) < 2000 || parseInt(nam) > 2100) {
      return res.status(400).json({ error: 'Valid year is required' });
    }

    const tableName = validTypes.find(t => t === normalizedType);

    // Get all households with their area
    const [households] = await pool.execute('SELECT MaHoKhau, dienTichHo FROM hokhau');
    
    for (const household of households) {
      await pool.execute(
        `UPDATE ?? SET GiaPhi = ?, TienNopMoiThang = ? WHERE MaHoKhau = ? AND Nam >= ?`,
        [tableName, giaPhi, giaPhi * household.dienTichHo, household.MaHoKhau, nam]
      );
    }

    res.json({ message: 'Fee price updated successfully', updated: households.length });
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


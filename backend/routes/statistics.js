import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get total households
    const [householdCount] = await pool.execute('SELECT COUNT(*) as count FROM hokhau');
    
    // Get total residents
    const [residentCount] = await pool.execute('SELECT COUNT(*) as count FROM nhankhau');
    
    // Get total payments this month
    const [paymentThisMonth] = await pool.execute(
      'SELECT SUM(SoTienThanhToan) as total FROM thanhtoan WHERE MONTH(NgayThanhToan) = MONTH(CURRENT_DATE()) AND YEAR(NgayThanhToan) = YEAR(CURRENT_DATE())'
    );
    
    // Get total payments this year
    const [paymentThisYear] = await pool.execute(
      'SELECT SUM(SoTienThanhToan) as total FROM thanhtoan WHERE YEAR(NgayThanhToan) = YEAR(CURRENT_DATE())'
    );

    // Get unpaid fees count for current month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const columnName = `Thang${currentMonth}`;
    
    const [unpaidDichVu] = await pool.execute(
      `SELECT COUNT(*) as count FROM phidichvu WHERE Nam = ? AND ${columnName} = 0`,
      [currentYear]
    );
    
    const [unpaidQuanLy] = await pool.execute(
      `SELECT COUNT(*) as count FROM phiquanly WHERE Nam = ? AND ${columnName} = 0`,
      [currentYear]
    );
    
    const [unpaidGuiXe] = await pool.execute(
      `SELECT COUNT(*) as count FROM phiguixe WHERE Nam = ? AND ${columnName} = 0`,
      [currentYear]
    );

    res.json({
      totalHouseholds: householdCount[0].count,
      totalResidents: residentCount[0].count,
      paymentThisMonth: paymentThisMonth[0].total || 0,
      paymentThisYear: paymentThisYear[0].total || 0,
      unpaidFees: {
        dichVu: unpaidDichVu[0].count,
        quanLy: unpaidQuanLy[0].count,
        guiXe: unpaidGuiXe[0].count
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


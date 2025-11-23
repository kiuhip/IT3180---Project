import express from 'express';
import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM user WHERE UserName = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];

    // Simple password comparison (since original system doesn't use hashing)
    if (user.Password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { username: user.UserName, hoTen: user.HoTen },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        username: user.UserName,
        hoTen: user.HoTen,
        email: user.Email,
        soDT: user.SoDT,
        diaChi: user.DiaChi,
        tuoi: user.Tuoi
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT UserName, HoTen, Email, SoDT, DiaChi, Tuoi FROM user WHERE UserName = ?',
      [req.user.username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    // Return consistent format with login endpoint
    res.json({
      user: {
        username: user.UserName,
        hoTen: user.HoTen,
        email: user.Email,
        soDT: user.SoDT,
        diaChi: user.DiaChi,
        tuoi: user.Tuoi
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords are required' });
    }

    const [rows] = await pool.execute(
      'SELECT Password FROM user WHERE UserName = ?',
      [req.user.username]
    );

    if (rows.length === 0 || rows[0].Password !== oldPassword) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    await pool.execute(
      'UPDATE user SET Password = ? WHERE UserName = ?',
      [newPassword, req.user.username]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user info
router.put('/update-info', authenticateToken, async (req, res) => {
  try {
    const { hoTen, email, soDT, diaChi, tuoi } = req.body;

    await pool.execute(
      'UPDATE user SET HoTen = ?, Email = ?, SoDT = ?, DiaChi = ?, Tuoi = ? WHERE UserName = ?',
      [hoTen, email, soDT, diaChi, tuoi, req.user.username]
    );

    res.json({ message: 'User info updated successfully' });
  } catch (error) {
    console.error('Update user info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


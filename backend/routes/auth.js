import express from 'express';
import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const [rows] = await pool.execute(
      'SELECT UserName, HoTen, Email, SoDT, DiaChi, Tuoi FROM user WHERE UserName = ?',
      [decoded.username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords are required' });
    }

    const [rows] = await pool.execute(
      'SELECT Password FROM user WHERE UserName = ?',
      [decoded.username]
    );

    if (rows.length === 0 || rows[0].Password !== oldPassword) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    await pool.execute(
      'UPDATE user SET Password = ? WHERE UserName = ?',
      [newPassword, decoded.username]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user info
router.put('/update-info', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { hoTen, email, soDT, diaChi, tuoi } = req.body;

    await pool.execute(
      'UPDATE user SET HoTen = ?, Email = ?, SoDT = ?, DiaChi = ?, Tuoi = ? WHERE UserName = ?',
      [hoTen, email, soDT, diaChi, tuoi, decoded.username]
    );

    res.json({ message: 'User info updated successfully' });
  } catch (error) {
    console.error('Update user info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


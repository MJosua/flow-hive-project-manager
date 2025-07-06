const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool, JWT_SECRET } = require('../server');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Login endpoint - using HOTS authentication
router.post('/login', async (req, res) => {
  try {
    const { uid, password, asin } = req.body;

    console.log('Login attempt for UID:', uid);
    
    if (!uid || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Query your HOTS authentication table (you'll handle this)
    // For now, I'll provide a structure but you'll need to modify for your HOTS login
    
    // Example query - modify this for your HOTS authentication
    const [hotsUsers] = await pool.execute(
      'SELECT * FROM hots_users WHERE uid = ? AND is_active = 1',
      [uid]
    );

    if (hotsUsers.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = hotsUsers[0];
    
    // Verify password (you'll handle this based on your HOTS system)
    // const isValidPassword = await bcrypt.compare(password, user.password_hash);
    // For now, simple comparison - you should implement proper password verification
    const isValidPassword = password === user.password || asin === user.password;
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        uid: user.uid,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store token in database for session management
    await pool.execute(
      'INSERT INTO user_sessions (user_id, token, expires_at, created_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW())',
      [user.user_id, token]
    );

    res.json({
      success: true,
      tokek: token, // Using 'tokek' to match your frontend
      userData: {
        user_id: user.user_id,
        uid: user.uid,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        department: user.department
      },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Keep login endpoint
router.post('/keep-login', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Check if token is still valid in database
    const [sessions] = await pool.execute(
      'SELECT * FROM user_sessions WHERE user_id = ? AND token = ? AND expires_at > NOW()',
      [userId, req.token]
    );

    if (sessions.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Session expired'
      });
    }

    // Get updated user data
    const [users] = await pool.execute(
      'SELECT * FROM hots_users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Update last activity
    await pool.execute(
      'UPDATE user_sessions SET last_activity = NOW() WHERE token = ?',
      [req.token]
    );

    res.json({
      success: true,
      tokek: req.token,
      userData: {
        user_id: user.user_id,
        uid: user.uid,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        department: user.department
      },
      expires_at: sessions[0].expires_at
    });

  } catch (error) {
    console.error('Keep login error:', error);
    res.status(500).json({
      success: false,
      message: 'Keep login failed'
    });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Remove token from database
    await pool.execute(
      'DELETE FROM user_sessions WHERE token = ?',
      [req.token]
    );

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

module.exports = router;

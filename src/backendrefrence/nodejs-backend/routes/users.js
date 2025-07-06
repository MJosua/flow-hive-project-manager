
const express = require('express');
const { pool } = require('../server');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all users
router.get('/', async (req, res) => {
  try {
    const { department_id, role } = req.query;

    let query = `
      SELECT 
        u.user_id,
        u.uid,
        u.firstname,
        u.lastname,
        u.email,
        u.role,
        u.department,
        u.is_active
      FROM pm_users u
      WHERE u.is_active = 1
    `;
    
    const params = [];

    if (department_id) {
      query += ' AND u.department_id = ?';
      params.push(department_id);
    }
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    query += ' ORDER BY u.firstname, u.lastname';

    const [users] = await pool.execute(query, params);

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Get departments
router.get('/departments', async (req, res) => {
  try {
    const [departments] = await pool.execute(`
      SELECT * FROM pm_departments 
      WHERE is_active = 1 
      ORDER BY department_name
    `);

    res.json({
      success: true,
      data: departments
    });

  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch departments'
    });
  }
});

module.exports = router;

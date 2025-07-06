
const express = require('express');
const { pool } = require('../server');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all tasks with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      assigned_to, 
      project_id,
      page = 1, 
      limit = 10 
    } = req.query;

    let query = `
      SELECT 
        t.*,
        p.name as project_name,
        CONCAT(u_assigned.firstname, ' ', u_assigned.lastname) as assigned_to_name,
        CONCAT(u_created.firstname, ' ', u_created.lastname) as created_by_name
      FROM pm_tasks t
      LEFT JOIN pm_projects p ON t.project_id = p.project_id
      LEFT JOIN pm_users u_assigned ON t.assigned_to = u_assigned.user_id
      LEFT JOIN pm_users u_created ON t.created_by = u_created.user_id
      WHERE 1=1
    `;
    
    const params = [];

    // Apply filters
    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }
    if (assigned_to) {
      query += ' AND t.assigned_to = ?';
      params.push(assigned_to);
    }
    if (project_id) {
      query += ' AND t.project_id = ?';
      params.push(project_id);
    }

    query += ' ORDER BY t.created_date DESC';

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [tasks] = await pool.execute(query, params);

    res.json({
      success: true,
      data: tasks
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// Get user's assigned tasks
router.get('/my-tasks', async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { status } = req.query;

    let query = `
      SELECT 
        t.*,
        p.name as project_name
      FROM pm_tasks t
      LEFT JOIN pm_projects p ON t.project_id = p.project_id
      WHERE t.assigned_to = ?
    `;
    
    const params = [userId];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    query += ' ORDER BY t.due_date ASC';

    const [tasks] = await pool.execute(query, params);

    res.json({
      success: true,
      data: tasks
    });

  } catch (error) {
    console.error('Error fetching my tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const taskData = req.body;
    const userId = req.user.user_id;

    const [result] = await pool.execute(`
      INSERT INTO pm_tasks 
      (name, description, status, priority, project_id, assigned_to, created_by, due_date, estimated_hours, created_date, updated_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      taskData.name,
      taskData.description,
      taskData.status || 'todo',
      taskData.priority || 'medium',
      taskData.project_id,
      taskData.assigned_to,
      userId,
      taskData.due_date,
      taskData.estimated_hours
    ]);

    const [newTask] = await pool.execute(
      'SELECT * FROM pm_tasks WHERE task_id = ?',
      [result.insertId]
    );

    res.json({
      success: true,
      data: newTask[0]
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// Update task status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress } = req.body;

    await pool.execute(`
      UPDATE pm_tasks 
      SET status = ?, progress = ?, updated_date = NOW()
      WHERE task_id = ?
    `, [status, progress || 0, id]);

    const [updatedTask] = await pool.execute(
      'SELECT * FROM pm_tasks WHERE task_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: updatedTask[0]
    });

  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task status'
    });
  }
});

module.exports = router;

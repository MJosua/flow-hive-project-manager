
const express = require('express');
const { pool } = require('../server');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all projects with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      manager_id, 
      department_id,
      page = 1, 
      limit = 10 
    } = req.query;

    let query = `
      SELECT 
        p.*,
        CONCAT(u.firstname, ' ', u.lastname) as manager_name,
        d.department_name
      FROM pm_projects p
      LEFT JOIN pm_users u ON p.manager_id = u.user_id
      LEFT JOIN pm_departments d ON p.department_id = d.department_id
      WHERE 1=1
    `;
    
    const params = [];

    // Apply filters
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND p.priority = ?';
      params.push(priority);
    }
    if (manager_id) {
      query += ' AND p.manager_id = ?';
      params.push(manager_id);
    }
    if (department_id) {
      query += ' AND p.department_id = ?';
      params.push(department_id);
    }

    query += ' ORDER BY p.created_date DESC';

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [projects] = await pool.execute(query, params);

    res.json({
      success: true,
      data: projects
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

// Get project detail
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get project details
    const [projects] = await pool.execute(`
      SELECT 
        p.*,
        CONCAT(u.firstname, ' ', u.lastname) as manager_name,
        d.department_name
      FROM pm_projects p
      LEFT JOIN pm_users u ON p.manager_id = u.user_id
      LEFT JOIN pm_departments d ON p.department_id = d.department_id
      WHERE p.project_id = ?
    `, [id]);

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Get project tasks
    const [tasks] = await pool.execute(`
      SELECT 
        t.*,
        CONCAT(u_assigned.firstname, ' ', u_assigned.lastname) as assigned_to_name,
        CONCAT(u_created.firstname, ' ', u_created.lastname) as created_by_name
      FROM pm_tasks t
      LEFT JOIN pm_users u_assigned ON t.assigned_to = u_assigned.user_id
      LEFT JOIN pm_users u_created ON t.created_by = u_created.user_id
      WHERE t.project_id = ?
      ORDER BY t.created_date DESC
    `, [id]);

    const project = projects[0];
    project.tasks = tasks;

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Error fetching project detail:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project detail'
    });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const projectData = req.body;
    const userId = req.user.user_id;

    const [result] = await pool.execute(`
      INSERT INTO pm_projects 
      (name, description, status, priority, manager_id, department_id, budget, start_date, end_date, estimated_hours, created_date, updated_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      projectData.name,
      projectData.description,
      projectData.status || 'planning',
      projectData.priority || 'medium',
      projectData.manager_id || userId,
      projectData.department_id,
      projectData.budget,
      projectData.start_date,
      projectData.end_date,
      projectData.estimated_hours
    ]);

    const [newProject] = await pool.execute(
      'SELECT * FROM pm_projects WHERE project_id = ?',
      [result.insertId]
    );

    res.json({
      success: true,
      data: newProject[0]
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await pool.execute(`
      UPDATE pm_projects 
      SET name = ?, description = ?, status = ?, priority = ?, budget = ?, 
          start_date = ?, end_date = ?, estimated_hours = ?, updated_date = NOW()
      WHERE project_id = ?
    `, [
      updateData.name,
      updateData.description,
      updateData.status,
      updateData.priority,
      updateData.budget,
      updateData.start_date,
      updateData.end_date,
      updateData.estimated_hours,
      id
    ]);

    const [updatedProject] = await pool.execute(
      'SELECT * FROM pm_projects WHERE project_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: updatedProject[0]
    });

  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM pm_projects WHERE project_id = ?', [id]);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
});

module.exports = router;

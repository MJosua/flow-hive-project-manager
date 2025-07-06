const { dbPMS } = require('../../config/db');
let yellowTerminal = "\x1b[33m";

module.exports = {
  getAllProjects: async (req, res) => {
    let date = new Date();
    let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';

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
          CONCAT(u.firstname, ' ', u.lastname) AS manager_name,
          d.department_name
        FROM pm_projects p
        LEFT JOIN pm_users u ON p.manager_id = u.user_id
        LEFT JOIN pm_departments d ON p.department_id = d.department_id
        WHERE 1=1
      `;
      const params = [];

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
      const offset = (page - 1) * limit;
      query += ` LIMIT ${limit} OFFSET ${offset}`;

      const [projects] = await dbPMS.promise().execute(query, params);

      res.status(200).json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch projects' });
    }
  },

  getProjectDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const [projects] = await dbPMS.promise().execute(`
        SELECT 
          p.*, 
          CONCAT(u.firstname, ' ', u.lastname) AS manager_name,
          d.department_name
        FROM pm_projects p
        LEFT JOIN pm_users u ON p.manager_id = u.user_id
        LEFT JOIN pm_departments d ON p.department_id = d.department_id
        WHERE p.project_id = ?
      `, [id]);

      if (projects.length === 0) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      const [tasks] = await dbPMS.promise().execute(`
        SELECT 
          t.*,
          CONCAT(u_assigned.firstname, ' ', u_assigned.lastname) AS assigned_to_name,
          CONCAT(u_created.firstname, ' ', u_created.lastname) AS created_by_name
        FROM pm_tasks t
        LEFT JOIN pm_users u_assigned ON t.assigned_to = u_assigned.user_id
        LEFT JOIN pm_users u_created ON t.created_by = u_created.user_id
        WHERE t.project_id = ?
        ORDER BY t.created_date DESC
      `, [id]);

      const project = projects[0];
      project.tasks = tasks;

      res.status(200).json({ success: true, data: project });
    } catch (error) {
      console.error('Error fetching project detail:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch project detail' });
    }
  },

  createProject: async (req, res) => {
    try {
      const data = req.body;
      const userId = req.dataToken.user_id;

      const [result] = await dbPMS.promise().execute(`
        INSERT INTO pm_projects 
        (name, description, status, priority, manager_id, department_id, budget, start_date, end_date, estimated_hours, created_date, updated_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        data.name,
        data.description,
        data.status || 'planning',
        data.priority || 'medium',
        data.manager_id || userId,
        data.department_id,
        data.budget,
        data.start_date,
        data.end_date,
        data.estimated_hours
      ]);

      const [newProject] = await dbPMS.promise().execute(
        'SELECT * FROM pm_projects WHERE project_id = ?',
        [result.insertId]
      );

      res.status(200).json({ success: true, data: newProject[0] });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ success: false, error: 'Failed to create project' });
    }
  },

  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      await dbPMS.promise().execute(`
        UPDATE pm_projects 
        SET name = ?, description = ?, status = ?, priority = ?, budget = ?, 
            start_date = ?, end_date = ?, estimated_hours = ?, updated_date = NOW()
        WHERE project_id = ?
      `, [
        data.name,
        data.description,
        data.status,
        data.priority,
        data.budget,
        data.start_date,
        data.end_date,
        data.estimated_hours,
        id
      ]);

      const [updatedProject] = await dbPMS.promise().execute(
        'SELECT * FROM pm_projects WHERE project_id = ?',
        [id]
      );

      res.status(200).json({ success: true, data: updatedProject[0] });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ success: false, error: 'Failed to update project' });
    }
  },

  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;

      await dbPMS.promise().execute('DELETE FROM pm_projects WHERE project_id = ?', [id]);

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ success: false, error: 'Failed to delete project' });
    }
  }
};

const { dbPMS } = require('../../config/db');
let yellowTerminal = "\x1b[33m";

module.exports = {
  getAllTasks: async (req, res) => {
    let date = new Date();
    let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' : ';

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
          p.name AS project_name,
          CONCAT(u_assigned.firstname, ' ', u_assigned.lastname) AS assigned_to_name,
          CONCAT(u_created.firstname, ' ', u_created.lastname) AS created_by_name
        FROM pm_tasks t
        LEFT JOIN pm_projects p ON t.project_id = p.project_id
        LEFT JOIN pm_users u_assigned ON t.assigned_to = u_assigned.user_id
        LEFT JOIN pm_users u_created ON t.created_by = u_created.user_id
        WHERE 1=1
      `;
      const params = [];

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

      const offset = (page - 1) * limit;
      query += ` LIMIT ${limit} OFFSET ${offset}`;

      const [tasks] = await dbPMS.promise().execute(query, params);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
    }
  },

  getMyTasks: async (req, res) => {
    try {
      const userId = req.dataToken.user_id;
      const { status } = req.query;

      let query = `
        SELECT 
          t.*, 
          p.name AS project_name
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

      const [tasks] = await dbPMS.promise().execute(query, params);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
    }
  },

  createTask: async (req, res) => {
    try {
      const data = req.body;
      const userId = req.dataToken.user_id;

      const [result] = await dbPMS.promise().execute(`
        INSERT INTO pm_tasks 
        (name, description, status, priority, project_id, assigned_to, created_by, due_date, estimated_hours, created_date, updated_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        data.name,
        data.description,
        data.status || 'todo',
        data.priority || 'medium',
        data.project_id,
        data.assigned_to,
        userId,
        data.due_date,
        data.estimated_hours
      ]);

      const [newTask] = await dbPMS.promise().execute(
        'SELECT * FROM pm_tasks WHERE task_id = ?',
        [result.insertId]
      );

      res.status(200).json({
        success: true,
        data: newTask[0]
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ success: false, error: 'Failed to create task' });
    }
  },

  updateTaskStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, progress } = req.body;

      await dbPMS.promise().execute(`
        UPDATE pm_tasks 
        SET status = ?, progress = ?, updated_date = NOW()
        WHERE task_id = ?
      `, [status, progress || 0, id]);

      const [updatedTask] = await dbPMS.promise().execute(
        'SELECT * FROM pm_tasks WHERE task_id = ?',
        [id]
      );

      res.status(200).json({
        success: true,
        data: updatedTask[0]
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).json({ success: false, error: 'Failed to update task status' });
    }
  },

  moveTaskToGroup: async (req, res) => {
    try {
      const { id } = req.params;
      const { group_id } = req.body;

      if (!group_id) {
        return res.status(400).json({ success: false, error: 'group_id is required' });
      }

      await dbPMS.promise().execute(`
        UPDATE pm_tasks
        SET group_id = ?, updated_date = NOW()
        WHERE task_id = ?
      `, [group_id, id]);

      const [updatedTask] = await dbPMS.promise().execute(
        'SELECT * FROM pm_tasks WHERE task_id = ?',
        [id]
      );

      res.status(200).json({
        success: true,
        data: updatedTask[0]
      });
    } catch (error) {
      console.error('Error moving task to group:', error);
      res.status(500).json({ success: false, error: 'Failed to move task to group' });
    }
  }
};

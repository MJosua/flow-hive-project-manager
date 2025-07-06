
const { supabase } = require('../config/supabase');

const taskController = {
  // Get all tasks with filtering
  async getAllTasks(req, res) {
    try {
      const { 
        status, 
        priority, 
        assigned_to, 
        project_id,
        task_type_id,
        page = 1, 
        limit = 10 
      } = req.query;

      let query = supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_projects!project_id(name as project_name, manager_name),
          pm_users!assigned_to(firstname, lastname, email),
          pm_users!created_by(firstname, lastname),
          m_task_types!task_type_id(name as task_type_name, color_code, icon)
        `)
        .order('created_date', { ascending: false });

      // Apply filters
      if (status) query = query.eq('status', status);
      if (priority) query = query.eq('priority', priority);
      if (assigned_to) query = query.eq('assigned_to', assigned_to);
      if (project_id) query = query.eq('project_id', project_id);
      if (task_type_id) query = query.eq('task_type_id', task_type_id);

      // Pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get user's assigned tasks
  async getMyTasks(req, res) {
    try {
      const userId = req.user.user_id;
      const { status } = req.query;

      let query = supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_projects!project_id(name as project_name, manager_name),
          m_task_types!task_type_id(name as task_type_name, color_code, icon),
          m_priority_levels!priority_level_id(name as priority_name, color_code as priority_color)
        `)
        .eq('assigned_to', userId)
        .order('due_date', { ascending: true });

      if (status) query = query.eq('status', status);

      const { data, error } = await query;

      if (error) throw error;

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create new task with approval workflow
  async createTask(req, res) {
    try {
      const taskData = req.body;
      const userId = req.user.user_id;

      // Get task type configuration
      const { data: taskType } = await supabase
        .from('m_task_types')
        .select('requires_approval, is_billable, is_target_based')
        .eq('task_type_id', taskData.task_type_id)
        .single();

      // Insert task
      const { data: task, error: taskError } = await supabase
        .from('pm_tasks')
        .insert({
          ...taskData,
          created_by: userId,
          status: taskType?.requires_approval ? 'pending-approval' : 'todo',
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Create approval workflow if required
      if (taskType?.requires_approval) {
        const { data: workflow } = await supabase
          .from('t_approval_workflows')
          .insert({
            entity_type: 'task',
            entity_id: task.task_id,
            approval_type_id: 1, // Standard Task Approval
            submitted_by: userId,
            max_level: 2
          })
          .select()
          .single();

        // Get approval hierarchy
        const { data: approvers } = await supabase
          .rpc('get_approval_hierarchy', { p_user_id: userId });

        // Create approval records
        for (let i = 0; i < Math.min(approvers.length, 2); i++) {
          await supabase
            .from('t_task_approvals')
            .insert({
              workflow_id: workflow.workflow_id,
              task_id: task.task_id,
              level: i + 1,
              approver_id: approvers[i].approver_id
            });
        }
      }

      res.json({ success: true, data: task });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update task status with Kanban support
  async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, column_order, new_column } = req.body;

      const updateData = {
        status,
        updated_date: new Date().toISOString()
      };

      // Add column order for Kanban persistence
      if (column_order !== undefined) {
        updateData.column_order = column_order;
      }

      const { data, error } = await supabase
        .from('pm_tasks')
        .update(updateData)
        .eq('task_id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Move task to different group/project
  async moveTaskToGroup(req, res) {
    try {
      const { id } = req.params;
      const { project_id, group_id } = req.body;
      const userId = req.user.user_id;

      // Check if approval is required for task transfer
      const approvalRequired = project_id !== undefined; // Moving between projects requires approval

      if (approvalRequired) {
        // Create approval workflow for task transfer
        const { data: workflow } = await supabase
          .from('t_approval_workflows')
          .insert({
            entity_type: 'task_transfer',
            entity_id: id,
            approval_type_id: 3, // Resource Assignment
            submitted_by: userId,
            max_level: 2
          })
          .select()
          .single();

        res.json({ 
          success: true, 
          message: 'Task transfer submitted for approval',
          workflow_id: workflow.workflow_id
        });
      } else {
        // Direct update for group changes within same project
        const { data, error } = await supabase
          .from('pm_tasks')
          .update({
            group_id,
            updated_date: new Date().toISOString()
          })
          .eq('task_id', id)
          .select()
          .single();

        if (error) throw error;

        res.json({ success: true, data });
      }
    } catch (error) {
      console.error('Error moving task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get task dependencies
  async getTaskDependencies(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('t_task_dependencies')
        .select(`
          *,
          pm_tasks!depends_on_task_id(name, status, due_date)
        `)
        .eq('task_id', id);

      if (error) throw error;

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching task dependencies:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Add task dependency
  async addTaskDependency(req, res) {
    try {
      const { id } = req.params;
      const { depends_on_task_id, dependency_type, lag_days } = req.body;
      const userId = req.user.user_id;

      const { data, error } = await supabase
        .from('t_task_dependencies')
        .insert({
          task_id: id,
          depends_on_task_id,
          dependency_type: dependency_type || 'finish_to_start',
          lag_days: lag_days || 0,
          created_by: userId
        })
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error adding task dependency:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Time tracking
  async logTime(req, res) {
    try {
      const { id } = req.params;
      const { start_time, end_time, description, is_billable, hourly_rate } = req.body;
      const userId = req.user.user_id;

      // Calculate duration
      const start = new Date(start_time);
      const end = new Date(end_time);
      const duration_minutes = Math.round((end - start) / (1000 * 60));
      const total_cost = is_billable && hourly_rate ? (duration_minutes / 60) * hourly_rate : null;

      const { data, error } = await supabase
        .from('t_time_tracking')
        .insert({
          task_id: id,
          user_id: userId,
          start_time,
          end_time,
          duration_minutes,
          description,
          is_billable: is_billable || false,
          hourly_rate,
          total_cost
        })
        .select()
        .single();

      if (error) throw error;

      // Update task actual hours
      const totalMinutes = await supabase
        .from('t_time_tracking')
        .select('duration_minutes')
        .eq('task_id', id);

      const totalHours = totalMinutes.data?.reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0) / 60;

      await supabase
        .from('pm_tasks')
        .update({ actual_hours: Math.round(totalHours) })
        .eq('task_id', id);

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error logging time:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get time entries for task
  async getTimeEntries(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('t_time_tracking')
        .select(`
          *,
          pm_users!user_id(firstname, lastname)
        `)
        .eq('task_id', id)
        .order('start_time', { ascending: false });

      if (error) throw error;

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching time entries:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = taskController;

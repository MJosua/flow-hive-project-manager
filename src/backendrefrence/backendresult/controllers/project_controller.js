
const { supabase } = require('../config/supabase');

const projectController = {
  // Get all projects with enhanced filtering
  async getProjects(req, res) {
    try {
      const { 
        status, 
        priority, 
        manager_id, 
        department_id, 
        project_type_id,
        page = 1, 
        limit = 10 
      } = req.query;

      let query = supabase
        .from('pm_projects')
        .select(`
          *,
          pm_users!manager_id(firstname, lastname, email),
          pm_departments!department_id(department_name),
          m_project_types!project_type_id(name as project_type_name)
        `)
        .order('created_date', { ascending: false });

      // Apply filters
      if (status) query = query.eq('status', status);
      if (priority) query = query.eq('priority', priority);
      if (manager_id) query = query.eq('manager_id', manager_id);
      if (department_id) query = query.eq('department_id', department_id);
      if (project_type_id) query = query.eq('project_type_id', project_type_id);

      // Pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      res.json({
        success: true,
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count
        }
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create new project with approval workflow
  async createProject(req, res) {
    try {
      const projectData = req.body;
      const userId = req.user.user_id;

      // Insert project
      const { data: project, error: projectError } = await supabase
        .from('pm_projects')
        .insert({
          ...projectData,
          manager_id: userId,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Check if approval is required
      const { data: projectType } = await supabase
        .from('m_project_types')
        .select('requires_approval, approval_threshold')
        .eq('project_type_id', projectData.project_type_id)
        .single();

      if (projectType?.requires_approval && projectData.budget > projectType.approval_threshold) {
        // Create approval workflow
        const { data: workflow } = await supabase
          .from('t_approval_workflows')
          .insert({
            entity_type: 'project',
            entity_id: project.project_id,
            approval_type_id: 2, // Project Budget Approval
            submitted_by: userId,
            max_level: 3
          })
          .select()
          .single();

        // Get approval hierarchy
        const { data: approvers } = await supabase
          .rpc('get_approval_hierarchy', { p_user_id: userId });

        // Create approval records for each level
        for (let i = 0; i < Math.min(approvers.length, 3); i++) {
          await supabase
            .from('t_project_approvals')
            .insert({
              workflow_id: workflow.workflow_id,
              project_id: project.project_id,
              level: i + 1,
              approver_id: approvers[i].approver_id
            });
        }
      }

      res.json({ success: true, data: project });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get project detail with tasks and team members
  async getProjectDetail(req, res) {
    try {
      const { id } = req.params;

      const { data: project, error: projectError } = await supabase
        .from('pm_projects')
        .select(`
          *,
          pm_users!manager_id(firstname, lastname, email),
          pm_departments!department_id(department_name),
          m_project_types!project_type_id(name as project_type_name)
        `)
        .eq('project_id', id)
        .single();

      if (projectError) throw projectError;

      // Get project tasks
      const { data: tasks } = await supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_users!assigned_to(firstname, lastname),
          pm_users!created_by(firstname, lastname)
        `)
        .eq('project_id', id)
        .order('created_date', { ascending: false });

      // Get team members (users assigned to tasks in this project)
      const { data: teamMembers } = await supabase
        .from('pm_users')
        .select('user_id, firstname, lastname, email, role_name')
        .in('user_id', [...new Set(tasks?.map(task => task.assigned_to).filter(Boolean) || [])]);

      // Get approval workflow if exists
      const { data: approvalWorkflow } = await supabase
        .from('t_approval_workflows')
        .select(`
          *,
          t_project_approvals(
            *,
            pm_users!approver_id(firstname, lastname)
          )
        `)
        .eq('entity_type', 'project')
        .eq('entity_id', id)
        .eq('is_active', true)
        .single();

      res.json({
        success: true,
        data: {
          ...project,
          tasks: tasks || [],
          team_members: teamMembers || [],
          approval_workflow: approvalWorkflow
        }
      });
    } catch (error) {
      console.error('Error fetching project detail:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update project
  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabase
        .from('pm_projects')
        .update({
          ...updateData,
          updated_date: new Date().toISOString()
        })
        .eq('project_id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete project
  async deleteProject(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('pm_projects')
        .delete()
        .eq('project_id', id);

      if (error) throw error;

      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get Kanban data for project
  async getKanbanData(req, res) {
    try {
      const { id } = req.params;

      // Get status options for tasks
      const { data: statusOptions } = await supabase
        .from('m_status_options')
        .select('*')
        .eq('entity_type', 'task')
        .eq('is_active', true)
        .order('sort_order');

      // Get tasks grouped by status
      const { data: tasks } = await supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_users!assigned_to(firstname, lastname, email),
          m_task_types!task_type_id(name, color_code, icon),
          m_priority_levels!priority_level_id(name as priority_name, color_code as priority_color)
        `)
        .eq('project_id', id)
        .order('created_date');

      // Group tasks by status
      const columns = statusOptions.map(status => ({
        id: status.status_key,
        title: status.status_label,
        color: status.color_code,
        tasks: tasks?.filter(task => task.status === status.status_key) || []
      }));

      res.json({ success: true, data: { columns } });
    } catch (error) {
      console.error('Error fetching Kanban data:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get Gantt data for project
  async getGanttData(req, res) {
    try {
      const { id } = req.params;

      // Get tasks with dependencies
      const { data: tasks } = await supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_users!assigned_to(firstname, lastname),
          t_task_dependencies!task_id(
            depends_on_task_id,
            dependency_type,
            lag_days
          )
        `)
        .eq('project_id', id)
        .order('created_date');

      // Calculate critical path
      const { data: criticalPath } = await supabase
        .rpc('calculate_critical_path', { p_project_id: parseInt(id) });

      const ganttTasks = tasks?.map(task => ({
        ...task,
        start_date: task.start_date || task.created_date,
        end_date: task.due_date,
        progress: task.progress || 0,
        dependencies: task.t_task_dependencies || [],
        is_critical: criticalPath?.find(cp => cp.task_id === task.task_id)?.is_critical || false
      }));

      res.json({ success: true, data: { tasks: ganttTasks, critical_path: criticalPath } });
    } catch (error) {
      console.error('Error fetching Gantt data:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = projectController;

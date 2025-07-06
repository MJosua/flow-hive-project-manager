
const { supabase } = require('../config/supabase');

const kanbanController = {
  // Get Kanban board configuration and tasks
  async getBoard(req, res) {
    try {
      const { projectId } = req.params;

      // Get status options (columns)
      const { data: statusColumns } = await supabase
        .from('m_status_options')
        .select('*')
        .eq('entity_type', 'task')
        .eq('is_active', true)
        .order('sort_order');

      // Get tasks for the project
      const { data: tasks } = await supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_users!assigned_to(user_id, firstname, lastname, email),
          m_task_types!task_type_id(name, color_code, icon),
          m_priority_levels!priority_level_id(name as priority_name, color_code as priority_color),
          t_task_dependencies!task_id(depends_on_task_id, dependency_type)
        `)
        .eq('project_id', projectId)
        .order('column_order', { ascending: true });

      // Group tasks by status
      const columns = statusColumns.map(column => ({
        id: column.status_key,
        title: column.status_label,
        color: column.color_code,
        is_final: column.is_final,
        sort_order: column.sort_order,
        tasks: tasks?.filter(task => task.status === column.status_key)
          .sort((a, b) => (a.column_order || 0) - (b.column_order || 0)) || []
      }));

      // Get WIP limits and board configuration (if exists)
      const { data: boardConfig } = await supabase
        .from('t_custom_configurations')
        .select('value')
        .eq('entity_type', 'kanban_board')
        .eq('entity_id', projectId)
        .single();

      res.json({
        success: true,
        data: {
          columns,
          configuration: boardConfig?.value || {
            wip_limits: {},
            show_assignee: true,
            show_priority: true,
            show_due_date: true
          }
        }
      });
    } catch (error) {
      console.error('Error fetching Kanban board:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Move task between columns with drag-drop support
  async moveTask(req, res) {
    try {
      const { taskId } = req.params;
      const { 
        new_status, 
        new_column_order, 
        source_column, 
        destination_column,
        destination_index 
      } = req.body;

      // Get current task
      const { data: currentTask } = await supabase
        .from('pm_tasks')
        .select('status, column_order, project_id')
        .eq('task_id', taskId)
        .single();

      if (!currentTask) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }

      // Check WIP limits for destination column
      const { data: wipConfig } = await supabase
        .from('t_custom_configurations')
        .select('value')
        .eq('entity_type', 'kanban_board')
        .eq('entity_id', currentTask.project_id)
        .single();

      if (wipConfig?.value?.wip_limits?.[destination_column]) {
        const { data: tasksInColumn } = await supabase
          .from('pm_tasks')
          .select('task_id')
          .eq('project_id', currentTask.project_id)
          .eq('status', destination_column);

        const wipLimit = wipConfig.value.wip_limits[destination_column];
        if (tasksInColumn.length >= wipLimit && currentTask.status !== destination_column) {
          return res.status(400).json({
            success: false,
            error: `WIP limit exceeded for ${destination_column}. Limit: ${wipLimit}`
          });
        }
      }

      // Update task positions in source column (if moved within same column)
      if (source_column === destination_column) {
        const { data: columnTasks } = await supabase
          .from('pm_tasks')
          .select('task_id, column_order')
          .eq('project_id', currentTask.project_id)
          .eq('status', source_column)
          .order('column_order');

        // Reorder tasks
        const updates = [];
        columnTasks.forEach((task, index) => {
          if (task.task_id === parseInt(taskId)) return;
          
          let newOrder = index;
          if (index >= destination_index) {
            newOrder = index + 1;
          }
          
          if (task.column_order !== newOrder) {
            updates.push({
              task_id: task.task_id,
              column_order: newOrder
            });
          }
        });

        // Execute updates
        for (const update of updates) {
          await supabase
            .from('pm_tasks')
            .update({ column_order: update.column_order })
            .eq('task_id', update.task_id);
        }
      } else {
        // Moving to different column - update orders in both columns
        // Update destination column orders
        const { data: destTasks } = await supabase
          .from('pm_tasks')
          .select('task_id')
          .eq('project_id', currentTask.project_id)
          .eq('status', destination_column)
          .gte('column_order', destination_index)
          .order('column_order');

        for (const task of destTasks || []) {
          await supabase
            .from('pm_tasks')
            .update({ column_order: supabase.raw('column_order + 1') })
            .eq('task_id', task.task_id);
        }
      }

      // Update the moved task
      const { data: updatedTask, error } = await supabase
        .from('pm_tasks')
        .update({
          status: new_status,
          column_order: destination_index,
          updated_date: new Date().toISOString()
        })
        .eq('task_id', taskId)
        .select(`
          *,
          pm_users!assigned_to(firstname, lastname),
          m_task_types!task_type_id(name, color_code, icon)
        `)
        .single();

      if (error) throw error;

      // Log the move in audit trail
      await supabase
        .from('t_audit_logs')
        .insert({
          entity_type: 'task_move',
          entity_id: parseInt(taskId),
          action: 'kanban_move',
          old_values: { 
            status: currentTask.status, 
            column_order: currentTask.column_order 
          },
          new_values: { 
            status: new_status, 
            column_order: destination_index 
          },
          user_id: req.user.user_id
        });

      res.json({ success: true, data: updatedTask });
    } catch (error) {
      console.error('Error moving task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update board configuration
  async updateBoardConfig(req, res) {
    try {
      const { projectId } = req.params;
      const configuration = req.body;
      const userId = req.user.user_id;

      const { data, error } = await supabase
        .from('t_custom_configurations')
        .upsert({
          entity_type: 'kanban_board',
          entity_id: parseInt(projectId),
          attribute_id: null,
          value: configuration,
          created_by: userId,
          updated_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error updating board configuration:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get board analytics
  async getBoardAnalytics(req, res) {
    try {
      const { projectId } = req.params;
      const { period = '30' } = req.query; // days

      const periodStart = new Date();
      periodStart.setDate(periodStart.getDate() - parseInt(period));

      // Task distribution by status
      const { data: statusDistribution } = await supabase
        .from('pm_tasks')
        .select('status')
        .eq('project_id', projectId);

      // Task completion trend
      const { data: completionTrend } = await supabase
        .from('pm_tasks')
        .select('updated_date, status')
        .eq('project_id', projectId)
        .eq('status', 'done')
        .gte('updated_date', periodStart.toISOString())
        .order('updated_date');

      // Average time in each column
      const { data: auditLogs } = await supabase
        .from('t_audit_logs')
        .select('entity_id, old_values, new_values, created_date')
        .eq('entity_type', 'task_move')
        .eq('action', 'kanban_move')
        .gte('created_date', periodStart.toISOString());

      // Process analytics data
      const statusCount = {};
      statusDistribution?.forEach(task => {
        statusCount[task.status] = (statusCount[task.status] || 0) + 1;
      });

      const dailyCompletions = {};
      completionTrend?.forEach(task => {
        const date = task.updated_date.split('T')[0];
        dailyCompletions[date] = (dailyCompletions[date] || 0) + 1;
      });

      res.json({
        success: true,
        data: {
          status_distribution: statusCount,
          daily_completions: dailyCompletions,
          total_tasks: statusDistribution?.length || 0,
          completed_tasks: statusCount['done'] || 0,
          completion_rate: statusDistribution?.length ? 
            ((statusCount['done'] || 0) / statusDistribution.length * 100).toFixed(1) : 0
        }
      });
    } catch (error) {
      console.error('Error fetching board analytics:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = kanbanController;

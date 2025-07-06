
const { supabase } = require('../config/supabase');

const approvalController = {
  // Get pending approvals for user
  async getPendingApprovals(req, res) {
    try {
      const userId = req.user.user_id;

      // Get task approvals
      const { data: taskApprovals } = await supabase
        .from('t_task_approvals')
        .select(`
          *,
          t_approval_workflows!workflow_id(
            entity_type,
            entity_id,
            submitted_date,
            pm_users!submitted_by(firstname, lastname)
          ),
          pm_tasks!task_id(name, description, project_name)
        `)
        .eq('approver_id', userId)
        .eq('status', 'pending')
        .eq('is_active', true);

      // Get project approvals
      const { data: projectApprovals } = await supabase
        .from('t_project_approvals')
        .select(`
          *,
          t_approval_workflows!workflow_id(
            entity_type,
            entity_id,
            submitted_date,
            pm_users!submitted_by(firstname, lastname)
          ),
          pm_projects!project_id(name, description, budget)
        `)
        .eq('approver_id', userId)
        .eq('status', 'pending')
        .eq('is_active', true);

      const allApprovals = [
        ...(taskApprovals || []).map(approval => ({ 
          ...approval, 
          type: 'task',
          entity: approval.pm_tasks 
        })),
        ...(projectApprovals || []).map(approval => ({ 
          ...approval, 
          type: 'project',
          entity: approval.pm_projects 
        }))
      ].sort((a, b) => new Date(b.t_approval_workflows.submitted_date) - new Date(a.t_approval_workflows.submitted_date));

      res.json({ success: true, data: allApprovals });
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Approve or reject
  async processApproval(req, res) {
    try {
      const { id } = req.params;
      const { action, comments, delegate_to } = req.body; // action: 'approve', 'reject', 'delegate'
      const userId = req.user.user_id;

      // Get approval record
      const { data: approval } = await supabase
        .from('t_task_approvals')
        .select(`
          *,
          t_approval_workflows!workflow_id(*)
        `)
        .eq('approval_id', id)
        .single();

      if (!approval) {
        // Try project approvals
        const { data: projectApproval } = await supabase
          .from('t_project_approvals')
          .select(`
            *,
            t_approval_workflows!workflow_id(*)
          `)
          .eq('approval_id', id)
          .single();

        if (!projectApproval) {
          return res.status(404).json({ success: false, error: 'Approval not found' });
        }
        approval = projectApproval;
      }

      const workflow = approval.t_approval_workflows;

      // Update approval record
      const updateData = {
        status: action,
        comments,
        approved_date: new Date().toISOString()
      };

      if (action === 'delegate' && delegate_to) {
        updateData.delegated_to = delegate_to;
        updateData.status = 'delegated';
      }

      const table = approval.task_id ? 't_task_approvals' : 't_project_approvals';
      await supabase
        .from(table)
        .update(updateData)
        .eq('approval_id', id);

      // Update workflow status
      if (action === 'reject') {
        await supabase
          .from('t_approval_workflows')
          .update({
            status: 'rejected',
            completed_date: new Date().toISOString(),
            rejection_reason: comments
          })
          .eq('workflow_id', workflow.workflow_id);

        // Update entity status
        await this.updateEntityStatus(workflow.entity_type, workflow.entity_id, 'rejected');
      } else if (action === 'approve') {
        // Check if this is the final approval level
        const { data: remainingApprovals } = await supabase
          .from(table)
          .select('approval_id')
          .eq('workflow_id', workflow.workflow_id)
          .eq('status', 'pending')
          .neq('approval_id', id);

        if (!remainingApprovals || remainingApprovals.length === 0) {
          // Final approval - complete workflow
          await supabase
            .from('t_approval_workflows')
            .update({
              status: 'approved',
              completed_date: new Date().toISOString()
            })
            .eq('workflow_id', workflow.workflow_id);

          // Update entity status
          await this.updateEntityStatus(workflow.entity_type, workflow.entity_id, 'approved');
        }
      }

      res.json({ success: true, message: `Approval ${action}d successfully` });
    } catch (error) {
      console.error('Error processing approval:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Helper function to update entity status after approval
  async updateEntityStatus(entityType, entityId, approvalStatus) {
    let table, idField, statusUpdate;

    switch (entityType) {
      case 'task':
        table = 'pm_tasks';
        idField = 'task_id';
        statusUpdate = approvalStatus === 'approved' ? 'todo' : 'rejected';
        break;
      case 'project':
        table = 'pm_projects';
        idField = 'project_id';
        statusUpdate = approvalStatus === 'approved' ? 'active' : 'cancelled';
        break;
      case 'task_transfer':
        // Handle task transfer approval
        if (approvalStatus === 'approved') {
          // Execute the transfer (this would need additional logic to get transfer details)
          return;
        }
        table = 'pm_tasks';
        idField = 'task_id';
        statusUpdate = 'transfer_rejected';
        break;
      default:
        return;
    }

    await supabase
      .from(table)
      .update({ 
        status: statusUpdate,
        updated_date: new Date().toISOString()
      })
      .eq(idField, entityId);
  },

  // Get approval history for entity
  async getApprovalHistory(req, res) {
    try {
      const { entity_type, entity_id } = req.query;

      const { data: workflows } = await supabase
        .from('t_approval_workflows')
        .select(`
          *,
          t_task_approvals(
            *,
            pm_users!approver_id(firstname, lastname)
          ),
          t_project_approvals(
            *,
            pm_users!approver_id(firstname, lastname)
          ),
          pm_users!submitted_by(firstname, lastname)
        `)
        .eq('entity_type', entity_type)
        .eq('entity_id', entity_id)
        .order('submitted_date', { ascending: false });

      res.json({ success: true, data: workflows });
    } catch (error) {
      console.error('Error fetching approval history:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get approval statistics
  async getApprovalStats(req, res) {
    try {
      const userId = req.user.user_id;

      // Get pending approvals count
      const { data: pendingTasks } = await supabase
        .from('t_task_approvals')
        .select('approval_id')
        .eq('approver_id', userId)
        .eq('status', 'pending');

      const { data: pendingProjects } = await supabase
        .from('t_project_approvals')
        .select('approval_id')
        .eq('approver_id', userId)
        .eq('status', 'pending');

      // Get completed approvals this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: completedThisMonth } = await supabase
        .from('t_approval_workflows')
        .select('workflow_id')
        .in('status', ['approved', 'rejected'])
        .gte('completed_date', startOfMonth.toISOString());

      res.json({
        success: true,
        data: {
          pending_tasks: pendingTasks?.length || 0,
          pending_projects: pendingProjects?.length || 0,
          total_pending: (pendingTasks?.length || 0) + (pendingProjects?.length || 0),
          completed_this_month: completedThisMonth?.length || 0
        }
      });
    } catch (error) {
      console.error('Error fetching approval stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = approvalController;

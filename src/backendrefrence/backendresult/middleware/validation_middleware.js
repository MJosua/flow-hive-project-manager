
const validationMiddleware = {
  // Validate project creation
  validateProject(req, res, next) {
    const { name, manager_id, start_date, end_date } = req.body;
    const errors = [];

    if (!name || name.trim().length < 3) {
      errors.push('Project name must be at least 3 characters long');
    }

    if (!manager_id) {
      errors.push('Manager ID is required');
    }

    if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
      errors.push('Start date must be before end date');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  },

  // Validate task creation
  validateTask(req, res, next) {
    const { name, project_id, estimated_hours, due_date } = req.body;
    const errors = [];

    if (!name || name.trim().length < 3) {
      errors.push('Task name must be at least 3 characters long');
    }

    if (!project_id) {
      errors.push('Project ID is required');
    }

    if (estimated_hours && (estimated_hours < 0 || estimated_hours > 1000)) {
      errors.push('Estimated hours must be between 0 and 1000');
    }

    if (due_date && new Date(due_date) < new Date()) {
      errors.push('Due date cannot be in the past');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  },

  // Validate time tracking
  validateTimeEntry(req, res, next) {
    const { start_time, end_time, hourly_rate } = req.body;
    const errors = [];

    if (!start_time) {
      errors.push('Start time is required');
    }

    if (!end_time) {
      errors.push('End time is required');
    }

    if (start_time && end_time && new Date(start_time) >= new Date(end_time)) {
      errors.push('Start time must be before end time');
    }

    if (hourly_rate && (hourly_rate < 0 || hourly_rate > 10000)) {
      errors.push('Hourly rate must be between 0 and 10000');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  },

  // Validate Kanban move
  validateKanbanMove(req, res, next) {
    const { new_status, destination_index } = req.body;
    const errors = [];

    if (!new_status) {
      errors.push('New status is required');
    }

    if (destination_index === undefined || destination_index < 0) {
      errors.push('Valid destination index is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  },

  // Validate approval action
  validateApprovalAction(req, res, next) {
    const { action } = req.body;
    const validActions = ['approve', 'reject', 'delegate'];
    const errors = [];

    if (!action || !validActions.includes(action)) {
      errors.push(`Action must be one of: ${validActions.join(', ')}`);
    }

    if (action === 'delegate' && !req.body.delegate_to) {
      errors.push('Delegate to user ID is required when delegating');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  }
};

module.exports = validationMiddleware;


const { supabase } = require('../config/supabase');

const loggingMiddleware = {
  // Request logging
  logRequest(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
      user: req.user?.user_id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    next();
  },

  // Audit logging for important actions
  async auditLog(entityType, entityId, action, oldValues, newValues, userId, req) {
    try {
      await supabase
        .from('t_audit_logs')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          action: action,
          old_values: oldValues,
          new_values: newValues,
          user_id: userId,
          ip_address: req?.ip,
          user_agent: req?.get('User-Agent')
        });
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  },

  // Error logging
  logError(error, req, res, next) {
    console.error(`Error: ${error.message}`, {
      stack: error.stack,
      url: req.url,
      method: req.method,
      user: req.user?.user_id,
      body: req.body
    });

    // Log to database for critical errors
    if (error.status >= 500) {
      this.auditLog(
        'system_error',
        0,
        'error',
        null,
        { message: error.message, stack: error.stack },
        req.user?.user_id || 0,
        req
      );
    }

    next(error);
  }
};

module.exports = loggingMiddleware;

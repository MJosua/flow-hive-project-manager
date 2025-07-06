
const express = require('express');
const router = express.Router();

// Import route modules
const projectRoutes = require('./routes/project_routes');
const taskRoutes = require('./routes/task_routes');
const approvalRoutes = require('./routes/approval_routes');
const kanbanRoutes = require('./routes/kanban_routes');
const authMiddleware = require('./middleware/auth_middleware');
const loggingMiddleware = require('./middleware/logging_middleware');

// Apply global middleware
router.use(loggingMiddleware.logRequest);

// Authentication routes (no auth required)
router.post('/auth/login', async (req, res) => {
  try {
    const { uid, password } = req.body;

    // Validate credentials against pm_users table
    const { data: user, error } = await require('./config/supabase').supabase
      .from('pm_users')
      .select('*')
      .eq('uid', uid)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate token
    const tokenResult = await authMiddleware.generateToken(user);

    res.json({
      success: true,
      tokek: tokenResult.token,
      expires_at: tokenResult.expires_at,
      userData: user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.post('/auth/keep-login', authMiddleware.keepLogin);
router.post('/auth/logout', authMiddleware.logout);

// Protected routes
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/approvals', approvalRoutes);
router.use('/kanban', kanbanRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

// Error handling
router.use(loggingMiddleware.logError);

module.exports = router;

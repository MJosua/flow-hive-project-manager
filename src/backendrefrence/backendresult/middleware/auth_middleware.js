const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = {
  // Enhanced token validation with database check
  async validateToken(req, res, next) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
      }

      // Check if token exists in database and is valid
      const { data: tokenRecord, error } = await supabase
        .from('user_tokens')
        .select(`
          *,
          pm_users!user_id(*)
        `)
        .eq('tokek', token)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !tokenRecord) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
      }

      // Update last used timestamp
      await supabase
        .from('user_tokens')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', tokenRecord.id);

      // Add user data to request
      req.user = tokenRecord.pm_users;
      req.token = tokenRecord;
      
      next();
    } catch (error) {
      console.error('Token validation error:', error);
      res.status(401).json({ success: false, error: 'Token validation failed' });
    }
  },

  // Generate new JWT token
  async generateToken(userData) {
    try {
      const token = jwt.sign(
        { 
          user_id: userData.user_id,
          uid: userData.uid,
          email: userData.email,
          role: userData.role_name
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Store token in database
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { data: tokenRecord, error } = await supabase
        .from('user_tokens')
        .insert({
          user_id: userData.user_id,
          tokek: token,
          expires_at: expiresAt.toISOString(),
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      return { token, expires_at: expiresAt };
    } catch (error) {
      console.error('Token generation error:', error);
      throw error;
    }
  },

  // Keep login functionality
  async keepLogin(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
      }

      // Validate existing token
      const { data: tokenRecord } = await supabase
        .from('user_tokens')
        .select(`
          *,
          pm_users!user_id(*)
        `)
        .eq('tokek', token)
        .eq('is_active', true)
        .single();

      if (!tokenRecord) {
        return res.status(401).json({ success: false, error: 'Token not found' });
      }

      // Check if token is close to expiry (within 2 hours)
      const tokenExpiry = new Date(tokenRecord.expires_at);
      const now = new Date();
      const hoursUntilExpiry = (tokenExpiry - now) / (1000 * 60 * 60);

      let newToken = token;
      let newExpiry = tokenExpiry;

      if (hoursUntilExpiry < 2) {
        // Generate new token
        const tokenResult = await this.generateToken(tokenRecord.pm_users);
        newToken = tokenResult.token;
        newExpiry = tokenResult.expires_at;

        // Deactivate old token
        await supabase
          .from('user_tokens')
          .update({ is_active: false })
          .eq('id', tokenRecord.id);
      } else {
        // Just update last used timestamp
        await supabase
          .from('user_tokens')
          .update({ last_used_at: now.toISOString() })
          .eq('id', tokenRecord.id);
      }

      res.json({
        success: true,
        tokek: newToken,
        expires_at: newExpiry,
        userData: tokenRecord.pm_users
      });
    } catch (error) {
      console.error('Keep login error:', error);
      res.status(500).json({ success: false, error: 'Keep login failed' });
    }
  },

  // Logout functionality
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        await supabase
          .from('user_tokens')
          .update({ is_active: false })
          .eq('tokek', token);
      }

      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ success: false, error: 'Logout failed' });
    }
  }
};

module.exports = authMiddleware;

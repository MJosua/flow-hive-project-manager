import { supabase } from '@/integrations/supabase/client';
import { API_URL } from '@/config/sourceConfig';

// Check if external API is reachable
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('External API not reachable, using Supabase fallback');
    return false;
  }
};

// Unified API service that switches between external API and Supabase
export class ApiService {
  private useSupabase = false;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    this.useSupabase = !(await checkApiAvailability());
    this.initialized = true;
    console.log(this.useSupabase ? '🔄 Using Supabase backend' : '✅ Using external API');
  }

  // Auth methods
  async login(credentials: { uid: string; password: string }) {
    try {
      await this.initialize();
      
      console.log('=== API SERVICE LOGIN ===');
      console.log(`Using: ${this.useSupabase ? 'Supabase' : 'External API'}`);
      console.log('Credentials received:', { uid: credentials.uid, password: '***' });
      
      // Always try external API first if not already using Supabase
      if (!this.useSupabase) {
        try {
          console.log('🔄 Trying external API login...');
          const result = await this.externalLogin(credentials);
          console.log('✅ External API login successful');
          return result;
        } catch (error) {
          console.warn('❌ External API login failed, switching to Supabase:', error);
          this.useSupabase = true;
        }
      }
      console.log('credentials',credentials)
      // Use Supabase if external API failed or is unavailable
      console.log('🔄 Using Supabase login...');
      return await this.supabaseLogin(credentials);
    } catch (error: any) {
      console.error('❌ All login methods failed:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  private async supabaseLogin(credentials: { uid: string; password: string }) {
    try {
      console.log('=== SUPABASE LOGIN ===');
      console.log('Looking for uid:', credentials.uid);
      
      // FIXED: Query by uid field correctly
      const { data: users, error: userError } = await supabase
        .from('pm_users')
        .select('email, user_id, firstname, lastname, role_name, department_name, uid')
        .eq('uid', credentials.uid);

      console.log('Supabase query result:', { users, error: userError });

      if (userError) {
        console.error('❌ Supabase query error:', userError);
        throw new Error(`Database error: ${userError.message}`);
      }

      if (!users || users.length === 0) {
        console.error('❌ No users found with uid:', credentials.uid);
        
        // Debug: Get all users to see what's available
        const { data: allUsers } = await supabase
          .from('pm_users')
          .select('uid, firstname, lastname')
          .limit(10);
        
        console.log('Available users:', allUsers);
        const availableUids = allUsers?.map(u => u.uid).join(', ') || 'none';
        throw new Error(`User not found. Available users: ${availableUids}`);
      }

      const user = users[0];
      console.log('✅ User found:', user);

      // Simple password validation for demo
      if (credentials.password === 'password' || credentials.password === 'test123') {
        const mockToken = `supabase_${user.user_id}_${Date.now()}`;
        
        const result = {
          success: true,
          tokek: mockToken,
          userData: {
            uid: user.uid,
            user_id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role_name: user.role_name,
            department_name: user.department_name
          }
        };
        
        console.log('✅ Supabase login successful:', result);
        return result;
      } else {
        console.error('❌ Invalid password for user:', credentials.uid);
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      console.error('❌ Supabase login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  private async externalLogin(credentials: { uid: string; password: string }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
const response = await fetch(`${API_URL}/hots_auth/pm/login`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(credentials),
  signal: controller.signal
});
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('External API response:', result);
      return result;
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('External API error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Projects methods
  async getProjects() {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/project`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      const { data, error } = await supabase
        .from('pm_projects')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch projects');
    }
  }

  async getProject(id: number) {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/project/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      const { data, error } = await supabase
        .from('pm_projects')
        .select('*')
        .eq('project_id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch project');
    }
  }

  async createProject(projectData: any) {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/project`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('tokek')}`
            },
            body: JSON.stringify(projectData)
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      // Get next project_id
      const { data: lastProject } = await supabase
        .from('pm_projects')
        .select('project_id')
        .order('project_id', { ascending: false })
        .limit(1);

      const nextId = (lastProject?.[0]?.project_id || 0) + 1;

      const { data, error } = await supabase
        .from('pm_projects')
        .insert([{ ...projectData, project_id: nextId }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create project');
    }
  }

  async updateProject(id: number, projectData: any) {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/project/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('tokek')}`
            },
            body: JSON.stringify(projectData)
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      const { data, error } = await supabase
        .from('pm_projects')
        .update(projectData)
        .eq('project_id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update project');
    }
  }

  async deleteProject(id: number) {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/project/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      const { error } = await supabase
        .from('pm_projects')
        .delete()
        .eq('project_id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete project');
    }
  }

  // Tasks methods
  async getTasks(projectId?: number) {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const url = projectId ? `${API_URL}/prjct_mngr/project/${projectId}/tasks` : `${API_URL}/prjct_mngr/task`;
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      let query = supabase.from('pm_tasks').select('*');
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tasks');
    }
  }

  async getMyTasks() {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/task/my-tasks`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      // For demo purposes, we'll get tasks assigned to user_id 2 (Jane Smith)
      const { data, error } = await supabase
        .from('pm_tasks')
        .select('*')
        .eq('assigned_to', 2)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch my tasks');
    }
  }

  async createTask(taskData: any) {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/task`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('tokek')}`
            },
            body: JSON.stringify(taskData)
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      // Get next task_id
      const { data: lastTask } = await supabase
        .from('pm_tasks')
        .select('task_id')
        .order('task_id', { ascending: false })
        .limit(1);

      const nextId = (lastTask?.[0]?.task_id || 0) + 1;

      const { data, error } = await supabase
        .from('pm_tasks')
        .insert([{ ...taskData, task_id: nextId }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create task');
    }
  }

  async updateTask(id: number, taskData: any) {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/task/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('tokek')}`
            },
            body: JSON.stringify(taskData)
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      const { data, error } = await supabase
        .from('pm_tasks')
        .update(taskData)
        .eq('task_id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update task');
    }
  }

  // Users methods
  async getUsers() {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/user`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      const { data, error } = await supabase
        .from('pm_users')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  }

  async getDepartments() {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/user/departments`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      const { data, error } = await supabase
        .from('pm_departments')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch departments');
    }
  }

  async getTeams() {
    try {
      await this.initialize();
      
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/prjct_mngr/user/teams`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
          });
          if (response.ok) {
            return await response.json();
          }
          throw new Error('External API failed');
        } catch (error) {
          console.warn('External API failed, switching to Supabase');
          this.useSupabase = true;
        }
      }

      const { data, error } = await supabase
        .from('pm_teams')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch teams');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

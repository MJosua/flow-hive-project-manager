import { supabase } from '@/integrations/supabase/client';
import { API_URL } from '@/config/sourceConfig';

// Check if external API is reachable
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('External API not reachable, using Supabase');
    return false;
  }
};

// Unified API service that switches between external API and Supabase
export class ApiService {
  private useSupabase = false;

  async initialize() {
    this.useSupabase = !(await checkApiAvailability());
    console.log(this.useSupabase ? '🔄 Using Supabase backend' : '✅ Using external API');
  }

  // Auth methods
  async login(credentials: { username: string; password: string }) {
    try {
      // Always try external API first
      if (!this.useSupabase) {
        try {
          return await this.externalLogin(credentials);
        } catch (error) {
          console.warn('External API login failed, falling back to Supabase');
          this.useSupabase = true;
        }
      }
      console.log('credentials',credentials)
      // Use Supabase if external API failed or is unavailable
      return await this.supabaseLogin(credentials);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  private async supabaseLogin(credentials: { uid: string; password: string }) {
    try {
      // First try to find user by uid to get their email
      const { data: user, error: userError } = await supabase
        .from('pm_users')
        .select('email, user_id, firstname, lastname, role_name, department_name')
        .eq('uid', credentials.uid)
        .single();

      if (userError || !user) {
        throw new Error('User not found');
      }

      // For demo purposes, we'll simulate authentication success
      // In a real app, you'd validate the password against a hash
      if (credentials.password === 'password') {
        // Create a mock session token
        const mockToken = `supabase_${user.user_id}_${Date.now()}`;
        
        return {
          success: true,
          tokek: mockToken,
          userData: {
            uid: credentials.uid,
            user_id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role_name: user.role_name,
            department_name: user.department_name
          }
        };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  private async externalLogin(credentials: { uid: string; password: string }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(`${API_URL}/hots_auth/pm/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Projects methods
  async getProjects() {
    try {
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/project`, {
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/project/${id}`, {
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/project`, {
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/project/${id}`, {
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/project/${id}`, {
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
      if (!this.useSupabase) {
        try {
          const url = projectId ? `${API_URL}/pm/project/${projectId}/tasks` : `${API_URL}/pm/task`;
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/task/my-tasks`, {
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/task`, {
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/task/${id}`, {
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/user`, {
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/user/departments`, {
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
      if (!this.useSupabase) {
        try {
          const response = await fetch(`${API_URL}/pm/user/teams`, {
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

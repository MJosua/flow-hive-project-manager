
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
  async login(credentials: { uid: string; password: string }) {
    if (this.useSupabase) {
      return this.supabaseLogin(credentials);
    }
    return this.externalLogin(credentials);
  }

  private async supabaseLogin(credentials: { uid: string; password: string }) {
    // For Supabase, we'll use email/password auth
    // First try to find user by uid to get email
    const { data: user } = await supabase
      .from('pm_users')
      .select('email')
      .eq('uid', credentials.uid)
      .single();

    if (!user) {
      throw new Error('User not found');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: credentials.password,
    });

    if (error) throw error;

    return {
      success: true,
      tokek: data.session?.access_token,
      userData: data.user
    };
  }

  private async externalLogin(credentials: { uid: string; password: string }) {
    const response = await fetch(`${API_URL}/hots_auth/pm/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  }

  // Projects methods
  async getProjects() {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_projects')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    }

    const response = await fetch(`${API_URL}/prjct_mngr/project`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
    });
    return response.json();
  }

  async getProject(id: number) {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_projects')
        .select('*')
        .eq('project_id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    }

    const response = await fetch(`${API_URL}/prjct_mngr/project/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
    });
    return response.json();
  }

  async createProject(projectData: any) {
    if (this.useSupabase) {
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
    }

    const response = await fetch(`${API_URL}/prjct_mngr/project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('tokek')}`
      },
      body: JSON.stringify(projectData)
    });
    return response.json();
  }

  async updateProject(id: number, projectData: any) {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_projects')
        .update(projectData)
        .eq('project_id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    }

    const response = await fetch(`${API_URL}/prjct_mngr/project/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('tokek')}`
      },
      body: JSON.stringify(projectData)
    });
    return response.json();
  }

  async deleteProject(id: number) {
    if (this.useSupabase) {
      const { error } = await supabase
        .from('pm_projects')
        .delete()
        .eq('project_id', id);

      if (error) throw error;
      return { success: true };
    }

    const response = await fetch(`${API_URL}/prjct_mngr/project/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
    });
    return response.json();
  }

  // Tasks methods
  async getTasks(projectId?: number) {
    if (this.useSupabase) {
      let query = supabase.from('pm_tasks').select('*');
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    }

    const url = projectId ? `${API_URL}/prjct_mngr/project/${projectId}/tasks` : `${API_URL}/prjct_mngr/task`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
    });
    return response.json();
  }

  async getMyTasks() {
    if (this.useSupabase) {
      // For demo purposes, we'll get tasks assigned to user_id 2 (Jane Smith)
      const { data, error } = await supabase
        .from('pm_tasks')
        .select('*')
        .eq('assigned_to', 2)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    }

    const response = await fetch(`${API_URL}/prjct_mngr/task/my-tasks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
    });
    return response.json();
  }

  async createTask(taskData: any) {
    if (this.useSupabase) {
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
    }

    const response = await fetch(`${API_URL}/prjct_mngr/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('tokek')}`
      },
      body: JSON.stringify(taskData)
    });
    return response.json();
  }

  async updateTask(id: number, taskData: any) {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_tasks')
        .update(taskData)
        .eq('task_id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    }

    const response = await fetch(`${API_URL}/prjct_mngr/task/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('tokek')}`
      },
      body: JSON.stringify(taskData)
    });
    return response.json();
  }

  // Users methods
  async getUsers() {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_users')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    }

    const response = await fetch(`${API_URL}/prjct_mngr/user`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
    });
    return response.json();
  }

  async getDepartments() {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_departments')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    }

    const response = await fetch(`${API_URL}/prjct_mngr/user/departments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
    });
    return response.json();
  }

  async getTeams() {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_teams')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    }

    const response = await fetch(`${API_URL}/prjct_mngr/user/teams`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tokek')}` }
    });
    return response.json();
  }
}

// Export singleton instance
export const apiService = new ApiService();

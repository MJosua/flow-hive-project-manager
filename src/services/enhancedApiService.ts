
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

class EnhancedApiService {
  private baseURL: string;
  private useSupabase: boolean = false;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
    this.initialize();
  }

  async initialize() {
    try {
      // Test external API connection
      const response = await axios.get(`${this.baseURL}/health`);
      if (response.data.success) {
        console.log('External API connected successfully');
        this.useSupabase = false;
      }
    } catch (error) {
      console.log('External API unavailable, using Supabase');
      this.useSupabase = true;
    }
  }

  // Authentication methods
  async login(uid: string, password: string) {
    if (this.useSupabase) {
      const { data: user, error } = await supabase
        .from('pm_users')
        .select('*')
        .eq('uid', uid)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        throw new Error('Invalid credentials');
      }

      // Generate a simple token for Supabase mode
      const token = btoa(JSON.stringify({ user_id: user.user_id, timestamp: Date.now() }));
      
      return {
        tokek: token,
        userData: user,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    } else {
      const response = await axios.post(`${this.baseURL}/auth/login`, { uid, password });
      return response.data;
    }
  }

  async keepLogin() {
    const token = localStorage.getItem('tokek');
    if (!token) throw new Error('No token found');

    if (this.useSupabase) {
      // Simple token validation for Supabase mode
      try {
        const decoded = JSON.parse(atob(token));
        const { data: user } = await supabase
          .from('pm_users')
          .select('*')
          .eq('user_id', decoded.user_id)
          .single();

        return {
          tokek: token,
          userData: user,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
      } catch {
        throw new Error('Invalid token');
      }
    } else {
      const response = await axios.post(`${this.baseURL}/auth/keep-login`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  }

  // Project methods
  async getProjects(filters: any = {}) {
    if (this.useSupabase) {
      let query = supabase
        .from('pm_projects')
        .select(`
          *,
          pm_users!manager_id(firstname, lastname, email),
          pm_departments!department_id(department_name)
        `)
        .order('created_date', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.manager_id) query = query.eq('manager_id', parseInt(filters.manager_id));
      if (filters.department_id) query = query.eq('department_id', parseInt(filters.department_id));

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('GET', '/projects', null, filters);
      return response.data;
    }
  }

  async createProject(projectData: any) {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_projects')
        .insert({
          ...projectData,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('POST', '/projects', projectData);
      return response.data;
    }
  }

  async getProjectDetail(id: string) {
    if (this.useSupabase) {
      const projectId = parseInt(id);
      const { data: project, error } = await supabase
        .from('pm_projects')
        .select(`
          *,
          pm_users!manager_id(firstname, lastname, email),
          pm_departments!department_id(department_name)
        `)
        .eq('project_id', projectId)
        .single();

      if (error) throw error;

      // Get project tasks
      const { data: tasks } = await supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_users!assigned_to(firstname, lastname),
          pm_users!created_by(firstname, lastname)
        `)
        .eq('project_id', projectId);

      return {
        success: true,
        data: { ...project, tasks: tasks || [] }
      };
    } else {
      const response = await this.makeRequest('GET', `/projects/${id}`);
      return response.data;
    }
  }

  // Task methods
  async getTasks(filters: any = {}) {
    if (this.useSupabase) {
      let query = supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_projects!project_id(name as project_name),
          pm_users!assigned_to(firstname, lastname, email),
          pm_users!created_by(firstname, lastname)
        `)
        .order('created_date', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.assigned_to) query = query.eq('assigned_to', parseInt(filters.assigned_to));
      if (filters.project_id) query = query.eq('project_id', parseInt(filters.project_id));

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('GET', '/tasks', null, filters);
      return response.data;
    }
  }

  async getMyTasks(userId: number) {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_projects!project_id(name as project_name),
          pm_users!assigned_to(firstname, lastname)
        `)
        .eq('assigned_to', userId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('GET', '/tasks/my-tasks');
      return response.data;
    }
  }

  async createTask(taskData: any) {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_tasks')
        .insert({
          ...taskData,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('POST', '/tasks', taskData);
      return response.data;
    }
  }

  async updateTaskStatus(taskId: string, statusData: any) {
    if (this.useSupabase) {
      const taskIdNum = parseInt(taskId);
      const { data, error } = await supabase
        .from('pm_tasks')
        .update({
          ...statusData,
          updated_date: new Date().toISOString()
        })
        .eq('task_id', taskIdNum)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('PATCH', `/tasks/${taskId}/status`, statusData);
      return response.data;
    }
  }

  // Kanban methods
  async getKanbanData(projectId: string) {
    if (this.useSupabase) {
      const projectIdNum = parseInt(projectId);
      
      // Get status options
      const { data: statusOptions } = await supabase
        .from('m_status_options')
        .select('*')
        .eq('entity_type', 'task')
        .eq('is_active', true)
        .order('sort_order');

      // Get tasks
      const { data: tasks } = await supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_users!assigned_to(firstname, lastname, email)
        `)
        .eq('project_id', projectIdNum)
        .order('created_date');

      // Group tasks by status
      const columns = statusOptions?.map(status => ({
        id: status.status_key,
        title: status.status_label,
        color: status.color_code,
        tasks: tasks?.filter(task => task.status === status.status_key) || []
      })) || [];

      return { success: true, data: { columns } };
    } else {
      const response = await this.makeRequest('GET', `/kanban/project/${projectId}/board`);
      return response.data;
    }
  }

  async moveKanbanTask(taskId: string, moveData: any) {
    if (this.useSupabase) {
      const taskIdNum = parseInt(taskId);
      const { data, error } = await supabase
        .from('pm_tasks')
        .update({
          status: moveData.new_status,
          column_order: moveData.destination_index,
          updated_date: new Date().toISOString()
        })
        .eq('task_id', taskIdNum)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('POST', `/kanban/task/${taskId}/move`, moveData);
      return response.data;
    }
  }

  // Gantt methods
  async getGanttData(projectId: string) {
    if (this.useSupabase) {
      const projectIdNum = parseInt(projectId);
      const { data: tasks } = await supabase
        .from('pm_tasks')
        .select(`
          *,
          pm_users!assigned_to(firstname, lastname),
          t_task_dependencies!task_id(depends_on_task_id, dependency_type, lag_days)
        `)
        .eq('project_id', projectIdNum)
        .order('created_date');

      const ganttTasks = tasks?.map(task => ({
        ...task,
        start_date: task.created_date || task.created_date, // Use created_date as fallback for start_date
        end_date: task.due_date,
        progress: task.progress || 0,
        dependencies: task.t_task_dependencies || []
      }));

      return { success: true, data: { tasks: ganttTasks } };
    } else {
      const response = await this.makeRequest('GET', `/projects/${projectId}/gantt`);
      return response.data;
    }
  }

  // Approval methods
  async getPendingApprovals() {
    if (this.useSupabase) {
      // This is a simplified version - full implementation would be more complex
      return { success: true, data: [] };
    } else {
      const response = await this.makeRequest('GET', '/approvals/pending');
      return response.data;
    }
  }

  // User management
  async getUsers(filters: any = {}) {
    if (this.useSupabase) {
      let query = supabase
        .from('pm_users')
        .select('*')
        .eq('is_active', true)
        .order('firstname');

      if (filters.department_id) query = query.eq('department_id', parseInt(filters.department_id));
      if (filters.team_id) query = query.eq('team_id', parseInt(filters.team_id));

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('GET', '/users', null, filters);
      return response.data;
    }
  }

  async getDepartments() {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_departments')
        .select('*')
        .eq('is_active', true)
        .order('department_name');

      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('GET', '/departments');
      return response.data;
    }
  }

  async getTeams() {
    if (this.useSupabase) {
      const { data, error } = await supabase
        .from('pm_teams')
        .select('*')
        .order('team_name');

      if (error) throw error;
      return { success: true, data };
    } else {
      const response = await this.makeRequest('GET', '/teams');
      return response.data;
    }
  }

  // Helper method for external API requests
  private async makeRequest(method: string, endpoint: string, data?: any, params?: any) {
    const token = localStorage.getItem('tokek');
    const config: any = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {}
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    if (params) {
      config.params = params;
    }

    return await axios(config);
  }
}

export const enhancedApiService = new EnhancedApiService();

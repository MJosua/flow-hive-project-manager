
import axios from 'axios';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
    console.log('API Service initialized with base URL:', this.baseURL);
  }

  // Authentication methods
  async login(credentials: { uid: string; password: string; asin?: string }) {
    try {
      console.log('🔄 Attempting login to:', `${this.baseURL}/auth/login`);
      const response = await axios.post(`${this.baseURL}/auth/login`, credentials);
      console.log('✅ Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async keepLogin() {
    try {
      const token = localStorage.getItem('tokek');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${this.baseURL}/auth/keep-login`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Keep login error:', error.response?.data || error.message);
      throw error;
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('tokek');
      if (token) {
        await axios.post(`${this.baseURL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      return { success: true };
    } catch (error: any) {
      console.error('❌ Logout error:', error.response?.data || error.message);
      return { success: true }; // Always return success for logout
    }
  }

  // Project methods
  async getProjects(filters: any = {}) {
    try {
      const response = await this.makeRequest('GET', '/projects', null, filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch projects');
    }
  }

  async createProject(projectData: any) {
    try {
      const response = await this.makeRequest('POST', '/projects', projectData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create project');
    }
  }

  async getProjectDetail(id: string) {
    try {
      const response = await this.makeRequest('GET', `/projects/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch project detail');
    }
  }

  async updateProject(id: string, projectData: any) {
    try {
      const response = await this.makeRequest('PUT', `/projects/${id}`, projectData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update project');
    }
  }

  async deleteProject(id: string) {
    try {
      const response = await this.makeRequest('DELETE', `/projects/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete project');
    }
  }

  // Task methods
  async getTasks(filters: any = {}) {
    try {
      const response = await this.makeRequest('GET', '/tasks', null, filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  async getMyTasks() {
    try {
      const response = await this.makeRequest('GET', '/tasks/my-tasks');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch my tasks');
    }
  }

  async createTask(taskData: any) {
    try {
      const response = await this.makeRequest('POST', '/tasks', taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  }

  async updateTaskStatus(taskId: string, statusData: any) {
    try {
      const response = await this.makeRequest('PATCH', `/tasks/${taskId}/status`, statusData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update task status');
    }
  }

  // User methods
  async getUsers(filters: any = {}) {
    try {
      const response = await this.makeRequest('GET', '/users', null, filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }

  async getDepartments() {
    try {
      const response = await this.makeRequest('GET', '/users/departments');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch departments');
    }
  }

  // Helper method for making authenticated requests
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

export const apiService = new ApiService();

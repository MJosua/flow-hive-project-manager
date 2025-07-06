
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
      console.log('🔄 Attempting login to:', `${this.baseURL}/auth/pm/login`);
      const response = await axios.post(`${this.baseURL}/auth/pm/login`, credentials);
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

      const response = await axios.get(`${this.baseURL}/auth/pm/profile`, {
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
        await axios.post(`${this.baseURL}/auth/pm/logout`, {}, {
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
      const response = await this.makeRequest('GET', '/prjct_mngr/project', null, filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch projects');
    }
  }

  async createProject(projectData: any) {
    try {
      const response = await this.makeRequest('POST', '/prjct_mngr/project', projectData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create project');
    }
  }

  async getProjectDetail(id: string) {
    try {
      const response = await this.makeRequest('GET', `/prjct_mngr/project/detail/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch project detail');
    }
  }

  async updateProject(id: string, projectData: any) {
    try {
      const response = await this.makeRequest('PATCH', `/prjct_mngr/project/${id}`, projectData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update project');
    }
  }

  async deleteProject(id: string) {
    try {
      const response = await this.makeRequest('DELETE', `/prjct_mngr/project/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete project');
    }
  }

  // Task methods
  async getTasks(filters: any = {}) {
    try {
      const response = await this.makeRequest('GET', '/prjct_mngr/task', null, filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  async getMyTasks() {
    try {
      const response = await this.makeRequest('GET', '/prjct_mngr/task/my-tasks');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch my tasks');
    }
  }

  async createTask(taskData: any) {
    try {
      const response = await this.makeRequest('POST', '/prjct_mngr/task', taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  }

  async updateTaskStatus(taskId: string, statusData: any) {
    try {
      const response = await this.makeRequest('PATCH', `/prjct_mngr/task/${taskId}/status`, statusData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update task status');
    }
  }

  async moveTaskToGroup(taskId: string, groupData: any) {
    try {
      const response = await this.makeRequest('PATCH', `/prjct_mngr/task/${taskId}/move-group`, groupData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to move task to group');
    }
  }

  // Gantt methods
  async getGanttData(projectId: string) {
    try {
      const response = await this.makeRequest('GET', `/prjct_mngr/gantt/project/${projectId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch Gantt data');
    }
  }

  async updateTaskGantt(taskId: string, ganttData: any) {
    try {
      const response = await this.makeRequest('PUT', `/prjct_mngr/gantt/task/${taskId}`, ganttData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update task in Gantt');
    }
  }

  // Kanban methods
  async getKanbanData(projectId: string) {
    try {
      const response = await this.makeRequest('GET', `/prjct_mngr/kanban/project/${projectId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch Kanban data');
    }
  }

  async moveTaskKanban(taskId: string, moveData: any) {
    try {
      const response = await this.makeRequest('PUT', `/prjct_mngr/kanban/task/${taskId}/move`, moveData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to move task in Kanban');
    }
  }

  // Department methods
  async getDepartments() {
    try {
      const response = await this.makeRequest('GET', '/prjct_mngr/department');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch departments');
    }
  }

  async getDepartmentDetail(id: string) {
    try {
      const response = await this.makeRequest('GET', `/prjct_mngr/department/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch department detail');
    }
  }

  async createDepartment(departmentData: any) {
    try {
      const response = await this.makeRequest('POST', '/prjct_mngr/department', departmentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create department');
    }
  }

  // Team methods
  async getTeams(filters: any = {}) {
    try {
      const response = await this.makeRequest('GET', '/prjct_mngr/team', null, filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch teams');
    }
  }

  async getTeamDetail(id: string) {
    try {
      const response = await this.makeRequest('GET', `/prjct_mngr/team/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch team detail');
    }
  }

  async createTeam(teamData: any) {
    try {
      const response = await this.makeRequest('POST', '/prjct_mngr/team', teamData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create team');
    }
  }

  // Approval methods
  async getApprovalHierarchy(userId: string) {
    try {
      const response = await this.makeRequest('GET', `/prjct_mngr/approval/hierarchy/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch approval hierarchy');
    }
  }

  async getPendingApprovals() {
    try {
      const response = await this.makeRequest('GET', '/prjct_mngr/approval/pending');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch pending approvals');
    }
  }

  async submitTaskApproval(taskId: string, approvalData: any) {
    try {
      const response = await this.makeRequest('POST', `/prjct_mngr/approval/task/${taskId}/submit`, approvalData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to submit task for approval');
    }
  }

  async processTaskApproval(approvalId: string, action: any) {
    try {
      const response = await this.makeRequest('PUT', `/prjct_mngr/approval/task/${approvalId}/process`, action);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to process approval');
    }
  }

  // User methods
  async getUsers(filters: any = {}) {
    try {
      const response = await this.makeRequest('GET', '/auth/admin/account', null, filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
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

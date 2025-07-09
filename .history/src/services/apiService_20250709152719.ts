
import axios from 'axios';
import { logger } from './loggingService';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
    logger.logInfo('API Service initialized', { baseURL: this.baseURL });
  }

  // Authentication methods
  async login(credentials: { uid: string; password: string; asin?: string }) {
    try {
      logger.logApiRequest('/hots_auth/login', 'POST', credentials);
      const response = await axios.post(`${this.baseURL}/hots_auth/login`, credentials);
      logger.logApiSuccess('/hots_auth/login', 'POST', response.status, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/hots_auth/login', 'POST', error, credentials);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async keepLogin() {
    try {
      const token = localStorage.getItem('tokek');
      if (!token) {
        logger.logWarn('No token found for keepLogin');
        throw new Error('No token found');
      }

      logger.logApiRequest('/hots_auth/keeplogin', 'GET');
      const response = await axios.get(`${this.baseURL}/hots_auth/keeplogin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logger.logApiSuccess('/hots_auth/keeplogin', 'GET', response.status);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/hots_auth/keeplogin', 'GET', error);
      throw error;
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('tokek');
      if (token) {
        logger.logApiRequest('/hots_auth/pm/logout', 'POST');
        await axios.post(`${this.baseURL}/hots_auth/pm/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        logger.logApiSuccess('/hots_auth/pm/logout', 'POST', 200);
      }
      return { success: true };
    } catch (error: any) {
      logger.logApiError('/hots_auth/pm/logout', 'POST', error);
      return { success: true }; // Always return success for logout
    }
  }

  // Project methods using PM database
  async getProjects(filters: any = {}) {
    try {
      logger.logApiRequest('/PM/project', 'GET', filters);
      const response = await this.makeRequest('GET', '/PM/project', null, filters);
      logger.logApiSuccess('/PM/project', 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/project', 'GET', error, filters);
      throw new Error(error.response?.data?.error || 'Failed to fetch projects');
    }
  }

  async createProject(projectData: any) {
    try {
      logger.logApiRequest('/PM/project', 'POST', projectData);
      const response = await this.makeRequest('POST', '/PM/project', projectData);
      logger.logApiSuccess('/PM/project', 'POST', 201, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/project', 'POST', error, projectData);
      throw new Error(error.response?.data?.error || 'Failed to create project');
    }
  }

  async getProjectDetail(id: string) {
    try {
      logger.logApiRequest(`/PM/project/detail/${id}`, 'GET');
      const response = await this.makeRequest('GET', `/PM/project/detail/${id}`);
      logger.logApiSuccess(`/PM/project/detail/${id}`, 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/project/detail/${id}`, 'GET', error, { projectId: id });
      throw new Error(error.response?.data?.error || 'Failed to fetch project detail');
    }
  }

  async updateProject(id: string, projectData: any) {
    try {
      logger.logApiRequest(`/PM/project/${id}`, 'PATCH', projectData);
      const response = await this.makeRequest('PATCH', `/PM/project/${id}`, projectData);
      logger.logApiSuccess(`/PM/project/${id}`, 'PATCH', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/project/${id}`, 'PATCH', error, { projectId: id, projectData });
      throw new Error(error.response?.data?.error || 'Failed to update project');
    }
  }

  async deleteProject(id: string) {
    try {
      logger.logApiRequest(`/PM/project/${id}`, 'DELETE');
      const response = await this.makeRequest('DELETE', `/PM/project/${id}`);
      logger.logApiSuccess(`/PM/project/${id}`, 'DELETE', 200);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/project/${id}`, 'DELETE', error, { projectId: id });
      throw new Error(error.response?.data?.error || 'Failed to delete project');
    }
  }

  // Task methods using PM database
  async getTasks(filters: any = {}) {
    try {
      logger.logApiRequest('/PM/task', 'GET', filters);
      const response = await this.makeRequest('GET', '/PM/task', null, filters);
      logger.logApiSuccess('/PM/task', 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/task', 'GET', error, filters);
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  async getMyTasks() {
    try {
      logger.logApiRequest('/PM/task/my-tasks', 'GET');
      const response = await this.makeRequest('GET', '/PM/task/my-tasks');
      logger.logApiSuccess('/PM/task/my-tasks', 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/task/my-tasks', 'GET', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch my tasks');
    }
  }

  async createTask(taskData: any) {
    try {
      logger.logApiRequest('/PM/task', 'POST', taskData);
      const response = await this.makeRequest('POST', '/PM/task', taskData);
      logger.logApiSuccess('/PM/task', 'POST', 201, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/task', 'POST', error, taskData);
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  }

  async updateTaskStatus(taskId: string, statusData: any) {
    try {
      logger.logApiRequest(`/PM/task/${taskId}/status`, 'PATCH', statusData);
      const response = await this.makeRequest('PATCH', `/PM/task/${taskId}/status`, statusData);
      logger.logApiSuccess(`/PM/task/${taskId}/status`, 'PATCH', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/task/${taskId}/status`, 'PATCH', error, { taskId, statusData });
      throw new Error(error.response?.data?.error || 'Failed to update task status');
    }
  }

  async moveTaskToGroup(taskId: string, groupData: any) {
    try {
      logger.logApiRequest(`/PM/task/${taskId}/move-group`, 'PATCH', groupData);
      const response = await this.makeRequest('PATCH', `/PM/task/${taskId}/move-group`, groupData);
      logger.logApiSuccess(`/PM/task/${taskId}/move-group`, 'PATCH', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/task/${taskId}/move-group`, 'PATCH', error, { taskId, groupData });
      throw new Error(error.response?.data?.error || 'Failed to move task to group');
    }
  }

  // Gantt methods using PM database
  async getGanttData(projectId: string) {
    try {
      logger.logApiRequest(`/PM/gantt/project/${projectId}`, 'GET');
      const response = await this.makeRequest('GET', `/PM/gantt/project/${projectId}`);
      logger.logApiSuccess(`/PM/gantt/project/${projectId}`, 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/gantt/project/${projectId}`, 'GET', error, { projectId });
      throw new Error(error.response?.data?.error || 'Failed to fetch Gantt data');
    }
  }

  async updateTaskGantt(taskId: string, ganttData: any) {
    try {
      logger.logApiRequest(`/PM/gantt/task/${taskId}`, 'PUT', ganttData);
      const response = await this.makeRequest('PUT', `/PM/gantt/task/${taskId}`, ganttData);
      logger.logApiSuccess(`/PM/gantt/task/${taskId}`, 'PUT', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/gantt/task/${taskId}`, 'PUT', error, { taskId, ganttData });
      throw new Error(error.response?.data?.error || 'Failed to update task in Gantt');
    }
  }

  // Kanban methods using PM database
  async getKanbanData(projectId: string) {
    try {
      logger.logApiRequest(`/PM/kanban/project/${projectId}`, 'GET');
      const response = await this.makeRequest('GET', `/PM/kanban/project/${projectId}`);
      logger.logApiSuccess(`/PM/kanban/project/${projectId}`, 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/kanban/project/${projectId}`, 'GET', error, { projectId });
      throw new Error(error.response?.data?.error || 'Failed to fetch Kanban data');
    }
  }

  async moveTaskKanban(taskId: string, moveData: any) {
    try {
      logger.logApiRequest(`/PM/kanban/task/${taskId}/move`, 'PUT', moveData);
      const response = await this.makeRequest('PUT', `/PM/kanban/task/${taskId}/move`, moveData);
      logger.logApiSuccess(`/PM/kanban/task/${taskId}/move`, 'PUT', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/kanban/task/${taskId}/move`, 'PUT', error, { taskId, moveData });
      throw new Error(error.response?.data?.error || 'Failed to move task in Kanban');
    }
  }

  // Department methods using PM database
  async getDepartments() {
    try {
      logger.logApiRequest('/PM/department', 'GET');
      const response = await this.makeRequest('GET', '/PM/department');
      logger.logApiSuccess('/PM/department', 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/department', 'GET', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch departments');
    }
  }

  async getDepartmentDetail(id: string) {
    try {
      logger.logApiRequest(`/PM/department/${id}`, 'GET');
      const response = await this.makeRequest('GET', `/PM/department/${id}`);
      logger.logApiSuccess(`/PM/department/${id}`, 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/department/${id}`, 'GET', error, { departmentId: id });
      throw new Error(error.response?.data?.error || 'Failed to fetch department detail');
    }
  }

  async createDepartment(departmentData: any) {
    try {
      logger.logApiRequest('/PM/department', 'POST', departmentData);
      const response = await this.makeRequest('POST', '/PM/department', departmentData);
      logger.logApiSuccess('/PM/department', 'POST', 201, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/department', 'POST', error, departmentData);
      throw new Error(error.response?.data?.error || 'Failed to create department');
    }
  }

  // Team methods using PM database
  async getTeams(filters: any = {}) {
    try {
      logger.logApiRequest('/PM/team', 'GET', filters);
      const response = await this.makeRequest('GET', '/PM/team', null, filters);
      logger.logApiSuccess('/PM/team', 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/team', 'GET', error, filters);
      throw new Error(error.response?.data?.error || 'Failed to fetch teams');
    }
  }

  async getUserTeams(departmentId: number) {
    try {
      logger.logApiRequest(`/PM/team/byid/${departmentId}`, 'GET');
      const response = await this.makeRequest('GET', `/PM/team/byid/${departmentId}`);
      logger.logApiSuccess(`/PM/team/byid/${departmentId}`, 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/team/byid/${departmentId}`, 'GET', error, { departmentId });
      throw new Error(error.response?.data?.error || 'Failed to fetch user teams');
    }
  }

  async requestTeamJoin(teamId: number) {
    try {
      logger.logApiRequest(`/PM/team/${teamId}/join-request`, 'POST');
      const response = await this.makeRequest('POST', `/PM/team/${teamId}/join-request`);
      logger.logApiSuccess(`/PM/team/${teamId}/join-request`, 'POST', 201, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/team/${teamId}/join-request`, 'POST', error, { teamId });
      throw new Error(error.response?.data?.error || 'Failed to request team join');
    }
  }

  async getTeamDetail(id: string) {
    try {
      logger.logApiRequest(`/PM/team/${id}`, 'GET');
      const response = await this.makeRequest('GET', `/PM/team/${id}`);
      logger.logApiSuccess(`/PM/team/${id}`, 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/team/${id}`, 'GET', error, { teamId: id });
      throw new Error(error.response?.data?.error || 'Failed to fetch team detail');
    }
  }

  async createTeam(teamData: any) {
    try {
      logger.logApiRequest('/PM/team', 'POST', teamData);
      const response = await this.makeRequest('POST', '/PM/team', teamData);
      logger.logApiSuccess('/PM/team', 'POST', 201, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/team', 'POST', error, teamData);
      throw new Error(error.response?.data?.error || 'Failed to create team');
    }
  }

  // Approval methods
  async getApprovalHierarchy(userId: string) {
    try {
      logger.logApiRequest(`/PM/approval/hierarchy/${userId}`, 'GET');
      const response = await this.makeRequest('GET', `/PM/approval/hierarchy/${userId}`);
      logger.logApiSuccess(`/PM/approval/hierarchy/${userId}`, 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/approval/hierarchy/${userId}`, 'GET', error, { userId });
      throw new Error(error.response?.data?.error || 'Failed to fetch approval hierarchy');
    }
  }

  async getPendingApprovals() {
    try {
      logger.logApiRequest('/PM/approval/pending', 'GET');
      const response = await this.makeRequest('GET', '/PM/approval/pending');
      logger.logApiSuccess('/PM/approval/pending', 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/approval/pending', 'GET', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch pending approvals');
    }
  }

  async submitTaskApproval(taskId: string, approvalData: any) {
    try {
      logger.logApiRequest(`/PM/approval/task/${taskId}/submit`, 'POST', approvalData);
      const response = await this.makeRequest('POST', `/PM/approval/task/${taskId}/submit`, approvalData);
      logger.logApiSuccess(`/PM/approval/task/${taskId}/submit`, 'POST', 201, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/approval/task/${taskId}/submit`, 'POST', error, { taskId, approvalData });
      throw new Error(error.response?.data?.error || 'Failed to submit task for approval');
    }
  }

  async processTaskApproval(approvalId: string, action: any) {
    try {
      logger.logApiRequest(`/PM/approval/task/${approvalId}/process`, 'PUT', action);
      const response = await this.makeRequest('PUT', `/PM/approval/task/${approvalId}/process`, action);
      logger.logApiSuccess(`/PM/approval/task/${approvalId}/process`, 'PUT', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/approval/task/${approvalId}/process`, 'PUT', error, { approvalId, action });
      throw new Error(error.response?.data?.error || 'Failed to process approval');
    }
  }

  async processProjectApproval(projectId: string, action: any) {
    try {
      logger.logApiRequest(`/PM/approval/project/${projectId}/process`, 'PUT', action);
      const response = await this.makeRequest('PUT', `/PM/approval/project/${projectId}/process`, action);
      logger.logApiSuccess(`/PM/approval/project/${projectId}/process`, 'PUT', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/approval/project/${projectId}/process`, 'PUT', error, { projectId, action });
      throw new Error(error.response?.data?.error || 'Failed to process project approval');
    }
  }

  // User methods
  async getUsers(filters: any = {}) {
    try {
      logger.logApiRequest('/hots_admin/account', 'GET', filters);
      const response = await this.makeRequest('GET', '/hots_admin/account', null, filters);
      logger.logApiSuccess('/hots_admin/account', 'GET', 200, response.data);
      return response.data.packet;
    } catch (error: any) {
      logger.logApiError('/hots_admin/account', 'GET', error, filters);
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }

  async getUsersbyDepartment(filters: any = {}, department_id: number) {
    try {
      logger.logApiRequest(`/hots_admin/account/${department_id}`, 'GET', filters);
      const response = await this.makeRequest('GET', `/hots_admin/account/${department_id}`, null, filters);
      logger.logApiSuccess(`/hots_admin/account/${department_id}`, 'GET', 200, response.data);
      return response.data.packet;
    } catch (error: any) {
      logger.logApiError(`/hots_admin/account/${department_id}`, 'GET', error, filters);
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }



  // Notification methods
  async getNotifications() {
    try {
      logger.logApiRequest('/PM/notifications', 'GET');
      const response = await this.makeRequest('GET', '/PM/notifications');
      logger.logApiSuccess('/PM/notifications', 'GET', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError('/PM/notifications', 'GET', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }

  async markNotificationAsRead(notificationId: number) {
    try {
      logger.logApiRequest(`/PM/notifications/${notificationId}/read`, 'PUT');
      const response = await this.makeRequest('PUT', `/PM/notifications/${notificationId}/read`);
      logger.logApiSuccess(`/PM/notifications/${notificationId}/read`, 'PUT', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/notifications/${notificationId}/read`, 'PUT', error, { notificationId });
      throw new Error(error.response?.data?.error || 'Failed to mark notification as read');
    }
  }

  // Project join methods
  async requestProjectJoin(projectId: number) {
    try {
      logger.logApiRequest(`/PM/project/${projectId}/join-request`, 'POST');
      const response = await this.makeRequest('POST', `/PM/project/${projectId}/join-request`);
      logger.logApiSuccess(`/PM/project/${projectId}/join-request`, 'POST', 201, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/project/${projectId}/join-request`, 'POST', error, { projectId });
      throw new Error(error.response?.data?.error || 'Failed to request project join');
    }
  }

  async processProjectJoinRequest(requestId: number, action: { action: 'approve' | 'reject'; comments?: string }) {
    try {
      logger.logApiRequest(`/PM/project/join-request/${requestId}`, 'PUT', action);
      const response = await this.makeRequest('PUT', `/PM/project/join-request/${requestId}`, action);
      logger.logApiSuccess(`/PM/project/join-request/${requestId}`, 'PUT', 200, response.data);
      return response.data;
    } catch (error: any) {
      logger.logApiError(`/PM/project/join-request/${requestId}`, 'PUT', error, { requestId, action });
      throw new Error(error.response?.data?.error || 'Failed to process join request');
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
    } else {
      logger.logWarn('No token found for authenticated request', { endpoint });
    }

    if (data) {
      config.data = data;
    }

    if (params) {
      config.params = params;
    }

    logger.logDebug('Making API request', {
      method,
      url: config.url,
      hasToken: !!token,
      hasData: !!data,
      hasParams: !!params
    });

    return await axios(config);
  }
}

export const apiService = new ApiService();

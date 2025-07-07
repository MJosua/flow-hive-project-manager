
import axios from 'axios';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
    console.log('🔧 API Service initialized with base URL:', this.baseURL);
  }

  // Authentication methods
  async login(credentials: { uid: string; password: string; asin?: string }) {
    try {
      console.log('🔄 Attempting login to:', `${this.baseURL}/hots_auth/login`);
      const response = await axios.post(`${this.baseURL}/hots_auth/login`, credentials);
      console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login API Error:', {
        url: `${this.baseURL}/hots_auth/login`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async keepLogin() {
    try {
      const token = localStorage.getItem('tokek');
      if (!token) {
        console.warn('⚠️ No token found for keepLogin');
        throw new Error('No token found');
      }

      console.log('🔄 Keep login request with token');
      const response = await axios.get(`${this.baseURL}/hots_auth/keeplogin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Keep login successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Keep Login API Error:', {
        url: `${this.baseURL}/hots_auth/keeplogin`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('tokek');
      if (token) {
        console.log('🔄 Logging out user');
        await axios.post(`${this.baseURL}/hots_auth/pm/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Logout successful');
      }
      return { success: true };
    } catch (error: any) {
      console.error('❌ Logout API Error:', {
        url: `${this.baseURL}/hots_auth/pm/logout`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return { success: true }; // Always return success for logout
    }
  }

  // Project methods using PM database
  async getProjects(filters: any = {}) {
    try {
      console.log('🔄 Fetching projects with filters:', filters);
      const response = await this.makeRequest('GET', '/PM/project', null, filters);
      console.log('✅ Projects fetched successfully:', response.data?.length || 0, 'projects');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Projects API Error:', {
        url: `${this.baseURL}/PM/project`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        filters
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch projects');
    }
  }

  async createProject(projectData: any) {
    try {
      console.log('🔄 Creating project:', projectData.name);
      const response = await this.makeRequest('POST', '/PM/project', projectData);
      console.log('✅ Project created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Create Project API Error:', {
        url: `${this.baseURL}/PM/project`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectData
      });
      throw new Error(error.response?.data?.error || 'Failed to create project');
    }
  }

  async getProjectDetail(id: string) {
    try {
      console.log('🔄 Fetching project detail for ID:', id);
      const response = await this.makeRequest('GET', `/PM/project/detail/${id}`);
      console.log('✅ Project detail fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Project Detail API Error:', {
        url: `${this.baseURL}/PM/project/detail/${id}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectId: id
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch project detail');
    }
  }

  async updateProject(id: string, projectData: any) {
    try {
      console.log('🔄 Updating project ID:', id);
      const response = await this.makeRequest('PATCH', `/PM/project/${id}`, projectData);
      console.log('✅ Project updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Update Project API Error:', {
        url: `${this.baseURL}/PM/project/${id}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectId: id,
        projectData
      });
      throw new Error(error.response?.data?.error || 'Failed to update project');
    }
  }

  async deleteProject(id: string) {
    try {
      console.log('🔄 Deleting project ID:', id);
      const response = await this.makeRequest('DELETE', `/PM/project/${id}`);
      console.log('✅ Project deleted successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Delete Project API Error:', {
        url: `${this.baseURL}/PM/project/${id}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectId: id
      });
      throw new Error(error.response?.data?.error || 'Failed to delete project');
    }
  }

  // Task methods using PM database
  async getTasks(filters: any = {}) {
    try {
      console.log('🔄 Fetching tasks with filters:', filters);
      const response = await this.makeRequest('GET', '/PM/task', null, filters);
      console.log('✅ Tasks fetched successfully:', response.data?.length || 0, 'tasks');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Tasks API Error:', {
        url: `${this.baseURL}/PM/task`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        filters
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  async getMyTasks() {
    try {
      console.log('🔄 Fetching my tasks');
      const response = await this.makeRequest('GET', '/PM/task/my-tasks');
      console.log('✅ My tasks fetched successfully:', response.data?.length || 0, 'tasks');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get My Tasks API Error:', {
        url: `${this.baseURL}/PM/task/my-tasks`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch my tasks');
    }
  }

  async createTask(taskData: any) {
    try {
      console.log('🔄 Creating task:', taskData.name);
      const response = await this.makeRequest('POST', '/PM/task', taskData);
      console.log('✅ Task created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Create Task API Error:', {
        url: `${this.baseURL}/PM/task`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        taskData
      });
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  }

  async updateTaskStatus(taskId: string, statusData: any) {
    try {
      console.log('🔄 Updating task status for ID:', taskId);
      const response = await this.makeRequest('PATCH', `/PM/task/${taskId}/status`, statusData);
      console.log('✅ Task status updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Update Task Status API Error:', {
        url: `${this.baseURL}/PM/task/${taskId}/status`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        taskId,
        statusData
      });
      throw new Error(error.response?.data?.error || 'Failed to update task status');
    }
  }

  async moveTaskToGroup(taskId: string, groupData: any) {
    try {
      console.log('🔄 Moving task to group for ID:', taskId);
      const response = await this.makeRequest('PATCH', `/PM/task/${taskId}/move-group`, groupData);
      console.log('✅ Task moved to group successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Move Task to Group API Error:', {
        url: `${this.baseURL}/PM/task/${taskId}/move-group`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        taskId,
        groupData
      });
      throw new Error(error.response?.data?.error || 'Failed to move task to group');
    }
  }

  // Gantt methods using PM database
  async getGanttData(projectId: string) {
    try {
      console.log('🔄 Fetching Gantt data for project:', projectId);
      const response = await this.makeRequest('GET', `/PM/gantt/project/${projectId}`);
      console.log('✅ Gantt data fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Gantt Data API Error:', {
        url: `${this.baseURL}/PM/gantt/project/${projectId}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectId
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch Gantt data');
    }
  }

  async updateTaskGantt(taskId: string, ganttData: any) {
    try {
      console.log('🔄 Updating task in Gantt for ID:', taskId);
      const response = await this.makeRequest('PUT', `/PM/gantt/task/${taskId}`, ganttData);
      console.log('✅ Task updated in Gantt successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Update Task Gantt API Error:', {
        url: `${this.baseURL}/PM/gantt/task/${taskId}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        taskId,
        ganttData
      });
      throw new Error(error.response?.data?.error || 'Failed to update task in Gantt');
    }
  }

  // Kanban methods using PM database
  async getKanbanData(projectId: string) {
    try {
      console.log('🔄 Fetching Kanban data for project:', projectId);
      const response = await this.makeRequest('GET', `/PM/kanban/project/${projectId}`);
      console.log('✅ Kanban data fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Kanban Data API Error:', {
        url: `${this.baseURL}/PM/kanban/project/${projectId}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectId
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch Kanban data');
    }
  }

  async moveTaskKanban(taskId: string, moveData: any) {
    try {
      console.log('🔄 Moving task in Kanban for ID:', taskId);
      const response = await this.makeRequest('PUT', `/PM/kanban/task/${taskId}/move`, moveData);
      console.log('✅ Task moved in Kanban successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Move Task Kanban API Error:', {
        url: `${this.baseURL}/PM/kanban/task/${taskId}/move`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        taskId,
        moveData
      });
      throw new Error(error.response?.data?.error || 'Failed to move task in Kanban');
    }
  }

  // Department methods using PM database
  async getDepartments() {
    try {
      console.log('🔄 Fetching departments');
      const response = await this.makeRequest('GET', '/PM/department');
      console.log('✅ Departments fetched successfully:', response.data?.length || 0, 'departments');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Departments API Error:', {
        url: `${this.baseURL}/PM/department`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch departments');
    }
  }

  async getDepartmentDetail(id: string) {
    try {
      console.log('🔄 Fetching department detail for ID:', id);
      const response = await this.makeRequest('GET', `/PM/department/${id}`);
      console.log('✅ Department detail fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Department Detail API Error:', {
        url: `${this.baseURL}/PM/department/${id}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        departmentId: id
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch department detail');
    }
  }

  async createDepartment(departmentData: any) {
    try {
      console.log('🔄 Creating department:', departmentData.name);
      const response = await this.makeRequest('POST', '/PM/department', departmentData);
      console.log('✅ Department created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Create Department API Error:', {
        url: `${this.baseURL}/PM/department`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        departmentData
      });
      throw new Error(error.response?.data?.error || 'Failed to create department');
    }
  }

  // Team methods using PM database
  async getTeams(filters: any = {}) {
    try {
      console.log('🔄 Fetching teams with filters:', filters);
      const response = await this.makeRequest('GET', '/PM/team', null, filters);
      console.log('✅ Teams fetched successfully:', response.data?.length || 0, 'teams');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Teams API Error:', {
        url: `${this.baseURL}/PM/team`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        filters
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch teams');
    }
  }

  async getTeamDetail(id: string) {
    try {
      console.log('🔄 Fetching team detail for ID:', id);
      const response = await this.makeRequest('GET', `/PM/team/${id}`);
      console.log('✅ Team detail fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Team Detail API Error:', {
        url: `${this.baseURL}/PM/team/${id}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        teamId: id
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch team detail');
    }
  }

  async createTeam(teamData: any) {
    try {
      console.log('🔄 Creating team:', teamData.name);
      const response = await this.makeRequest('POST', '/PM/team', teamData);
      console.log('✅ Team created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Create Team API Error:', {
        url: `${this.baseURL}/PM/team`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        teamData
      });
      throw new Error(error.response?.data?.error || 'Failed to create team');
    }
  }

  // Approval methods
  async getApprovalHierarchy(userId: string) {
    try {
      console.log('🔄 Fetching approval hierarchy for user:', userId);
      const response = await this.makeRequest('GET', `/PM/approval/hierarchy/${userId}`);
      console.log('✅ Approval hierarchy fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Approval Hierarchy API Error:', {
        url: `${this.baseURL}/PM/approval/hierarchy/${userId}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        userId
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch approval hierarchy');
    }
  }

  async getPendingApprovals() {
    try {
      console.log('🔄 Fetching pending approvals');
      const response = await this.makeRequest('GET', '/PM/approval/pending');
      console.log('✅ Pending approvals fetched successfully:', response.data?.length || 0, 'approvals');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Pending Approvals API Error:', {
        url: `${this.baseURL}/PM/approval/pending`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch pending approvals');
    }
  }

  async submitTaskApproval(taskId: string, approvalData: any) {
    try {
      console.log('🔄 Submitting task approval for ID:', taskId);
      const response = await this.makeRequest('POST', `/PM/approval/task/${taskId}/submit`, approvalData);
      console.log('✅ Task approval submitted successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Submit Task Approval API Error:', {
        url: `${this.baseURL}/PM/approval/task/${taskId}/submit`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        taskId,
        approvalData
      });
      throw new Error(error.response?.data?.error || 'Failed to submit task for approval');
    }
  }

  async processTaskApproval(approvalId: string, action: any) {
    try {
      console.log('🔄 Processing task approval ID:', approvalId);
      const response = await this.makeRequest('PUT', `/PM/approval/task/${approvalId}/process`, action);
      console.log('✅ Task approval processed successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Process Task Approval API Error:', {
        url: `${this.baseURL}/PM/approval/task/${approvalId}/process`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        approvalId,
        action
      });
      throw new Error(error.response?.data?.error || 'Failed to process approval');
    }
  }

  // User methods
  async getUsers(filters: any = {}) {
    try {
      console.log('🔄 Fetching users with filters:', filters);
      const response = await this.makeRequest('GET', '/hots_admin/account', null, filters);
      console.log('✅ Users fetched successfully:', response.data?.length || 0, 'users');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Users API Error:', {
        url: `${this.baseURL}/hots_admin/account`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        filters
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }

  // Notification methods
  async getNotifications() {
    try {
      console.log('🔄 Fetching notifications');
      const response = await this.makeRequest('GET', '/PM/notifications');
      console.log('✅ Notifications fetched successfully:', response.data?.length || 0, 'notifications');
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Notifications API Error:', {
        url: `${this.baseURL}/PM/notifications`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }

  async markNotificationAsRead(notificationId: number) {
    try {
      console.log('🔄 Marking notification as read:', notificationId);
      const response = await this.makeRequest('PUT', `/PM/notifications/${notificationId}/read`);
      console.log('✅ Notification marked as read successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Mark Notification Read API Error:', {
        url: `${this.baseURL}/PM/notifications/${notificationId}/read`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        notificationId
      });
      throw new Error(error.response?.data?.error || 'Failed to mark notification as read');
    }
  }

  // Project join methods
  async requestProjectJoin(projectId: number) {
    try {
      console.log('🔄 Requesting to join project:', projectId);
      const response = await this.makeRequest('POST', `/PM/project/${projectId}/join-request`);
      console.log('✅ Project join request submitted successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Request Project Join API Error:', {
        url: `${this.baseURL}/PM/project/${projectId}/join-request`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectId
      });
      throw new Error(error.response?.data?.error || 'Failed to request project join');
    }
  }

  async processProjectJoinRequest(requestId: number, action: { action: 'approve' | 'reject'; comments?: string }) {
    try {
      console.log('🔄 Processing project join request:', requestId);
      const response = await this.makeRequest('PUT', `/PM/project/join-request/${requestId}`, action);
      console.log('✅ Project join request processed successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Process Project Join Request API Error:', {
        url: `${this.baseURL}/PM/project/join-request/${requestId}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        requestId,
        action
      });
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
      console.warn('⚠️ No token found for authenticated request to:', endpoint);
    }

    if (data) {
      config.data = data;
    }

    if (params) {
      config.params = params;
    }

    console.log('🔄 Making API request:', {
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

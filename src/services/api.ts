
import { 
  User, 
  Department, 
  Team, 
  TeamMember, 
  Role, 
  JobTitle, 
  Service, 
  WorkflowGroup, 
  WorkflowStep,
  ApiResponse,
  PaginatedResponse 
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
const BASE_URL = `${API_URL}/hots_settings`;

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // User Management
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/get/user');
  }

  async createUser(user: Omit<User, 'user_id'>): Promise<ApiResponse<User>> {
    return this.request<User>('/post/user', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/update/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete/user/${id}`, {
      method: 'DELETE',
    });
  }

  // Team Management
  async getTeams(): Promise<ApiResponse<Team[]>> {
    return this.request<Team[]>('/get/team');
  }

  async createTeam(team: Omit<Team, 'team_id'>): Promise<ApiResponse<Team>> {
    return this.request<Team>('/post/team', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  async updateTeam(id: string, team: Partial<Team>): Promise<ApiResponse<Team>> {
    return this.request<Team>(`/update/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(team),
    });
  }

  async deleteTeam(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete/team/${id}`, {
      method: 'DELETE',
    });
  }

  async getTeamMembers(teamId: string): Promise<ApiResponse<TeamMember[]>> {
    return this.request<TeamMember[]>(`/get/team_members/${teamId}`);
  }

  async getTeamLeaders(teamId: string): Promise<ApiResponse<TeamMember[]>> {
    return this.request<TeamMember[]>(`/get/team_leaders/${teamId}`);
  }

  async addTeamMember(teamMember: Omit<TeamMember, 'team_member_id'>): Promise<ApiResponse<TeamMember>> {
    return this.request<TeamMember>('/post/team_member', {
      method: 'POST',
      body: JSON.stringify(teamMember),
    });
  }

  async updateTeamMember(id: string, teamMember: Partial<TeamMember>): Promise<ApiResponse<TeamMember>> {
    return this.request<TeamMember>(`/update/team_member/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamMember),
    });
  }

  async removeTeamMember(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete/team_member/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTeamLeader(id: string, isLeader: boolean): Promise<ApiResponse<TeamMember>> {
    return this.request<TeamMember>(`/update/team_leader/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ team_leader: isLeader }),
    });
  }

  // Department Management
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    return this.request<Department[]>('/get/departments');
  }

  async createDepartment(department: Omit<Department, 'department_id'>): Promise<ApiResponse<Department>> {
    return this.request<Department>('/post/department', {
      method: 'POST',
      body: JSON.stringify(department),
    });
  }

  async updateDepartment(id: string, department: Partial<Department>): Promise<ApiResponse<Department>> {
    return this.request<Department>(`/update/department/${id}`, {
      method: 'PUT',
      body: JSON.stringify(department),
    });
  }

  async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete/department/${id}`, {
      method: 'DELETE',
    });
  }

  async getDepartmentTeams(id: string): Promise<ApiResponse<Team[]>> {
    return this.request<Team[]>(`/get/departments/${id}/teams`);
  }

  // Role Management
  async getRoles(): Promise<ApiResponse<Role[]>> {
    return this.request<Role[]>('/get/role');
  }

  async createRole(role: Omit<Role, 'role_id'>): Promise<ApiResponse<Role>> {
    return this.request<Role>('/post/role', {
      method: 'POST',
      body: JSON.stringify(role),
    });
  }

  async updateRole(id: string, role: Partial<Role>): Promise<ApiResponse<Role>> {
    return this.request<Role>(`/update/role/${id}`, {
      method: 'PUT',
      body: JSON.stringify(role),
    });
  }

  async deleteRole(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete/role/${id}`, {
      method: 'DELETE',
    });
  }

  // Job Title Management
  async getJobTitles(): Promise<ApiResponse<JobTitle[]>> {
    return this.request<JobTitle[]>('/get/jobtitle');
  }

  async createJobTitle(jobTitle: Omit<JobTitle, 'jobtitle_id'>): Promise<ApiResponse<JobTitle>> {
    return this.request<JobTitle>('/post/jobtitle', {
      method: 'POST',
      body: JSON.stringify(jobTitle),
    });
  }

  async updateJobTitle(id: string, jobTitle: Partial<JobTitle>): Promise<ApiResponse<JobTitle>> {
    return this.request<JobTitle>(`/update/jobtitle/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobTitle),
    });
  }

  async deleteJobTitle(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete/jobtitle/${id}`, {
      method: 'DELETE',
    });
  }

  // Service Management
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>('/get/services');
  }

  async getActiveServices(): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>('/get/services/active');
  }

  async getInactiveServices(): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>('/get/services/inactive');
  }

  async toggleService(serviceId: string): Promise<ApiResponse<Service>> {
    return this.request<Service>('/toggle/service', {
      method: 'POST',
      body: JSON.stringify({ service_id: serviceId }),
    });
  }

  async deleteService(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete/service/${id}`, {
      method: 'DELETE',
    });
  }

  // Workflow Management
  async getWorkflowGroups(): Promise<ApiResponse<WorkflowGroup[]>> {
    return this.request<WorkflowGroup[]>('/get/workflow_groups');
  }

  async createWorkflowGroup(group: Omit<WorkflowGroup, 'id'>): Promise<ApiResponse<WorkflowGroup>> {
    return this.request<WorkflowGroup>('/post/workflow_group', {
      method: 'POST',
      body: JSON.stringify(group),
    });
  }

  async updateWorkflowGroup(id: string, group: Partial<WorkflowGroup>): Promise<ApiResponse<WorkflowGroup>> {
    return this.request<WorkflowGroup>(`/update/workflow_group/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    });
  }

  async deleteWorkflowGroup(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete/workflow_group/${id}`, {
      method: 'DELETE',
    });
  }

  async getWorkflowSteps(groupId: string): Promise<ApiResponse<WorkflowStep[]>> {
    return this.request<WorkflowStep[]>(`/get/workflow_steps/${groupId}`);
  }

  async createWorkflowStep(step: Omit<WorkflowStep, 'step_id'>): Promise<ApiResponse<WorkflowStep>> {
    return this.request<WorkflowStep>('/post/workflow_step', {
      method: 'POST',
      body: JSON.stringify(step),
    });
  }

  async updateWorkflowStep(id: string, step: Partial<WorkflowStep>): Promise<ApiResponse<WorkflowStep>> {
    return this.request<WorkflowStep>(`/update/workflow_step/${id}`, {
      method: 'PUT',
      body: JSON.stringify(step),
    });
  }

  async deleteWorkflowStep(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete/workflow_step/${id}`, {
      method: 'DELETE',
    });
  }

  // Misc endpoints
  async getSuperiors(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/get_superior');
  }

  async assignUserToTeam(userId: string, teamId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/user/${userId}/team`, {
      method: 'PUT',
      body: JSON.stringify({ team_id: teamId }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;

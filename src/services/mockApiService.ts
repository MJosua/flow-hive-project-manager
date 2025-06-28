
import { API_URL } from '@/config/sourceConfig';

// Mock data that matches your PM API structure
const mockUsers = [
  {
    user_id: 1,
    firstname: 'John',
    lastname: 'Doe',
    uid: 'john.doe',
    email: 'john.doe@company.com',
    role_id: 1,
    role_name: 'Project Manager',
    department_id: 1,
    department_name: 'IT',
    team_id: 1,
    team_name: 'Development Team',
    job_title: 'Senior Project Manager',
    jobtitle_id: 1,
    superior_id: null,
    is_active: true,
    created_date: '2024-01-15T08:00:00.000Z',
    updated_date: '2024-01-20T10:30:00.000Z'
  },
  {
    user_id: 2,
    firstname: 'Jane',
    lastname: 'Smith',
    uid: 'jane.smith',
    email: 'jane.smith@company.com',
    role_id: 2,
    role_name: 'Developer',
    department_id: 1,
    department_name: 'IT',
    team_id: 1,
    team_name: 'Development Team',
    job_title: 'Senior Developer',
    jobtitle_id: 2,
    superior_id: 1,
    is_active: true,
    created_date: '2024-01-10T09:00:00.000Z',
    updated_date: '2024-01-18T14:20:00.000Z'
  }
];

const mockProjects = [
  {
    project_id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved UX',
    status: 'active',
    priority: 'high',
    start_date: '2024-01-15',
    end_date: '2024-04-15',
    manager_id: 1,
    manager_name: 'John Doe',
    department_id: 1,
    department_name: 'IT',
    progress: 35,
    budget: 50000,
    estimated_hours: 800,
    actual_hours: 280,
    created_date: '2024-01-10T08:00:00.000Z',
    updated_date: '2024-01-20T10:30:00.000Z'
  },
  {
    project_id: 2,
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application for customer engagement',
    status: 'planning',
    priority: 'medium',
    start_date: '2024-02-01',
    end_date: '2024-06-30',
    manager_id: 1,
    manager_name: 'John Doe',
    department_id: 1,
    department_name: 'IT',
    progress: 15,
    budget: 75000,
    estimated_hours: 1200,
    actual_hours: 120,
    created_date: '2024-01-20T09:00:00.000Z',
    updated_date: '2024-01-25T11:15:00.000Z'
  }
];

const mockTasks = [
  {
    task_id: 1,
    name: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the new homepage design',
    project_id: 1,
    project_name: 'Website Redesign',
    assigned_to: 2,
    assigned_to_name: 'Jane Smith',
    status: 'in-progress',
    priority: 'high',
    due_date: '2024-02-15',
    estimated_hours: 40,
    actual_hours: 15,
    progress: 37,
    group_id: 1,
    group_name: 'Design Phase',
    created_date: '2024-01-15T10:00:00.000Z',
    updated_date: '2024-01-22T14:30:00.000Z'
  },
  {
    task_id: 2,
    name: 'Backend API Development',
    description: 'Develop REST API endpoints for user authentication and data management',
    project_id: 1,
    project_name: 'Website Redesign',
    assigned_to: 2,
    assigned_to_name: 'Jane Smith',
    status: 'todo',
    priority: 'medium',
    due_date: '2024-03-01',
    estimated_hours: 60,
    actual_hours: 0,
    progress: 0,
    group_id: 2,
    group_name: 'Development Phase',
    created_date: '2024-01-15T10:30:00.000Z',
    updated_date: '2024-01-15T10:30:00.000Z'
  }
];

const mockDepartments = [
  {
    department_id: 1,
    department_name: 'Information Technology',
    department_shortname: 'IT',
    department_head: 1,
    head_name: 'John Doe',
    description: 'Responsible for all technology infrastructure and development',
    is_active: true,
    created_date: '2024-01-01T00:00:00.000Z',
    updated_date: '2024-01-01T00:00:00.000Z'
  },
  {
    department_id: 2,
    department_name: 'Human Resources',
    department_shortname: 'HR',
    department_head: null,
    head_name: null,
    description: 'Manages employee relations and organizational development',
    is_active: true,
    created_date: '2024-01-01T00:00:00.000Z',
    updated_date: '2024-01-01T00:00:00.000Z'
  }
];

const mockTeams = [
  {
    team_id: 1,
    team_name: 'Development Team',
    department_id: 1,
    description: 'Frontend and backend development team',
    team_leader_id: 1,
    team_leader_name: 'John Doe',
    member_count: 5,
    created_date: '2024-01-01T00:00:00.000Z',
    updated_date: '2024-01-01T00:00:00.000Z'
  }
];

// Check if API is reachable with proper timeout handling
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
    console.warn('API not reachable, using mock data');
    return false;
  }
};

// Mock API responses
export const mockApiResponses = {
  // Auth endpoints
  '/hots_auth/pm/login': {
    success: true,
    tokek: 'mock-jwt-token-12345',
    userData: mockUsers[0]
  },
  
  '/hots_auth/pm/profile': {
    success: true,
    data: mockUsers[0]
  },

  // Project endpoints
  '/prjct_mngr/project': {
    success: true,
    data: mockProjects
  },

  '/prjct_mngr/project/1': {
    success: true,
    data: mockProjects[0]
  },

  '/prjct_mngr/project/1/tasks': {
    success: true,
    data: mockTasks.filter(task => task.project_id === 1)
  },

  '/prjct_mngr/project/1/kanban': {
    success: true,
    data: {
      groups: [
        {
          group_id: 1,
          group_name: 'Design Phase',
          tasks: mockTasks.filter(task => task.group_id === 1)
        },
        {
          group_id: 2,
          group_name: 'Development Phase',
          tasks: mockTasks.filter(task => task.group_id === 2)
        }
      ]
    }
  },

  // Task endpoints
  '/prjct_mngr/task': {
    success: true,
    data: mockTasks
  },

  '/prjct_mngr/task/my-tasks': {
    success: true,
    data: mockTasks.filter(task => task.assigned_to === 2)
  },

  // User endpoints
  '/prjct_mngr/user': {
    success: true,
    data: mockUsers
  },

  '/prjct_mngr/user/departments': {
    success: true,
    data: mockDepartments
  },

  '/prjct_mngr/user/teams': {
    success: true,
    data: mockTeams
  }
};

// Get mock response for endpoint
export const getMockResponse = (endpoint: string, method: string = 'GET') => {
  const cleanEndpoint = endpoint.replace(API_URL, '').split('?')[0];
  return mockApiResponses[cleanEndpoint] || { success: false, message: 'Mock endpoint not found' };
};

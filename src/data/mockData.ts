import { User, Project, Task, Approval, Notification, ProjectRole } from '@/types';
import { addDays, subDays } from 'date-fns';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    role: 'admin',
    department: 'IT',
    status: 'active',
    phone: '+1 (555) 123-4567',
    joinDate: subDays(new Date(), 1825), // 5 years ago
    skills: ['Leadership', 'Project Management', 'System Architecture', 'DevOps'],
    workload: 85
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=32&h=32&fit=crop&crop=face',
    role: 'manager',
    department: 'Development',
    status: 'active',
    phone: '+1 (555) 234-5678',
    joinDate: subDays(new Date(), 1095), // 3 years ago
    skills: ['Team Management', 'Agile', 'React', 'Node.js'],
    workload: 75
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    role: 'developer',
    department: 'Development',
    status: 'active',
    phone: '+1 (555) 345-6789',
    joinDate: subDays(new Date(), 730), // 2 years ago
    skills: ['JavaScript', 'TypeScript', 'React', 'Python', 'SQL'],
    workload: 90
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    role: 'designer',
    department: 'Design',
    status: 'active',
    phone: '+1 (555) 456-7890',
    joinDate: subDays(new Date(), 545), // 1.5 years ago
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    workload: 70
  },
  {
    id: '5',
    name: 'Alex Rodriguez',
    email: 'alex@company.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    role: 'developer',
    department: 'Development',
    status: 'active',
    phone: '+1 (555) 567-8901',
    joinDate: subDays(new Date(), 365), // 1 year ago
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker'],
    workload: 95
  }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    status: 'active',
    priority: 'high',
    startDate: subDays(new Date(), 30),
    endDate: addDays(new Date(), 60),
    progress: 65,
    managerId: '2',
    teamMembers: ['2', '3', '4', '5'],
    budget: 150000,
    tags: ['React', 'Node.js', 'E-commerce'],
    color: '#10B981',
    roleColors: {
      'Project Lead': '#DC2626',
      'Senior Developer': '#2563EB',
      'UI Designer': '#7C3AED',
      'Developer': '#059669'
    }
  },
  {
    id: 'proj-2',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of the mobile application with new UI/UX',
    status: 'active',
    priority: 'medium',
    startDate: subDays(new Date(), 15),
    endDate: addDays(new Date(), 45),
    progress: 40,
    managerId: '2',
    teamMembers: ['4', '5'],
    budget: 80000,
    tags: ['Mobile', 'UI/UX', 'Design'],
    color: '#F59E0B',
    roleColors: {
      'Design Lead': '#EC4899',
      'UX Designer': '#8B5CF6',
      'Frontend Developer': '#10B981'
    }
  },
  {
    id: 'proj-3',
    name: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard for business intelligence',
    status: 'planning',
    priority: 'high',
    startDate: new Date(),
    endDate: addDays(new Date(), 90),
    progress: 10,
    managerId: '1',
    teamMembers: ['3', '5'],
    budget: 120000,
    tags: ['Analytics', 'Dashboard', 'BI'],
    color: '#EF4444',
    roleColors: {
      'Tech Lead': '#DC2626',
      'Data Engineer': '#2563EB',
      'Full Stack Developer': '#059669'
    }
  }
];

export const mockProjectRoles: ProjectRole[] = [
  // E-commerce Platform team
  {
    userId: '2',
    projectId: 'proj-1',
    role: 'Project Lead',
    hierarchy: 1,
    color: '#DC2626',
    permissions: ['manage_team', 'approve_tasks', 'edit_project']
  },
  {
    userId: '3',
    projectId: 'proj-1',
    role: 'Senior Developer',
    hierarchy: 2,
    color: '#2563EB',
    permissions: ['create_tasks', 'review_code']
  },
  {
    userId: '4',
    projectId: 'proj-1',
    role: 'UI Designer',
    hierarchy: 2,
    color: '#7C3AED',
    permissions: ['create_designs', 'review_ui']
  },
  {
    userId: '5',
    projectId: 'proj-1',
    role: 'Developer',
    hierarchy: 3,
    color: '#059669',
    permissions: ['complete_tasks']
  },
  
  // Mobile App Redesign team
  {
    userId: '2',
    projectId: 'proj-2',
    role: 'Design Lead',
    hierarchy: 1,
    color: '#EC4899',
    permissions: ['manage_team', 'approve_designs']
  },
  {
    userId: '4',
    projectId: 'proj-2',
    role: 'UX Designer',
    hierarchy: 2,
    color: '#8B5CF6',
    permissions: ['create_designs', 'user_research']
  },
  {
    userId: '5',
    projectId: 'proj-2',
    role: 'Frontend Developer',
    hierarchy: 2,
    color: '#10B981',
    permissions: ['implement_designs', 'review_code']
  },
  
  // Data Analytics Dashboard team
  {
    userId: '1',
    projectId: 'proj-3',
    role: 'Tech Lead',
    hierarchy: 1,
    color: '#DC2626',
    permissions: ['manage_team', 'approve_architecture']
  },
  {
    userId: '3',
    projectId: 'proj-3',
    role: 'Data Engineer',
    hierarchy: 2,
    color: '#2563EB',
    permissions: ['design_data_models', 'optimize_queries']
  },
  {
    userId: '5',
    projectId: 'proj-3',
    role: 'Full Stack Developer',
    hierarchy: 3,
    color: '#059669',
    permissions: ['implement_features', 'write_tests']
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design Login Page',
    description: 'Create modern login page design with password reset functionality',
    status: 'done',
    priority: 'high',
    assigneeId: '4',
    projectId: 'proj-1',
    startDate: subDays(new Date(), 20),
    endDate: subDays(new Date(), 15),
    estimatedHours: 16,
    actualHours: 14,
    tags: ['UI', 'Design'],
    dependencies: [],
    attachments: []
  },
  {
    id: 'task-2',
    title: 'Implement Authentication',
    description: 'Develop JWT-based authentication system with role management',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '3',
    projectId: 'proj-1',
    startDate: subDays(new Date(), 10),
    endDate: addDays(new Date(), 5),
    estimatedHours: 32,
    actualHours: 20,
    tags: ['Backend', 'Security'],
    dependencies: ['task-1'],
    attachments: []
  },
  {
    id: 'task-3',
    title: 'Product Catalog API',
    description: 'Build REST API for product management with search and filtering',
    status: 'todo',
    priority: 'medium',
    assigneeId: '5',
    projectId: 'proj-1',
    startDate: new Date(),
    endDate: addDays(new Date(), 14),
    estimatedHours: 40,
    actualHours: 0,
    tags: ['API', 'Backend'],
    dependencies: ['task-2'],
    attachments: []
  },
  {
    id: 'task-4',
    title: 'Shopping Cart Component',
    description: 'Create interactive shopping cart with quantity updates and checkout',
    status: 'review',
    priority: 'high',
    assigneeId: '3',
    projectId: 'proj-1',
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    estimatedHours: 24,
    actualHours: 26,
    tags: ['Frontend', 'React'],
    dependencies: ['task-1'],
    attachments: []
  },
  {
    id: 'task-5',
    title: 'Mobile Wireframes',
    description: 'Create wireframes for all mobile app screens',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '4',
    projectId: 'proj-2',
    startDate: subDays(new Date(), 5),
    endDate: addDays(new Date(), 3),
    estimatedHours: 20,
    actualHours: 12,
    tags: ['Wireframes', 'Mobile'],
    dependencies: [],
    attachments: []
  }
];

export const mockApprovals: Approval[] = [
  {
    id: 'app-1',
    type: 'project_creation',
    requesterId: '2',
    approverId: '1',
    status: 'pending',
    details: {
      projectName: 'AI Chatbot Integration',
      budget: 200000,
      timeline: '6 months'
    },
    createdAt: subDays(new Date(), 2)
  },
  {
    id: 'app-2',
    type: 'assignment',
    requesterId: '2',
    approverId: '1',
    status: 'approved',
    details: {
      taskId: 'task-3',
      assigneeId: '5',
      reason: 'Best fit for API development'
    },
    createdAt: subDays(new Date(), 5),
    resolvedAt: subDays(new Date(), 3),
    notes: 'Approved - good match for skills'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: '1',
    title: 'New Project Approval Required',
    message: 'Sarah Johnson has requested approval for AI Chatbot Integration project',
    type: 'warning',
    read: false,
    createdAt: subDays(new Date(), 2)
  },
  {
    id: 'notif-2',
    userId: '3',
    title: 'Task Assignment Updated',
    message: 'You have been assigned to implement Authentication system',
    type: 'info',
    read: true,
    createdAt: subDays(new Date(), 3)
  },
  {
    id: 'notif-3',
    userId: '2',
    title: 'Project Milestone Reached',
    message: 'E-commerce Platform has reached 65% completion',
    type: 'success',
    read: false,
    createdAt: subDays(new Date(), 1)
  }
];

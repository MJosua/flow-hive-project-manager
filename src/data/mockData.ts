
import { User, Project, Task, Approval, Notification } from '@/types';
import { addDays, subDays } from 'date-fns';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    role: 'admin',
    department: 'IT',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=32&h=32&fit=crop&crop=face',
    role: 'manager',
    department: 'Development',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    role: 'developer',
    department: 'Development',
    status: 'active'
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    role: 'designer',
    department: 'Design',
    status: 'active'
  },
  {
    id: '5',
    name: 'Alex Rodriguez',
    email: 'alex@company.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    role: 'developer',
    department: 'Development',
    status: 'active'
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
    color: '#10B981'
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
    color: '#F59E0B'
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
    color: '#EF4444'
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

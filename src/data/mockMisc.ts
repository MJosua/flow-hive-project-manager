
import { Approval, Notification, ProjectRole } from '@/types';
import { subDays } from 'date-fns';

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
      userId: '5',
      projectId: 'proj-2',
      role: 'Frontend Developer'
    },
    createdAt: subDays(new Date(), 10)
  },
  {
    id: 'app-3',
    type: 'task_approval',
    requesterId: '3',
    approverId: '2',
    status: 'rejected',
    details: {
      taskId: 'task-2',
      reason: 'Security review not completed'
    },
    createdAt: subDays(new Date(), 5)
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

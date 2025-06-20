
import { Task } from '@/types';
import { addDays, subDays } from 'date-fns';

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

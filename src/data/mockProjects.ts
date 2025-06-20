
import { Project } from '@/types';
import { addDays, subDays } from 'date-fns';

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

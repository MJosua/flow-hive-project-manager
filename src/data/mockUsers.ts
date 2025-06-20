
import { User } from '@/types';
import { subDays } from 'date-fns';

export const mockUsers: User[] = [
  {
    user_id: '1',
    firstname: 'John',
    lastname: 'Smith',
    uid: 'john-smith-001',
    email: 'john@company.com',
    role_id: 'admin',
    department_id: 'IT',
    jobtitle_id: 'senior-admin',
    superior_id: undefined,
    finished_date: undefined,
    active: true,
    is_deleted: false,
    registration_date: subDays(new Date(), 1825),
    // UI computed fields
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    skills: ['Leadership', 'Project Management', 'System Architecture', 'DevOps'],
    workload: 85
  },
  {
    user_id: '2',
    firstname: 'Sarah',
    lastname: 'Johnson',
    uid: 'sarah-johnson-002',
    email: 'sarah@company.com',
    role_id: 'manager',
    department_id: 'Development',
    jobtitle_id: 'team-lead',
    superior_id: '1',
    finished_date: undefined,
    active: true,
    is_deleted: false,
    registration_date: subDays(new Date(), 1095),
    // UI computed fields
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=32&h=32&fit=crop&crop=face',
    phone: '+1 (555) 234-5678',
    skills: ['Team Management', 'Agile', 'React', 'Node.js'],
    workload: 75
  },
  {
    user_id: '3',
    firstname: 'Mike',
    lastname: 'Davis',
    uid: 'mike-davis-003',
    email: 'mike@company.com',
    role_id: 'developer',
    department_id: 'Development',
    jobtitle_id: 'senior-dev',
    superior_id: '2',
    finished_date: undefined,
    active: true,
    is_deleted: false,
    registration_date: subDays(new Date(), 730),
    // UI computed fields
    name: 'Mike Davis',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    phone: '+1 (555) 345-6789',
    skills: ['JavaScript', 'TypeScript', 'React', 'Python', 'SQL'],
    workload: 90
  },
  {
    user_id: '4',
    firstname: 'Emily',
    lastname: 'Chen',
    uid: 'emily-chen-004',
    email: 'emily@company.com',
    role_id: 'designer',
    department_id: 'Design',
    jobtitle_id: 'ui-designer',
    superior_id: '2',
    finished_date: undefined,
    active: true,
    is_deleted: false,
    registration_date: subDays(new Date(), 545),
    // UI computed fields
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    phone: '+1 (555) 456-7890',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    workload: 70
  },
  {
    user_id: '5',
    firstname: 'Alex',
    lastname: 'Rodriguez',
    uid: 'alex-rodriguez-005',
    email: 'alex@company.com',
    role_id: 'developer',
    department_id: 'Development',
    jobtitle_id: 'junior-dev',
    superior_id: '3',
    finished_date: undefined,
    active: true,
    is_deleted: false,
    registration_date: subDays(new Date(), 365),
    // UI computed fields
    name: 'Alex Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    phone: '+1 (555) 567-8901',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker'],
    workload: 95
  }
];

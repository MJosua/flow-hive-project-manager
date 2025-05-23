
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'developer' | 'designer' | 'tester';
  department: string;
  status: 'active' | 'inactive';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate: Date;
  progress: number;
  managerId: string;
  teamMembers: string[];
  budget: number;
  tags: string[];
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeId: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  dependencies: string[];
  attachments: string[];
}

export interface Approval {
  id: string;
  type: 'project_creation' | 'assignment' | 'team_assignment';
  requesterId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  details: any;
  createdAt: Date;
  resolvedAt?: Date;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  userId: string;
  taskId: string;
  projectId: string;
  hours: number;
  date: Date;
  description: string;
}

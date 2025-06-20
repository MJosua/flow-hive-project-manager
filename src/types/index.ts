
export interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  uid: string;
  email: string;
  role_id: string;
  department_id: string;
  jobtitle_id: string;
  superior_id?: string;
  finished_date?: Date;
  active: boolean;
  is_deleted: boolean;
  registration_date: Date;
  // Additional computed fields for UI
  name: string; // firstname + lastname
  avatar?: string;
  phone?: string;
  skills?: string[];
  workload?: number;
}

export interface Department {
  department_id: string;
  department_name: string;
  department_shortname: string;
  department_head?: string;
  description?: string;
  is_deleted: boolean;
  created_date: Date;
  finished_date?: Date;
  updated_date?: Date;
}

export interface Team {
  team_id: string;
  team_name: string;
  department_id: string;
  creation_date: Date;
  finished_date?: Date;
  member_count: number;
}

export interface TeamMember {
  team_member_id: string;
  team_id: string;
  user_id: string;
  team_leader: boolean;
  created_date: Date;
  updated_date?: Date;
  finished_date?: Date;
}

export interface Role {
  role_id: string;
  role_name: string;
  role_description?: string;
  permissions?: string[];
  creation_date: Date;
  finished_date?: Date;
  is_active: boolean;
}

export interface JobTitle {
  jobtitle_id: string;
  job_title: string;
  description?: string;
  department_id: string;
  creation_date: Date;
  finished_date?: Date;
  is_active: boolean;
}

export interface Service {
  service_id: string;
  service_name: string;
  description?: string;
  category_id?: string;
  is_active: boolean;
  created_date: Date;
  updated_date?: Date;
}

export interface WorkflowGroup {
  id: string;
  name: string;
  description?: string;
  category_ids?: string[];
  created_at: Date;
  updated_at?: Date;
  finished_date?: Date;
  is_active: boolean;
}

export interface WorkflowStep {
  step_id: string;
  workflow_group_id: string;
  step_order: number;
  step_type: string;
  assigned_value?: string;
  description?: string;
  is_active: boolean;
  creation_date: Date;
  updated_at?: Date;
  finished_date?: Date;
}

export interface Ticket {
  ticket_id: string;
  service_id: string;
  status_id: string;
  created_by: string;
  assigned_team?: string;
  assigned_to?: string;
  creation_date: Date;
  last_update?: Date;
  reject_reason?: string;
  current_step?: string;
  fulfillment_comment?: string;
}

export interface TicketDetail {
  ticket_id: string;
  lbl_col1?: string;
  lbl_col2?: string;
  lbl_col3?: string;
  lbl_col4?: string;
  lbl_col5?: string;
  lbl_col6?: string;
  lbl_col7?: string;
  lbl_col8?: string;
  lbl_col9?: string;
  lbl_col10?: string;
  lbl_col11?: string;
  lbl_col12?: string;
  lbl_col13?: string;
  lbl_col14?: string;
  lbl_col15?: string;
  lbl_col16?: string;
  cstm_col1?: string;
  cstm_col2?: string;
  cstm_col3?: string;
  cstm_col4?: string;
  cstm_col5?: string;
  cstm_col6?: string;
  cstm_col7?: string;
  cstm_col8?: string;
  cstm_col9?: string;
  cstm_col10?: string;
  cstm_col11?: string;
  cstm_col12?: string;
  cstm_col13?: string;
  cstm_col14?: string;
  cstm_col15?: string;
  cstm_col16?: string;
}

// Legacy types for backward compatibility
export interface ProjectRole {
  userId: string;
  projectId: string;
  role: string;
  hierarchy: number;
  color: string;
  permissions: string[];
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
  roleColors: { [roleName: string]: string };
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
  type: 'project_creation' | 'assignment' | 'team_assignment' | 'task_approval';
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

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

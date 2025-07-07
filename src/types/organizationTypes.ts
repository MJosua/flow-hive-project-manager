
export interface Department {
  department_id: number;
  department_name: string;
  department_shortname: string;
  description?: string;
  department_head: number;
  head_name?: string;
  is_active: boolean;
  created_date: string;
  updated_date: string;
  tags?: string[];
  color?: string;
}

export interface Team {
  team_id: number;
  team_name: string;
  description?: string;
  department_id: number;
  department_name?: string;
  team_leader_id?: number;
  team_leader_name?: string;
  member_count: number;
  is_active: boolean;
  created_date: string;
  updated_date: string;
  tags?: string[];
  color?: string;
}

export interface User {
  user_id: number;
  uid: string;
  firstname: string;
  lastname: string;
  email: string;
  role_id: number;
  role_name: string;
  department_id: number;
  department_name: string;
  team_id?: number;
  team_name?: string;
  job_title?: string;
  superior_id?: number;
  is_active: boolean;
  tags?: string[];
}

export interface ProjectApproval {
  approval_id: number;
  project_id: number;
  project_name: string;
  submitted_by: number;
  submitted_by_name: string;
  approver_id: number;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  submitted_date: string;
  approved_date?: string;
}

export interface TaskApproval {
  approval_id: number;
  task_id: number;
  task_name: string;
  project_id: number;
  project_name: string;
  submitted_by: number;
  submitted_by_name: string;
  approver_id: number;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  submitted_date: string;
  approved_date?: string;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  type: 'project_invite' | 'task_assignment' | 'approval_request' | 'approval_response';
  title: string;
  message: string;
  entity_type: 'project' | 'task' | 'approval';
  entity_id: number;
  is_read: boolean;
  created_date: string;
  action_url?: string;
}

export interface CustomAttribute {
  attribute_id: number;
  name: string;
  data_type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: string[];
  is_required: boolean;
  entity_type: 'project' | 'task';
  created_by: number;
  created_date: string;
}

export interface Tag {
  tag_id: number;
  name: string;
  color: string;
  entity_type: 'user' | 'team' | 'department' | 'task' | 'project';
  created_by: number;
  created_date: string;
}

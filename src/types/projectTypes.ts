
export interface Project {
  project_id: number;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date: string;
  end_date: string;
  manager_id: number;
  manager_name?: string;
  department_id: number;
  department_name?: string;
  created_date: string;
  updated_date: string;
  progress: number; // 0-100
  budget?: number;
  estimated_hours?: number;
  actual_hours?: number;
}

export interface Task {
  task_id: number;
  project_id: number;
  project_name?: string;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to: number;
  assigned_to_name?: string;
  created_by: number;
  created_by_name?: string;
  due_date: string;
  estimated_hours: number;
  actual_hours?: number;
  created_date: string;
  updated_date: string;
  dependencies?: number[]; // task_ids this task depends on
  tags?: string[];
  custom_attributes?: Record<string, any>;
}

export interface ProjectMember {
  project_id: number;
  user_id: number;
  user_name?: string;
  role: 'manager' | 'lead' | 'member' | 'viewer';
  custom_rank?: string;
  custom_title?: string;
  joined_date: string;
  left_date?: string;
  permissions: string[];
}

export interface ProjectNote {
  note_id: number;
  project_id: number;
  task_id?: number;
  user_id: number;
  user_name?: string;
  content: string;
  note_type: 'general' | 'gantt' | 'kanban' | 'task';
  position_x?: number; // For Gantt chart positioning
  position_y?: number;
  created_date: string;
  updated_date: string;
}

export interface ChatMessage {
  message_id: number;
  project_id: number;
  task_id?: number;
  user_id: number;
  user_name?: string;
  message: string;
  message_type: 'text' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  reply_to?: number;
  created_date: string;
  is_edited: boolean;
}

export interface CustomAttribute {
  attribute_id: number;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  options?: string[]; // For select/multiselect types
  is_required: boolean;
  applies_to: 'project' | 'task' | 'both';
  created_date: string;
}

export interface KanbanColumn {
  column_id: string;
  name: string;
  status: Task['status'];
  order: number;
  color: string;
  limit?: number; // WIP limit
}

export interface GanttTask extends Task {
  start_date: string;
  gantt_duration: number; // in days
  progress: number; // 0-100
  parent_task_id?: number;
  is_milestone: boolean;
}

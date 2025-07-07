export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      m_approval_types: {
        Row: {
          allows_delegation: boolean | null
          approval_type_id: number
          created_date: string | null
          description: string | null
          escalation_enabled: boolean | null
          is_active: boolean | null
          max_levels: number | null
          name: string
          timeout_hours: number | null
        }
        Insert: {
          allows_delegation?: boolean | null
          approval_type_id?: number
          created_date?: string | null
          description?: string | null
          escalation_enabled?: boolean | null
          is_active?: boolean | null
          max_levels?: number | null
          name: string
          timeout_hours?: number | null
        }
        Update: {
          allows_delegation?: boolean | null
          approval_type_id?: number
          created_date?: string | null
          description?: string | null
          escalation_enabled?: boolean | null
          is_active?: boolean | null
          max_levels?: number | null
          name?: string
          timeout_hours?: number | null
        }
        Relationships: []
      }
      m_custom_attributes: {
        Row: {
          attribute_id: number
          created_by: number | null
          created_date: string | null
          data_type: string
          default_value: string | null
          entity_type: string
          is_active: boolean | null
          is_required: boolean | null
          name: string
          options: Json | null
          validation_rules: Json | null
        }
        Insert: {
          attribute_id?: number
          created_by?: number | null
          created_date?: string | null
          data_type: string
          default_value?: string | null
          entity_type: string
          is_active?: boolean | null
          is_required?: boolean | null
          name: string
          options?: Json | null
          validation_rules?: Json | null
        }
        Update: {
          attribute_id?: number
          created_by?: number | null
          created_date?: string | null
          data_type?: string
          default_value?: string | null
          entity_type?: string
          is_active?: boolean | null
          is_required?: boolean | null
          name?: string
          options?: Json | null
          validation_rules?: Json | null
        }
        Relationships: []
      }
      m_priority_levels: {
        Row: {
          color_code: string
          created_date: string | null
          escalation_hours: number | null
          is_active: boolean | null
          level_value: number
          name: string
          priority_id: number
        }
        Insert: {
          color_code: string
          created_date?: string | null
          escalation_hours?: number | null
          is_active?: boolean | null
          level_value: number
          name: string
          priority_id?: number
        }
        Update: {
          color_code?: string
          created_date?: string | null
          escalation_hours?: number | null
          is_active?: boolean | null
          level_value?: number
          name?: string
          priority_id?: number
        }
        Relationships: []
      }
      m_project_types: {
        Row: {
          approval_threshold: number | null
          created_date: string | null
          default_duration_days: number | null
          description: string | null
          is_active: boolean | null
          name: string
          project_type_id: number
          requires_approval: boolean | null
          updated_date: string | null
        }
        Insert: {
          approval_threshold?: number | null
          created_date?: string | null
          default_duration_days?: number | null
          description?: string | null
          is_active?: boolean | null
          name: string
          project_type_id?: number
          requires_approval?: boolean | null
          updated_date?: string | null
        }
        Update: {
          approval_threshold?: number | null
          created_date?: string | null
          default_duration_days?: number | null
          description?: string | null
          is_active?: boolean | null
          name?: string
          project_type_id?: number
          requires_approval?: boolean | null
          updated_date?: string | null
        }
        Relationships: []
      }
      m_status_options: {
        Row: {
          color_code: string | null
          created_date: string | null
          description: string | null
          entity_type: string
          is_active: boolean | null
          is_final: boolean | null
          sort_order: number | null
          status_id: number
          status_key: string
          status_label: string
        }
        Insert: {
          color_code?: string | null
          created_date?: string | null
          description?: string | null
          entity_type: string
          is_active?: boolean | null
          is_final?: boolean | null
          sort_order?: number | null
          status_id?: number
          status_key: string
          status_label: string
        }
        Update: {
          color_code?: string | null
          created_date?: string | null
          description?: string | null
          entity_type?: string
          is_active?: boolean | null
          is_final?: boolean | null
          sort_order?: number | null
          status_id?: number
          status_key?: string
          status_label?: string
        }
        Relationships: []
      }
      m_task_types: {
        Row: {
          color_code: string | null
          created_date: string | null
          default_estimated_hours: number | null
          description: string | null
          icon: string | null
          is_active: boolean | null
          is_billable: boolean | null
          is_target_based: boolean | null
          name: string
          requires_approval: boolean | null
          task_type_id: number
        }
        Insert: {
          color_code?: string | null
          created_date?: string | null
          default_estimated_hours?: number | null
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          is_billable?: boolean | null
          is_target_based?: boolean | null
          name: string
          requires_approval?: boolean | null
          task_type_id?: number
        }
        Update: {
          color_code?: string | null
          created_date?: string | null
          default_estimated_hours?: number | null
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          is_billable?: boolean | null
          is_target_based?: boolean | null
          name?: string
          requires_approval?: boolean | null
          task_type_id?: number
        }
        Relationships: []
      }
      pm_departments: {
        Row: {
          created_date: string | null
          department_head: number | null
          department_id: number
          department_name: string
          department_shortname: string
          description: string | null
          head_name: string | null
          id: string
          is_active: boolean | null
          updated_date: string | null
        }
        Insert: {
          created_date?: string | null
          department_head?: number | null
          department_id: number
          department_name: string
          department_shortname: string
          description?: string | null
          head_name?: string | null
          id?: string
          is_active?: boolean | null
          updated_date?: string | null
        }
        Update: {
          created_date?: string | null
          department_head?: number | null
          department_id?: number
          department_name?: string
          department_shortname?: string
          description?: string | null
          head_name?: string | null
          id?: string
          is_active?: boolean | null
          updated_date?: string | null
        }
        Relationships: []
      }
      pm_projects: {
        Row: {
          actual_hours: number | null
          budget: number | null
          created_date: string | null
          department_id: number | null
          department_name: string | null
          description: string | null
          end_date: string | null
          estimated_hours: number | null
          id: string
          manager_id: number
          manager_name: string | null
          name: string
          priority: string | null
          progress: number | null
          project_id: number
          start_date: string | null
          status: string | null
          updated_date: string | null
        }
        Insert: {
          actual_hours?: number | null
          budget?: number | null
          created_date?: string | null
          department_id?: number | null
          department_name?: string | null
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          manager_id: number
          manager_name?: string | null
          name: string
          priority?: string | null
          progress?: number | null
          project_id: number
          start_date?: string | null
          status?: string | null
          updated_date?: string | null
        }
        Update: {
          actual_hours?: number | null
          budget?: number | null
          created_date?: string | null
          department_id?: number | null
          department_name?: string | null
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          manager_id?: number
          manager_name?: string | null
          name?: string
          priority?: string | null
          progress?: number | null
          project_id?: number
          start_date?: string | null
          status?: string | null
          updated_date?: string | null
        }
        Relationships: []
      }
      pm_tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: number | null
          assigned_to_name: string | null
          created_by: number | null
          created_by_name: string | null
          created_date: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          group_id: number | null
          group_name: string | null
          id: string
          name: string
          priority: string | null
          progress: number | null
          project_id: number
          project_name: string | null
          status: string | null
          tags: string[] | null
          task_id: number
          updated_date: string | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: number | null
          assigned_to_name?: string | null
          created_by?: number | null
          created_by_name?: string | null
          created_date?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          group_id?: number | null
          group_name?: string | null
          id?: string
          name: string
          priority?: string | null
          progress?: number | null
          project_id: number
          project_name?: string | null
          status?: string | null
          tags?: string[] | null
          task_id: number
          updated_date?: string | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: number | null
          assigned_to_name?: string | null
          created_by?: number | null
          created_by_name?: string | null
          created_date?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          group_id?: number | null
          group_name?: string | null
          id?: string
          name?: string
          priority?: string | null
          progress?: number | null
          project_id?: number
          project_name?: string | null
          status?: string | null
          tags?: string[] | null
          task_id?: number
          updated_date?: string | null
        }
        Relationships: []
      }
      pm_teams: {
        Row: {
          created_date: string | null
          department_id: number
          description: string | null
          id: string
          member_count: number | null
          team_id: number
          team_leader_id: number | null
          team_leader_name: string | null
          team_name: string
          updated_date: string | null
        }
        Insert: {
          created_date?: string | null
          department_id: number
          description?: string | null
          id?: string
          member_count?: number | null
          team_id: number
          team_leader_id?: number | null
          team_leader_name?: string | null
          team_name: string
          updated_date?: string | null
        }
        Update: {
          created_date?: string | null
          department_id?: number
          description?: string | null
          id?: string
          member_count?: number | null
          team_id?: number
          team_leader_id?: number | null
          team_leader_name?: string | null
          team_name?: string
          updated_date?: string | null
        }
        Relationships: []
      }
      pm_users: {
        Row: {
          created_date: string | null
          department_id: number | null
          department_name: string | null
          email: string
          firstname: string
          id: string
          is_active: boolean | null
          job_title: string | null
          jobtitle_id: number | null
          lastname: string
          role_id: number | null
          role_name: string | null
          superior_id: number | null
          team_id: number | null
          team_name: string | null
          uid: string
          updated_date: string | null
          user_id: number
        }
        Insert: {
          created_date?: string | null
          department_id?: number | null
          department_name?: string | null
          email: string
          firstname: string
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          jobtitle_id?: number | null
          lastname: string
          role_id?: number | null
          role_name?: string | null
          superior_id?: number | null
          team_id?: number | null
          team_name?: string | null
          uid: string
          updated_date?: string | null
          user_id: number
        }
        Update: {
          created_date?: string | null
          department_id?: number | null
          department_name?: string | null
          email?: string
          firstname?: string
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          jobtitle_id?: number | null
          lastname?: string
          role_id?: number | null
          role_name?: string | null
          superior_id?: number | null
          team_id?: number | null
          team_name?: string | null
          uid?: string
          updated_date?: string | null
          user_id?: number
        }
        Relationships: []
      }
      t_approval_workflows: {
        Row: {
          approval_type_id: number | null
          completed_date: string | null
          current_level: number | null
          entity_id: number
          entity_type: string
          is_active: boolean | null
          max_level: number | null
          rejection_reason: string | null
          status: string | null
          submitted_by: number
          submitted_date: string | null
          total_time_hours: number | null
          workflow_id: number
        }
        Insert: {
          approval_type_id?: number | null
          completed_date?: string | null
          current_level?: number | null
          entity_id: number
          entity_type: string
          is_active?: boolean | null
          max_level?: number | null
          rejection_reason?: string | null
          status?: string | null
          submitted_by: number
          submitted_date?: string | null
          total_time_hours?: number | null
          workflow_id?: number
        }
        Update: {
          approval_type_id?: number | null
          completed_date?: string | null
          current_level?: number | null
          entity_id?: number
          entity_type?: string
          is_active?: boolean | null
          max_level?: number | null
          rejection_reason?: string | null
          status?: string | null
          submitted_by?: number
          submitted_date?: string | null
          total_time_hours?: number | null
          workflow_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "t_approval_workflows_approval_type_id_fkey"
            columns: ["approval_type_id"]
            isOneToOne: false
            referencedRelation: "m_approval_types"
            referencedColumns: ["approval_type_id"]
          },
        ]
      }
      t_audit_logs: {
        Row: {
          action: string
          created_date: string | null
          entity_id: number
          entity_type: string
          ip_address: unknown | null
          log_id: number
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: number
        }
        Insert: {
          action: string
          created_date?: string | null
          entity_id: number
          entity_type: string
          ip_address?: unknown | null
          log_id?: number
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id: number
        }
        Update: {
          action?: string
          created_date?: string | null
          entity_id?: number
          entity_type?: string
          ip_address?: unknown | null
          log_id?: number
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: number
        }
        Relationships: []
      }
      t_custom_configurations: {
        Row: {
          attribute_id: number | null
          config_id: number
          created_by: number
          created_date: string | null
          entity_id: number
          entity_type: string
          updated_date: string | null
          value: Json
        }
        Insert: {
          attribute_id?: number | null
          config_id?: number
          created_by: number
          created_date?: string | null
          entity_id: number
          entity_type: string
          updated_date?: string | null
          value: Json
        }
        Update: {
          attribute_id?: number | null
          config_id?: number
          created_by?: number
          created_date?: string | null
          entity_id?: number
          entity_type?: string
          updated_date?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "t_custom_configurations_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "m_custom_attributes"
            referencedColumns: ["attribute_id"]
          },
        ]
      }
      t_project_approvals: {
        Row: {
          approval_id: number
          approved_date: string | null
          approver_id: number
          budget_approved: number | null
          comments: string | null
          delegated_to: number | null
          is_active: boolean | null
          level: number
          project_id: number
          status: string | null
          workflow_id: number | null
        }
        Insert: {
          approval_id?: number
          approved_date?: string | null
          approver_id: number
          budget_approved?: number | null
          comments?: string | null
          delegated_to?: number | null
          is_active?: boolean | null
          level: number
          project_id: number
          status?: string | null
          workflow_id?: number | null
        }
        Update: {
          approval_id?: number
          approved_date?: string | null
          approver_id?: number
          budget_approved?: number | null
          comments?: string | null
          delegated_to?: number | null
          is_active?: boolean | null
          level?: number
          project_id?: number
          status?: string | null
          workflow_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "t_project_approvals_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "t_approval_workflows"
            referencedColumns: ["workflow_id"]
          },
        ]
      }
      t_task_approvals: {
        Row: {
          approval_id: number
          approved_date: string | null
          approver_id: number
          comments: string | null
          delegated_to: number | null
          is_active: boolean | null
          level: number
          status: string | null
          task_id: number
          workflow_id: number | null
        }
        Insert: {
          approval_id?: number
          approved_date?: string | null
          approver_id: number
          comments?: string | null
          delegated_to?: number | null
          is_active?: boolean | null
          level: number
          status?: string | null
          task_id: number
          workflow_id?: number | null
        }
        Update: {
          approval_id?: number
          approved_date?: string | null
          approver_id?: number
          comments?: string | null
          delegated_to?: number | null
          is_active?: boolean | null
          level?: number
          status?: string | null
          task_id?: number
          workflow_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "t_task_approvals_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "t_approval_workflows"
            referencedColumns: ["workflow_id"]
          },
        ]
      }
      t_task_dependencies: {
        Row: {
          created_by: number
          created_date: string | null
          dependency_id: number
          dependency_type: string | null
          depends_on_task_id: number
          is_critical: boolean | null
          lag_days: number | null
          task_id: number
        }
        Insert: {
          created_by: number
          created_date?: string | null
          dependency_id?: number
          dependency_type?: string | null
          depends_on_task_id: number
          is_critical?: boolean | null
          lag_days?: number | null
          task_id: number
        }
        Update: {
          created_by?: number
          created_date?: string | null
          dependency_id?: number
          dependency_type?: string | null
          depends_on_task_id?: number
          is_critical?: boolean | null
          lag_days?: number | null
          task_id?: number
        }
        Relationships: []
      }
      t_time_tracking: {
        Row: {
          approved_by: number | null
          approved_date: string | null
          created_date: string | null
          description: string | null
          duration_minutes: number | null
          end_time: string | null
          entry_id: number
          hourly_rate: number | null
          is_billable: boolean | null
          start_time: string
          task_id: number
          total_cost: number | null
          user_id: number
        }
        Insert: {
          approved_by?: number | null
          approved_date?: string | null
          created_date?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          entry_id?: number
          hourly_rate?: number | null
          is_billable?: boolean | null
          start_time: string
          task_id: number
          total_cost?: number | null
          user_id: number
        }
        Update: {
          approved_by?: number | null
          approved_date?: string | null
          created_date?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          entry_id?: number
          hourly_rate?: number | null
          is_billable?: boolean | null
          start_time?: string
          task_id?: number
          total_cost?: number | null
          user_id?: number
        }
        Relationships: []
      }
      user_tokens: {
        Row: {
          created_at: string
          device_info: string | null
          expires_at: string
          id: string
          ip_address: string | null
          is_active: boolean
          last_used_at: string | null
          tokek: string
          user_id: number
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean
          last_used_at?: string | null
          tokek: string
          user_id: number
        }
        Update: {
          created_at?: string
          device_info?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean
          last_used_at?: string | null
          tokek?: string
          user_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_critical_path: {
        Args: { p_project_id: number }
        Returns: {
          task_id: number
          early_start: string
          early_finish: string
          late_start: string
          late_finish: string
          is_critical: boolean
        }[]
      }
      cleanup_expired_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_approval_hierarchy: {
        Args: { p_user_id: number }
        Returns: {
          level: number
          approver_id: number
          approver_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

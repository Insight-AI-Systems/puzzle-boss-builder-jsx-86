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
      beta_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["note_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["note_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["note_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          browser_info: string | null
          created_at: string | null
          description: string
          email: string | null
          id: string
          page_url: string | null
          status: string | null
          type: Database["public"]["Enums"]["feedback_type"]
          user_id: string | null
        }
        Insert: {
          browser_info?: string | null
          created_at?: string | null
          description: string
          email?: string | null
          id?: string
          page_url?: string | null
          status?: string | null
          type: Database["public"]["Enums"]["feedback_type"]
          user_id?: string | null
        }
        Update: {
          browser_info?: string | null
          created_at?: string | null
          description?: string
          email?: string | null
          id?: string
          page_url?: string | null
          status?: string | null
          type?: Database["public"]["Enums"]["feedback_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      password_reset_attempts: {
        Row: {
          attempt_count: number | null
          email: string
          id: string
          ip_address: string | null
          last_attempt_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          email: string
          id?: string
          ip_address?: string | null
          last_attempt_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          email?: string
          id?: string
          ip_address?: string | null
          last_attempt_at?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_locked: boolean | null
          active_sessions: Json | null
          avatar_url: string | null
          bio: string | null
          categories_played: string[] | null
          country: string | null
          created_at: string | null
          credits: number | null
          email: string | null
          email_change_new_email: string | null
          email_change_token: string | null
          email_change_token_expires_at: string | null
          failed_login_attempts: number | null
          id: string
          last_password_change: string | null
          last_sign_in: string | null
          role: string | null
          security_questions: Json | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          account_locked?: boolean | null
          active_sessions?: Json | null
          avatar_url?: string | null
          bio?: string | null
          categories_played?: string[] | null
          country?: string | null
          created_at?: string | null
          credits?: number | null
          email?: string | null
          email_change_new_email?: string | null
          email_change_token?: string | null
          email_change_token_expires_at?: string | null
          failed_login_attempts?: number | null
          id: string
          last_password_change?: string | null
          last_sign_in?: string | null
          role?: string | null
          security_questions?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          account_locked?: boolean | null
          active_sessions?: Json | null
          avatar_url?: string | null
          bio?: string | null
          categories_played?: string[] | null
          country?: string | null
          created_at?: string | null
          credits?: number | null
          email?: string | null
          email_change_new_email?: string | null
          email_change_token?: string | null
          email_change_token_expires_at?: string | null
          failed_login_attempts?: number | null
          id?: string
          last_password_change?: string | null
          last_sign_in?: string | null
          role?: string | null
          security_questions?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      progress_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          progress_item_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          progress_item_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          progress_item_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_comments_progress_item_id_fkey"
            columns: ["progress_item_id"]
            isOneToOne: false
            referencedRelation: "progress_items"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          last_edited_by: string | null
          order_index: number | null
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_edited_by?: string | null
          order_index?: number | null
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_edited_by?: string | null
          order_index?: number | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_active: string | null
          location_info: Json | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active?: string | null
          location_info?: Json | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active?: string | null
          location_info?: Json | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_super_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
      has_permission: {
        Args: { user_id: string; permission_name: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      search_and_sync_users: {
        Args: { search_term: string }
        Returns: {
          id: string
          email: string
          display_name: string
          role: string
          created_at: string
        }[]
      }
      terminate_other_sessions: {
        Args: { current_session_id: string }
        Returns: undefined
      }
    }
    Enums: {
      feedback_type: "bug" | "suggestion" | "question" | "other"
      note_status: "wip" | "completed"
      user_role:
        | "admin"
        | "category_manager"
        | "social_media_manager"
        | "partner_manager"
        | "cfo"
        | "player"
        | "user"
        | "super_admin"
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
    Enums: {
      feedback_type: ["bug", "suggestion", "question", "other"],
      note_status: ["wip", "completed"],
      user_role: [
        "admin",
        "category_manager",
        "social_media_manager",
        "partner_manager",
        "cfo",
        "player",
        "user",
        "super_admin",
      ],
    },
  },
} as const

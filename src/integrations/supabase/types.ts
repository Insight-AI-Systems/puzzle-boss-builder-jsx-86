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
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          status?: string | null
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
      hero_puzzle_config: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["puzzle_difficulty"]
          id: string
          image_url: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["puzzle_difficulty"]
          id?: string
          image_url: string
          title?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["puzzle_difficulty"]
          id?: string
          image_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      issues: {
        Row: {
          category: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          modified_by: string
          status: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          description: string
          id?: string
          modified_by: string
          status?: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          modified_by?: string
          status?: Database["public"]["Enums"]["issue_status"]
          title?: string
          updated_at?: string
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
          age_group: Database["public"]["Enums"]["age_group"] | null
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
          age_group?: Database["public"]["Enums"]["age_group"] | null
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
          age_group?: Database["public"]["Enums"]["age_group"] | null
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
      puzzle_completions: {
        Row: {
          completed_at: string | null
          completion_time: number
          difficulty_level: string | null
          game_mode: string | null
          id: string
          is_winner: boolean | null
          moves_count: number | null
          puzzle_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_time: number
          difficulty_level?: string | null
          game_mode?: string | null
          id?: string
          is_winner?: boolean | null
          moves_count?: number | null
          puzzle_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_time?: number
          difficulty_level?: string | null
          game_mode?: string | null
          id?: string
          is_winner?: boolean | null
          moves_count?: number | null
          puzzle_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "puzzle_completions_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
        ]
      }
      puzzle_leaderboard: {
        Row: {
          created_at: string
          id: string
          player_id: string
          player_name: string | null
          puzzle_id: string
          time_seconds: number
        }
        Insert: {
          created_at?: string
          id?: string
          player_id: string
          player_name?: string | null
          puzzle_id: string
          time_seconds: number
        }
        Update: {
          created_at?: string
          id?: string
          player_id?: string
          player_name?: string | null
          puzzle_id?: string
          time_seconds?: number
        }
        Relationships: []
      }
      puzzle_progress: {
        Row: {
          completion_time: number | null
          id: string
          is_completed: boolean | null
          last_updated: string | null
          progress: Json | null
          puzzle_id: string
          start_time: string | null
          user_id: string
        }
        Insert: {
          completion_time?: number | null
          id?: string
          is_completed?: boolean | null
          last_updated?: string | null
          progress?: Json | null
          puzzle_id: string
          start_time?: string | null
          user_id: string
        }
        Update: {
          completion_time?: number | null
          id?: string
          is_completed?: boolean | null
          last_updated?: string | null
          progress?: Json | null
          puzzle_id?: string
          start_time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "puzzle_progress_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
        ]
      }
      puzzle_settings: {
        Row: {
          created_at: string | null
          id: string
          settings: Json | null
          settings_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings?: Json | null
          settings_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          settings?: Json | null
          settings_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      puzzles: {
        Row: {
          avg_time: number | null
          category_id: string | null
          completions: number | null
          cost_per_play: number | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          id: string
          image_url: string
          income_target: number
          override_target: boolean
          pieces: number
          prize_value: number
          puzzle_config: Json | null
          puzzle_owner: string | null
          puzzle_type: string | null
          release_date: string
          status: string
          supplier: string | null
          time_limit: number | null
          title: string
          updated_at: string
        }
        Insert: {
          avg_time?: number | null
          category_id?: string | null
          completions?: number | null
          cost_per_play?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          image_url: string
          income_target: number
          override_target?: boolean
          pieces?: number
          prize_value: number
          puzzle_config?: Json | null
          puzzle_owner?: string | null
          puzzle_type?: string | null
          release_date: string
          status?: string
          supplier?: string | null
          time_limit?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          avg_time?: number | null
          category_id?: string | null
          completions?: number | null
          cost_per_play?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string
          income_target?: number
          override_target?: boolean
          pieces?: number
          prize_value?: number
          puzzle_config?: Json | null
          puzzle_owner?: string | null
          puzzle_type?: string | null
          release_date?: string
          status?: string
          supplier?: string | null
          time_limit?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "puzzles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
      get_puzzle_stats: {
        Args: { puzzle_id: string }
        Returns: {
          total_plays: number
          avg_completion_time: number
          fastest_time: number
          completion_rate: number
        }[]
      }
      handle_password_reset_attempt: {
        Args: { _email: string; _ip_address?: string }
        Returns: string
      }
      has_permission: {
        Args: { user_id: string; permission_name: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_password_reset_rate_limited: {
        Args: {
          _email: string
          _max_attempts?: number
          _timeframe_minutes?: number
        }
        Returns: boolean
      }
      mapdbstatustofrontend: {
        Args: { db_status: Database["public"]["Enums"]["issue_status"] }
        Returns: string
      }
      mapfrontendstatustodb: {
        Args: { frontend_status: string }
        Returns: Database["public"]["Enums"]["issue_status"]
      }
      search_and_sync_users: {
        Args: { search_term: string }
        Returns: {
          id: string
          email: string
          display_name: string
          role: string
          created_at: string
          gender: string
          age_group: string
        }[]
      }
      terminate_other_sessions: {
        Args: { current_session_id: string }
        Returns: undefined
      }
    }
    Enums: {
      age_group: "13-17" | "18-24" | "25-34" | "35-44" | "45-60" | "60+"
      feedback_type: "bug" | "suggestion" | "question" | "other"
      issue_status: "wip" | "completed" | "deferred"
      note_status: "wip" | "completed"
      puzzle_difficulty: "easy" | "medium" | "hard"
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
      age_group: ["13-17", "18-24", "25-34", "35-44", "45-60", "60+"],
      feedback_type: ["bug", "suggestion", "question", "other"],
      issue_status: ["wip", "completed", "deferred"],
      note_status: ["wip", "completed"],
      puzzle_difficulty: ["easy", "medium", "hard"],
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

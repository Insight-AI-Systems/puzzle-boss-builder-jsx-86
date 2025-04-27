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
      category_managers: {
        Row: {
          active: boolean
          category_id: string
          commission_percent: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          category_id: string
          commission_percent?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          category_id?: string
          commission_percent?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_managers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_revenue: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          revenue: number | null
          transaction_date: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          revenue?: number | null
          transaction_date?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          revenue?: number | null
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_revenue_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_payments: {
        Row: {
          category_id: string
          commission_amount: number
          created_at: string
          email_error: string | null
          email_sent_at: string | null
          email_status: string | null
          gross_income: number
          id: string
          invoice_number: string | null
          manager_id: string
          net_income: number
          payment_date: string | null
          payment_status: string
          period: string
          updated_at: string
        }
        Insert: {
          category_id: string
          commission_amount?: number
          created_at?: string
          email_error?: string | null
          email_sent_at?: string | null
          email_status?: string | null
          gross_income?: number
          id?: string
          invoice_number?: string | null
          manager_id: string
          net_income?: number
          payment_date?: string | null
          payment_status?: string
          period: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          commission_amount?: number
          created_at?: string
          email_error?: string | null
          email_sent_at?: string | null
          email_status?: string | null
          gross_income?: number
          id?: string
          invoice_number?: string | null
          manager_id?: string
          net_income?: number
          payment_date?: string | null
          payment_status?: string
          period?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_payments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "category_managers"
            referencedColumns: ["id"]
          },
        ]
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
      image_files: {
        Row: {
          created_at: string
          id: string
          original_height: number | null
          original_path: string
          original_size: number | null
          original_width: number | null
          processed_height: number | null
          processed_path: string | null
          processed_width: number | null
          processing_status: string
          product_image_id: string
          thumbnail_path: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          original_height?: number | null
          original_path: string
          original_size?: number | null
          original_width?: number | null
          processed_height?: number | null
          processed_path?: string | null
          processed_width?: number | null
          processing_status?: string
          product_image_id: string
          thumbnail_path?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          original_height?: number | null
          original_path?: string
          original_size?: number | null
          original_width?: number | null
          processed_height?: number | null
          processed_path?: string | null
          processed_width?: number | null
          processing_status?: string
          product_image_id?: string
          thumbnail_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_files_product_image_id_fkey"
            columns: ["product_image_id"]
            isOneToOne: false
            referencedRelation: "product_images"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
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
          modified_at: string | null
          modified_by: string
          status: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at: string
          workaround: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          description: string
          id?: string
          modified_at?: string | null
          modified_by: string
          status?: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at?: string
          workaround?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          modified_at?: string | null
          modified_by?: string
          status?: Database["public"]["Enums"]["issue_status"]
          title?: string
          updated_at?: string
          workaround?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          amount: number
          created_at: string
          end_date: string | null
          id: string
          last_payment_date: string | null
          membership_type: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_date?: string | null
          id?: string
          last_payment_date?: string | null
          membership_type: string
          start_date?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_date?: string | null
          id?: string
          last_payment_date?: string | null
          membership_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
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
      prize_winners: {
        Row: {
          completion_time: number
          created_at: string
          id: string
          prize_value: number
          puzzle_id: string
          puzzle_image_url: string
          puzzle_name: string
          user_id: string
          winner_country: string | null
        }
        Insert: {
          completion_time: number
          created_at?: string
          id?: string
          prize_value: number
          puzzle_id: string
          puzzle_image_url: string
          puzzle_name: string
          user_id: string
          winner_country?: string | null
        }
        Update: {
          completion_time?: number
          created_at?: string
          id?: string
          prize_value?: number
          puzzle_id?: string
          puzzle_image_url?: string
          puzzle_name?: string
          user_id?: string
          winner_country?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prize_winners_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json
          name: string
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
      puzzle_images: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          original_path: string | null
          processed_path: string | null
          status: string | null
          thumbnail_path: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          original_path?: string | null
          processed_path?: string | null
          status?: string | null
          thumbnail_path?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          original_path?: string | null
          processed_path?: string | null
          status?: string | null
          thumbnail_path?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          active_players: Json | null
          avg_time: number | null
          category_id: string | null
          completions: number | null
          cost_per_play: number | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          expected_release_date: string | null
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
          active_players?: Json | null
          avg_time?: number | null
          category_id?: string | null
          completions?: number | null
          cost_per_play?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          expected_release_date?: string | null
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
          active_players?: Json | null
          avg_time?: number | null
          category_id?: string | null
          completions?: number | null
          cost_per_play?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          expected_release_date?: string | null
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
      site_expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          date: string
          expense_type: string
          id: string
          notes: string | null
          payee: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          date?: string
          expense_type: string
          id?: string
          notes?: string | null
          payee?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          date?: string
          expense_type?: string
          id?: string
          notes?: string | null
          payee?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_income: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          date: string
          id: string
          method: string
          notes: string | null
          source_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          date?: string
          id?: string
          method?: string
          notes?: string | null
          source_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          date?: string
          id?: string
          method?: string
          notes?: string | null
          source_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_income_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          comments: Json | null
          created_at: string
          created_by: string
          description: string
          id: string
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          comments?: Json | null
          created_at?: string
          created_by: string
          description: string
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          title: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          comments?: Json | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          title?: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Relationships: []
      }
      user_activity_metrics: {
        Row: {
          active_users: number | null
          created_at: string | null
          id: string
          metric_date: string
          new_signups: number | null
          puzzles_completed: number | null
          revenue: number | null
        }
        Insert: {
          active_users?: number | null
          created_at?: string | null
          id?: string
          metric_date?: string
          new_signups?: number | null
          puzzles_completed?: number | null
          revenue?: number | null
        }
        Update: {
          active_users?: number | null
          created_at?: string | null
          id?: string
          metric_date?: string
          new_signups?: number | null
          puzzles_completed?: number | null
          revenue?: number | null
        }
        Relationships: []
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
      membership_stats: {
        Row: {
          active_members: number | null
          canceled_members: number | null
          expired_members: number | null
          month: string | null
          total_revenue: number | null
        }
        Relationships: []
      }
      puzzle_top_players: {
        Row: {
          completion_time: number | null
          puzzle_id: string | null
          rank: number | null
          user_id: string | null
          username: string | null
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
    }
    Functions: {
      calculate_daily_metrics: {
        Args: { date_param: string }
        Returns: {
          active_users: number
          new_signups: number
          puzzles_completed: number
          revenue: number
        }[]
      }
      calculate_monthly_commissions: {
        Args: { month_param: string }
        Returns: undefined
      }
      ensure_super_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
      get_category_revenue: {
        Args: { date_param: string }
        Returns: {
          category_name: string
          total_revenue: number
        }[]
      }
      get_daily_winners: {
        Args: { date_param: string }
        Returns: {
          id: string
          winner_name: string
          puzzle_name: string
          puzzle_image_url: string
          completion_time: number
          prize_value: number
          winner_country: string
          created_at: string
        }[]
      }
      get_membership_stats: {
        Args: { start_date: string; end_date: string }
        Returns: {
          period: string
          active_members: number
          expired_members: number
          canceled_members: number
          revenue: number
          churn_rate: number
        }[]
      }
      get_monthly_financial_summary: {
        Args: { month_param: string }
        Returns: {
          period: string
          total_income: number
          total_expenses: number
          net_profit: number
          commissions_paid: number
          prize_expenses: number
        }[]
      }
      get_monthly_trends: {
        Args: { months_back?: number }
        Returns: {
          month_date: string
          active_users: number
          new_signups: number
          puzzles_completed: number
          revenue: number
        }[]
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
      get_user_email: {
        Args: { user_id: string }
        Returns: string
      }
      handle_password_reset_attempt: {
        Args: { _email: string; _ip_address?: string }
        Returns: string
      }
      has_permission: {
        Args: { user_id: string; permission_name: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          user_id: string
          role_name: Database["public"]["Enums"]["user_role"]
        }
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
      update_puzzle_active_players: {
        Args: { puzzle_id: string; user_id: string; action: string }
        Returns: undefined
      }
    }
    Enums: {
      age_group: "13-17" | "18-24" | "25-34" | "35-44" | "45-60" | "60+"
      feedback_type: "bug" | "suggestion" | "question" | "other"
      issue_status: "wip" | "completed" | "deferred"
      note_status: "wip" | "completed"
      puzzle_difficulty: "easy" | "medium" | "hard"
      ticket_status: "open" | "in-progress" | "resolved" | "closed"
      ticket_type: "internal" | "external"
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
      ticket_status: ["open", "in-progress", "resolved", "closed"],
      ticket_type: ["internal", "external"],
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

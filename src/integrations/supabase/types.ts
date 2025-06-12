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
      auth_rate_limits: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          id: string
          identifier: string
          last_attempt_at: string
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          identifier: string
          last_attempt_at?: string
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          identifier?: string
          last_attempt_at?: string
        }
        Relationships: []
      }
      beta_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          member_id: string
          status: Database["public"]["Enums"]["note_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          member_id: string
          status?: Database["public"]["Enums"]["note_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          member_id?: string
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
          member_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          category_id: string
          commission_percent?: number
          created_at?: string
          id?: string
          member_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          category_id?: string
          commission_percent?: number
          created_at?: string
          id?: string
          member_id?: string
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
          member_id: string | null
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
          member_id?: string | null
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
          member_id?: string | null
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
      email_analytics: {
        Row: {
          campaign_id: string | null
          clicked: number
          created_at: string | null
          date: string
          delivered: number
          desktop_pct: number | null
          id: string
          mobile_pct: number | null
          opened: number
          other_pct: number | null
          sent: number
          webmail_pct: number | null
        }
        Insert: {
          campaign_id?: string | null
          clicked?: number
          created_at?: string | null
          date?: string
          delivered?: number
          desktop_pct?: number | null
          id?: string
          mobile_pct?: number | null
          opened?: number
          other_pct?: number | null
          sent?: number
          webmail_pct?: number | null
        }
        Update: {
          campaign_id?: string | null
          clicked?: number
          created_at?: string | null
          date?: string
          delivered?: number
          desktop_pct?: number | null
          id?: string
          mobile_pct?: number | null
          opened?: number
          other_pct?: number | null
          sent?: number
          webmail_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          audience: string
          created_at: string | null
          id: string
          name: string
          opened: number
          recipients: number
          scheduled_for: string | null
          sent: number
          status: string
          template_id: string | null
        }
        Insert: {
          audience: string
          created_at?: string | null
          id?: string
          name: string
          opened?: number
          recipients?: number
          scheduled_for?: string | null
          sent?: number
          status: string
          template_id?: string | null
        }
        Update: {
          audience?: string
          created_at?: string | null
          id?: string
          name?: string
          opened?: number
          recipients?: number
          scheduled_for?: string | null
          sent?: number
          status?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_engagement: {
        Row: {
          campaign_id: string | null
          clicked: number
          created_at: string | null
          date: string
          id: string
          opened: number
          sent: number
        }
        Insert: {
          campaign_id?: string | null
          clicked?: number
          created_at?: string | null
          date: string
          id?: string
          opened?: number
          sent?: number
        }
        Update: {
          campaign_id?: string | null
          clicked?: number
          created_at?: string | null
          date?: string
          id?: string
          opened?: number
          sent?: number
        }
        Relationships: [
          {
            foreignKeyName: "email_engagement_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_link_clicks: {
        Row: {
          campaign_id: string | null
          clicks: number
          created_at: string | null
          id: string
          link: string
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number
          created_at?: string | null
          id?: string
          link: string
        }
        Update: {
          campaign_id?: string | null
          clicks?: number
          created_at?: string | null
          id?: string
          link?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_link_clicks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          last_sent: string | null
          name: string
          status: string
          subject: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          last_sent?: string | null
          name: string
          status?: string
          subject: string
          type: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          last_sent?: string | null
          name?: string
          status?: string
          subject?: string
          type?: string
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
          member_id: string | null
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
          member_id?: string | null
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
          member_id?: string | null
          page_url?: string | null
          status?: string | null
          type?: Database["public"]["Enums"]["feedback_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          member_id: string | null
          metadata: Json | null
          payment_method: string | null
          status: string
          transaction_date: string
          transaction_type: string
          user_id: string | null
          xero_invoice_id: string | null
          xero_transaction_id: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          member_id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          status: string
          transaction_date?: string
          transaction_type: string
          user_id?: string | null
          xero_invoice_id?: string | null
          xero_transaction_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          member_id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          status?: string
          transaction_date?: string
          transaction_type?: string
          user_id?: string | null
          xero_invoice_id?: string | null
          xero_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_detection_logs: {
        Row: {
          action_taken: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          risk_factors: Json | null
          risk_score: number | null
          transaction_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          risk_factors?: Json | null
          risk_score?: number | null
          transaction_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          risk_factors?: Json | null
          risk_score?: number | null
          transaction_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_detection_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "game_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      game_prize_pools: {
        Row: {
          created_at: string | null
          entries_count: number | null
          entry_fee: number
          game_id: string
          game_type: string
          id: string
          max_entries: number | null
          prize_distribution: Json | null
          status: string | null
          total_pool: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entries_count?: number | null
          entry_fee: number
          game_id: string
          game_type: string
          id?: string
          max_entries?: number | null
          prize_distribution?: Json | null
          status?: string | null
          total_pool?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entries_count?: number | null
          entry_fee?: number
          game_id?: string
          game_type?: string
          id?: string
          max_entries?: number | null
          prize_distribution?: Json | null
          status?: string | null
          total_pool?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      game_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          external_transaction_id: string | null
          game_id: string | null
          id: string
          metadata: Json | null
          payment_method_id: string | null
          session_id: string | null
          status: string
          transaction_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_transaction_id?: string | null
          game_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          session_id?: string | null
          status?: string
          transaction_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_transaction_id?: string | null
          game_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          session_id?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
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
      integration_webhooks: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          provider: string
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          provider: string
          type: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          provider?: string
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
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
          member_id: string
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
          member_id: string
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
          member_id?: string
          membership_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_agreements: {
        Row: {
          created_at: string
          document_url: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          metadata: Json | null
          name: string
          partner_id: string
          signed_at: string | null
          status: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          metadata?: Json | null
          name: string
          partner_id: string
          signed_at?: string | null
          status?: string
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          document_url?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          partner_id?: string
          signed_at?: string | null
          status?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_agreements_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_communications: {
        Row: {
          content: string
          id: string
          metadata: Json | null
          partner_id: string
          sent_at: string
          sent_by: string | null
          subject: string
          type: Database["public"]["Enums"]["communication_type"]
        }
        Insert: {
          content: string
          id?: string
          metadata?: Json | null
          partner_id: string
          sent_at?: string
          sent_by?: string | null
          subject: string
          type: Database["public"]["Enums"]["communication_type"]
        }
        Update: {
          content?: string
          id?: string
          metadata?: Json | null
          partner_id?: string
          sent_at?: string
          sent_by?: string | null
          subject?: string
          type?: Database["public"]["Enums"]["communication_type"]
        }
        Relationships: [
          {
            foreignKeyName: "partner_communications_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string
          id: string
          images: Json | null
          metadata: Json | null
          name: string
          partner_id: string
          price: number
          quantity: number
          shipping_info: Json | null
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description: string
          id?: string
          images?: Json | null
          metadata?: Json | null
          name: string
          partner_id: string
          price: number
          quantity: number
          shipping_info?: Json | null
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          images?: Json | null
          metadata?: Json | null
          name?: string
          partner_id?: string
          price?: number
          quantity?: number
          shipping_info?: Json | null
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_products_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          address: string | null
          assigned_to: string | null
          city: string | null
          company_name: string
          contact_name: string
          country: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          metadata: Json | null
          notes: string | null
          onboarding_stage: Database["public"]["Enums"]["onboarding_stage"]
          phone: string | null
          postal_code: string | null
          state: string | null
          status: Database["public"]["Enums"]["partner_status"]
          tax_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          city?: string | null
          company_name: string
          contact_name: string
          country?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          onboarding_stage?: Database["public"]["Enums"]["onboarding_stage"]
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          tax_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          city?: string | null
          company_name?: string
          contact_name?: string
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          onboarding_stage?: Database["public"]["Enums"]["onboarding_stage"]
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          tax_id?: string | null
          updated_at?: string
          website?: string | null
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
      payment_methods: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last_four: string | null
          metadata: Json | null
          method_type: string
          provider: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_four?: string | null
          metadata?: Json | null
          method_type: string
          provider: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_four?: string | null
          metadata?: Json | null
          method_type?: string
          provider?: string
          updated_at?: string | null
          user_id?: string | null
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
          member_id: string
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
          member_id: string
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
          member_id?: string
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
          address_line1: string | null
          address_line2: string | null
          age_group: Database["public"]["Enums"]["age_group"] | null
          avatar_url: string | null
          bio: string | null
          categories_played: string[] | null
          city: string | null
          clerk_user_id: string | null
          country: string | null
          created_at: string | null
          credits: number | null
          custom_gender: string | null
          date_of_birth: string | null
          email: string | null
          email_change_new_email: string | null
          email_change_token: string | null
          email_change_token_expires_at: string | null
          failed_login_attempts: number | null
          full_name: string | null
          gender: string | null
          id: string
          last_password_change: string | null
          last_sign_in: string | null
          marketing_opt_in: boolean | null
          member_id: string
          phone: string | null
          postal_code: string | null
          role: string | null
          security_questions: Json | null
          state: string | null
          tax_id: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          tokens: number
          two_factor_enabled: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          account_locked?: boolean | null
          active_sessions?: Json | null
          address_line1?: string | null
          address_line2?: string | null
          age_group?: Database["public"]["Enums"]["age_group"] | null
          avatar_url?: string | null
          bio?: string | null
          categories_played?: string[] | null
          city?: string | null
          clerk_user_id?: string | null
          country?: string | null
          created_at?: string | null
          credits?: number | null
          custom_gender?: string | null
          date_of_birth?: string | null
          email?: string | null
          email_change_new_email?: string | null
          email_change_token?: string | null
          email_change_token_expires_at?: string | null
          failed_login_attempts?: number | null
          full_name?: string | null
          gender?: string | null
          id: string
          last_password_change?: string | null
          last_sign_in?: string | null
          marketing_opt_in?: boolean | null
          member_id: string
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          security_questions?: Json | null
          state?: string | null
          tax_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          tokens?: number
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          account_locked?: boolean | null
          active_sessions?: Json | null
          address_line1?: string | null
          address_line2?: string | null
          age_group?: Database["public"]["Enums"]["age_group"] | null
          avatar_url?: string | null
          bio?: string | null
          categories_played?: string[] | null
          city?: string | null
          clerk_user_id?: string | null
          country?: string | null
          created_at?: string | null
          credits?: number | null
          custom_gender?: string | null
          date_of_birth?: string | null
          email?: string | null
          email_change_new_email?: string | null
          email_change_token?: string | null
          email_change_token_expires_at?: string | null
          failed_login_attempts?: number | null
          full_name?: string | null
          gender?: string | null
          id?: string
          last_password_change?: string | null
          last_sign_in?: string | null
          marketing_opt_in?: boolean | null
          member_id?: string
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          security_questions?: Json | null
          state?: string | null
          tax_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          tokens?: number
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
          member_id: string
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
          member_id: string
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
          member_id?: string
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
          member_id: string
          player_id: string
          player_name: string | null
          puzzle_id: string
          time_seconds: number
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          player_id: string
          player_name?: string | null
          puzzle_id: string
          time_seconds: number
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
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
          member_id: string
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
          member_id: string
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
          member_id?: string
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
      role_hierarchy: {
        Row: {
          child_role: Database["public"]["Enums"]["user_role"]
          created_at: string
          parent_role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          child_role: Database["public"]["Enums"]["user_role"]
          created_at?: string
          parent_role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          child_role?: Database["public"]["Enums"]["user_role"]
          created_at?: string
          parent_role?: Database["public"]["Enums"]["user_role"]
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
      security_audit_logs: {
        Row: {
          created_at: string
          details: Json | null
          email: string | null
          event_type: string
          id: string
          ip_address: string | null
          member_id: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          email?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          member_id?: string | null
          severity: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          email?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          member_id?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          page_id: string
          published_at: string | null
          section_id: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          page_id: string
          published_at?: string | null
          section_id: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          page_id?: string
          published_at?: string | null
          section_id?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
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
          member_id: string | null
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
          member_id?: string | null
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
          member_id?: string | null
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
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          credits: number | null
          email: string
          id: string
          member_id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
          xero_customer_id: string | null
        }
        Insert: {
          created_at?: string
          credits?: number | null
          email: string
          id?: string
          member_id: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
          xero_customer_id?: string | null
        }
        Update: {
          created_at?: string
          credits?: number | null
          email?: string
          id?: string
          member_id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
          xero_customer_id?: string | null
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          created_at: string
          direction: string
          error_message: string | null
          id: string
          integration: string
          record_id: string
          record_type: string
          status: string
        }
        Insert: {
          created_at?: string
          direction: string
          error_message?: string | null
          id?: string
          integration: string
          record_id: string
          record_type: string
          status: string
        }
        Update: {
          created_at?: string
          direction?: string
          error_message?: string | null
          id?: string
          integration?: string
          record_id?: string
          record_type?: string
          status?: string
        }
        Relationships: []
      }
      tetris_high_scores: {
        Row: {
          created_at: string
          duration: number
          id: string
          level: number
          lines: number
          score: number
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          duration: number
          id?: string
          level: number
          lines: number
          score: number
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          duration?: number
          id?: string
          level?: number
          lines?: number
          score?: number
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          assigned_to: string | null
          comments: Json | null
          created_at: string
          created_by: string
          description: string
          id: string
          member_id: string
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
          member_id: string
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
          member_id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          title?: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          admin_user_id: string | null
          amount: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          puzzle_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          admin_user_id?: string | null
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          puzzle_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          admin_user_id?: string | null
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          puzzle_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_transactions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_transactions_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_receipts: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          receipt_data: Json | null
          receipt_number: string
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          receipt_data?: Json | null
          receipt_number: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          receipt_data?: Json | null
          receipt_number?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_receipts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "game_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      trivia_leaderboard: {
        Row: {
          average_time: number
          category_id: string | null
          correct_answers: number
          created_at: string
          id: string
          quiz_date: string
          total_questions: number
          total_score: number
          user_id: string | null
          username: string
        }
        Insert: {
          average_time: number
          category_id?: string | null
          correct_answers: number
          created_at?: string
          id?: string
          quiz_date?: string
          total_questions: number
          total_score: number
          user_id?: string | null
          username: string
        }
        Update: {
          average_time?: number
          category_id?: string | null
          correct_answers?: number
          created_at?: string
          id?: string
          quiz_date?: string
          total_questions?: number
          total_score?: number
          user_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "trivia_leaderboard_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "trivia_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_questions: {
        Row: {
          category_id: string | null
          correct_answer: string
          created_at: string
          created_by: string | null
          difficulty: string
          explanation: string | null
          id: string
          is_active: boolean
          question: string
          time_limit: number
          updated_at: string
          wrong_answers: string[]
        }
        Insert: {
          category_id?: string | null
          correct_answer: string
          created_at?: string
          created_by?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          is_active?: boolean
          question: string
          time_limit?: number
          updated_at?: string
          wrong_answers?: string[]
        }
        Update: {
          category_id?: string | null
          correct_answer?: string
          created_at?: string
          created_by?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          is_active?: boolean
          question?: string
          time_limit?: number
          updated_at?: string
          wrong_answers?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "trivia_questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "trivia_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_quiz_answers: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean
          question_id: string | null
          selected_answer: string
          session_id: string | null
          time_bonus: number
          time_taken: number
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct: boolean
          question_id?: string | null
          selected_answer: string
          session_id?: string | null
          time_bonus?: number
          time_taken: number
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string | null
          selected_answer?: string
          session_id?: string | null
          time_bonus?: number
          time_taken?: number
        }
        Relationships: [
          {
            foreignKeyName: "trivia_quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "trivia_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trivia_quiz_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "trivia_quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_quiz_sessions: {
        Row: {
          category_id: string | null
          completed_at: string | null
          correct_answers: number
          created_at: string
          current_question: number
          id: string
          score: number
          session_data: Json | null
          started_at: string
          status: string
          time_bonus: number
          total_questions: number
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          current_question?: number
          id?: string
          score?: number
          session_data?: Json | null
          started_at?: string
          status?: string
          time_bonus?: number
          total_questions?: number
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          current_question?: number
          id?: string
          score?: number
          session_data?: Json | null
          started_at?: string
          status?: string
          time_bonus?: number
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trivia_quiz_sessions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "trivia_categories"
            referencedColumns: ["id"]
          },
        ]
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
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          address_type: string
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean | null
          member_id: string
          postal_code: string
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          address_type: string
          city: string
          country: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          member_id: string
          postal_code: string
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          address_type?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          member_id?: string
          postal_code?: string
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_membership_details: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          end_date: string | null
          id: string
          member_id: string
          membership_id: string | null
          notes: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          end_date?: string | null
          id?: string
          member_id: string
          membership_id?: string | null
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          end_date?: string | null
          id?: string
          member_id?: string
          membership_id?: string | null
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_membership_details_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      user_payment_methods: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          last_used: string | null
          member_id: string
          method_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_used?: string | null
          member_id: string
          method_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_used?: string | null
          member_id?: string
          method_type?: string
          updated_at?: string | null
          user_id?: string
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
      user_segments: {
        Row: {
          count: number
          created_at: string | null
          created_by: string | null
          filters: Json
          id: string
          name: string
        }
        Insert: {
          count?: number
          created_at?: string | null
          created_by?: string | null
          filters?: Json
          id?: string
          name: string
        }
        Update: {
          count?: number
          created_at?: string | null
          created_by?: string | null
          filters?: Json
          id?: string
          name?: string
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
          member_id: string
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
          member_id: string
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
          member_id?: string
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          event_type: string | null
          id: string
          processed: boolean | null
          provider: string
          raw_data: Json | null
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          id?: string
          processed?: boolean | null
          provider: string
          raw_data?: Json | null
        }
        Update: {
          created_at?: string
          event_type?: string | null
          id?: string
          processed?: boolean | null
          provider?: string
          raw_data?: Json | null
        }
        Relationships: []
      }
      word_search_leaderboard: {
        Row: {
          category: string
          completion_time_seconds: number
          created_at: string
          difficulty: string
          hints_used: number
          id: string
          incorrect_selections: number
          player_id: string
          player_name: string
          score: number
          total_words: number
          words_found: number
        }
        Insert: {
          category?: string
          completion_time_seconds: number
          created_at?: string
          difficulty?: string
          hints_used?: number
          id?: string
          incorrect_selections?: number
          player_id: string
          player_name: string
          score?: number
          total_words: number
          words_found: number
        }
        Update: {
          category?: string
          completion_time_seconds?: number
          created_at?: string
          difficulty?: string
          hints_used?: number
          id?: string
          incorrect_selections?: number
          player_id?: string
          player_name?: string
          score?: number
          total_words?: number
          words_found?: number
        }
        Relationships: []
      }
      xero_account_link: {
        Row: {
          created_at: string
          id: string
          last_synced: string | null
          status: string | null
          sync_status: string | null
          user_id: string
          xero_account_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_synced?: string | null
          status?: string | null
          sync_status?: string | null
          user_id: string
          xero_account_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_synced?: string | null
          status?: string | null
          sync_status?: string | null
          user_id?: string
          xero_account_id?: string
        }
        Relationships: []
      }
      xero_accounts: {
        Row: {
          code: string
          created_at: string
          id: string
          last_synced: string
          name: string
          raw_data: Json | null
          status: string
          type: string
          xero_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          last_synced?: string
          name: string
          raw_data?: Json | null
          status: string
          type: string
          xero_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          last_synced?: string
          name?: string
          raw_data?: Json | null
          status?: string
          type?: string
          xero_id?: string
        }
        Relationships: []
      }
      xero_bills: {
        Row: {
          bill_number: string
          created_at: string
          date: string
          due_date: string | null
          id: string
          last_synced: string
          raw_data: Json | null
          status: string
          total: number
          vendor_name: string | null
          xero_id: string
        }
        Insert: {
          bill_number: string
          created_at?: string
          date: string
          due_date?: string | null
          id?: string
          last_synced?: string
          raw_data?: Json | null
          status: string
          total: number
          vendor_name?: string | null
          xero_id: string
        }
        Update: {
          bill_number?: string
          created_at?: string
          date?: string
          due_date?: string | null
          id?: string
          last_synced?: string
          raw_data?: Json | null
          status?: string
          total?: number
          vendor_name?: string | null
          xero_id?: string
        }
        Relationships: []
      }
      xero_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_customer: boolean | null
          is_supplier: boolean | null
          last_synced: string
          name: string
          phone: string | null
          raw_data: Json | null
          status: string | null
          xero_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_customer?: boolean | null
          is_supplier?: boolean | null
          last_synced?: string
          name: string
          phone?: string | null
          raw_data?: Json | null
          status?: string | null
          xero_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_customer?: boolean | null
          is_supplier?: boolean | null
          last_synced?: string
          name?: string
          phone?: string | null
          raw_data?: Json | null
          status?: string | null
          xero_id?: string
        }
        Relationships: []
      }
      xero_integration_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      xero_invoices: {
        Row: {
          contact_name: string | null
          created_at: string
          date: string
          due_date: string | null
          id: string
          invoice_number: string
          last_synced: string
          raw_data: Json | null
          status: string
          total: number
          xero_id: string
        }
        Insert: {
          contact_name?: string | null
          created_at?: string
          date: string
          due_date?: string | null
          id?: string
          invoice_number: string
          last_synced?: string
          raw_data?: Json | null
          status: string
          total: number
          xero_id: string
        }
        Update: {
          contact_name?: string | null
          created_at?: string
          date?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          last_synced?: string
          raw_data?: Json | null
          status?: string
          total?: number
          xero_id?: string
        }
        Relationships: []
      }
      xero_oauth_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string
          scope: string | null
          tenant_id: string
          token_type: string
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          refresh_token: string
          scope?: string | null
          tenant_id: string
          token_type?: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string
          scope?: string | null
          tenant_id?: string
          token_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      xero_transactions: {
        Row: {
          account_code: string | null
          amount: number
          contact_name: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          last_synced: string
          raw_data: Json | null
          type: string
          xero_id: string
        }
        Insert: {
          account_code?: string | null
          amount: number
          contact_name?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          last_synced?: string
          raw_data?: Json | null
          type: string
          xero_id: string
        }
        Update: {
          account_code?: string | null
          amount?: number
          contact_name?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          last_synced?: string
          raw_data?: Json | null
          type?: string
          xero_id?: string
        }
        Relationships: []
      }
      xero_user_mappings: {
        Row: {
          created_at: string
          id: string
          last_synced: string | null
          sync_status: string | null
          user_id: string
          xero_contact_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_synced?: string | null
          sync_status?: string | null
          user_id: string
          xero_contact_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_synced?: string | null
          sync_status?: string | null
          user_id?: string
          xero_contact_id?: string
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
        Relationships: []
      }
    }
    Functions: {
      award_credits: {
        Args: {
          target_user_id: string
          credits_to_add: number
          admin_note?: string
        }
        Returns: undefined
      }
      award_tokens: {
        Args: {
          target_user_id: string
          tokens_to_add: number
          admin_note?: string
        }
        Returns: undefined
      }
      calculate_daily_metrics: {
        Args: { date_param: string }
        Returns: {
          active_users: number
          new_signups: number
          puzzles_completed: number
          revenue: number
          total_users: number
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
      get_current_clerk_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
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
      get_email_analytics: {
        Args: {
          start_date: string
          end_date: string
          campaign_id_param?: string
        }
        Returns: {
          sent: number
          delivered: number
          opened: number
          clicked: number
          delivery_rate: number
          open_rate: number
          click_rate: number
          bounce_rate: number
          mobile_pct: number
          desktop_pct: number
          webmail_pct: number
          other_pct: number
        }[]
      }
      get_member_financial_summary: {
        Args: { member_id_param: string }
        Returns: {
          total_spend: number
          total_prizes: number
          membership_revenue: number
          puzzle_revenue: number
          last_payment_date: string
          membership_status: string
          xero_contact_id: string
          membership_end_date: string
          lifetime_value: number
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
      get_role_inherits_from: {
        Args: {
          user_role: Database["public"]["Enums"]["user_role"]
          parent_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
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
        Args:
          | { permission_name: string }
          | { user_id: string; permission_name: string }
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
      spend_tokens: {
        Args: {
          spending_user_id: string
          tokens_to_spend: number
          target_puzzle_id?: string
          spend_description?: string
        }
        Returns: boolean
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
      communication_type: "email" | "call" | "meeting" | "note"
      content_status: "draft" | "published"
      feedback_type: "bug" | "suggestion" | "question" | "other"
      issue_status: "wip" | "completed" | "deferred"
      note_status: "wip" | "completed"
      onboarding_stage:
        | "invited"
        | "registration_started"
        | "registration_completed"
        | "documents_pending"
        | "documents_submitted"
        | "contract_sent"
        | "contract_signed"
        | "approved"
        | "rejected"
      partner_status: "prospect" | "active" | "inactive" | "suspended"
      product_status: "draft" | "pending_approval" | "approved" | "rejected"
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
      communication_type: ["email", "call", "meeting", "note"],
      content_status: ["draft", "published"],
      feedback_type: ["bug", "suggestion", "question", "other"],
      issue_status: ["wip", "completed", "deferred"],
      note_status: ["wip", "completed"],
      onboarding_stage: [
        "invited",
        "registration_started",
        "registration_completed",
        "documents_pending",
        "documents_submitted",
        "contract_sent",
        "contract_signed",
        "approved",
        "rejected",
      ],
      partner_status: ["prospect", "active", "inactive", "suspended"],
      product_status: ["draft", "pending_approval", "approved", "rejected"],
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

-- Apply corrected RLS policies migration
-- This migration adds comprehensive RLS policies for all tables

-- Enable RLS on tables that don't have it yet
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE beta_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_prize_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_detection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for auth_rate_limits (admin only)
CREATE POLICY "Admins can manage auth rate limits" ON auth_rate_limits
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]));

-- Add RLS policies for beta_notes
CREATE POLICY "Users can manage their own beta notes" ON beta_notes
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all beta notes" ON beta_notes
FOR SELECT USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]));

-- Add RLS policies for category_managers
CREATE POLICY "Admins can manage category managers" ON category_managers
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]));

CREATE POLICY "Category managers can view their assignments" ON category_managers
FOR SELECT USING (auth.uid() = user_id);

-- Add RLS policies for commission_payments
CREATE POLICY "Admins can manage commission payments" ON commission_payments
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role, 'cfo'::user_role]));

CREATE POLICY "Managers can view their own commissions" ON commission_payments
FOR SELECT USING (auth.uid() = manager_id);

-- Add RLS policies for email_campaigns
CREATE POLICY "Admins can manage email campaigns" ON email_campaigns
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role, 'social_media_manager'::user_role]));

-- Add RLS policies for game_transactions
CREATE POLICY "Users can view their own game transactions" ON game_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game transactions" ON game_transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all game transactions" ON game_transactions
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]));

-- Add RLS policies for game_prize_pools
CREATE POLICY "Public can view active prize pools" ON game_prize_pools
FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage prize pools" ON game_prize_pools
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]));

-- Add RLS policies for image_files
CREATE POLICY "Admins can manage image files" ON image_files
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role, 'category_manager'::user_role]));

CREATE POLICY "Public can view processed images" ON image_files
FOR SELECT USING (processing_status = 'completed');

-- Add RLS policies for memberships
CREATE POLICY "Users can view their own memberships" ON memberships
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memberships" ON memberships
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all memberships" ON memberships
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]));

-- Add RLS policies for partner_products (using correct enum values)
CREATE POLICY "Admins can manage partner products" ON partner_products
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role, 'partner_manager'::user_role]));

CREATE POLICY "Public can view active partner products" ON partner_products
FOR SELECT USING (status = 'active');

-- Add RLS policies for fraud_detection_logs
CREATE POLICY "Admins can view fraud detection logs" ON fraud_detection_logs
FOR SELECT USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]));

CREATE POLICY "System can insert fraud detection logs" ON fraud_detection_logs
FOR INSERT WITH CHECK (true);

-- Add RLS policies for email_engagement
CREATE POLICY "Admins can manage email engagement" ON email_engagement
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role, 'social_media_manager'::user_role]));

-- Add RLS policies for invoice_templates
CREATE POLICY "Admins can manage invoice templates" ON invoice_templates
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role, 'cfo'::user_role]));
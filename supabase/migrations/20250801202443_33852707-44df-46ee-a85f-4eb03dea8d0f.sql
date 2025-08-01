-- Additional RLS Policies for Remaining Tables (Fixed)

-- Enable RLS on tables that don't have it
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_managers ENABLE ROW LEVEL SECURITY;

-- Auth rate limits - system only
CREATE POLICY "System can manage auth rate limits" 
ON public.auth_rate_limits 
FOR ALL 
USING (true);

-- Beta notes - users can manage their own, admins can view all
CREATE POLICY "Users can manage their own beta notes" 
ON public.beta_notes 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all beta notes" 
ON public.beta_notes 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Category managers - admin only
CREATE POLICY "Admins can manage category managers" 
ON public.category_managers 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Commission payments - admin and CFO only
CREATE POLICY "Financial managers can view commission payments" 
ON public.commission_payments 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

CREATE POLICY "Admins can manage commission payments" 
ON public.commission_payments 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Email campaigns - social media managers
CREATE POLICY "Social media managers can manage email campaigns" 
ON public.email_campaigns 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'social_media_manager'));

-- Email analytics - read only for managers
CREATE POLICY "Managers can view email analytics" 
ON public.email_analytics 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'social_media_manager'));

-- Email templates - social media managers
CREATE POLICY "Social media managers can manage email templates" 
ON public.email_templates 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'social_media_manager'));

-- Game transactions - users can view their own
CREATE POLICY "Users can view their own game transactions" 
ON public.game_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert game transactions" 
ON public.game_transactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all game transactions" 
ON public.game_transactions 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

-- Game prize pools - public read, admin write
CREATE POLICY "Public can view active prize pools" 
ON public.game_prize_pools 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admins can manage prize pools" 
ON public.game_prize_pools 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Image files - admin only
CREATE POLICY "Admins can manage image files" 
ON public.image_files 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'category_manager'));

-- Memberships - users can view their own
CREATE POLICY "Users can view their own membership" 
ON public.memberships 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all memberships" 
ON public.memberships 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

-- Partner communications - partner managers only
CREATE POLICY "Partner managers can manage communications" 
ON public.partner_communications 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'partner_manager'));

-- Partner products - partner managers (using correct enum values)
CREATE POLICY "Public can view approved partner products" 
ON public.partner_products 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Partner managers can manage products" 
ON public.partner_products 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'partner_manager'));

-- Partner agreements - partner managers only
CREATE POLICY "Partner managers can manage agreements" 
ON public.partner_agreements 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'partner_manager'));

-- Password reset attempts - system only
CREATE POLICY "System can manage password reset attempts" 
ON public.password_reset_attempts 
FOR ALL 
USING (true);

-- Permissions - admin only
CREATE POLICY "Admins can view permissions" 
ON public.permissions 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Role permissions - admin only
CREATE POLICY "Admins can view role permissions" 
ON public.role_permissions 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Role hierarchy - admin only
CREATE POLICY "Admins can view role hierarchy" 
ON public.role_hierarchy 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Site settings - admin only
CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Progress items - admin only
CREATE POLICY "Admins can manage progress items" 
ON public.progress_items 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Progress comments - admin only
CREATE POLICY "Admins can manage progress comments" 
ON public.progress_comments 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Site income/expenses - financial managers only
CREATE POLICY "Financial managers can view site income" 
ON public.site_income 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

CREATE POLICY "Financial managers can manage site income" 
ON public.site_income 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

CREATE POLICY "Financial managers can view site expenses" 
ON public.site_expenses 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

CREATE POLICY "Financial managers can manage site expenses" 
ON public.site_expenses 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

-- Category revenue - financial managers only
CREATE POLICY "Financial managers can view category revenue" 
ON public.category_revenue 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

CREATE POLICY "System can insert category revenue" 
ON public.category_revenue 
FOR INSERT 
WITH CHECK (true);

-- Puzzle JS files - admin only
CREATE POLICY "Admins can manage puzzle JS files" 
ON public.puzzle_js_files 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'category_manager'));

-- Fraud detection logs - admin only
CREATE POLICY "Admins can view fraud logs" 
ON public.fraud_detection_logs 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "System can insert fraud logs" 
ON public.fraud_detection_logs 
FOR INSERT 
WITH CHECK (true);

-- Tetris high scores - public leaderboard
CREATE POLICY "Public can view tetris scores" 
ON public.tetris_high_scores 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own scores" 
ON public.tetris_high_scores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Email engagement/analytics tables
CREATE POLICY "Managers can view email engagement" 
ON public.email_engagement 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'social_media_manager'));

CREATE POLICY "System can insert email engagement" 
ON public.email_engagement 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Managers can view email link clicks" 
ON public.email_link_clicks 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'social_media_manager'));

CREATE POLICY "System can insert email link clicks" 
ON public.email_link_clicks 
FOR INSERT 
WITH CHECK (true);

-- Integration webhooks - admin only
CREATE POLICY "Admins can manage integration webhooks" 
ON public.integration_webhooks 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Invoice templates - admin only
CREATE POLICY "Admins can manage invoice templates" 
ON public.invoice_templates 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

-- Sync logs - admin only
CREATE POLICY "Admins can view sync logs" 
ON public.sync_logs 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "System can insert sync logs" 
ON public.sync_logs 
FOR INSERT 
WITH CHECK (true);

-- Membership stats - admin read only
CREATE POLICY "Admins can view membership stats" 
ON public.membership_stats 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));
-- Critical RLS Policies for Essential Tables

-- Profiles table - users can read/update their own profile only
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Jigsaw puzzles - public read for active, admin write
CREATE POLICY "Public can view active puzzles" 
ON public.jigsaw_puzzles 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage all puzzles" 
ON public.jigsaw_puzzles 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'category_manager'));

-- Jigsaw completions - users can manage their own
CREATE POLICY "Users can view their own completions" 
ON public.jigsaw_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions" 
ON public.jigsaw_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all completions" 
ON public.jigsaw_completions 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Game sessions - users can manage their own
CREATE POLICY "Users can manage their own game sessions" 
ON public.jigsaw_game_sessions 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all game sessions" 
ON public.jigsaw_game_sessions 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Puzzle configs - admin only
CREATE POLICY "Admins can manage puzzle configs" 
ON public.jigsaw_puzzle_configs 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'category_manager'));

-- Puzzle images - public read, admin write
CREATE POLICY "Public can view puzzle images" 
ON public.jigsaw_puzzle_images 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage puzzle images" 
ON public.jigsaw_puzzle_images 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'category_manager'));

-- Financial transactions - restricted access
CREATE POLICY "Admins can view financial transactions" 
ON public.financial_transactions 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

CREATE POLICY "Users can view their own transactions" 
ON public.financial_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage financial transactions" 
ON public.financial_transactions 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));

-- Token transactions - users can view their own
CREATE POLICY "Users can view their own token transactions" 
ON public.token_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all token transactions" 
ON public.token_transactions 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "System can insert token transactions" 
ON public.token_transactions 
FOR INSERT 
WITH CHECK (true);

-- Payment methods - users can manage their own
CREATE POLICY "Users can manage their own payment methods" 
ON public.payment_methods 
FOR ALL 
USING (auth.uid() = user_id);

-- Prize winners - public read, admin write
CREATE POLICY "Public can view prize winners" 
ON public.prize_winners 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert prize winners" 
ON public.prize_winners 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage prize winners" 
ON public.prize_winners 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Security audit logs - admin only
CREATE POLICY "Admins can view security logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "System can insert security logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Feedback - users can create, admins can manage
CREATE POLICY "Users can create feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" 
ON public.feedback 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all feedback" 
ON public.feedback 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Site content - admin only
CREATE POLICY "Public can view published content" 
ON public.site_content 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage all content" 
ON public.site_content 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'social_media_manager'));

-- Issues/tickets - restricted access
CREATE POLICY "Admins can manage issues" 
ON public.issues 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins can manage tickets" 
ON public.tickets 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin'));

-- Partner management - admin only
CREATE POLICY "Partner managers can view partners" 
ON public.partners 
FOR SELECT 
USING (get_current_user_role() IN ('admin', 'super_admin', 'partner_manager'));

CREATE POLICY "Partner managers can manage partners" 
ON public.partners 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'partner_manager'));

-- Subscribers - users can view their own, admins can manage
CREATE POLICY "Users can view their own subscription" 
ON public.subscribers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" 
ON public.subscribers 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'super_admin', 'cfo'));
-- Enable RLS on tables that are missing it
ALTER TABLE public.progress_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzle_progress ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for existing tables
CREATE POLICY "Admin users can manage progress items" ON public.progress_items
  FOR ALL USING (get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin', 'admin']));

CREATE POLICY "Admins can manage puzzles" ON public.puzzles
  FOR ALL USING (get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin', 'admin', 'category_manager']));

CREATE POLICY "Everyone can view published puzzles" ON public.puzzles
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own puzzle progress" ON public.puzzle_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all puzzle progress" ON public.puzzle_progress
  FOR SELECT USING (get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin', 'admin']));
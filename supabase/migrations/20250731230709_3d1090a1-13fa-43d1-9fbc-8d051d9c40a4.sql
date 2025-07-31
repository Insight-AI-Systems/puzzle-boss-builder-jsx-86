-- Fix remaining security issues from linter

-- 1. Enable RLS on tables missing it (from linter errors)
ALTER TABLE IF EXISTS public.membership_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for membership_stats if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'membership_stats') THEN
    CREATE POLICY "Admins can view membership stats" 
    ON public.membership_stats FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin', 'cfo')
      )
    );
  END IF;
END $$;

-- 2. Fix remaining functions with mutable search_path (most critical ones)
-- These functions need SET search_path for security

CREATE OR REPLACE FUNCTION public.update_puzzle_progress_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_puzzle_settings_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_ticket_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_content_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update the profile email when auth.users email changes
  UPDATE public.profiles 
  SET email = NEW.email
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_progress_item_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_email(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    user_email TEXT;
BEGIN
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = user_id;
    
    RETURN user_email;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_puzzle_stats(puzzle_id uuid)
RETURNS TABLE(total_plays integer, avg_completion_time numeric, fastest_time numeric, completion_rate numeric)
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(pc.id) AS total_plays,
    AVG(pc.completion_time) AS avg_completion_time,
    MIN(pc.completion_time) AS fastest_time,
    (SUM(CASE WHEN pc.is_winner THEN 1 ELSE 0 END)::NUMERIC / NULLIF(COUNT(pc.id), 0))::NUMERIC AS completion_rate
  FROM 
    puzzle_completions pc
  WHERE 
    pc.puzzle_id = get_puzzle_stats.puzzle_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_role_inherits_from(user_role user_role, parent_role user_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Direct match
  IF user_role = parent_role THEN
    RETURN TRUE;
  END IF;
  
  -- Check hierarchy
  RETURN EXISTS (
    WITH RECURSIVE role_tree AS (
      -- Base case: direct children
      SELECT child_role, parent_role
      FROM public.role_hierarchy
      WHERE child_role = user_role
      
      UNION ALL
      
      -- Recursive case: ancestors
      SELECT rh.child_role, rh.parent_role
      FROM public.role_hierarchy rh
      JOIN role_tree rt ON rt.parent_role = rh.child_role
    )
    SELECT 1 FROM role_tree WHERE parent_role = parent_role
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_daily_winners(date_param date)
RETURNS TABLE(id uuid, winner_name text, puzzle_name text, puzzle_image_url text, completion_time numeric, prize_value numeric, winner_country text, created_at timestamp with time zone)
LANGUAGE sql
SET search_path TO 'public'
AS $$
    SELECT 
        pw.id,
        p.username as winner_name,
        pw.puzzle_name,
        pw.puzzle_image_url,
        pw.completion_time,
        pw.prize_value,
        pw.winner_country,
        pw.created_at
    FROM prize_winners pw
    JOIN profiles p ON p.id = pw.user_id
    WHERE DATE(pw.created_at) = date_param
    ORDER BY pw.created_at DESC
    LIMIT 12;
$$;
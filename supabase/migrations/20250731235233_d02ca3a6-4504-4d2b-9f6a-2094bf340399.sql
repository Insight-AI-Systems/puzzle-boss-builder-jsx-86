-- Update RLS policies to work with Clerk JWT tokens
-- First, create a function to get the current Clerk user ID from the JWT
CREATE OR REPLACE FUNCTION public.get_current_clerk_user_id()
RETURNS TEXT AS $$
BEGIN
  -- Extract the Clerk user ID from the JWT subject claim
  RETURN auth.jwt() ->> 'sub';
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update profiles table to use clerk_user_id as the primary identifier
-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON public.profiles(clerk_user_id);

-- Update profiles RLS policies to work with Clerk authentication
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

-- Create new RLS policies using Clerk user ID
CREATE POLICY "Users can view their own profile via Clerk"
ON public.profiles FOR SELECT
USING (clerk_user_id = get_current_clerk_user_id());

CREATE POLICY "Users can update their own profile via Clerk"
ON public.profiles FOR UPDATE
USING (clerk_user_id = get_current_clerk_user_id());

CREATE POLICY "Users can create their own profile via Clerk"
ON public.profiles FOR INSERT
WITH CHECK (clerk_user_id = get_current_clerk_user_id());

-- Update other tables that reference user_id to work with Clerk
-- Update puzzle_progress table
DROP POLICY IF EXISTS "Users can view their own puzzle progress" ON public.puzzle_progress;
DROP POLICY IF EXISTS "Users can update their own puzzle progress" ON public.puzzle_progress;
DROP POLICY IF EXISTS "Users can create their own puzzle progress" ON public.puzzle_progress;

CREATE POLICY "Users can manage their puzzle progress via Clerk"
ON public.puzzle_progress FOR ALL
USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_user_id = get_current_clerk_user_id()));

-- Update puzzle_completions table
DROP POLICY IF EXISTS "Users can view their own completions" ON public.puzzle_completions;
DROP POLICY IF EXISTS "Users can create their own completions" ON public.puzzle_completions;

CREATE POLICY "Users can manage their completions via Clerk"
ON public.puzzle_completions FOR ALL
USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_user_id = get_current_clerk_user_id()));
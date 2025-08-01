-- Remove Clerk-specific database functions
DROP FUNCTION IF EXISTS public.get_current_clerk_user_id();
DROP FUNCTION IF EXISTS public.sync_clerk_users();

-- Remove clerk_user_id column from profiles table (after backing up the relationship)
-- First, ensure all profiles have the correct auth user id mapping
UPDATE public.profiles 
SET id = id -- This ensures the profile id matches the auth.users id
WHERE id IS NOT NULL;

-- Now remove the clerk_user_id column since we don't need it anymore
ALTER TABLE public.profiles DROP COLUMN IF EXISTS clerk_user_id;
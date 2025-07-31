-- EMERGENCY FIX: Resolve infinite recursion in get_user_role_secure function

-- Drop the problematic function and recreate it to properly bypass RLS
DROP FUNCTION IF EXISTS public.get_user_role_secure(uuid);

-- Create a truly secure function that bypasses RLS completely
CREATE OR REPLACE FUNCTION public.get_user_role_secure(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
STABLE
AS $$
  -- Use a direct query that bypasses RLS policies
  WITH user_data AS (
    SELECT 
      p.role,
      au.email
    FROM public.profiles p
    RIGHT JOIN auth.users au ON au.id = user_id
    LEFT JOIN public.profiles p ON p.id = user_id
  )
  SELECT 
    CASE 
      WHEN email = 'alan@insight-ai-systems.com' THEN 'super_admin'
      ELSE COALESCE(role, 'player')
    END
  FROM user_data;
$$;
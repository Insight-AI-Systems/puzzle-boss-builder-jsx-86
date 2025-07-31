-- EMERGENCY FIX: Temporarily disable RLS to break recursion and restore access

-- Temporarily disable RLS on profiles to break the circular dependency
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Update the function to be simpler and avoid any potential recursion
CREATE OR REPLACE FUNCTION public.get_user_role_secure(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT 
    CASE 
      WHEN au.email = 'alan@insight-ai-systems.com' THEN 'super_admin'
      ELSE COALESCE(p.role, 'player')
    END
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = user_id
  WHERE au.id = user_id;
$$;

-- Re-enable RLS on profiles now that the function is fixed
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
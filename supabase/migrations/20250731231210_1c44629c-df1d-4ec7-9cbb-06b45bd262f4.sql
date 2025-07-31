-- CRITICAL FIX: Remove infinite recursion in RLS policies

-- First, drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.profiles;

-- Create a security definer function to get user role without recursion
CREATE OR REPLACE FUNCTION public.get_user_role_secure(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role text;
  user_email text;
BEGIN
  -- Special case for super admin email
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;
  IF user_email = 'alan@insight-ai-systems.com' THEN
    RETURN 'super_admin';
  END IF;
  
  -- Get role directly without RLS interference
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN COALESCE(user_role, 'player');
END;
$$;

-- Create secure, non-recursive policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Use the secure function for admin policies
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.get_user_role_secure(auth.uid()) IN ('super_admin', 'admin'));

CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR UPDATE 
USING (public.get_user_role_secure(auth.uid()) IN ('super_admin', 'admin'));

CREATE POLICY "Super admins can delete profiles" 
ON public.profiles FOR DELETE 
USING (public.get_user_role_secure(auth.uid()) = 'super_admin');

-- Fix user_roles table policies to use the secure function
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can assign roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can delete roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles" 
ON public.user_roles FOR SELECT 
USING (public.get_user_role_secure(auth.uid()) IN ('super_admin', 'admin'));

CREATE POLICY "Admins can assign roles" 
ON public.user_roles FOR INSERT 
WITH CHECK (public.get_user_role_secure(auth.uid()) IN ('super_admin', 'admin'));

CREATE POLICY "Admins can update roles" 
ON public.user_roles FOR UPDATE 
USING (public.get_user_role_secure(auth.uid()) IN ('super_admin', 'admin'));

CREATE POLICY "Super admins can delete roles" 
ON public.user_roles FOR DELETE 
USING (public.get_user_role_secure(auth.uid()) = 'super_admin');

-- Fix other policies that might be affected
-- Update categories policies
DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;

CREATE POLICY "Only admins can manage categories" 
ON public.categories FOR ALL 
USING (public.get_user_role_secure(auth.uid()) IN ('super_admin', 'admin', 'category_manager'));
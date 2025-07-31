-- CRITICAL SECURITY FIXES - Phase 1: Database RLS Policies

-- 1. Fix profiles table RLS policies (CRITICAL)
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow profile access for Clerk users" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation for Clerk users" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile updates for Clerk users" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile deletion for Clerk users" ON public.profiles;

-- Create secure policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

-- Only super_admins can delete profiles
CREATE POLICY "Super admins can delete profiles" 
ON public.profiles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- 2. Create missing user_roles table and secure it
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create secure policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can assign roles" 
ON public.user_roles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can update roles" 
ON public.user_roles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Super admins can delete roles" 
ON public.user_roles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- 3. Secure xero_user_mappings table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'xero_user_mappings') THEN
    -- Enable RLS
    ALTER TABLE public.xero_user_mappings ENABLE ROW LEVEL SECURITY;
    
    -- Create secure policies
    CREATE POLICY "Admins can manage xero mappings" 
    ON public.xero_user_mappings FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin', 'cfo')
      )
    );
  END IF;
END $$;

-- 4. Fix database functions with SECURITY DEFINER (sample of critical ones)
-- Update get_current_user_role function to be more secure
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _role user_role;
  _special_admin_email TEXT := 'alan@insight-ai-systems.com';
  _user_email TEXT;
BEGIN
  -- Get the current user's email
  SELECT email INTO _user_email 
  FROM auth.users 
  WHERE id = auth.uid();
  
  -- Special case for protected admin
  IF _user_email = _special_admin_email THEN
    RETURN 'super_admin'::user_role;
  END IF;
  
  -- Get role from profiles
  SELECT role::user_role INTO _role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Default to player if no role found
  RETURN COALESCE(_role, 'player'::user_role);
END;
$$;

-- Update has_permission function
CREATE OR REPLACE FUNCTION public.has_permission(permission_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_role user_role;
BEGIN
  -- Get current user role
  _user_role := public.get_current_user_role();
  
  -- Check if user role has the specified permission
  RETURN EXISTS (
    SELECT 1 
    FROM public.role_permissions rp
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE p.name = permission_name
    AND rp.role = _user_role
  );
END;
$$;

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name user_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE id = user_id AND role::user_role = role_name
    );
$$;

-- Update is_admin function  
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE id = user_id AND (role = 'admin' OR role = 'super_admin')
    );
$$;
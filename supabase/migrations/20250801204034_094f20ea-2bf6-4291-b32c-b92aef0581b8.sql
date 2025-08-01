-- Fix profile creation for Clerk users
-- This ensures profiles are created when users sign up with Clerk

-- First, update the existing trigger to handle Clerk user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, role, clerk_user_id, member_id)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', NEW.email),
    CASE 
      WHEN NEW.email = 'alan@insight-ai-systems.com' THEN 'super_admin'
      ELSE 'player'
    END,
    NEW.id, -- Set clerk_user_id to the auth user id
    NEW.id  -- Set member_id to the auth user id as well
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    clerk_user_id = EXCLUDED.clerk_user_id,
    member_id = EXCLUDED.member_id,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to sync existing Clerk users who might not have profiles
CREATE OR REPLACE FUNCTION public.sync_clerk_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find auth users who don't have profiles
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.profiles p ON p.id = au.id
    WHERE p.id IS NULL
  LOOP
    -- Create missing profiles
    INSERT INTO public.profiles (id, email, username, role, clerk_user_id, member_id)
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.raw_user_meta_data ->> 'username', user_record.email),
      CASE 
        WHEN user_record.email = 'alan@insight-ai-systems.com' THEN 'super_admin'
        ELSE 'player'
      END,
      user_record.id,
      user_record.id
    );
  END LOOP;
END;
$$;

-- Run the sync function to create any missing profiles
SELECT public.sync_clerk_users();
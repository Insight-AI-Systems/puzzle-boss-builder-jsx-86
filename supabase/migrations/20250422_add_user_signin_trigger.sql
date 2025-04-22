
-- Create a function to handle user sign-ins
CREATE OR REPLACE FUNCTION public.handle_user_signin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET last_sign_in = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Add trigger to update last_sign_in timestamp when user logs in
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_signed_in'
  ) THEN
    CREATE TRIGGER on_auth_user_signed_in
      AFTER UPDATE OF last_sign_in_at ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_user_signin();
  END IF;
END
$$;

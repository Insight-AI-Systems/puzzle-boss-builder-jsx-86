-- Phase 1 security hardening: protect profiles updates and lock down product_images writes

-- 1) Prevent non-admins from changing sensitive profile fields
CREATE OR REPLACE FUNCTION public.prevent_non_admin_sensitive_profile_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow admins unrestricted updates
  IF public.is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  -- Block changes to sensitive columns by non-admins
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Updating role is not permitted';
  END IF;

  IF NEW.tokens IS DISTINCT FROM OLD.tokens THEN
    RAISE EXCEPTION 'Updating tokens is not permitted';
  END IF;

  IF NEW.credits IS DISTINCT FROM OLD.credits THEN
    RAISE EXCEPTION 'Updating credits is not permitted';
  END IF;

  IF NEW.account_locked IS DISTINCT FROM OLD.account_locked THEN
    RAISE EXCEPTION 'Updating account_locked is not permitted';
  END IF;

  IF NEW.failed_login_attempts IS DISTINCT FROM OLD.failed_login_attempts THEN
    RAISE EXCEPTION 'Updating failed_login_attempts is not permitted';
  END IF;

  IF NEW.member_id IS DISTINCT FROM OLD.member_id THEN
    RAISE EXCEPTION 'Updating member_id is not permitted';
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Updating id is not permitted';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_non_admin_sensitive_profile_updates ON public.profiles;
CREATE TRIGGER trg_prevent_non_admin_sensitive_profile_updates
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_non_admin_sensitive_profile_updates();

-- 2) Lock down world-writable product_images policies
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Remove permissive write policies
DROP POLICY IF EXISTS "Anyone can delete product images" ON public.product_images;
DROP POLICY IF EXISTS "Anyone can insert product images" ON public.product_images;
DROP POLICY IF EXISTS "Anyone can update product images" ON public.product_images;

-- Keep existing public SELECT policy as-is; add restricted write policies for authenticated admins/category managers
CREATE POLICY "Admins and category managers can insert product images"
ON public.product_images
FOR INSERT
TO authenticated
WITH CHECK (public.get_current_user_role() = ANY (ARRAY['admin'::user_role,'super_admin'::user_role,'category_manager'::user_role]));

CREATE POLICY "Admins and category managers can update product images"
ON public.product_images
FOR UPDATE
TO authenticated
USING (public.get_current_user_role() = ANY (ARRAY['admin'::user_role,'super_admin'::user_role,'category_manager'::user_role]))
WITH CHECK (public.get_current_user_role() = ANY (ARRAY['admin'::user_role,'super_admin'::user_role,'category_manager'::user_role]));

CREATE POLICY "Admins and category managers can delete product images"
ON public.product_images
FOR DELETE
TO authenticated
USING (public.get_current_user_role() = ANY (ARRAY['admin'::user_role,'super_admin'::user_role,'category_manager'::user_role]));
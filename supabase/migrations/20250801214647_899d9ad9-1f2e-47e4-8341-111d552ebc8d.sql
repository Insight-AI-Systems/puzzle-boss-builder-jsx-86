-- Update Alan's profile with the new Clerk user ID
UPDATE public.profiles 
SET 
  clerk_user_id = 'user_30hf60EkfbEWnuSowP3yUf8bifu',
  role = 'super_admin',
  updated_at = NOW()
WHERE id = 'd59a26d5-33d7-475b-95aa-7c0a1c03f6fc';
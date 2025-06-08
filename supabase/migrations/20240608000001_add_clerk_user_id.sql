
-- Add clerk_user_id column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;

-- Create index for better performance on clerk_user_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);

-- Update any existing profiles to use a generated UUID as member_id if null
UPDATE profiles SET member_id = gen_random_uuid() WHERE member_id IS NULL;

-- Enable RLS on puzzle_js_files table if not already enabled
ALTER TABLE puzzle_js_files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to puzzle JS files
-- These files are needed for the puzzle game to work for all users
CREATE POLICY "Allow public read access to puzzle JS files" 
ON puzzle_js_files 
FOR SELECT 
USING (true);

-- Create policy to allow admins to manage puzzle JS files
CREATE POLICY "Allow admins to manage puzzle JS files" 
ON puzzle_js_files 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]));
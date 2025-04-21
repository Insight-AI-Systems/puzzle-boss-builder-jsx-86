
import { supabase } from "@/integrations/supabase/client";

export const checkAndSetupPuzzleTable = async () => {
  // Check if the table exists by querying it
  const { error } = await supabase
    .from('puzzles')
    .select('id')
    .limit(1);

  // If error and the table doesn't exist, we should notify the user
  if (error && error.code === '42P01') { // 42P01 is PostgreSQL's error code for 'undefined_table'
    console.error('Puzzles table does not exist in the database:', error);
    return {
      exists: false,
      error: 'The puzzles table does not exist in your Supabase database. Please run the SQL migration to create it.'
    };
  } else if (error) {
    console.error('Error checking puzzles table:', error);
    return {
      exists: false, 
      error: `Error checking database: ${error.message}`
    };
  }

  return { exists: true };
};

export const getSqlForPuzzleTable = () => {
  return `
-- Create puzzles table
CREATE TABLE IF NOT EXISTS public.puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  difficulty TEXT DEFAULT 'medium',
  image_url TEXT NOT NULL,
  time_limit INTEGER DEFAULT 0,
  cost_per_play NUMERIC(10,2) DEFAULT 0,
  income_target NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  prize TEXT NOT NULL,
  prize_value NUMERIC(10,2) NOT NULL,
  puzzle_owner TEXT,
  supplier TEXT,
  completions INTEGER DEFAULT 0,
  avg_time INTEGER DEFAULT 0,
  release_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trigger to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_puzzles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_puzzles_updated_at
BEFORE UPDATE ON public.puzzles
FOR EACH ROW
EXECUTE FUNCTION update_puzzles_updated_at();

-- Add row level security
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;

-- Create policies for different roles
CREATE POLICY "Allow admins full access to puzzles" 
ON public.puzzles 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.role = 'super_admin')
  )
);

-- Let players view active puzzles
CREATE POLICY "Let players view active puzzles" 
ON public.puzzles 
FOR SELECT 
TO authenticated 
USING (status = 'active');
  `;
};

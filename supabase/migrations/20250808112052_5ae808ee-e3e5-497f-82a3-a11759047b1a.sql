-- Create leaderboard table for simple puzzle results
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  puzzle_slug TEXT NOT NULL,
  completion_time_seconds INTEGER NOT NULL CHECK (completion_time_seconds >= 0),
  moves INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reference profiles for user_id (avoid referencing auth.users)
ALTER TABLE public.leaderboard
  ADD CONSTRAINT leaderboard_user_fk
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;

-- Useful indexes for ranking queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_slug_time
  ON public.leaderboard (puzzle_slug, completion_time_seconds);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user
  ON public.leaderboard (user_id);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Public can view leaderboard
CREATE POLICY "Public can view leaderboard"
ON public.leaderboard
FOR SELECT
USING (true);

-- Authenticated users can insert their own results
CREATE POLICY "Users can insert their own leaderboard entries"
ON public.leaderboard
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Do not allow updates/deletes by default (no policies created)
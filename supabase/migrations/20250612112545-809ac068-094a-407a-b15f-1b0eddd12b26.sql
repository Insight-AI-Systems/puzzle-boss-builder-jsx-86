
-- Create word search leaderboard table
CREATE TABLE public.word_search_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES auth.users NOT NULL,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  completion_time_seconds NUMERIC NOT NULL,
  words_found INTEGER NOT NULL,
  total_words INTEGER NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'pro',
  category TEXT NOT NULL DEFAULT 'animals',
  incorrect_selections INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.word_search_leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view leaderboard entries
CREATE POLICY "Anyone can view word search leaderboard" 
  ON public.word_search_leaderboard 
  FOR SELECT 
  USING (true);

-- Create policy that allows users to insert their own scores
CREATE POLICY "Users can insert their own scores" 
  ON public.word_search_leaderboard 
  FOR INSERT 
  WITH CHECK (auth.uid() = player_id);

-- Enable realtime for the leaderboard table
ALTER TABLE public.word_search_leaderboard REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.word_search_leaderboard;

-- Create index for better query performance
CREATE INDEX idx_word_search_leaderboard_score ON public.word_search_leaderboard(score DESC, completion_time_seconds ASC);
CREATE INDEX idx_word_search_leaderboard_category_difficulty ON public.word_search_leaderboard(category, difficulty);

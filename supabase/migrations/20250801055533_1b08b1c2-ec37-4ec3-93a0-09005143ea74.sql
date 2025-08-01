-- Create jigsaw puzzles table
CREATE TABLE public.jigsaw_puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert')),
  piece_count INTEGER NOT NULL CHECK (piece_count >= 6 AND piece_count <= 2000),
  estimated_time_minutes INTEGER,
  price DECIMAL(10,2) DEFAULT 0.00,
  is_free BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create jigsaw puzzle images table
CREATE TABLE public.jigsaw_puzzle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puzzle_id UUID NOT NULL REFERENCES public.jigsaw_puzzles(id) ON DELETE CASCADE,
  original_image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  medium_image_url TEXT,
  large_image_url TEXT,
  image_width INTEGER,
  image_height INTEGER,
  file_size_bytes INTEGER,
  file_format TEXT,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create jigsaw puzzle configurations table
CREATE TABLE public.jigsaw_puzzle_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puzzle_id UUID NOT NULL REFERENCES public.jigsaw_puzzles(id) ON DELETE CASCADE,
  grid_rows INTEGER NOT NULL,
  grid_columns INTEGER NOT NULL,
  piece_shapes JSONB DEFAULT '{}',
  snap_tolerance INTEGER DEFAULT 20,
  rotation_enabled BOOLEAN DEFAULT false,
  shuffle_enabled BOOLEAN DEFAULT true,
  ghost_preview BOOLEAN DEFAULT true,
  hint_system_enabled BOOLEAN DEFAULT true,
  time_limit_minutes INTEGER,
  auto_save BOOLEAN DEFAULT true,
  sound_effects BOOLEAN DEFAULT true,
  background_color TEXT DEFAULT '#1a1a2e',
  border_style TEXT DEFAULT 'rounded',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create jigsaw game sessions table
CREATE TABLE public.jigsaw_game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  puzzle_id UUID NOT NULL REFERENCES public.jigsaw_puzzles(id),
  session_status TEXT DEFAULT 'active' CHECK (session_status IN ('active', 'paused', 'completed', 'abandoned')),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_time TIMESTAMP WITH TIME ZONE,
  total_time_seconds INTEGER DEFAULT 0,
  moves_count INTEGER DEFAULT 0,
  pieces_placed INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  save_data JSONB DEFAULT '{}',
  final_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create jigsaw completions table
CREATE TABLE public.jigsaw_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  puzzle_id UUID NOT NULL REFERENCES public.jigsaw_puzzles(id),
  session_id UUID NOT NULL REFERENCES public.jigsaw_game_sessions(id),
  completion_time_seconds INTEGER NOT NULL,
  total_moves INTEGER NOT NULL,
  hints_used INTEGER DEFAULT 0,
  final_score INTEGER,
  completion_percentage DECIMAL(5,2) DEFAULT 100.00,
  achievement_unlocked TEXT[],
  ranking_position INTEGER,
  is_personal_best BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jigsaw_puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jigsaw_puzzle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jigsaw_puzzle_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jigsaw_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jigsaw_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jigsaw_puzzles
CREATE POLICY "Everyone can view published puzzles" ON public.jigsaw_puzzles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all puzzles" ON public.jigsaw_puzzles
  FOR ALL USING (get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin', 'admin', 'category_manager']));

-- RLS Policies for jigsaw_puzzle_images  
CREATE POLICY "Everyone can view puzzle images" ON public.jigsaw_puzzle_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage puzzle images" ON public.jigsaw_puzzle_images
  FOR ALL USING (get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin', 'admin', 'category_manager']));

-- RLS Policies for jigsaw_puzzle_configs
CREATE POLICY "Everyone can view puzzle configs" ON public.jigsaw_puzzle_configs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage puzzle configs" ON public.jigsaw_puzzle_configs
  FOR ALL USING (get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin', 'admin', 'category_manager']));

-- RLS Policies for jigsaw_game_sessions
CREATE POLICY "Users can manage own sessions" ON public.jigsaw_game_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON public.jigsaw_game_sessions
  FOR SELECT USING (get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin', 'admin']));

-- RLS Policies for jigsaw_completions
CREATE POLICY "Users can view own completions" ON public.jigsaw_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON public.jigsaw_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view leaderboard data" ON public.jigsaw_completions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all completions" ON public.jigsaw_completions
  FOR ALL USING (get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin', 'admin']));

-- Create indexes for performance
CREATE INDEX idx_jigsaw_puzzles_category ON public.jigsaw_puzzles(category_id);
CREATE INDEX idx_jigsaw_puzzles_difficulty ON public.jigsaw_puzzles(difficulty_level);
CREATE INDEX idx_jigsaw_puzzles_status ON public.jigsaw_puzzles(status);
CREATE INDEX idx_jigsaw_puzzles_created_by ON public.jigsaw_puzzles(created_by);

CREATE INDEX idx_jigsaw_puzzle_images_puzzle ON public.jigsaw_puzzle_images(puzzle_id);
CREATE INDEX idx_jigsaw_puzzle_images_primary ON public.jigsaw_puzzle_images(puzzle_id, is_primary);

CREATE INDEX idx_jigsaw_puzzle_configs_puzzle ON public.jigsaw_puzzle_configs(puzzle_id);

CREATE INDEX idx_jigsaw_game_sessions_user ON public.jigsaw_game_sessions(user_id);
CREATE INDEX idx_jigsaw_game_sessions_puzzle ON public.jigsaw_game_sessions(puzzle_id);
CREATE INDEX idx_jigsaw_game_sessions_status ON public.jigsaw_game_sessions(session_status);

CREATE INDEX idx_jigsaw_completions_user ON public.jigsaw_completions(user_id);
CREATE INDEX idx_jigsaw_completions_puzzle ON public.jigsaw_completions(puzzle_id);
CREATE INDEX idx_jigsaw_completions_time ON public.jigsaw_completions(completion_time_seconds);

-- Create triggers for updated_at
CREATE TRIGGER update_jigsaw_puzzles_updated_at
  BEFORE UPDATE ON public.jigsaw_puzzles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jigsaw_puzzle_images_updated_at
  BEFORE UPDATE ON public.jigsaw_puzzle_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jigsaw_puzzle_configs_updated_at
  BEFORE UPDATE ON public.jigsaw_puzzle_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jigsaw_game_sessions_updated_at
  BEFORE UPDATE ON public.jigsaw_game_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
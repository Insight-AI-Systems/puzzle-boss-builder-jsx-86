-- Create puzzle game pricing configuration table
CREATE TABLE public.puzzle_game_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  piece_count INTEGER NOT NULL,
  base_price NUMERIC(10,2) NOT NULL DEFAULT 2.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(difficulty_level, piece_count)
);

-- Enable RLS
ALTER TABLE public.puzzle_game_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active pricing" 
ON public.puzzle_game_pricing 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage pricing" 
ON public.puzzle_game_pricing 
FOR ALL 
USING (get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Insert default pricing
INSERT INTO public.puzzle_game_pricing (difficulty_level, piece_count, base_price) VALUES
('easy', 20, 2.00),
('medium', 100, 3.50),
('hard', 500, 5.00);

-- Create trigger for updated_at
CREATE TRIGGER update_puzzle_game_pricing_updated_at
BEFORE UPDATE ON public.puzzle_game_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add puzzle_game transaction type to existing financial_transactions
-- (This extends the existing transaction types without breaking anything)
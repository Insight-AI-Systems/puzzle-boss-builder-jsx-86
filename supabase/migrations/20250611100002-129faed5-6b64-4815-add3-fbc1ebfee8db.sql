
-- Add tokens column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN tokens integer DEFAULT 0 NOT NULL;

-- Create token_transactions table for audit trail
CREATE TABLE public.token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL, -- positive for credits, negative for debits
  transaction_type text NOT NULL, -- 'admin_award', 'puzzle_play', 'promotion', etc
  description text,
  admin_user_id uuid REFERENCES public.profiles(id), -- who performed the action
  puzzle_id uuid REFERENCES public.puzzles(id), -- if related to puzzle play
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on token_transactions
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for token_transactions
CREATE POLICY "Users can view their own token transactions" 
  ON public.token_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all token transactions" 
  ON public.token_transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admins can insert token transactions" 
  ON public.token_transactions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- Create function to award tokens (admin only)
CREATE OR REPLACE FUNCTION public.award_tokens(
  target_user_id uuid, 
  tokens_to_add integer, 
  admin_note text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_role text;
BEGIN
  -- Check if current user is admin
  SELECT role INTO admin_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  IF admin_role NOT IN ('admin', 'super_admin') THEN
    RAISE EXCEPTION 'Only admins can award tokens';
  END IF;
  
  -- Update tokens
  UPDATE public.profiles
  SET tokens = tokens + tokens_to_add,
      updated_at = NOW()
  WHERE id = target_user_id;
  
  -- Log the transaction
  INSERT INTO public.token_transactions (
    user_id,
    amount,
    transaction_type,
    description,
    admin_user_id,
    metadata
  ) VALUES (
    target_user_id,
    tokens_to_add,
    'admin_award',
    COALESCE(admin_note, 'Tokens awarded by admin'),
    auth.uid(),
    jsonb_build_object(
      'awarded_by', auth.uid(),
      'admin_note', admin_note,
      'award_type', 'free_tokens'
    )
  );
END;
$$;

-- Create function to spend tokens (for puzzle play)
CREATE OR REPLACE FUNCTION public.spend_tokens(
  spending_user_id uuid,
  tokens_to_spend integer,
  target_puzzle_id uuid DEFAULT NULL,
  spend_description text DEFAULT 'Token spend'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_tokens integer;
BEGIN
  -- Get current token balance
  SELECT tokens INTO current_tokens
  FROM public.profiles
  WHERE id = spending_user_id;
  
  -- Check if user has enough tokens
  IF current_tokens < tokens_to_spend THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct tokens
  UPDATE public.profiles
  SET tokens = tokens - tokens_to_spend,
      updated_at = NOW()
  WHERE id = spending_user_id;
  
  -- Log the transaction
  INSERT INTO public.token_transactions (
    user_id,
    amount,
    transaction_type,
    description,
    puzzle_id,
    metadata
  ) VALUES (
    spending_user_id,
    -tokens_to_spend,
    'puzzle_play',
    spend_description,
    target_puzzle_id,
    jsonb_build_object(
      'spend_type', 'puzzle_play',
      'puzzle_id', target_puzzle_id
    )
  );
  
  RETURN TRUE;
END;
$$;

-- Add indexes for performance
CREATE INDEX idx_token_transactions_user_id ON public.token_transactions(user_id);
CREATE INDEX idx_token_transactions_created_at ON public.token_transactions(created_at DESC);
CREATE INDEX idx_token_transactions_type ON public.token_transactions(transaction_type);

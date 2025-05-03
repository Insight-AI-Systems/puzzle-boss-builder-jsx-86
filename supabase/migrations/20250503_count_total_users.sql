
-- Create a function to count total users securely
CREATE OR REPLACE FUNCTION public.count_total_users()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count integer;
BEGIN
  -- Count users in auth.users
  SELECT COUNT(*) INTO total_count FROM auth.users;
  RETURN total_count;
END;
$$;

-- Create or update the daily metrics function to ensure consistent counting
CREATE OR REPLACE FUNCTION public.calculate_daily_metrics(date_param date)
RETURNS TABLE(
  active_users integer, 
  new_signups integer, 
  puzzles_completed integer, 
  revenue numeric,
  total_users integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count integer;
BEGIN
  -- Get total user count
  SELECT count_total_users() INTO total_count;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(DISTINCT id) 
     FROM profiles 
     WHERE DATE(last_sign_in) = date_param)::INTEGER as active_users,
    
    (SELECT COUNT(*) 
     FROM profiles 
     WHERE DATE(created_at) = date_param)::INTEGER as new_signups,
    
    (SELECT COUNT(*) 
     FROM puzzle_completions 
     WHERE DATE(completed_at) = date_param)::INTEGER as puzzles_completed,
    
    COALESCE((SELECT SUM(prize_value) 
     FROM prize_winners 
     WHERE DATE(created_at) = date_param), 0)::DECIMAL(10,2) as revenue,
     
    total_count::INTEGER as total_users;
END;
$$;

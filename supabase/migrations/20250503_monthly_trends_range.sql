
-- Create a function to get monthly trends within a date range
CREATE OR REPLACE FUNCTION public.get_monthly_trends_range(from_date text, to_date text)
RETURNS TABLE(
  month_date date, 
  active_users integer, 
  new_signups integer, 
  puzzles_completed integer, 
  revenue numeric,
  total_users integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH months AS (
        SELECT generate_series(
            date_trunc('month', from_date::date),
            date_trunc('month', to_date::date),
            '1 month'::INTERVAL
        )::DATE as month_start
    ),
    monthly_active_users AS (
        SELECT 
            DATE_TRUNC('month', last_sign_in)::DATE as month_start, 
            COUNT(DISTINCT id) as active_count
        FROM profiles
        WHERE 
            last_sign_in IS NOT NULL AND
            DATE_TRUNC('month', last_sign_in) BETWEEN 
                date_trunc('month', from_date::date) AND
                date_trunc('month', to_date::date)
        GROUP BY DATE_TRUNC('month', last_sign_in)::DATE
    ),
    monthly_signups AS (
        SELECT 
            DATE_TRUNC('month', created_at)::DATE as month_start, 
            COUNT(*) as signup_count
        FROM profiles
        WHERE 
            DATE_TRUNC('month', created_at) BETWEEN 
                date_trunc('month', from_date::date) AND
                date_trunc('month', to_date::date)
        GROUP BY DATE_TRUNC('month', created_at)::DATE
    ),
    monthly_puzzles AS (
        SELECT 
            DATE_TRUNC('month', completed_at)::DATE as month_start, 
            COUNT(*) as completed_count
        FROM puzzle_completions
        WHERE 
            DATE_TRUNC('month', completed_at) BETWEEN 
                date_trunc('month', from_date::date) AND
                date_trunc('month', to_date::date)
        GROUP BY DATE_TRUNC('month', completed_at)::DATE
    ),
    monthly_revenue AS (
        SELECT 
            DATE_TRUNC('month', created_at)::DATE as month_start, 
            SUM(prize_value) as revenue_sum
        FROM prize_winners
        WHERE 
            DATE_TRUNC('month', created_at) BETWEEN 
                date_trunc('month', from_date::date) AND
                date_trunc('month', to_date::date)
        GROUP BY DATE_TRUNC('month', created_at)::DATE
    ),
    -- Get total users count at the end of each month
    monthly_totals AS (
        SELECT 
            m.month_start,
            (SELECT COUNT(*) FROM auth.users WHERE DATE_TRUNC('month', created_at) <= m.month_start) as total_users
        FROM months m
    )
    SELECT 
        m.month_start,
        COALESCE(mau.active_count, 0)::INTEGER as active_users,
        COALESCE(ms.signup_count, 0)::INTEGER as new_signups,
        COALESCE(mp.completed_count, 0)::INTEGER as puzzles_completed,
        COALESCE(mr.revenue_sum, 0)::DECIMAL(10,2) as revenue,
        COALESCE(mt.total_users, 0)::INTEGER as total_users
    FROM months m
    LEFT JOIN monthly_active_users mau ON m.month_start = mau.month_start
    LEFT JOIN monthly_signups ms ON m.month_start = ms.month_start
    LEFT JOIN monthly_puzzles mp ON m.month_start = mp.month_start
    LEFT JOIN monthly_revenue mr ON m.month_start = mr.month_start
    LEFT JOIN monthly_totals mt ON m.month_start = mt.month_start
    ORDER BY m.month_start DESC;
END;
$$;

-- Update the original get_monthly_trends function to include total_users
CREATE OR REPLACE FUNCTION public.get_monthly_trends(months_back integer DEFAULT 12)
RETURNS TABLE(
  month_date date, 
  active_users integer, 
  new_signups integer, 
  puzzles_completed integer, 
  revenue numeric,
  total_users integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH months AS (
        SELECT generate_series(
            date_trunc('month', CURRENT_DATE) - ((months_back - 1) || ' months')::INTERVAL,
            date_trunc('month', CURRENT_DATE),
            '1 month'::INTERVAL
        )::DATE as month_start
    ),
    -- Get total users count at the end of each month
    monthly_totals AS (
        SELECT 
            m.month_start,
            (SELECT COUNT(*) FROM auth.users WHERE DATE_TRUNC('month', created_at) <= m.month_start) as total_users
        FROM months m
    )
    SELECT 
        m.month_start,
        COALESCE((
            SELECT COUNT(DISTINCT id)
            FROM profiles
            WHERE DATE_TRUNC('month', last_sign_in) = m.month_start
        ), 0)::INTEGER as active_users,
        COALESCE((
            SELECT COUNT(*)
            FROM profiles
            WHERE DATE_TRUNC('month', created_at) = m.month_start
        ), 0)::INTEGER as new_signups,
        COALESCE((
            SELECT COUNT(*)
            FROM puzzle_completions
            WHERE DATE_TRUNC('month', completed_at) = m.month_start
        ), 0)::INTEGER as puzzles_completed,
        COALESCE((
            SELECT SUM(prize_value)
            FROM prize_winners
            WHERE DATE_TRUNC('month', created_at) = m.month_start
        ), 0)::DECIMAL(10,2) as revenue,
        COALESCE(mt.total_users, 0)::INTEGER as total_users
    FROM months m
    LEFT JOIN monthly_totals mt ON m.month_start = mt.month_start
    ORDER BY month_start DESC;
END;
$$;

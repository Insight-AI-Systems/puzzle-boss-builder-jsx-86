
-- This SQL script fixes the ambiguous column issue in the get_monthly_financial_summary function
-- To apply this fix, run this SQL in the Supabase SQL editor

CREATE OR REPLACE FUNCTION public.get_monthly_financial_summary(month_param text)
RETURNS TABLE(period text, total_income numeric, total_expenses numeric, net_profit numeric, commissions_paid numeric, prize_expenses numeric)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH monthly_income AS (
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM site_income
    WHERE TO_CHAR(date, 'YYYY-MM') = month_param
  ),
  monthly_expenses AS (
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM site_expenses
    WHERE TO_CHAR(date, 'YYYY-MM') = month_param
  ),
  monthly_commissions AS (
    SELECT COALESCE(SUM(commission_amount), 0) AS total
    FROM commission_payments
    -- Use explicit table qualification to avoid the ambiguous column reference
    WHERE commission_payments.period = month_param AND payment_status = 'paid'
  ),
  monthly_prizes AS (
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM site_expenses
    WHERE TO_CHAR(date, 'YYYY-MM') = month_param AND expense_type = 'prizes'
  )
  SELECT
    month_param AS period,
    (SELECT total FROM monthly_income) AS total_income,
    (SELECT total FROM monthly_expenses) AS total_expenses,
    ((SELECT total FROM monthly_income) - (SELECT total FROM monthly_expenses)) AS net_profit,
    (SELECT total FROM monthly_commissions) AS commissions_paid,
    (SELECT total FROM monthly_prizes) AS prize_expenses;
END;
$$;

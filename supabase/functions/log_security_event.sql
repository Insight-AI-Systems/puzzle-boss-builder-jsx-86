
-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  user_id UUID DEFAULT NULL,
  email TEXT DEFAULT NULL,
  severity TEXT DEFAULT 'info',
  ip_address TEXT DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  event_details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO security_audit_logs (
    user_id,
    event_type,
    severity,
    ip_address,
    user_agent,
    details,
    email
  ) VALUES (
    user_id,
    event_type,
    severity,
    ip_address,
    user_agent,
    event_details,
    email
  );
END;
$$;

-- Grant usage to this function
GRANT EXECUTE ON FUNCTION public.log_security_event TO authenticated, service_role, anon;

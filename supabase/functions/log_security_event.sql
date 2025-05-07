
-- First, make sure the security_audit_logs table exists
CREATE TABLE IF NOT EXISTS security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NULL,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  ip_address TEXT NULL,
  user_agent TEXT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  email TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for the security audit logs table
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to read audit logs
CREATE POLICY "Admins can read security audit logs"
  ON security_audit_logs
  FOR SELECT
  USING (
    (SELECT is_admin FROM public.is_admin(auth.uid())) = true
  );

-- Policy to allow inserting logs from authenticated users (about themselves)
CREATE POLICY "Users can insert their own security logs"
  ON security_audit_logs
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

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

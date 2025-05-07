
-- Create security_config table for centralized security configuration
CREATE TABLE IF NOT EXISTS public.security_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security_config table
ALTER TABLE public.security_config ENABLE ROW LEVEL SECURITY;

-- Create policies for security_config table
CREATE POLICY "Only super_admins can view security_config" 
  ON public.security_config 
  FOR SELECT 
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Only super_admins can insert security_config" 
  ON public.security_config 
  FOR INSERT 
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Only super_admins can update security_config" 
  ON public.security_config 
  FOR UPDATE 
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Create security_audit_logs table for comprehensive security logging
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security_audit_logs table
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for security_audit_logs table
CREATE POLICY "Only super_admins can view all security_audit_logs" 
  ON public.security_audit_logs 
  FOR SELECT 
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Users can view their own security_audit_logs" 
  ON public.security_audit_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Any authenticated user can insert security_audit_logs" 
  ON public.security_audit_logs 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Initialize security config with admin emails
INSERT INTO public.security_config (config_key, config_value, description)
VALUES (
  'admin_emails', 
  '["alan@insight-ai-systems.com"]'::jsonb, 
  'List of protected admin email addresses that always have super_admin access'
)
ON CONFLICT (config_key) 
DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  updated_at = now();

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type TEXT,
  action_details JSONB DEFAULT NULL
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
    details
  ) VALUES (
    auth.uid(),
    'ADMIN_ACTION',
    'info',
    current_setting('request.headers', true)::jsonb->>'x-forwarded-for',
    current_setting('request.headers', true)::jsonb->>'user-agent',
    jsonb_build_object(
      'action', action_type,
      'details', action_details,
      'timestamp', now()
    )
  );
END;
$$;

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_event_type ON security_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON security_audit_logs(created_at);

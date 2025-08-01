-- Create table for puzzle JavaScript files
CREATE TABLE public.puzzle_js_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.puzzle_js_files ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage puzzle files
CREATE POLICY "Admins can manage puzzle files" 
ON public.puzzle_js_files 
FOR ALL 
USING (
  get_user_role_secure(auth.uid()) = ANY (ARRAY['super_admin'::text, 'admin'::text, 'category_manager'::text])
);

-- Create trigger for updated_at
CREATE TRIGGER update_puzzle_js_files_updated_at
BEFORE UPDATE ON public.puzzle_js_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
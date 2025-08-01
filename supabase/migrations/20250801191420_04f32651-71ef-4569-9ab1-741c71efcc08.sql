-- Add RLS policy to allow reading categories
CREATE POLICY "Allow public read access to active categories" 
ON public.categories 
FOR SELECT 
USING (status = 'active');

-- Also allow read access to all categories for admins
CREATE POLICY "Allow admin read access to all categories" 
ON public.categories 
FOR SELECT 
USING (true);
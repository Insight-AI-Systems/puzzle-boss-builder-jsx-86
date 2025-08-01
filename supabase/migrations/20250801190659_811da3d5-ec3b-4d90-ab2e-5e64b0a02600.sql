-- Add DELETE policy for product_images table
CREATE POLICY "Anyone can delete product images" 
ON public.product_images 
FOR DELETE 
USING (true);
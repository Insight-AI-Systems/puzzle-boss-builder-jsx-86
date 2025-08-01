-- Migration to fix older images by updating metadata with imageUrl from original_path
UPDATE product_images 
SET metadata = metadata || jsonb_build_object(
  'imageUrl', 
  'https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/processed_images/' || 
  (SELECT original_path FROM image_files WHERE product_image_id = product_images.id LIMIT 1)
)
WHERE id IN (
  SELECT DISTINCT pi.id 
  FROM product_images pi
  JOIN image_files if ON pi.id = if.product_image_id
  WHERE if.original_path IS NOT NULL 
  AND if.processed_path IS NULL
  AND (pi.metadata->>'imageUrl') IS NULL
);
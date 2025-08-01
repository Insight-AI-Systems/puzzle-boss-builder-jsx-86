-- Update recent images that don't have imageUrl but should be migrated to new system
UPDATE product_images 
SET metadata = metadata || jsonb_build_object(
  'imageUrl', 
  'https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/processed_images/' || 
  (SELECT original_path FROM image_files WHERE product_image_id = product_images.id LIMIT 1)
)
WHERE (metadata->>'imageUrl') IS NULL 
AND EXISTS (
  SELECT 1 FROM image_files 
  WHERE product_image_id = product_images.id 
  AND original_path IS NOT NULL
);
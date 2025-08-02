-- Update the Ducati 998 puzzle image with a real image URL
-- First, let's check what images we have available
UPDATE jigsaw_puzzle_images 
SET original_image_url = 'https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/processed_images/1754074803080-IMG_3646.jpg',
    thumbnail_url = 'https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/processed_images/thumb-1754074803080-IMG_3646.jpg',
    medium_image_url = 'https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/processed_images/1754074803080-IMG_3646.jpg',
    image_width = 1024,
    image_height = 768
WHERE original_image_url = '' OR original_image_url IS NULL;
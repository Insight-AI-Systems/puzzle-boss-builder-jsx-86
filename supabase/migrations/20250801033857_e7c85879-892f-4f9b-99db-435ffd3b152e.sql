-- Drop remaining puzzle-related functions
DROP FUNCTION IF EXISTS public.update_puzzle_progress_timestamp();
DROP FUNCTION IF EXISTS public.update_puzzle_settings_timestamp();
DROP FUNCTION IF EXISTS public.get_puzzle_stats(uuid);
DROP FUNCTION IF EXISTS public.complete_puzzle_from_progress();
DROP FUNCTION IF EXISTS public.update_puzzle_active_players(uuid, uuid, text);
DROP FUNCTION IF EXISTS public.update_puzzle_timestamp();

-- Drop storage buckets
DELETE FROM storage.buckets WHERE id = 'Processed Puzzle Images';
DELETE FROM storage.buckets WHERE id = 'puzzle_images';
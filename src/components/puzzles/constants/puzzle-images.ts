
import { supabase } from "@/integrations/supabase/client";

export interface PuzzleImage {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
}

// This will fetch processed images from our image library
export const fetchPuzzleImages = async (): Promise<PuzzleImage[]> => {
  const { data: images, error } = await supabase
    .from('puzzle_images')
    .select('*')
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching puzzle images:', error);
    return [];
  }

  return images.map(img => ({
    id: img.id,
    name: img.name,
    url: img.processed_path || img.original_path,
    thumbnail: img.thumbnail_path
  }));
};

// Default images used as fallback if no processed images are available
export const DEFAULT_IMAGES: PuzzleImage[] = [
  {
    id: 'default',
    name: 'Default Puzzle',
    url: '/images/default-puzzle.jpg',
    thumbnail: '/images/default-puzzle-thumb.jpg'
  }
];

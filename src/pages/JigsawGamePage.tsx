import React from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layouts/PageLayout';
import { MinimalJigsawGame } from '@/components/games/jigsaw/MinimalJigsawGame';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function JigsawGamePage() {
  const { id } = useParams();
  
  // Fetch puzzle data if ID is provided
  const { data: puzzle, isLoading } = useQuery({
    queryKey: ['puzzle', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('jigsaw_puzzles')
        .select('*, images:jigsaw_puzzle_images(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (id && isLoading) {
    return (
      <PageLayout title="Loading Puzzle..." subtitle="">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Loading puzzle...</div>
        </div>
      </PageLayout>
    );
  }

  const title = puzzle?.title || "Jigsaw Puzzle";
  const subtitle = puzzle?.description || "Solve beautiful jigsaw puzzles with varying difficulty levels";
  const imageUrl = puzzle?.images?.[0]?.original_image_url || puzzle?.images?.[0]?.large_image_url || puzzle?.images?.[0]?.medium_image_url;
  console.log('🔍 All image data:', puzzle?.images?.[0]);
  console.log('🔍 Available image fields:', puzzle?.images?.[0] ? Object.keys(puzzle.images[0]) : 'No images');
  console.log('🔍 Final imageUrl:', imageUrl);
  const pieceCount = puzzle?.piece_count || 100;
  const difficulty = puzzle?.difficulty_level || 'medium';

  console.log('🧩 JigsawGamePage puzzle data:', {
    puzzle,
    title,
    imageUrl,
    pieceCount,
    difficulty,
    hasImages: !!puzzle?.images?.length,
    firstImage: puzzle?.images?.[0]
  });

  // CRITICAL DEBUG: Check if we're even on the puzzle page
  console.log('🚨 DEBUG: Current window location:', window.location.href);
  console.log('🚨 DEBUG: Puzzle ID from params:', id);
  console.log('🚨 DEBUG: Is loading?', isLoading);
  console.log('🚨 DEBUG: Puzzle exists?', !!puzzle);
  
  if (!puzzle && !isLoading) {
    console.error('❌ CRITICAL: No puzzle data found for ID:', id);
  }

  return (
    <PageLayout 
      title={title} 
      subtitle={subtitle}
    >
      <MinimalJigsawGame 
        pieceCount={pieceCount as 20 | 100 | 500}
        imageUrl={imageUrl}
        onComplete={() => console.log('Puzzle completed!')}
      />
    </PageLayout>
  );
}
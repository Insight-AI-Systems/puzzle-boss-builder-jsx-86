import React from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layouts/PageLayout';
import { PuzzleComponent } from '@/components/games/jigsaw/PuzzleComponent';
import { JigsawLeaderboard } from '@/components/games/jigsaw/JigsawLeaderboard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function JigsawGamePage() {
  console.log('🎯 JigsawGamePage component started loading');
  const { id } = useParams();
  console.log('🎯 Puzzle ID from URL params:', id);
  
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

  // Map piece count to a grid as close to square as possible
  const computeGrid = (pieces: number) => {
    if (pieces <= 20) return { rows: 4, columns: 5 };
    if (pieces <= 100) return { rows: 10, columns: 10 };
    return { rows: 20, columns: 25 };
  };
  const { rows, columns } = computeGrid(pieceCount);
  const puzzleSlug = (puzzle?.id || id || 'puzzle') as string;

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
      <PuzzleComponent
        imageUrl={imageUrl}
        rows={rows}
        columns={columns}
        puzzleSlug={puzzleSlug}
      />
      <div className="mt-6">
        <JigsawLeaderboard puzzleSlug={puzzleSlug} />
      </div>
    </PageLayout>
  );
}
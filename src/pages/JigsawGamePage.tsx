import React from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layouts/PageLayout';
import { JigsawGameWrapper } from '@/components/games/jigsaw/JigsawGameWrapper';
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
  const imageUrl = puzzle?.images?.[0]?.original_image_url;
  const pieceCount = puzzle?.piece_count || 100;
  const difficulty = puzzle?.difficulty_level || 'medium';

  return (
    <PageLayout 
      title={title} 
      subtitle={subtitle}
    >
      <JigsawGameWrapper 
        difficulty={difficulty as 'easy' | 'medium' | 'hard'}
        pieceCount={pieceCount as 20 | 100 | 500}
        imageUrl={imageUrl}
      />
    </PageLayout>
  );
}
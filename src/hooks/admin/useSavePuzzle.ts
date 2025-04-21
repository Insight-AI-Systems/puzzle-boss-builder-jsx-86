
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SavePuzzleInput = {
  imageUrl: string;
  title: string;
  description: string;
  categoryId: string;
  releaseDate: Date;
  pieces: number;
  prizeValue: number;
  incomeTarget: number;
  overrideTarget: boolean;
};

export function useSavePuzzle() {
  return useMutation({
    mutationFn: async (puzzle: SavePuzzleInput) => {
      const { data, error } = await supabase
        .from("puzzles")
        .insert([{
          image_url: puzzle.imageUrl,
          title: puzzle.title,
          description: puzzle.description,
          category_id: puzzle.categoryId,
          release_date: puzzle.releaseDate.toISOString(),
          pieces: puzzle.pieces,
          prize_value: puzzle.prizeValue,
          income_target: puzzle.incomeTarget,
          override_target: puzzle.overrideTarget,
          status: 'draft', // New puzzles start as draft
        }])
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }
      return data;
    },
  });
}


import { useToast } from '@/hooks/use-toast';

export const usePuzzleEditValidation = () => {
  const { toast } = useToast();

  const validatePuzzleForm = (puzzle: any) => {
    if (!puzzle.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Puzzle name is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (!puzzle.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return false;
    }
    
    if (!puzzle.prizeValue || puzzle.prizeValue <= 0) {
      toast({
        title: "Validation Error",
        description: "Prize value must be greater than zero",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return { validatePuzzleForm };
};

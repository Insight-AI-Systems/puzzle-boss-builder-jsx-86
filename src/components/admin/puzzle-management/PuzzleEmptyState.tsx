
import { Plus, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PuzzleEmptyStateProps {
  onCreatePuzzle: () => void;
}

export const PuzzleEmptyState: React.FC<PuzzleEmptyStateProps> = ({ onCreatePuzzle }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-puzzle-aqua/10">
        <Puzzle className="h-8 w-8 text-puzzle-aqua" />
      </div>
      <h3 className="text-lg font-medium mb-2">No puzzles found</h3>
      <p className="text-muted-foreground mb-6">
        Get started by creating your first puzzle
      </p>
      <Button onClick={onCreatePuzzle}>
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Puzzle
      </Button>
    </div>
  );
};

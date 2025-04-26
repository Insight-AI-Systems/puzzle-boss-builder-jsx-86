
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface PuzzleStatusToggleProps {
  puzzle: any;
  onChange: (field: string, value: any) => void;
}

export const PuzzleStatusToggle: React.FC<PuzzleStatusToggleProps> = ({
  puzzle,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-3">
      <Label htmlFor="edit-status" className="mb-0">Puzzle Status</Label>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() =>
          onChange(
            "status",
            puzzle.status === "active" ? "inactive" : "active"
          )
        }
        tabIndex={0}
        aria-pressed={puzzle.status === "active" ? "true" : "false"}
        aria-label={puzzle.status === "active" ? "Active" : "Inactive"}
      >
        {puzzle.status === "active"
          ? <ToggleRight className="h-6 w-6 text-green-500" />
          : <ToggleLeft className="h-6 w-6 text-gray-400" />
        }
      </Button>
      <span className={`text-xs ml-2 ${puzzle.status === "active" ? "text-green-600" : "text-gray-500"}`}>
        {puzzle.status === "active" ? "Active" : "Inactive"}
      </span>
    </div>
  );
};

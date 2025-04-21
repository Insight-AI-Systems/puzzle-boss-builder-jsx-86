
import React from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PuzzleControlsBarProps {
  onReset: () => void;
}

export const PuzzleControlsBar: React.FC<PuzzleControlsBarProps> = ({ onReset }) => (
  <div className="flex gap-2">
    <button
      onClick={onReset}
      className="inline-flex items-center px-3 py-1 rounded-md bg-muted hover:bg-accent text-xs font-medium border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
      type="button"
      aria-label="Reset Puzzle"
      tabIndex={0}
    >
      <RefreshCcw className="h-4 w-4 mr-1" />
      Reset
    </button>
  </div>
);

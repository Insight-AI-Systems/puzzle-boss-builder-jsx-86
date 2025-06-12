
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { SudokuSize } from '../types/sudokuTypes';

interface SudokuInstructionsProps {
  size: SudokuSize;
}

export function SudokuInstructions({ size }: SudokuInstructionsProps) {
  const getBoxSize = (size: SudokuSize) => {
    switch (size) {
      case 4: return '2×2';
      case 6: return '3×2';
      case 9: return '3×3';
      default: return '3×3';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0 bg-gray-700 hover:bg-gray-600 border-gray-600"
          >
            <Info className="h-4 w-4 text-puzzle-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="left" 
          className="max-w-xs p-4 bg-gray-800 border-gray-600 text-puzzle-white"
        >
          <div className="space-y-3">
            <h3 className="font-semibold text-puzzle-aqua">How to Play Sudoku {size}×{size}</h3>
            
            <div className="space-y-2 text-sm">
              <p><strong>Goal:</strong> Fill the entire grid with numbers 1-{size}</p>
              
              <div>
                <strong>Rules:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Each row must contain all numbers 1-{size}</li>
                  <li>Each column must contain all numbers 1-{size}</li>
                  <li>Each {getBoxSize(size)} box must contain all numbers 1-{size}</li>
                  <li>No number can repeat in any row, column, or box</li>
                </ul>
              </div>
              
              <div>
                <strong>How to Play:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Click a cell to select it</li>
                  <li>Click a number to place it in the selected cell</li>
                  <li>Use the Clear button to remove numbers</li>
                  <li>Red highlighting shows conflicts</li>
                </ul>
              </div>
              
              <div>
                <strong>Controls:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li><strong>Hint:</strong> Reveals one correct number</li>
                  <li><strong>Undo/Redo:</strong> Navigate through moves</li>
                  <li><strong>Reset:</strong> Start over with the same puzzle</li>
                  <li><strong>New Game:</strong> Generate a fresh puzzle</li>
                </ul>
              </div>
              
              <p><strong>Scoring:</strong> Based on moves made and hints used. Fewer moves and hints = higher score!</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

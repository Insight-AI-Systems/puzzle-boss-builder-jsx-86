
import React from 'react';
import { cn } from '@/lib/utils';

export interface CrosswordGridProps {
  grid: any[][];
  selectedCell?: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  onCellInput?: (letter: string) => void;
}

export function CrosswordGrid({ grid, selectedCell, onCellClick, onCellInput }: CrosswordGridProps) {
  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      onCellInput?.(e.key);
    }
  };

  return (
    <div className="grid gap-1 p-4 bg-white rounded-lg shadow-md" 
         style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 10}, 1fr)` }}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-bold cursor-pointer",
              cell.isBlocked ? "bg-black" : "bg-white hover:bg-blue-50",
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? "bg-blue-200" : ""
            )}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
            tabIndex={cell.isBlocked ? -1 : 0}
          >
            {!cell.isBlocked && cell.letter}
          </div>
        ))
      )}
    </div>
  );
}

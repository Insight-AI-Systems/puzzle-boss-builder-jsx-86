
import React from 'react';
import { CrosswordCell } from '../types/crosswordTypes';
import { cn } from '@/lib/utils';

interface CrosswordGridProps {
  grid: CrosswordCell[][];
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}

export function CrosswordGrid({ grid, onCellClick, disabled = false }: CrosswordGridProps) {
  const handleCellClick = (row: number, col: number) => {
    if (disabled) return;
    onCellClick(row, col);
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCellClick(row, col);
    }
  };

  return (
    <div className="crossword-grid bg-white border-2 border-gray-300 inline-block p-2">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <div
              key={cell.id}
              className={cn(
                "w-8 h-8 border border-gray-400 relative cursor-pointer transition-colors",
                "flex items-center justify-center text-sm font-bold",
                {
                  "bg-black": cell.isBlocked,
                  "bg-white hover:bg-blue-50": !cell.isBlocked && !cell.isSelected && !cell.isHighlighted,
                  "bg-blue-200": cell.isHighlighted && !cell.isSelected,
                  "bg-blue-400": cell.isSelected,
                  "cursor-not-allowed": disabled
                }
              )}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              tabIndex={!cell.isBlocked && !disabled ? 0 : -1}
              role="button"
              aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}${cell.number ? `, clue ${cell.number}` : ''}`}
            >
              {!cell.isBlocked && (
                <>
                  {cell.number && (
                    <span className="absolute top-0 left-0 text-xs font-normal leading-none text-black">
                      {cell.number}
                    </span>
                  )}
                  <span className="text-black">
                    {cell.letter}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

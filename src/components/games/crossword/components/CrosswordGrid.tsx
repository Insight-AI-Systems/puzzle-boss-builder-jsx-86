
import React from 'react';
import { cn } from '@/lib/utils';

export interface CrosswordGridProps {
  grid: any[][];
  selectedCell?: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  onCellInput?: (letter: string) => void;
}

export function CrosswordGrid({ grid, selectedCell, onCellClick, onCellInput }: CrosswordGridProps) {
  console.log('🎯 CrosswordGrid: Rendering with props:', { 
    hasGrid: !!grid,
    gridSize: grid?.length, 
    selectedCell,
    hasOnCellClick: !!onCellClick 
  });

  if (!grid || grid.length === 0) {
    console.log('❌ CrosswordGrid: No grid data available');
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No grid data available</p>
      </div>
    );
  }

  // Validate grid structure
  if (!Array.isArray(grid) || !Array.isArray(grid[0])) {
    console.error('❌ CrosswordGrid: Invalid grid structure');
    return (
      <div className="flex items-center justify-center h-64 bg-red-100 rounded-lg">
        <p className="text-red-500">Invalid grid structure</p>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    console.log('⌨️ CrosswordGrid: Key pressed:', { key: e.key, row, col });
    if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      console.log('✅ CrosswordGrid: Valid letter input:', e.key);
      onCellInput?.(e.key.toUpperCase());
    }
  };

  const gridSize = grid[0]?.length || 10;
  console.log('📐 CrosswordGrid: Grid dimensions:', grid.length, 'x', gridSize);

  return (
    <div 
      className="grid gap-1 p-4 bg-white rounded-lg shadow-md mx-auto max-w-fit" 
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const isBlocked = cell?.isBlocked !== false; // Default to blocked if undefined
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-bold cursor-pointer relative",
                isBlocked ? "bg-black" : "bg-white hover:bg-blue-50",
                isSelected ? "bg-blue-200 ring-2 ring-blue-400" : ""
              )}
              onClick={() => {
                console.log('🖱️ CrosswordGrid: Cell clicked:', { rowIndex, colIndex, isBlocked });
                if (!isBlocked) {
                  onCellClick(rowIndex, colIndex);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              tabIndex={isBlocked ? -1 : 0}
            >
              {!isBlocked && (
                <>
                  {cell?.number && (
                    <span className="absolute top-0 left-0 text-xs leading-none p-0.5">
                      {cell.number}
                    </span>
                  )}
                  <span className="text-center">
                    {cell?.letter || ''}
                  </span>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

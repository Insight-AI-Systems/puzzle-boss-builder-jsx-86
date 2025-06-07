
import React from 'react';
import { SudokuGrid as SudokuGridType, SudokuSize } from '../types/sudokuTypes';

interface SudokuGridProps {
  grid: SudokuGridType;
  initialGrid: SudokuGridType;
  selectedCell: [number, number] | null;
  conflicts: Set<string>;
  size: SudokuSize;
  onCellClick: (row: number, col: number) => void;
  isActive: boolean;
}

export function SudokuGrid({
  grid,
  initialGrid,
  selectedCell,
  conflicts,
  size,
  onCellClick,
  isActive
}: SudokuGridProps) {
  const getBoxSize = (size: SudokuSize) => {
    switch (size) {
      case 4: return { width: 2, height: 2 };
      case 6: return { width: 3, height: 2 };
      case 9: return { width: 3, height: 3 };
      default: return { width: 3, height: 3 };
    }
  };

  const boxSize = getBoxSize(size);
  
  const getCellClasses = (row: number, col: number) => {
    const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
    const isInitial = initialGrid[row][col] !== 0;
    const hasConflict = conflicts.has(`${row}-${col}`);
    const isHighlighted = selectedCell && (
      selectedCell[0] === row || 
      selectedCell[1] === col ||
      (Math.floor(selectedCell[0] / boxSize.height) === Math.floor(row / boxSize.height) &&
       Math.floor(selectedCell[1] / boxSize.width) === Math.floor(col / boxSize.width))
    );
    
    let classes = 'w-full h-full flex items-center justify-center text-lg font-bold border transition-all duration-150 ';
    
    // Base styling
    classes += isInitial 
      ? 'bg-gray-700 text-puzzle-white font-extrabold ' 
      : 'bg-gray-800 text-puzzle-aqua hover:bg-gray-700 ';
    
    // Selection and highlighting
    if (isSelected) {
      classes += 'bg-puzzle-aqua text-puzzle-black ring-2 ring-puzzle-aqua ';
    } else if (isHighlighted) {
      classes += 'bg-gray-600 ';
    }
    
    // Conflicts
    if (hasConflict) {
      classes += 'bg-red-900 text-red-300 ring-1 ring-red-500 ';
    }
    
    // Borders for box separation
    const topBorder = row % boxSize.height === 0 ? 'border-t-2 border-t-puzzle-white ' : 'border-t border-t-gray-600 ';
    const bottomBorder = (row + 1) % boxSize.height === 0 && row !== size - 1 ? 'border-b-2 border-b-puzzle-white ' : 'border-b border-b-gray-600 ';
    const leftBorder = col % boxSize.width === 0 ? 'border-l-2 border-l-puzzle-white ' : 'border-l border-l-gray-600 ';
    const rightBorder = (col + 1) % boxSize.width === 0 && col !== size - 1 ? 'border-r-2 border-r-puzzle-white ' : 'border-r border-r-gray-600 ';
    
    classes += topBorder + bottomBorder + leftBorder + rightBorder;
    
    // Cursor
    classes += isActive && !isInitial ? 'cursor-pointer ' : 'cursor-default ';
    
    return classes;
  };

  const cellSize = size === 4 ? 'h-14 w-14' : size === 6 ? 'h-12 w-12' : 'h-10 w-10';

  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className={`grid gap-0 bg-gray-900 p-2 rounded-lg shadow-2xl`}
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          maxWidth: size === 4 ? '280px' : size === 6 ? '360px' : '440px'
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${cellSize} ${getCellClasses(rowIndex, colIndex)}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell !== 0 && (
                <span className="select-none">
                  {cell}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

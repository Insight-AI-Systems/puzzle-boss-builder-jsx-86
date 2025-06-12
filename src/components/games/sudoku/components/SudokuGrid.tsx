
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
    
    let classes = 'w-full h-full flex items-center justify-center font-bold border transition-all duration-150 ';
    
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

  // Responsive cell sizes - much larger than before
  const getCellSize = () => {
    switch (size) {
      case 4: return 'h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24'; // 64px -> 96px
      case 6: return 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20'; // 56px -> 80px
      case 9: return 'h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16'; // 48px -> 64px
      default: return 'h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16';
    }
  };

  // Responsive text sizes
  const getTextSize = () => {
    switch (size) {
      case 4: return 'text-xl sm:text-2xl md:text-3xl';
      case 6: return 'text-lg sm:text-xl md:text-2xl';
      case 9: return 'text-base sm:text-lg md:text-xl';
      default: return 'text-base sm:text-lg md:text-xl';
    }
  };

  // Responsive container max widths - much larger
  const getContainerMaxWidth = () => {
    switch (size) {
      case 4: return 'max-w-md sm:max-w-lg md:max-w-xl'; // 448px -> 576px
      case 6: return 'max-w-lg sm:max-w-xl md:max-w-2xl'; // 512px -> 672px
      case 9: return 'max-w-xl sm:max-w-2xl md:max-w-3xl'; // 576px -> 768px
      default: return 'max-w-xl sm:max-w-2xl md:max-w-3xl';
    }
  };

  const cellSize = getCellSize();
  const textSize = getTextSize();
  const containerMaxWidth = getContainerMaxWidth();

  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className={`grid gap-0 bg-gray-900 p-3 sm:p-4 md:p-6 rounded-lg shadow-2xl ${containerMaxWidth} w-full`}
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`
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
                <span className={`select-none ${textSize}`}>
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

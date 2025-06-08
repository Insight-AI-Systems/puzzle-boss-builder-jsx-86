import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Cell {
  row: number;
  col: number;
}

interface WordSearchGridProps {
  grid: string[][];
  selectedCells: Cell[];
  currentSelection: Cell[];
  hintCells?: Cell[]; // New prop for hint highlighting
  onSelectionStart: (cell: Cell) => void;
  onSelectionMove: (cell: Cell) => void;
  onSelectionEnd: () => void;
  isDisabled?: boolean;
}

const CELL_SIZE = 40;
const CURRENT_SELECTION_COLOR = 'rgba(255, 255, 0, 0.6)'; // Yellow for current selection
const FOUND_WORD_COLOR = 'rgba(0, 255, 128, 0.7)'; // Green for found words
const HINT_COLOR = 'rgba(255, 165, 0, 0.8)'; // Orange for hints - high visibility

export function WordSearchGrid({
  grid,
  selectedCells,
  currentSelection,
  hintCells = [],
  onSelectionStart,
  onSelectionMove,
  onSelectionEnd,
  isDisabled = false
}: WordSearchGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const drawGrid = useCallback(() => {
    if (!canvasRef.current || !grid.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = grid.length;
    canvas.width = gridSize * CELL_SIZE;
    canvas.height = gridSize * CELL_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid cells
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * CELL_SIZE;
        const y = rowIndex * CELL_SIZE;

        // Draw cell background
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

        // Check if cell is part of a found word (permanently highlighted)
        const isFoundCell = selectedCells.some(selectedCell => 
          selectedCell.row === rowIndex && selectedCell.col === colIndex
        );
        
        // Check if cell is part of current selection
        const isCurrentSelection = currentSelection.some(selectedCell => 
          selectedCell.row === rowIndex && selectedCell.col === colIndex
        );

        // Check if cell is part of a hint
        const isHintCell = hintCells.some(hintCell => 
          hintCell.row === rowIndex && hintCell.col === colIndex
        );

        // Apply highlighting with priority: found words > hints > current selection
        if (isFoundCell) {
          ctx.fillStyle = FOUND_WORD_COLOR;
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        } else if (isHintCell) {
          ctx.fillStyle = HINT_COLOR;
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        } else if (isCurrentSelection) {
          ctx.fillStyle = CURRENT_SELECTION_COLOR;
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }

        // Draw cell border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

        // Draw cell letter
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cell, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
      });
    });
  }, [grid, selectedCells, currentSelection, hintCells]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  const getCellCoordinates = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0]?.length) {
      return { row, col };
    }
    return null;
  };

  // Mouse events
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDisabled) return;
    setIsMouseDown(true);
    const cell = getCellCoordinates(event.clientX, event.clientY);
    if (cell) onSelectionStart(cell);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDisabled || !isMouseDown) return;
    const cell = getCellCoordinates(event.clientX, event.clientY);
    if (cell) onSelectionMove(cell);
  };

  const handleMouseUp = () => {
    if (isDisabled) return;
    setIsMouseDown(false);
    onSelectionEnd();
  };

  // Touch events for mobile
  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    const touch = event.touches[0];
    const cell = getCellCoordinates(touch.clientX, touch.clientY);
    if (cell) onSelectionStart(cell);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    const touch = event.touches[0];
    const cell = getCellCoordinates(touch.clientX, touch.clientY);
    if (cell) onSelectionMove(cell);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    onSelectionEnd();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 cursor-crosshair max-w-full touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </CardContent>
    </Card>
  );
}

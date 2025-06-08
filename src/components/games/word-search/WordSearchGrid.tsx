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
  onSelectionStart: (cell: Cell) => void;
  onSelectionMove: (cell: Cell) => void;
  onSelectionEnd: () => void;
  isDisabled?: boolean;
}

const CELL_SIZE = 40;
const HIGHLIGHT_COLOR = 'rgba(255, 255, 0, 0.5)';

export function WordSearchGrid({
  grid,
  selectedCells,
  currentSelection,
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

        // Highlight selected cells
        const isSelected = selectedCells.some(selectedCell => 
          selectedCell.row === rowIndex && selectedCell.col === colIndex
        );
        const isCurrentSelection = currentSelection.some(selectedCell => 
          selectedCell.row === rowIndex && selectedCell.col === colIndex
        );

        if (isSelected || isCurrentSelection) {
          ctx.fillStyle = HIGHLIGHT_COLOR;
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
  }, [grid, selectedCells, currentSelection]);

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

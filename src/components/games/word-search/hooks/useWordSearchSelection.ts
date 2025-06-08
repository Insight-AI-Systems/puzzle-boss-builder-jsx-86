
import { useState, useCallback } from 'react';

interface Cell {
  row: number;
  col: number;
}

export function useWordSearchSelection() {
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<Cell | null>(null);
  const [currentSelection, setCurrentSelection] = useState<Cell[]>([]);

  const startSelection = useCallback((cell: Cell) => {
    setIsSelecting(true);
    setDragStart(cell);
    setCurrentSelection([cell]);
  }, []);

  const updateSelection = useCallback((cell: Cell) => {
    if (!isSelecting || !dragStart) return;

    const cellsBetween: Cell[] = [];
    const rowDiff = Math.abs(cell.row - dragStart.row);
    const colDiff = Math.abs(cell.col - dragStart.col);

    // Only allow straight lines (horizontal, vertical, diagonal)
    if (rowDiff <= 1 && colDiff <= 1) {
      const rowDir = cell.row > dragStart.row ? 1 : cell.row < dragStart.row ? -1 : 0;
      const colDir = cell.col > dragStart.col ? 1 : cell.col < dragStart.col ? -1 : 0;

      let currentRow = dragStart.row;
      let currentCol = dragStart.col;
      
      while (currentRow !== cell.row + rowDir || currentCol !== cell.col + colDir) {
        cellsBetween.push({ row: currentRow, col: currentCol });
        currentRow += rowDir;
        currentCol += colDir;
      }
    }

    setCurrentSelection(cellsBetween);
  }, [isSelecting, dragStart]);

  const endSelection = useCallback(() => {
    setIsSelecting(false);
    setDragStart(null);
    return currentSelection;
  }, [currentSelection]);

  const clearSelection = useCallback(() => {
    setCurrentSelection([]);
  }, []);

  return {
    isSelecting,
    currentSelection,
    startSelection,
    updateSelection,
    endSelection,
    clearSelection
  };
}

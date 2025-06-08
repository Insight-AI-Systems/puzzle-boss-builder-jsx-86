
import { useState, useCallback } from 'react';
import { cellToString, stringToCell } from '@/business/engines/word-search/utils';

interface Cell {
  row: number;
  col: number;
}

export function useWordSearchSelection() {
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [currentSelection, setCurrentSelection] = useState<string[]>([]);

  const startSelection = useCallback((cell: Cell | string) => {
    const cellId = typeof cell === 'string' ? cell : cellToString(cell);
    setIsSelecting(true);
    setDragStart(cellId);
    setCurrentSelection([cellId]);
  }, []);

  const updateSelection = useCallback((cell: Cell | string) => {
    if (!isSelecting || !dragStart) return;

    const cellId = typeof cell === 'string' ? cell : cellToString(cell);
    const startCell = stringToCell(dragStart);
    const endCell = typeof cell === 'string' ? stringToCell(cell) : cell;

    const cellsBetween: string[] = [];
    const rowDiff = Math.abs(endCell.row - startCell.row);
    const colDiff = Math.abs(endCell.col - startCell.col);

    // Only allow straight lines (horizontal, vertical, diagonal)
    if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) {
      const rowDir = endCell.row > startCell.row ? 1 : endCell.row < startCell.row ? -1 : 0;
      const colDir = endCell.col > startCell.col ? 1 : endCell.col < startCell.col ? -1 : 0;

      let currentRow = startCell.row;
      let currentCol = startCell.col;
      
      while (currentRow !== endCell.row + rowDir || currentCol !== endCell.col + colDir) {
        cellsBetween.push(cellToString({ row: currentRow, col: currentCol }));
        if (currentRow === endCell.row && currentCol === endCell.col) break;
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

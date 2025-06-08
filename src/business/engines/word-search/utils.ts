
import { Cell } from './types';

export const cellToString = (cell: Cell): string => `${cell.row}-${cell.col}`;

export const stringToCell = (cellId: string): Cell => {
  const [row, col] = cellId.split('-').map(Number);
  return { row, col };
};

export const cellsToStrings = (cells: Cell[]): string[] => 
  cells.map(cellToString);

export const stringsToCells = (cellIds: string[]): Cell[] => 
  cellIds.map(stringToCell);

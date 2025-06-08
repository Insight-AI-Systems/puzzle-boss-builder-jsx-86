
export interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
  cells: Cell[];
}

export interface Cell {
  row: number;
  col: number;
}

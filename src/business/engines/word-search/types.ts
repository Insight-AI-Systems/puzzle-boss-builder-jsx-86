
export interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
  cells: string[];
}

export interface Cell {
  row: number;
  col: number;
}

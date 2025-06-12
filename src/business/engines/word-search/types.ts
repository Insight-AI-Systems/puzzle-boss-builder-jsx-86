
export interface Cell {
  row: number;
  col: number;
}

export interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal-dr' | 'diagonal-dl' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-ur' | 'diagonal-ul';
  cells: Cell[];
}

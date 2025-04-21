
import { PuzzlePiece, Edge } from '../types/puzzleTypes';

/**
 * Generate puzzle pieces based on rows and columns.
 * This is a basic implementation that will be enhanced in future phases.
 */
export const generatePuzzlePieces = (rows: number, columns: number): PuzzlePiece[] => {
  const pieces: PuzzlePiece[] = [];
  const totalPieces = rows * columns;
  
  for (let i = 0; i < totalPieces; i++) {
    // Calculate row and column for this piece
    const row = Math.floor(i / columns);
    const col = i % columns;
    
    // Generate edges for this piece
    const edges: Edge[] = [];
    
    // Top edge
    edges.push({
      id: `p${i}-top`,
      type: row === 0 ? 'flat' : (Math.random() > 0.5 ? 'tab' : 'slot'),
      position: 'top',
      matchingEdgeId: row === 0 ? undefined : `p${i - columns}-bottom`
    });
    
    // Right edge
    edges.push({
      id: `p${i}-right`,
      type: col === columns - 1 ? 'flat' : (Math.random() > 0.5 ? 'tab' : 'slot'),
      position: 'right',
      matchingEdgeId: col === columns - 1 ? undefined : `p${i + 1}-left`
    });
    
    // Bottom edge
    edges.push({
      id: `p${i}-bottom`,
      type: row === rows - 1 ? 'flat' : (Math.random() > 0.5 ? 'tab' : 'slot'),
      position: 'bottom',
      matchingEdgeId: row === rows - 1 ? undefined : `p${i + columns}-top`
    });
    
    // Left edge
    edges.push({
      id: `p${i}-left`,
      type: col === 0 ? 'flat' : (Math.random() > 0.5 ? 'tab' : 'slot'),
      position: 'left',
      matchingEdgeId: col === 0 ? undefined : `p${i - 1}-right`
    });
    
    // Create the piece
    pieces.push({
      id: i,
      position: i, // Initially in correct position
      originalPosition: i,
      edges,
      width: 100 / columns,
      height: 100 / rows,
      isCorrect: true // Initially all pieces are in the correct position
    });
  }
  
  return pieces;
};

/**
 * Advanced piece generator that will create SVG paths for jigsaw pieces.
 * This is a placeholder for the future implementation.
 */
export const generateAdvancedPieces = (
  rows: number, 
  columns: number,
  imageWidth: number,
  imageHeight: number
): PuzzlePiece[] => {
  // This will be implemented in Phase B
  return generatePuzzlePieces(rows, columns);
};

/**
 * Calculate the SVG path for a piece edge.
 * This is a placeholder for the future implementation.
 */
export const calculateEdgePath = (
  edgeType: 'tab' | 'slot' | 'flat',
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  orientation: 'horizontal' | 'vertical'
): string => {
  // This will be implemented in Phase B
  // For now, we'll just return a straight line
  return `M ${startX} ${startY} L ${endX} ${endY}`;
};

/**
 * Check if two pieces can connect.
 */
export const canPiecesConnect = (piece1: PuzzlePiece, piece2: PuzzlePiece): boolean => {
  // Check if pieces are adjacent in the original puzzle
  const row1 = Math.floor(piece1.originalPosition / Math.sqrt(piece1.originalPosition));
  const col1 = piece1.originalPosition % Math.sqrt(piece1.originalPosition);
  const row2 = Math.floor(piece2.originalPosition / Math.sqrt(piece2.originalPosition));
  const col2 = piece2.originalPosition % Math.sqrt(piece2.originalPosition);
  
  // Check if pieces are adjacent
  const isAdjacent = 
    (Math.abs(row1 - row2) === 1 && col1 === col2) ||
    (Math.abs(col1 - col2) === 1 && row1 === row2);
  
  return isAdjacent;
};


// Calculate the bounds and constraints for a puzzle piece
export function calculatePieceBounds(
  position: number, 
  originalPosition: number,
  rows: number, 
  columns: number, 
  width: number, 
  height: number,
  snapThreshold: number = 20
): { isSnappable: boolean, snapPosition: number | null } {
  // Calculate current row and column for this position
  const currentRow = Math.floor(position / columns);
  const currentCol = position % columns;
  
  // Calculate original row and column
  const originalRow = Math.floor(originalPosition / columns);
  const originalCol = originalPosition % columns;
  
  // Check if we're close to the original position
  const rowDistance = Math.abs(currentRow - originalRow);
  const colDistance = Math.abs(currentCol - originalCol);
  
  // Convert pixelThreshold to grid units
  const rowThreshold = snapThreshold / height;
  const colThreshold = snapThreshold / width;
  
  // Check if we're within snapping threshold of the original position
  const isSnappable = rowDistance <= rowThreshold && colDistance <= colThreshold;
  
  return {
    isSnappable,
    snapPosition: isSnappable ? originalPosition : null
  };
}

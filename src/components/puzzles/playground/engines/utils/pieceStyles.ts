
/**
 * Utility functions for puzzle piece styling
 */

export function getPieceStyle(
  pieceId: number,
  imageUrl: string,
  rows: number,
  columns: number,
  size: number = 64
): React.CSSProperties {
  // Calculate row and column based on the original piece id
  // This is the critical part - we use the pieceId to determine its original position
  const row = Math.floor(pieceId / columns);
  const col = pieceId % columns;
  
  // Calculate percentage-based background position
  const xPercent = (col * 100) / (columns - 1);
  const yPercent = (row * 100) / (rows - 1);
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: `${xPercent}% ${yPercent}%`,
    backgroundRepeat: "no-repeat",
    borderRadius: "0.4rem",
    border: "1px solid rgba(0,0,0,0.15)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    cursor: "grab"
  };
}

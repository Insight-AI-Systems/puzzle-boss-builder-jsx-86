
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
  const row = Math.floor(pieceId / columns);
  const col = pieceId % columns;
  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: `${(col * 100) / (columns - 1)}% ${(row * 100) / (rows - 1)}%`,
    backgroundRepeat: "no-repeat",
    borderRadius: "0.4rem",
    border: "1px solid rgba(0,0,0,0.15)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    cursor: "grab"
  };
}

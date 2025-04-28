
export const calculatePiecePosition = (
  index: number,
  rows: number,
  columns: number,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number } => {
  const pieceWidth = containerWidth / columns;
  const pieceHeight = containerHeight / rows;
  
  const row = Math.floor(index / columns);
  const col = index % columns;
  
  return {
    x: col * pieceWidth,
    y: row * pieceHeight
  };
};

export const calculatePieceStyle = (
  pieceId: string, 
  position: number,
  rows: number,
  columns: number,
  containerWidth: number,
  containerHeight: number,
  image: string
): React.CSSProperties => {
  const pieceIndex = parseInt(pieceId.split('-')[1]);
  const pieceWidth = containerWidth / columns;
  const pieceHeight = containerHeight / rows;
  
  // Calculate the position in the original image
  const originalRow = Math.floor(pieceIndex / columns);
  const originalCol = pieceIndex % columns;
  
  return {
    width: `${pieceWidth}px`,
    height: `${pieceHeight}px`,
    backgroundImage: `url(${image})`,
    backgroundSize: `${containerWidth}px ${containerHeight}px`,
    backgroundPosition: `-${originalCol * pieceWidth}px -${originalRow * pieceHeight}px`,
  };
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

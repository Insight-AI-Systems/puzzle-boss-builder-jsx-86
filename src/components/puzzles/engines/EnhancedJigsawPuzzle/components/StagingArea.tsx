
import React from 'react';
import { PuzzlePiece } from '../hooks/usePuzzleState';
import JigsawPiece from './JigsawPiece';

interface StagingAreaProps {
  pieces: PuzzlePiece[];
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers: boolean;
  onPlacePiece: (pieceId: number, position: number) => void;
}

const StagingArea: React.FC<StagingAreaProps> = ({
  pieces,
  imageUrl,
  rows,
  columns,
  showNumbers,
  onPlacePiece
}) => {
  if (pieces.length === 0) return null;
  
  // Calculate piece size for the staging area (smaller than board pieces)
  const pieceWidth = 60;
  const pieceHeight = (rows / columns) * pieceWidth;
  
  return (
    <div className="staging-area mt-6 p-4 bg-background/5 border border-border rounded-lg">
      <div className="text-center text-sm font-medium text-muted-foreground mb-2">
        Pieces: {pieces.length}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {pieces.map((piece) => (
          <div
            key={`staging-piece-${piece.id}`}
            className="staging-piece-container relative"
            style={{ 
              width: pieceWidth, 
              height: pieceHeight,
              perspective: '1000px' 
            }}
          >
            <JigsawPiece
              piece={piece}
              imageUrl={imageUrl}
              rows={rows}
              columns={columns}
              width={pieceWidth}
              height={pieceHeight}
              showNumber={showNumbers}
              onDragStart={(e) => {
                const dragEvent = e as React.DragEvent;
                if (dragEvent.dataTransfer) {
                  dragEvent.dataTransfer.setData('text/plain', piece.id.toString());
                }
              }}
              onDoubleClick={() => {
                // When double-clicking a staging piece, try to find its correct position
                if (piece.originalPosition !== null) {
                  onPlacePiece(piece.id, piece.originalPosition);
                }
              }}
              isDragging={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StagingArea;

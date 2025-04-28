import React, { useState, useRef, useEffect } from 'react';
import { PuzzlePiece } from './PuzzlePiece';
import { StagingArea } from './StagingArea';
import { type PuzzlePiece as PuzzlePieceType } from '../hooks/usePuzzleState';

interface PuzzleBoardProps {
  imageUrl: string;
  rows: number;
  columns: number;
  boardPieces: PuzzlePieceType[];
  stagingPieces: PuzzlePieceType[];
  onPiecePlaced: (id: number, position: number) => void;
  onPieceRemoved: (id: number) => void;
  isPieceCorrect: (id: number) => boolean;
  showGhost: boolean;
  showNumbers: boolean;
  onFirstInteraction: () => void;
  isComplete: boolean;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  imageUrl,
  rows,
  columns,
  boardPieces,
  stagingPieces,
  onPiecePlaced,
  onPieceRemoved,
  isPieceCorrect,
  showGhost,
  showNumbers,
  onFirstInteraction,
  isComplete
}) => {
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Calculate board size based on container width
  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current) {
        const width = boardRef.current.clientWidth;
        // Keep aspect ratio based on columns/rows
        const height = width * (rows / columns);
        setBoardSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [rows, columns]);

  // Calculate cell size
  const cellWidth = boardSize.width / columns;
  const cellHeight = boardSize.height / rows;

  // Handle drag start
  const handleDragStart = (id: number) => {
    setDraggingPiece(id);
    onFirstInteraction();
  };

  // Handle drag over for drop zones
  const handleDragOver = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    e.currentTarget.classList.add('highlight');
  };

  // Handle drag leave for drop zones
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('highlight');
  };

  // Handle drop on board
  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('highlight');
    
    if (draggingPiece !== null) {
      onPiecePlaced(draggingPiece, position);
      setDraggingPiece(null);
    }
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (id: number) => {
    handleDragStart(id);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main puzzle board */}
      <div 
        ref={boardRef}
        className={`puzzle-board relative border border-border ${isComplete ? 'completed' : ''}`}
        style={{ 
          width: '100%',
          height: boardSize.height > 0 ? boardSize.height : 'auto',
          backgroundImage: showGhost || isComplete ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: showGhost && !isComplete ? 0.3 : 1
        }}
      >
        {/* Grid cells for piece placement */}
        {Array.from({ length: rows * columns }).map((_, position) => {
          const piece = boardPieces.find(p => p.position === position);
          const isCorrect = piece ? isPieceCorrect(piece.id) : false;
          
          return (
            <div
              key={`cell-${position}`}
              className={`puzzle-cell absolute ${piece ? '' : 'empty-cell'}`}
              style={{
                width: `${cellWidth}px`,
                height: `${cellHeight}px`,
                left: `${(position % columns) * cellWidth}px`,
                top: `${Math.floor(position / columns) * cellHeight}px`,
              }}
              onDragOver={(e) => !piece && handleDragOver(e, position)}
              onDragLeave={(e) => !piece && handleDragLeave(e)}
              onDrop={(e) => !piece && handleDrop(e, position)}
              data-position={position}
            >
              {/* Render pieces that are on the board */}
              {piece && (
                <PuzzlePiece
                  piece={piece}
                  imageUrl={imageUrl}
                  rows={rows}
                  columns={columns}
                  isCorrect={isCorrect}
                  isDragging={piece.id === draggingPiece}
                  onDragStart={() => handleDragStart(piece.id)}
                  onTouchStart={() => handleTouchStart(piece.id)}
                  onDragEnd={() => setDraggingPiece(null)}
                  onDoubleClick={() => !isCorrect && onPieceRemoved(piece.id)}
                  showNumber={showNumbers}
                  width={cellWidth}
                  height={cellHeight}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Staging area for unused pieces */}
      {!isComplete && (
        <StagingArea 
          stagingPieces={stagingPieces}
          imageUrl={imageUrl}
          rows={rows}
          columns={columns}
          onPieceDragStart={handleDragStart}
          onPieceDragEnd={() => setDraggingPiece(null)}
          onPieceDoubleClick={(id, position) => onPiecePlaced(id, position)}
          showNumbers={showNumbers}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
        />
      )}
    </div>
  );
};

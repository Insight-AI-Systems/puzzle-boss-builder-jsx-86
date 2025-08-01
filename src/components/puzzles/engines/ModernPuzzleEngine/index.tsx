import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ModernPuzzleProps {
  imageUrl: string;
  rows?: number;
  columns?: number;
  puzzleId?: string;
  showNumbers?: boolean;
  showGuide?: boolean;
  onComplete?: (stats: { moves: number, time: number }) => void;
}

interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  currentRow?: number;
  currentCol?: number;
  isPlaced: boolean;
}

const ModernPuzzleEngine: React.FC<ModernPuzzleProps> = ({
  imageUrl,
  rows = 3,
  columns = 3,
  puzzleId = 'modern-puzzle',
  showNumbers = false,
  showGuide = true,
  onComplete
}) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const boardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize puzzle pieces
  useEffect(() => {
    const newPieces: PuzzlePiece[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        newPieces.push({
          id: row * columns + col,
          row,
          col,
          currentRow: Math.floor(Math.random() * rows),
          currentCol: Math.floor(Math.random() * columns),
          isPlaced: false
        });
      }
    }
    
    // Shuffle pieces
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempRow = newPieces[i].currentRow;
      const tempCol = newPieces[i].currentCol;
      newPieces[i].currentRow = newPieces[j].currentRow;
      newPieces[i].currentCol = newPieces[j].currentCol;
      newPieces[j].currentRow = tempRow;
      newPieces[j].currentCol = tempCol;
    }
    
    setPieces(newPieces);
  }, [rows, columns]);

  // Check for completion
  useEffect(() => {
    const allPlaced = pieces.every(piece => piece.isPlaced);
    if (allPlaced && pieces.length > 0 && !isComplete) {
      setIsComplete(true);
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      toast({
        title: '🎉 Puzzle Complete!',
        description: `Solved in ${moves} moves and ${timeElapsed} seconds!`,
      });
      onComplete?.({ moves, time: timeElapsed });
    }
  }, [pieces, isComplete, moves, startTime, toast, onComplete]);

  const handleDragStart = (piece: PuzzlePiece, e: React.DragEvent) => {
    setDraggedPiece(piece);
    e.dataTransfer.setData('text/plain', piece.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetRow: number, targetCol: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedPiece) return;

    const isCorrectPosition = draggedPiece.row === targetRow && draggedPiece.col === targetCol;
    
    setPieces(prev => prev.map(piece => {
      if (piece.id === draggedPiece.id) {
        return {
          ...piece,
          currentRow: targetRow,
          currentCol: targetCol,
          isPlaced: isCorrectPosition
        };
      }
      return piece;
    }));

    setMoves(prev => prev + 1);
    setDraggedPiece(null);

    if (isCorrectPosition) {
      toast({
        title: '✅ Correct!',
        description: 'Piece placed correctly!',
      });
    }
  };

  const pieceWidth = 100 / columns;
  const pieceHeight = 100 / rows;

  return (
    <div className="modern-puzzle-engine w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-puzzle-white">Modern Clean Design</h3>
        <p className="text-sm text-muted-foreground">Moves: {moves} | Complete: {isComplete ? '✅' : '⏳'}</p>
      </div>

      <div 
        ref={boardRef}
        className="relative bg-puzzle-black border-2 border-puzzle-aqua rounded-lg overflow-hidden"
        style={{
          aspectRatio: `${columns} / ${rows}`,
          backgroundImage: showGuide ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: showGuide ? 0.3 : 1
        }}
      >
        {/* Drop zones */}
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: columns }, (_, col) => (
            <div
              key={`zone-${row}-${col}`}
              className="absolute border border-puzzle-aqua/30 bg-transparent hover:bg-puzzle-aqua/10 transition-colors"
              style={{
                left: `${col * pieceWidth}%`,
                top: `${row * pieceHeight}%`,
                width: `${pieceWidth}%`,
                height: `${pieceHeight}%`
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(row, col, e)}
            />
          ))
        )}

        {/* Puzzle pieces */}
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className={`absolute border-2 rounded-md cursor-grab transition-all duration-200 ${
              piece.isPlaced 
                ? 'border-green-400 bg-green-400/20' 
                : 'border-puzzle-white bg-puzzle-black/80'
            } ${draggedPiece?.id === piece.id ? 'z-50 scale-105' : 'z-10'}`}
            style={{
              left: `${(piece.currentCol || 0) * pieceWidth}%`,
              top: `${(piece.currentRow || 0) * pieceHeight}%`,
              width: `${pieceWidth}%`,
              height: `${pieceHeight}%`,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${columns * 100}% ${rows * 100}%`,
              backgroundPosition: `-${piece.col * 100}% -${piece.row * 100}%`
            }}
            draggable
            onDragStart={(e) => handleDragStart(piece, e)}
          >
            {showNumbers && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black/70 text-white px-2 py-1 text-xs rounded">
                  {piece.id + 1}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernPuzzleEngine;
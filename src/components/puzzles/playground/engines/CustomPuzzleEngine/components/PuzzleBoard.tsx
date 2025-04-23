
import React, { useState, useEffect } from 'react';
import { PuzzlePiece } from '../hooks/usePuzzleState';

interface PuzzleBoardProps {
  imageUrl: string;
  pieces: PuzzlePiece[];
  rows: number;
  columns: number;
  onPieceDrop: (id: number, position: number) => void;
  isPieceCorrect: (id: number) => boolean;
  showGuideImage: boolean;
  showNumbers: boolean;
  onDragStart: () => void;
  draggedPiece: number | null;
  setDraggedPiece: (id: number | null) => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  imageUrl,
  pieces,
  rows,
  columns,
  onPieceDrop,
  isPieceCorrect,
  showGuideImage,
  showNumbers,
  onDragStart,
  draggedPiece,
  setDraggedPiece
}) => {
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  
  useEffect(() => {
    console.log("PuzzleBoard received pieces:", pieces.length);
  }, [pieces]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    onDragStart();
    e.dataTransfer.setData('text/plain', id.toString());
    setDraggedPiece(id);
    console.log('Drag started with piece:', id);
  };

  // Handle drag over (to allow drop)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    if (!isNaN(id)) {
      console.log(`Dropping piece ${id} at position ${position}`);
      onPieceDrop(id, position);
      setDraggedPiece(null);
    }
  };

  // Handle click for mobile devices
  const handlePieceClick = (id: number) => {
    if (selectedPiece === id) {
      setSelectedPiece(null);
    } else if (selectedPiece === null) {
      setSelectedPiece(id);
      onDragStart();
    } else {
      // Find the position of the clicked piece
      const clickedPiece = pieces.find(p => p.id === id);
      if (clickedPiece) {
        console.log(`Moving piece ${selectedPiece} to position ${clickedPiece.position}`);
        onPieceDrop(selectedPiece, clickedPiece.position);
        setSelectedPiece(null);
      }
    }
  };

  return (
    <div className="puzzle-board relative bg-black/20 border border-puzzle-aqua/30 rounded-lg overflow-hidden"
         style={{ aspectRatio: '1/1', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      {/* Guide image */}
      {showGuideImage && (
        <img 
          src={imageUrl} 
          alt="Puzzle guide" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
        />
      )}
      
      {/* Grid for puzzle */}
      <div className="grid relative z-10"
           style={{ 
             gridTemplateColumns: `repeat(${columns}, 1fr)`,
             gridTemplateRows: `repeat(${rows}, 1fr)`,
             width: '100%',
             height: '100%',
           }}>
        {/* Generate grid cells */}
        {Array.from({ length: rows * columns }).map((_, position) => {
          const piece = pieces.find(p => p.position === position);
          const isCorrect = piece ? isPieceCorrect(piece.id) : false;
          
          return (
            <div 
              key={`cell-${position}`}
              className={`puzzle-cell relative ${piece ? 'has-piece' : 'empty-cell'}`}
              style={{ 
                border: '1px dashed rgba(255,255,255,0.2)',
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, position)}
            >
              {piece && (
                <div
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, piece.id)}
                  onClick={() => handlePieceClick(piece.id)}
                  className={`puzzle-piece absolute inset-0 cursor-pointer transition-all
                              ${isCorrect ? 'border-2 border-green-500/50' : 'border border-white/20'} 
                              ${draggedPiece === piece.id ? 'opacity-50' : 'opacity-100'}
                              ${selectedPiece === piece.id ? 'ring-2 ring-puzzle-gold scale-95' : ''}
                              ${selectedPiece !== null && selectedPiece !== piece.id ? 'hover:ring-2 hover:ring-blue-500' : ''}
                              hover:brightness-110`}
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: `${columns * 100}% ${rows * 100}%`,
                    backgroundPosition: `${((piece.originalPosition % columns) / (columns - 1)) * 100}% ${(Math.floor(piece.originalPosition / columns) / (rows - 1)) * 100}%`,
                  }}
                >
                  {showNumbers && (
                    <span className="absolute top-1 left-1 text-xs bg-black/50 rounded-full w-5 h-5 flex items-center justify-center text-white">
                      {piece.id + 1}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

PuzzleBoard.displayName = 'PuzzleBoard';

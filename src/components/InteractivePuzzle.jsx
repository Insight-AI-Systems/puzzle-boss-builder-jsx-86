
import React, { useRef } from 'react';
import PuzzlePiece from './puzzle/PuzzlePiece';
import SuccessOverlay from './puzzle/SuccessOverlay';
import PuzzleControls from './puzzle/PuzzleControls';
import { usePuzzle } from '../hooks/usePuzzle';

const InteractivePuzzle = () => {
  const containerRef = useRef(null);
  
  const {
    pieces,
    solved,
    gridSize,
    muted,
    draggedPiece,
    puzzleImage,
    setDraggedPiece,
    setMuted,
    shufflePuzzle,
    resetPuzzle,
    handleDrop,
    playSoundEffect,
    allowDrop
  } = usePuzzle({ initialMuted: true });
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xs mb-4">
        <div 
          ref={containerRef}
          className={`relative aspect-square rounded-md overflow-hidden bg-puzzle-black/50 border-2 ${solved ? 'border-puzzle-gold' : 'border-puzzle-aqua'}`}
          onDragOver={allowDrop}
        >
          {/* Puzzle pieces */}
          {pieces.map((piece) => (
            <PuzzlePiece
              key={piece.id}
              piece={piece}
              puzzleImage={puzzleImage}
              gridSize={gridSize}
              draggedPiece={draggedPiece}
              setDraggedPiece={setDraggedPiece}
              playSound={playSoundEffect}
              onDrop={(e) => handleDrop(e, piece.currentPosition.row, piece.currentPosition.col)}
            />
          ))}
          
          {/* Success overlay */}
          {solved && <SuccessOverlay />}
        </div>
      </div>
      
      {/* Controls */}
      <PuzzleControls 
        shufflePuzzle={shufflePuzzle}
        resetPuzzle={resetPuzzle}
        muted={muted}
        setMuted={setMuted}
      />
    </div>
  );
};

export default InteractivePuzzle;

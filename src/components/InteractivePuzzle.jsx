
import React, { useState, useEffect, useRef } from 'react';
import PuzzlePiece from './puzzle/PuzzlePiece';
import SuccessOverlay from './puzzle/SuccessOverlay';
import PuzzleControls from './puzzle/PuzzleControls';
import { getPuzzleConfig, playSound } from './puzzle/PuzzleUtils';

const InteractivePuzzle = () => {
  const [pieces, setPieces] = useState([]);
  const [solved, setSolved] = useState(false);
  const [gridSize, setGridSize] = useState(4); // 4x4 grid (16 pieces)
  const [muted, setMuted] = useState(true);
  const containerRef = useRef(null);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [puzzleImage, setPuzzleImage] = useState('');
  
  // Initialize puzzle with configuration
  useEffect(() => {
    const config = getPuzzleConfig();
    setPuzzleImage(config.image);
    setGridSize(config.gridSize || 4);
  }, []);
  
  // Initialize puzzle pieces
  useEffect(() => {
    if (!puzzleImage) return;
    
    const initializePieces = () => {
      const newPieces = [];
      const totalPieces = gridSize * gridSize;
      
      for (let i = 0; i < totalPieces; i++) {
        // Calculate the correct position for this piece
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        
        newPieces.push({
          id: i,
          correctPosition: {
            row,
            col
          },
          currentPosition: {
            row,
            col
          }
        });
      }
      
      setPieces(newPieces);
      setSolved(true); // Initially solved
    };
    
    initializePieces();
  }, [gridSize, puzzleImage]);
  
  // Check if puzzle is solved
  useEffect(() => {
    if (pieces.length === 0) return;
    
    const isSolved = pieces.every(piece => 
      piece.currentPosition.row === piece.correctPosition.row && 
      piece.currentPosition.col === piece.correctPosition.col
    );
    
    // If newly solved, play success sound
    if (isSolved && !solved && !muted) {
      playSound('success', muted);
    }
    
    setSolved(isSolved);
  }, [pieces, muted, solved]);
  
  // Shuffle the puzzle pieces
  const shufflePuzzle = () => {
    const shuffled = [...pieces];
    
    // Fisher-Yates shuffle algorithm for positions
    let positions = pieces.map(piece => ({
      row: piece.currentPosition.row,
      col: piece.currentPosition.col
    }));
    
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Assign new positions to pieces
    for (let i = 0; i < shuffled.length; i++) {
      shuffled[i] = {
        ...shuffled[i],
        currentPosition: positions[i]
      };
    }
    
    setPieces(shuffled);
    setSolved(false);
  };
  
  // Reset the puzzle to the initial state
  const resetPuzzle = () => {
    const reset = pieces.map(piece => ({
      ...piece,
      currentPosition: { ...piece.correctPosition }
    }));
    
    setPieces(reset);
    setSolved(true);
  };
  
  // Handle dropping piece
  const handleDrop = (e, targetRow, targetCol) => {
    e.preventDefault();
    
    if (!draggedPiece) return;
    
    // Find target piece at drop location
    const targetPiece = pieces.find(
      p => p.currentPosition.row === targetRow && p.currentPosition.col === targetCol
    );
    
    if (!targetPiece) return;
    
    // Swap positions
    const updatedPieces = pieces.map(piece => {
      if (piece.id === draggedPiece.id) {
        return { ...piece, currentPosition: { ...targetPiece.currentPosition } };
      }
      if (piece.id === targetPiece.id) {
        return { ...piece, currentPosition: { ...draggedPiece.currentPosition } };
      }
      return piece;
    });
    
    setPieces(updatedPieces);
    playSound('place', muted);
    setDraggedPiece(null);
  };
  
  // Allow dropping by preventing default behavior
  const allowDrop = (e) => {
    e.preventDefault();
  };
  
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
              playSound={(type) => playSound(type, muted)}
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

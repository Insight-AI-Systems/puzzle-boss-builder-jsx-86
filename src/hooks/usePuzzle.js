
import { useState, useEffect } from 'react';
import { getPuzzleConfig, playSound } from '../components/puzzle/PuzzleUtils';

/**
 * Custom hook for puzzle logic and state management
 * @param {Object} options - Optional configuration
 * @param {boolean} options.initialMuted - Whether sound is initially muted
 * @returns {Object} Puzzle state and methods
 */
export const usePuzzle = ({ initialMuted = true } = {}) => {
  const [pieces, setPieces] = useState([]);
  const [solved, setSolved] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [muted, setMuted] = useState(initialMuted);
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
  
  // Play sound with muting check
  const playSoundEffect = (type) => {
    playSound(type, muted);
  };
  
  return {
    // State
    pieces,
    solved,
    gridSize,
    muted,
    draggedPiece,
    puzzleImage,
    
    // Actions
    setDraggedPiece,
    setMuted,
    shufflePuzzle,
    resetPuzzle,
    handleDrop,
    playSoundEffect,
    
    // Helpers
    allowDrop: (e) => e.preventDefault(),
  };
};

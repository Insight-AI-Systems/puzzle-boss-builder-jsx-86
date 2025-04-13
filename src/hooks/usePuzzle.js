
import { useState, useEffect, useCallback, useMemo } from 'react';
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
  
  // Initialize puzzle with configuration - only runs once
  useEffect(() => {
    const config = getPuzzleConfig();
    setPuzzleImage(config.image);
    setGridSize(config.gridSize || 4);
  }, []);
  
  // Memoized piece initialization to prevent unnecessary recalculations
  const initializePieces = useCallback(() => {
    if (!puzzleImage) return [];
    
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
    
    return newPieces;
  }, [gridSize, puzzleImage]);
  
  // Initialize pieces only when necessary
  useEffect(() => {
    const newPieces = initializePieces();
    if (newPieces.length > 0) {
      setPieces(newPieces);
      setSolved(true); // Initially solved
    }
  }, [initializePieces]);
  
  // Memoized puzzle solved check to prevent recalculation on every render
  const checkIfSolved = useCallback(() => {
    if (pieces.length === 0) return false;
    
    return pieces.every(piece => 
      piece.currentPosition.row === piece.correctPosition.row && 
      piece.currentPosition.col === piece.correctPosition.col
    );
  }, [pieces]);
  
  // Determine if puzzle is solved, with debouncing to reduce checks
  useEffect(() => {
    const isSolved = checkIfSolved();
    
    // Only play sound and update state if the solved status changes
    if (isSolved !== solved) {
      if (isSolved && !muted) {
        playSound('success', muted);
      }
      setSolved(isSolved);
    }
  }, [checkIfSolved, muted, solved]);
  
  // Optimized shuffle with memoization
  const shufflePuzzle = useCallback(() => {
    // Skip if no pieces are loaded
    if (pieces.length === 0) return;
    
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
  }, [pieces]);
  
  // Optimized reset function
  const resetPuzzle = useCallback(() => {
    // Skip if no pieces are loaded
    if (pieces.length === 0) return;
    
    const reset = pieces.map(piece => ({
      ...piece,
      currentPosition: { ...piece.correctPosition }
    }));
    
    setPieces(reset);
    setSolved(true);
  }, [pieces]);
  
  // Optimized drop handler with memoization
  const handleDrop = useCallback((e, targetRow, targetCol) => {
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
  }, [draggedPiece, muted, pieces]);
  
  // Optimized sound effect player
  const playSoundEffect = useCallback((type) => {
    playSound(type, muted);
  }, [muted]);
  
  // Prevent default for drag over - memoized to avoid recreating on each render
  const allowDrop = useCallback((e) => e.preventDefault(), []);
  
  // Expose only what's needed by components
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
    allowDrop,
  };
};

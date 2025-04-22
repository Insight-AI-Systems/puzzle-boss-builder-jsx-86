
import React, { useState, useEffect } from 'react';
import { useGridState } from '../hooks/useGridState';
import { SimplePuzzlePiece } from '../types/simple-puzzle-types';
import '../styles/puzzle-animations.css';

interface GridBasedPuzzleProps {
  rows?: number;
  columns?: number;
}

const GridBasedPuzzle: React.FC<GridBasedPuzzleProps> = ({
  rows = 3,
  columns = 3
}) => {
  // State for pieces
  const [pieces, setPieces] = useState<SimplePuzzlePiece[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [draggedPieceId, setDraggedPieceId] = useState<string | null>(null);
  
  // Grid state management
  const { grid, handlePieceDrop, resetGrid, debugGrid } = useGridState(
    pieces,
    rows,
    columns,
    setPieces
  );
  
  // Initialize pieces
  useEffect(() => {
    const totalPieces = rows * columns;
    const initialPieces: SimplePuzzlePiece[] = [];
    
    for (let i = 0; i < totalPieces; i++) {
      initialPieces.push({
        id: `piece-${i}`,
        position: -1, // Start in staging area
        originalPosition: i, // Set the original position as required by SimplePuzzlePiece
        color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
        isDragging: false
      });
    }
    
    setPieces(initialPieces);
  }, [rows, columns]);
  
  // Check for puzzle completion
  useEffect(() => {
    if (pieces.length === 0) return;
    
    const allCorrect = pieces.every(piece => {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      return piece.position === pieceNumber;
    });
    
    if (allCorrect && moveCount > 0) {
      setIsSolved(true);
      console.log('Puzzle solved!');
    }
  }, [pieces, moveCount]);
  
  // Shuffle pieces
  const handleShuffle = () => {
    setIsSolved(false);
    resetGrid();
    setMoveCount(0);
    
    // Randomly place some pieces on the grid and others in staging
    setPieces(prevPieces => {
      const shuffled = [...prevPieces];
      const positions = Array.from({ length: rows * columns }, (_, i) => i);
      
      // Fisher-Yates shuffle
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      
      // Place about half the pieces on the grid
      const piecesToPlace = Math.floor(shuffled.length / 2);
      
      return shuffled.map((piece, index) => ({
        ...piece,
        position: index < piecesToPlace ? positions[index] : -1,
        isDragging: false
      }));
    });
  };
  
  // Handle drag start
  const handleDragStart = (e: React.DragEvent, pieceId: string) => {
    setDraggedPieceId(pieceId);
    
    // Update dragging state
    setPieces(prev => prev.map(p => 
      p.id === pieceId ? { ...p, isDragging: true } : p
    ));
    
    e.dataTransfer.setData('text/plain', pieceId);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    if (draggedPieceId) {
      // Clear dragging state
      setPieces(prev => prev.map(p => 
        p.id === draggedPieceId ? { ...p, isDragging: false } : p
      ));
      
      setDraggedPieceId(null);
    }
  };
  
  // Allow dropping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Handle dropping on grid
  const handleCellDrop = (e: React.DragEvent, cellIndex: number) => {
    e.preventDefault();
    
    const pieceId = e.dataTransfer.getData('text/plain');
    if (!pieceId) return;
    
    // Record the move
    setMoveCount(prev => prev + 1);
    
    // Update the grid and pieces
    handlePieceDrop(pieceId, cellIndex);
  };
  
  // Handle dropping on staging area
  const handleStagingDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const pieceId = e.dataTransfer.getData('text/plain');
    if (!pieceId) return;
    
    // If the piece is correctly placed, don't allow moving to staging
    const piece = pieces.find(p => p.id === pieceId);
    if (piece) {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      if (piece.position === pieceNumber) return;
    }
    
    // Record the move
    setMoveCount(prev => prev + 1);
    
    // Move to staging (position -1)
    setPieces(prev => prev.map(p => 
      p.id === pieceId ? { ...p, position: -1, isDragging: false } : p
    ));
  };
  
  // Get staging pieces
  const stagingPieces = pieces.filter(p => p.position < 0);
  
  return (
    <div className="grid-based-puzzle flex flex-col items-center">
      <div className="controls mb-4 flex space-x-4">
        <button 
          onClick={handleShuffle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Shuffle
        </button>
        <button 
          onClick={debugGrid}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Debug Grid
        </button>
        <div className="move-counter px-4 py-2 bg-gray-100 rounded">
          Moves: {moveCount}
        </div>
      </div>
      
      <div 
        className={`grid-container p-2 bg-gray-800 rounded-lg border-2 ${
          isSolved ? 'border-yellow-500' : 'border-blue-500'
        }`}
        style={{ width: columns * 70 + (columns * 4) }}
      >
        <div 
          className="puzzle-grid grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {Array.from({ length: rows * columns }).map((_, cellIndex) => {
            const pieceId = grid[cellIndex];
            const piece = pieceId !== null 
              ? pieces.find(p => parseInt(p.id.split('-')[1]) === pieceId) 
              : null;
            
            const isCorrect = piece 
              ? parseInt(piece.id.split('-')[1]) === cellIndex 
              : false;
            
            return (
              <div 
                key={`cell-${cellIndex}`}
                className={`puzzle-cell flex items-center justify-center ${
                  piece ? 'occupied' : 'empty'
                } ${isCorrect ? 'correct' : ''}`}
                style={{ 
                  width: 70,
                  height: 70,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'
                }}
                onDrop={(e) => handleCellDrop(e, cellIndex)}
                onDragOver={handleDragOver}
              >
                {piece && (
                  <div 
                    className={`puzzle-piece flex items-center justify-center rounded-md ${
                      isCorrect ? 'puzzle-piece-correct' : ''
                    } ${piece.isDragging ? 'puzzle-piece-dragging' : ''}`}
                    style={{ 
                      width: 60, 
                      height: 60, 
                      backgroundColor: piece.color,
                      cursor: isCorrect ? 'default' : 'grab'
                    }}
                    draggable={!isCorrect}
                    onDragStart={(e) => handleDragStart(e, piece.id)}
                    onDragEnd={handleDragEnd}
                  >
                    {parseInt(piece.id.split('-')[1]) + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div 
        className="staging-area mt-4 p-2 bg-gray-700 rounded-lg min-h-16 flex flex-wrap gap-2"
        style={{ width: columns * 70 + (columns * 4) }}
        onDrop={handleStagingDrop}
        onDragOver={handleDragOver}
      >
        {stagingPieces.map(piece => (
          <div 
            key={`staging-${piece.id}`}
            className={`puzzle-piece flex items-center justify-center rounded-md ${
              piece.isDragging ? 'puzzle-piece-dragging opacity-50' : ''
            }`}
            style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: piece.color,
              cursor: 'grab'
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, piece.id)}
            onDragEnd={handleDragEnd}
          >
            {parseInt(piece.id.split('-')[1]) + 1}
          </div>
        ))}
        {stagingPieces.length === 0 && (
          <div className="text-gray-300 text-center py-2 w-full">
            All pieces are placed on the grid
          </div>
        )}
      </div>
      
      {isSolved && (
        <div className="success-banner mt-4 py-2 px-4 bg-green-500 text-white rounded-full animate-pulse">
          Puzzle Solved! 🎉
        </div>
      )}
    </div>
  );
};

export default GridBasedPuzzle;

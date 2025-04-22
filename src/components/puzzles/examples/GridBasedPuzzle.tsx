
import React from 'react';
import { useGridState } from '../hooks/useGridState';
import { useSimplePuzzlePieces } from '../hooks/usePuzzlePieces';
import PuzzleGrid from '../components/PuzzleGrid';
import PuzzleStagingArea from '../components/PuzzleStagingArea';
import { Button } from '@/components/ui/button';
import '../styles/puzzle-animations.css';

interface GridBasedPuzzleProps {
  rows?: number;
  columns?: number;
}

const GridBasedPuzzle: React.FC<GridBasedPuzzleProps> = ({
  rows = 3,
  columns = 3
}) => {
  const {
    pieces,
    setPieces,
    isSolved,
    setIsSolved,
    moveCount,
    setMoveCount,
    draggedPieceId,
    setDraggedPieceId
  } = useSimplePuzzlePieces(rows, columns);
  
  const { grid, handlePieceDrop, resetGrid, debugGrid } = useGridState(
    pieces,
    rows,
    columns,
    setPieces
  );

  // Handle shuffle
  const handleShuffle = () => {
    setIsSolved(false);
    resetGrid();
    setMoveCount(0);
    
    setPieces(prevPieces => {
      const shuffled = [...prevPieces];
      const positions = Array.from({ length: rows * columns }, (_, i) => i);
      
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      
      const piecesToPlace = Math.floor(shuffled.length / 2);
      
      return shuffled.map((piece, index) => ({
        ...piece,
        position: index < piecesToPlace ? positions[index] : -1,
        isDragging: false
      }));
    });
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, pieceId: string) => {
    setDraggedPieceId(pieceId);
    setPieces(prev => prev.map(p => 
      p.id === pieceId ? { ...p, isDragging: true } : p
    ));
    e.dataTransfer.setData('text/plain', pieceId);
  };

  const handleDragEnd = () => {
    if (draggedPieceId) {
      setPieces(prev => prev.map(p => 
        p.id === draggedPieceId ? { ...p, isDragging: false } : p
      ));
      setDraggedPieceId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCellDrop = (e: React.DragEvent, cellIndex: number) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    if (!pieceId) return;
    setMoveCount(prev => prev + 1);
    handlePieceDrop(pieceId, cellIndex);
  };

  const handleStagingDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    if (!pieceId) return;
    
    const piece = pieces.find(p => p.id === pieceId);
    if (piece) {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      if (piece.position === pieceNumber) return;
    }
    
    setMoveCount(prev => prev + 1);
    setPieces(prev => prev.map(p => 
      p.id === pieceId ? { ...p, position: -1, isDragging: false } : p
    ));
  };

  const stagingPieces = pieces.filter(p => p.position < 0);

  return (
    <div className="grid-based-puzzle flex flex-col items-center">
      <div className="controls mb-4 flex space-x-4">
        <Button onClick={handleShuffle} variant="default">
          Shuffle
        </Button>
        <Button onClick={debugGrid} variant="secondary">
          Debug Grid
        </Button>
        <div className="move-counter px-4 py-2 bg-gray-100 rounded">
          Moves: {moveCount}
        </div>
      </div>

      <PuzzleGrid
        grid={grid}
        pieces={pieces}
        columns={columns}
        isSolved={isSolved}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleCellDrop}
      />

      <PuzzleStagingArea
        stagingPieces={stagingPieces}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleStagingDrop}
      />

      {isSolved && (
        <div className="success-banner mt-4 py-2 px-4 bg-green-500 text-white rounded-full animate-pulse">
          Puzzle Solved! 🎉
        </div>
      )}
    </div>
  );
};

export default GridBasedPuzzle;

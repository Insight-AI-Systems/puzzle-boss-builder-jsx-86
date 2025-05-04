
import React, { useState, useRef, useEffect } from 'react';
import { PuzzlePiece } from '../hooks/usePuzzleState';
import JigsawPiece from './JigsawPiece';
import { generatePiecePath } from '../utils/piecePathGenerator';
import { calculatePieceBounds } from '../utils/pieceBoundsCalculator';

interface PuzzleBoardProps {
  imageUrl: string;
  rows: number;
  columns: number;
  boardPieces: PuzzlePiece[];
  showGuide: boolean;
  showNumbers: boolean;
  isComplete: boolean;
  onPlacePiece: (pieceId: number, position: number) => void;
  onRemovePiece: (pieceId: number) => void;
  snapThreshold: number;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  imageUrl,
  rows,
  columns,
  boardPieces,
  showGuide,
  showNumbers,
  isComplete,
  onPlacePiece,
  onRemovePiece,
  snapThreshold = 20
}) => {
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const [draggedPiece, setDraggedPiece] = useState<{ id: number, startX: number, startY: number } | null>(null);
  
  // Calculate board dimensions based on container width and maintain aspect ratio
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const containerWidth = boardRef.current.clientWidth;
        const aspectRatio = columns / rows;
        const width = containerWidth;
        const height = width / aspectRatio;
        setBoardSize({ width, height });
      }
    };
    
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, [rows, columns]);
  
  // Cell size for individual puzzle slots
  const cellWidth = boardSize.width / columns;
  const cellHeight = boardSize.height / rows;
  
  // Handle drag start
  const handleDragStart = (pieceId: number, e: React.DragEvent | React.TouchEvent) => {
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      e.dataTransfer.setData('text/plain', pieceId.toString());
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    setDraggedPiece({ id: pieceId, startX: clientX, startY: clientY });
    
    if ('dataTransfer' in e) {
      const dragImg = document.createElement('div');
      dragImg.style.opacity = '0';
      document.body.appendChild(dragImg);
      e.dataTransfer.setDragImage(dragImg, 0, 0);
      setTimeout(() => document.body.removeChild(dragImg), 0);
    }
  };
  
  // Handle drag over a drop zone
  const handleDragOver = (position: number, e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('puzzle-cell-hover');
  };
  
  // Handle drag leave from a drop zone
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('puzzle-cell-hover');
  };
  
  // Handle drop on the board
  const handleDrop = (position: number, e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('puzzle-cell-hover');
    
    const pieceId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(pieceId)) {
      onPlacePiece(pieceId, position);
    }
  };
  
  // Handle touch move for mobile
  const handleTouchMove = (e: TouchEvent) => {
    if (!draggedPiece || !boardRef.current) return;
    
    const touch = e.touches[0];
    const board = boardRef.current.getBoundingClientRect();
    
    // Calculate position within the board
    const relativeX = touch.clientX - board.left;
    const relativeY = touch.clientY - board.top;
    
    // Check if we're over a valid cell
    if (relativeX >= 0 && relativeX <= board.width && 
        relativeY >= 0 && relativeY <= board.height) {
      
      // Calculate the cell position
      const col = Math.floor(relativeX / cellWidth);
      const row = Math.floor(relativeY / cellHeight);
      
      if (col >= 0 && col < columns && row >= 0 && row < rows) {
        const position = row * columns + col;
        
        // Check if cell is empty
        const isOccupied = boardPieces.some(p => p.position === position && p.id !== draggedPiece.id);
        
        if (!isOccupied) {
          const cell = document.querySelector(`[data-position="${position}"]`);
          if (cell) {
            cell.classList.add('puzzle-cell-hover');
          }
        }
      }
    }
  };
  
  // Handle touch end for mobile
  const handleTouchEnd = (pieceId: number, e: TouchEvent) => {
    if (!boardRef.current) {
      setDraggedPiece(null);
      return;
    }
    
    const touch = e.changedTouches[0];
    const board = boardRef.current.getBoundingClientRect();
    
    // Calculate position within the board
    const relativeX = touch.clientX - board.left;
    const relativeY = touch.clientY - board.top;
    
    // Clean up hover effects
    document.querySelectorAll('.puzzle-cell-hover').forEach(cell => {
      cell.classList.remove('puzzle-cell-hover');
    });
    
    // Check if we're over a valid cell
    if (relativeX >= 0 && relativeX <= board.width && 
        relativeY >= 0 && relativeY <= board.height) {
      
      // Calculate the cell position
      const col = Math.floor(relativeX / cellWidth);
      const row = Math.floor(relativeY / cellHeight);
      
      if (col >= 0 && col < columns && row >= 0 && row < rows) {
        const position = row * columns + col;
        
        // Check if cell is empty
        const isOccupied = boardPieces.some(p => p.position === position && p.id !== pieceId);
        
        if (!isOccupied) {
          onPlacePiece(pieceId, position);
        }
      }
    }
    
    setDraggedPiece(null);
  };
  
  // Handle mouse move for drag visualization
  useEffect(() => {
    if (!draggedPiece) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const piece = document.querySelector(`[data-piece-id="${draggedPiece.id}"]`) as HTMLElement;
      if (piece) {
        piece.style.transform = `translate(${e.clientX - draggedPiece.startX}px, ${e.clientY - draggedPiece.startY}px)`;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove as any);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove as any);
    };
  }, [draggedPiece]);
  
  // Handle mouse up to check for snap
  useEffect(() => {
    if (!draggedPiece || !boardRef.current) return;
    
    const handleMouseUp = (e: MouseEvent) => {
      const board = boardRef.current!.getBoundingClientRect();
      const piece = document.querySelector(`[data-piece-id="${draggedPiece.id}"]`) as HTMLElement;
      
      if (piece) {
        // Reset piece transform
        piece.style.transform = '';
        
        // Calculate position within the board
        const relativeX = e.clientX - board.left;
        const relativeY = e.clientY - board.top;
        
        // Check if we're over a valid cell
        if (relativeX >= 0 && relativeX <= board.width && 
            relativeY >= 0 && relativeY <= board.height) {
          
          // Calculate the cell position
          const col = Math.floor(relativeX / cellWidth);
          const row = Math.floor(relativeY / cellHeight);
          
          if (col >= 0 && col < columns && row >= 0 && row < rows) {
            const position = row * columns + col;
            
            // Check if cell is empty
            const isOccupied = boardPieces.some(p => p.position === position && p.id !== draggedPiece.id);
            
            // Check if this piece's original position is within snap threshold
            const draggedPieceObj = boardPieces.find(p => p.id === draggedPiece.id);
            const isSnappable = draggedPieceObj && 
                               (Math.abs(col - draggedPieceObj.col) <= snapThreshold / cellWidth) && 
                               (Math.abs(row - draggedPieceObj.row) <= snapThreshold / cellHeight);
            
            if (isSnappable && draggedPieceObj) {
              // Snap to original position
              onPlacePiece(draggedPiece.id, draggedPieceObj.originalPosition);
            } else if (!isOccupied) {
              onPlacePiece(draggedPiece.id, position);
            }
          }
        }
      }
      
      setDraggedPiece(null);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedPiece, boardPieces, cellWidth, cellHeight, columns, rows, onPlacePiece, snapThreshold]);
  
  // Ensure touch events are registered and handled
  useEffect(() => {
    const handleTouchEndGlobal = (e: TouchEvent) => {
      if (draggedPiece) {
        handleTouchEnd(draggedPiece.id, e);
      }
    };
    
    document.addEventListener('touchend', handleTouchEndGlobal);
    
    return () => {
      document.removeEventListener('touchend', handleTouchEndGlobal);
    };
  }, [draggedPiece]);
  
  return (
    <div 
      ref={boardRef}
      className={`puzzle-board relative border border-border rounded-lg overflow-hidden ${isComplete ? 'puzzle-complete' : ''}`}
      style={{
        width: '100%',
        height: boardSize.height > 0 ? boardSize.height : 'auto',
        backgroundImage: (showGuide || isComplete) ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: showGuide && !isComplete ? 0.3 : 1,
        touchAction: 'none'
      }}
    >
      {/* Grid cells */}
      {Array.from({ length: rows * columns }).map((_, position) => {
        const row = Math.floor(position / columns);
        const col = position % columns;
        const piece = boardPieces.find(p => p.position === position);
        
        return (
          <div
            key={`cell-${position}`}
            className={`puzzle-cell absolute ${!piece ? 'empty-cell' : ''}`}
            style={{
              width: `${cellWidth}px`,
              height: `${cellHeight}px`,
              left: `${col * cellWidth}px`,
              top: `${row * cellHeight}px`
            }}
            onDragOver={!piece ? (e) => handleDragOver(position, e) : undefined}
            onDragLeave={!piece ? handleDragLeave : undefined}
            onDrop={!piece ? (e) => handleDrop(position, e) : undefined}
            data-position={position}
          >
            {/* Render piece if present */}
            {piece && (
              <JigsawPiece
                piece={piece}
                imageUrl={imageUrl}
                rows={rows}
                columns={columns}
                width={cellWidth}
                height={cellHeight}
                showNumber={showNumbers}
                onDragStart={(e) => handleDragStart(piece.id, e)}
                onDoubleClick={() => onRemovePiece(piece.id)}
                isDragging={draggedPiece?.id === piece.id}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PuzzleBoard;

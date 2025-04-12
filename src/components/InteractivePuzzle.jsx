
import React, { useState, useEffect, useRef } from 'react';
import { Shuffle, Check, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Demo puzzle image (would be replaced with admin-uploaded images in a full implementation)
const defaultPuzzleImage = 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&h=300&q=80';

const InteractivePuzzle = () => {
  const [pieces, setPieces] = useState([]);
  const [solved, setSolved] = useState(false);
  const [gridSize, setGridSize] = useState(4); // 4x4 grid (16 pieces)
  const [muted, setMuted] = useState(true);
  const containerRef = useRef(null);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [puzzleImage, setPuzzleImage] = useState(defaultPuzzleImage);
  
  // Initialize puzzle pieces
  useEffect(() => {
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
      playSound('success');
    }
    
    setSolved(isSolved);
  }, [pieces, muted, solved]);
  
  // Play sound effects
  const playSound = (type) => {
    if (muted) return;
    
    const sounds = {
      pick: new Audio('/sounds/pick.mp3'),
      place: new Audio('/sounds/place.mp3'),
      success: new Audio('/sounds/success.mp3')
    };
    
    // Fallback to prevent errors when sound files aren't available in development
    try {
      sounds[type].volume = 0.3;
      sounds[type].play().catch(error => console.log('Audio play prevented:', error));
    } catch (error) {
      console.log('Sound playback error:', error);
    }
  };
  
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
  
  // Handle dragging piece
  const handleDragStart = (e, piece) => {
    setDraggedPiece(piece);
    playSound('pick');
    
    // Set ghost drag image (empty for better UX)
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
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
    playSound('place');
    setDraggedPiece(null);
  };
  
  // Calculate positioning for puzzle pieces
  const getPieceStyle = (piece) => {
    const pieceWidth = 100 / gridSize;
    const pieceHeight = 100 / gridSize;
    
    // Correct background position to show the right part of the image
    const backgroundX = -(piece.correctPosition.col * 100) / gridSize;
    const backgroundY = -(piece.correctPosition.row * 100) / gridSize;
    
    return {
      width: `${pieceWidth}%`,
      height: `${pieceHeight}%`,
      top: `${piece.currentPosition.row * pieceHeight}%`,
      left: `${piece.currentPosition.col * pieceWidth}%`,
      backgroundImage: `url(${puzzleImage})`,
      backgroundSize: `${gridSize * 100}%`,
      backgroundPosition: `${backgroundX}% ${backgroundY}%`
    };
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
            <div
              key={piece.id}
              className="absolute transition-all duration-200 cursor-move hover:brightness-110 hover:scale-[1.02] active:scale-105 active:z-10"
              style={getPieceStyle(piece)}
              draggable
              onDragStart={(e) => handleDragStart(e, piece)}
              onDrop={(e) => handleDrop(e, piece.currentPosition.row, piece.currentPosition.col)}
            />
          ))}
          
          {/* Success overlay */}
          {solved && (
            <div className="absolute inset-0 flex items-center justify-center bg-puzzle-black/30 backdrop-blur-[1px] animate-fade-in">
              <div className="text-puzzle-gold flex items-center gap-2 font-bold text-2xl">
                <Check className="w-6 h-6" />
                Complete!
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-2 w-full max-w-xs">
        <Button 
          variant="outline" 
          size="sm"
          className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
          onClick={shufflePuzzle}
        >
          <Shuffle className="mr-1 w-4 h-4" />
          Shuffle
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
          onClick={resetPuzzle}
        >
          Reset
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10 ml-auto"
          onClick={() => setMuted(!muted)}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default InteractivePuzzle;

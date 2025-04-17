
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';

const PuzzleDemo = () => {
  return (
    <PageLayout
      title="Puzzle Demo"
      subtitle="Test our jigsaw puzzle technology"
      className="prose prose-invert max-w-6xl"
    >
      <div className="flex items-center text-muted-foreground text-sm mb-6">
        <Link to="/" className="hover:text-puzzle-aqua">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-puzzle-aqua">Puzzle Demo</span>
      </div>

      <div className="flex justify-center mb-8">
        <SimplePuzzleGame />
      </div>

      <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 p-6 rounded-lg">
        <h2 className="text-puzzle-white text-xl font-bold mb-2">About This Demo</h2>
        <p className="text-muted-foreground">
          This is a demonstration of our jigsaw puzzle technology. The full version will include customizable 
          images, difficulty levels, and competitive gameplay with leaderboards and timed challenges.
        </p>
        <p className="text-muted-foreground mt-2">
          Try dragging the pieces to move them around. This simple demo showcases the basic puzzle 
          mechanics that will be used in our full game.
        </p>
      </div>
    </PageLayout>
  );
};

// Simple puzzle game component that uses drag and drop
const SimplePuzzleGame = () => {
  const [pieces, setPieces] = React.useState(() => {
    // Create a 3x3 grid of puzzle pieces
    const initialPieces = [];
    for (let i = 0; i < 9; i++) {
      initialPieces.push({
        id: `piece-${i}`,
        position: i,
        color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
        isDragging: false
      });
    }
    return initialPieces;
  });

  const [draggedPiece, setDraggedPiece] = React.useState(null);

  const handleDragStart = (e, piece) => {
    e.dataTransfer.setData('text/plain', piece.id);
    setDraggedPiece(piece);
    
    // Set a ghost image for drag preview
    const dragPreview = document.createElement('div');
    dragPreview.style.width = '100px';
    dragPreview.style.height = '100px';
    dragPreview.style.backgroundColor = piece.color;
    dragPreview.style.opacity = '0.5';
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 50, 50);
    
    // Update piece state
    setPieces(pieces.map(p => 
      p.id === piece.id 
        ? { ...p, isDragging: true } 
        : p
    ));
    
    // Remove drag preview element after drag operation
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    if (!draggedPiece) return;
    
    const draggedId = e.dataTransfer.getData('text/plain');
    
    // Find the source piece and target position
    const sourceIndex = pieces.findIndex(p => p.id === draggedId);
    
    if (sourceIndex === -1) return;
    
    // Create a new array with swapped positions
    const newPieces = [...pieces];
    const temp = newPieces[sourceIndex];
    newPieces[sourceIndex] = newPieces[targetIndex];
    newPieces[targetIndex] = temp;
    
    // Update position property
    newPieces[sourceIndex].position = sourceIndex;
    newPieces[targetIndex].position = targetIndex;
    
    // Reset dragging state
    setPieces(newPieces.map(p => ({ ...p, isDragging: false })));
    setDraggedPiece(null);
  };
  
  const handleDragEnd = () => {
    setPieces(pieces.map(p => ({ ...p, isDragging: false })));
    setDraggedPiece(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <Button 
          onClick={() => setPieces(p => [...p].sort(() => Math.random() - 0.5))}
          className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-black"
        >
          Shuffle Pieces
        </Button>
      </div>
      
      <div 
        className="grid grid-cols-3 gap-2 bg-puzzle-black/60 p-4 rounded-lg border-2 border-puzzle-aqua"
        style={{ width: '360px', height: '360px' }}
      >
        {pieces.map((piece, index) => (
          <div 
            key={piece.id}
            draggable
            onDragStart={(e) => handleDragStart(e, piece)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-center rounded-lg cursor-grab shadow-md transition-all ${
              piece.isDragging ? 'opacity-50' : 'opacity-100'
            }`}
            style={{ 
              backgroundColor: piece.color,
              transform: piece.isDragging ? 'scale(0.95)' : 'scale(1)',
              width: '100%',
              height: '100%',
            }}
          >
            <span className="text-lg font-bold text-white drop-shadow-md">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-sm text-puzzle-aqua">
        Drag and drop pieces to rearrange the puzzle
      </p>
    </div>
  );
};

export default PuzzleDemo;

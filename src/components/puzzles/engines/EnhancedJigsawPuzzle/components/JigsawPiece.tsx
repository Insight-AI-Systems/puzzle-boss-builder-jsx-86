
import React, { useRef, useEffect } from 'react';
import { PuzzlePiece } from '../hooks/usePuzzleState';
import { generatePiecePath } from '../utils/piecePathGenerator';

interface JigsawPieceProps {
  piece: PuzzlePiece;
  imageUrl: string;
  rows: number;
  columns: number;
  width: number;
  height: number;
  showNumber: boolean;
  onDragStart: (e: React.DragEvent | React.TouchEvent) => void;
  onDoubleClick: () => void;
  isDragging: boolean;
}

const JigsawPiece: React.FC<JigsawPieceProps> = ({
  piece,
  imageUrl,
  rows,
  columns,
  width,
  height,
  showNumber,
  onDragStart,
  onDoubleClick,
  isDragging
}) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  
  // Generate unique ids for SVG elements
  const clipPathId = `puzzle-clip-${piece.id}`;
  const patternId = `piece-pattern-${piece.id}`;
  const shadowId = `piece-shadow-${piece.id}`;
  const embossId = `piece-emboss-${piece.id}`;
  const highlightId = `piece-highlight-${piece.id}`;
  
  // Generate the SVG path for this puzzle piece
  const piecePath = generatePiecePath(piece.originalPosition, rows, columns, width, height);
  
  // Play a satisfying snap sound when a piece is correctly placed
  useEffect(() => {
    if (piece.isCorrect) {
      try {
        // Try to play a sound effect if browser allows it
        const audio = new Audio('/sounds/snap.mp3');
        audio.volume = 0.3;
        audio.play().catch(err => console.log('Audio play failed:', err));
      } catch (e) {
        // Ignore audio errors - this is just an enhancement
      }
    }
  }, [piece.isCorrect]);
  
  // Set up touch events for mobile
  useEffect(() => {
    const pieceElement = pieceRef.current;
    if (!pieceElement) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      onDragStart(e as unknown as React.TouchEvent);
    };
    
    pieceElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      pieceElement.removeEventListener('touchstart', handleTouchStart);
    };
  }, [onDragStart]);
  
  return (
    <div
      ref={pieceRef}
      className={`puzzle-piece absolute w-full h-full ${piece.isCorrect ? 'correct puzzle-piece-locking' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable={true}
      onDragStart={onDragStart}
      onDoubleClick={onDoubleClick}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 10 : piece.isCorrect ? 1 : 2,
        transform: piece.rotation ? `rotate(${piece.rotation}deg)` : 'none',
        transition: isDragging ? 'none' : 'transform 0.2s, filter 0.2s',
      }}
      data-piece-id={piece.id}
    >
      {/* SVG definitions */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* Clip path for the puzzle piece shape */}
          <clipPath id={clipPathId}>
            <path d={piecePath} />
          </clipPath>
          
          {/* Pattern from the image */}
          <pattern 
            id={patternId} 
            patternUnits="userSpaceOnUse" 
            width={columns * width} 
            height={rows * height}
          >
            <image 
              href={imageUrl} 
              width={columns * width} 
              height={rows * height} 
              x="0" 
              y="0"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
          
          {/* Enhanced drop shadow filter for 3D effect */}
          <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx="3" dy="5" />
            <feGaussianBlur stdDeviation="5" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"/>
            <feBlend in="SourceGraphic" in2="offset-blur" mode="normal" />
          </filter>
          
          {/* Emboss filter to create pronounced 3D look */}
          <filter id={embossId}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="4" specularConstant="1.2" 
                               specularExponent="25" lightingColor="white"
                               result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000"/>
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" 
                        k1="0" k2="1" k3="1" k4="0" result="embossed"/>
          </filter>
          
          {/* Highlight filter for correct pieces */}
          <filter id={highlightId}>
            <feFlood floodColor="#4CAF50" floodOpacity="0.8" result="greenTint"/>
            <feComposite in="greenTint" in2="SourceGraphic" operator="in" result="tinted"/>
            <feGaussianBlur in="tinted" stdDeviation="1" result="blur"/>
            <feComposite in="blur" in2="SourceGraphic" operator="over"/>
          </filter>
        </defs>
      </svg>
      
      {/* The puzzle piece shape with improved styling */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className={`jigsaw-svg-piece ${isDragging ? 'dragging' : ''} ${piece.isCorrect ? 'correct' : ''}`}
      >
        {/* Base shape with image fill */}
        <path 
          d={piecePath} 
          fill={`url(#${patternId})`}
          stroke={piece.isCorrect ? "rgba(0,200,0,0.7)" : "rgba(255,255,255,0.7)"}
          strokeWidth="2"
          filter={isDragging ? `url(#${shadowId})` : 
                 piece.isCorrect ? `url(#${highlightId})` : 
                 `url(#${embossId})`}
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box'
          }}
        />
        
        {/* Top highlight for 3D effect */}
        <path 
          d={piecePath} 
          fill="none" 
          stroke={piece.isCorrect ? "rgba(100,255,100,0.9)" : "rgba(255,255,255,0.9)"}
          strokeWidth="2"
          strokeOpacity="0.6"
          strokeDasharray="0,4,1,0"
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box'
          }}
        />
        
        {/* Bottom shadow for 3D effect */}
        <path 
          d={piecePath} 
          fill="none" 
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeDasharray="0,6,1,0"
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box'
          }}
        />
        
        {/* Inner highlight for more depth */}
        <path 
          d={piecePath} 
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="3"
          strokeOpacity="0.25"
          filter="blur(2px)"
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box'
          }}
        />
      </svg>
      
      {/* Show piece number if enabled */}
      {showNumber && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <span 
            className="bg-black/70 text-white px-2 py-1 text-xs font-medium rounded-full shadow-md"
          >
            {piece.id + 1}
          </span>
        </div>
      )}
    </div>
  );
};

export default JigsawPiece;

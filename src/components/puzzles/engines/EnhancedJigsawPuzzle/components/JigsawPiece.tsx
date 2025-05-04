
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
  
  // Generate the SVG path for this puzzle piece
  const piecePath = generatePiecePath(piece.originalPosition, rows, columns, width, height);
  
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
      className={`puzzle-piece absolute w-full h-full ${piece.isCorrect ? 'correct' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable={true}
      onDragStart={onDragStart}
      onDoubleClick={onDoubleClick}
      style={{
        cursor: 'grab',
        zIndex: isDragging ? 10 : piece.isCorrect ? 1 : 2,
        transform: piece.rotation ? `rotate(${piece.rotation}deg)` : 'none',
        transition: isDragging ? 'none' : 'transform 0.2s, filter 0.2s',
        filter: isDragging ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' : piece.isCorrect ? 'drop-shadow(0 2px 4px rgba(0,128,0,0.3))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
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
            />
          </pattern>
          
          {/* Enhanced drop shadow filter for 3D effect */}
          <filter id={shadowId}>
            <feDropShadow dx="3" dy="3" stdDeviation="3" floodOpacity="0.4" />
          </filter>
          
          {/* Emboss filter to create 3D look */}
          <filter id={embossId}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="2" specularConstant="1" 
                               specularExponent="20" lightingColor="white"
                               result="specOut">
              <fePointLight x="-5000" y="-10000" z="10000"/>
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" 
                        k1="0" k2="1" k3="1" k4="0" result="embossed"/>
          </filter>
        </defs>
      </svg>
      
      {/* The puzzle piece shape with improved styling */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="piece-svg"
      >
        {/* Base shape with image fill */}
        <path 
          d={piecePath} 
          fill={`url(#${patternId})`}
          stroke={piece.isCorrect ? "rgba(0,200,0,0.7)" : "rgba(255,255,255,0.7)"}
          strokeWidth="1.5"
          filter={isDragging ? `url(#${shadowId})` : ''}
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
      </svg>
      
      {/* Show piece number if enabled */}
      {showNumber && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <span 
            className="bg-black/60 text-white px-2 py-1 text-xs font-medium rounded-full shadow-md"
          >
            {piece.id + 1}
          </span>
        </div>
      )}
    </div>
  );
};

export default JigsawPiece;

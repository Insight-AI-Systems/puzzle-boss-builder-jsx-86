
import React from 'react';
import { Card } from '@/components/ui/card';
import { MemoryCard as MemoryCardType } from '../types/memoryTypes';

interface MemoryCardProps {
  card: MemoryCardType;
  onClick: (cardId: string) => void;
  disabled: boolean;
  theme: string;
}

export function MemoryCard({ card, onClick, disabled, theme }: MemoryCardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <Card 
      className={`
        relative w-full aspect-square cursor-pointer transition-all duration-300 
        transform hover:scale-105 ${disabled ? 'cursor-not-allowed' : ''}
        ${card.isMatched ? 'opacity-70 scale-95' : ''}
      `}
      onClick={handleClick}
    >
      <div className="w-full h-full relative preserve-3d" style={{
        transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)'
      }}>
        {/* Card Back */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg bg-gradient-to-br from-puzzle-aqua to-puzzle-blue flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-white text-2xl font-bold">?</div>
        </div>
        
        {/* Card Front */}
        <div 
          className={`
            absolute inset-0 w-full h-full backface-hidden rounded-lg 
            flex items-center justify-center text-4xl font-bold
            ${card.isMatched ? 'bg-green-100 border-2 border-green-400' : 'bg-white border-2 border-gray-200'}
          `}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {card.value}
        </div>
      </div>
    </Card>
  );
}

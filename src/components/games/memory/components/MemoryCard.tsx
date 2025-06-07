
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MemoryCard as MemoryCardType } from '../types/memoryTypes';
import '../styles/memory-cards.css';

interface MemoryCardProps {
  card: MemoryCardType;
  onClick: (cardId: string) => void;
  disabled: boolean;
  theme: string;
}

export function MemoryCard({ card, onClick, disabled, theme }: MemoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const isImage = card.value.startsWith('http');

  const handleClick = () => {
    console.log('Card clicked:', card.id, 'isFlipped:', card.isFlipped, 'isMatched:', card.isMatched, 'disabled:', disabled);
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load:', card.value);
    setImageError(true);
  };

  const cardClasses = `
    memory-card w-full aspect-square
    ${card.isFlipped || card.isMatched ? 'flipped' : ''}
    ${disabled ? 'disabled' : ''}
  `;

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className="memory-card-inner">
        {/* Card Front (back side when flipped) */}
        <div className="memory-card-face memory-card-front">
          <div>?</div>
        </div>
        
        {/* Card Back (front side when flipped) */}
        <div className={`memory-card-face memory-card-back ${card.isMatched ? 'matched' : ''}`}>
          {isImage && !imageError ? (
            <img 
              src={card.value} 
              alt="Memory card"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="text-4xl">
              {imageError ? '❓' : card.value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

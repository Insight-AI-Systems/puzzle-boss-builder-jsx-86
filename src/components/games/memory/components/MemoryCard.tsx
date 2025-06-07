
import React, { useState, useEffect } from 'react';
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

  // Debug logging for card state changes
  useEffect(() => {
    console.log(`Card ${card.id} state changed:`, {
      isFlipped: card.isFlipped,
      isMatched: card.isMatched,
      value: card.value,
      disabled
    });
  }, [card.isFlipped, card.isMatched, card.id, card.value, disabled]);

  const handleClick = () => {
    console.log(`Card clicked: ${card.id}`, {
      isFlipped: card.isFlipped,
      isMatched: card.isMatched,
      disabled,
      canClick: !disabled && !card.isFlipped && !card.isMatched
    });
    
    if (!disabled && !card.isFlipped && !card.isMatched) {
      console.log(`Executing click for card: ${card.id}`);
      onClick(card.id);
    } else {
      console.log(`Click blocked for card: ${card.id}`, { disabled, isFlipped: card.isFlipped, isMatched: card.isMatched });
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load:', card.value);
    setImageError(true);
  };

  // Build class names more carefully
  const cardClasses = [
    'memory-card',
    'w-full',
    'aspect-square'
  ];

  // Add flip state
  if (card.isFlipped || card.isMatched) {
    cardClasses.push('flipped');
  }

  // Add disabled state
  if (disabled) {
    cardClasses.push('disabled');
  }

  // Add debug classes
  if (card.isFlipped || card.isMatched) {
    cardClasses.push('debug-flipped');
  } else {
    cardClasses.push('debug-not-flipped');
  }

  const finalClassName = cardClasses.join(' ');
  
  console.log(`Card ${card.id} className:`, finalClassName);

  return (
    <div 
      className={finalClassName}
      onClick={handleClick}
      style={{ minHeight: '80px' }} // Ensure minimum size
    >
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

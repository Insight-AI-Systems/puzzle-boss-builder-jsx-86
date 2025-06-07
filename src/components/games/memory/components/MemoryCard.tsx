
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
  const isFlipped = card.isFlipped || card.isMatched;

  // Debug logging for card state changes
  useEffect(() => {
    console.log(`🎴 Card ${card.id} state:`, {
      isFlipped: card.isFlipped,
      isMatched: card.isMatched,
      computedFlipped: isFlipped,
      value: card.value,
      disabled
    });
  }, [card.isFlipped, card.isMatched, card.id, card.value, disabled, isFlipped]);

  const handleClick = () => {
    console.log(`🎯 Card ${card.id} clicked:`, {
      isFlipped: card.isFlipped,
      isMatched: card.isMatched,
      disabled,
      canClick: !disabled && !card.isFlipped && !card.isMatched
    });
    
    if (!disabled && !card.isFlipped && !card.isMatched) {
      console.log(`✅ Executing click for card: ${card.id}`);
      onClick(card.id);
    } else {
      console.log(`❌ Click blocked for card: ${card.id}`, { disabled, isFlipped: card.isFlipped, isMatched: card.isMatched });
    }
  };

  const handleImageError = () => {
    console.log('❌ Image failed to load:', card.value);
    setImageError(true);
  };

  // Build class names
  const cardClasses = [
    'memory-card',
    'w-full',
    'aspect-square'
  ];

  // Add flip state
  if (isFlipped) {
    cardClasses.push('flipped');
    console.log(`🔄 Card ${card.id} is FLIPPED`);
  } else {
    console.log(`📋 Card ${card.id} is NOT FLIPPED`);
  }

  // Add disabled state
  if (disabled) {
    cardClasses.push('disabled');
  }

  // Add debug classes for visual confirmation
  if (isFlipped) {
    cardClasses.push('debug-flipped');
  } else {
    cardClasses.push('debug-not-flipped');
  }

  const finalClassName = cardClasses.join(' ');
  
  console.log(`🎨 Card ${card.id} className:`, finalClassName);
  console.log(`🎭 Card ${card.id} visual state: ${isFlipped ? 'SHOWING BACK' : 'SHOWING FRONT'}`);

  return (
    <div 
      className={finalClassName}
      onClick={handleClick}
      style={{ minHeight: '80px' }}
    >
      <div className="memory-card-content">
        {/* Card Front (question mark) */}
        <div className="memory-card-front">
          <div>?</div>
        </div>
        
        {/* Card Back (image/emoji content) */}
        <div className={`memory-card-back ${card.isMatched ? 'matched' : ''}`}>
          {isImage && !imageError ? (
            <img 
              src={card.value} 
              alt="Memory card"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="memory-card-emoji">
              {imageError ? '❓' : card.value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

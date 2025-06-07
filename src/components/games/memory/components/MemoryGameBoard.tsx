
import React from 'react';
import { MemoryCard } from './MemoryCard';
import { MemoryCard as MemoryCardType, LAYOUT_CONFIGS, THEME_CONFIGS } from '../types/memoryTypes';

interface MemoryGameBoardProps {
  cards: MemoryCardType[];
  onCardClick: (cardId: string) => void;
  disabled: boolean;
  layout: keyof typeof LAYOUT_CONFIGS;
  theme: keyof typeof THEME_CONFIGS;
}

export function MemoryGameBoard({ cards, onCardClick, disabled, layout, theme }: MemoryGameBoardProps) {
  const { rows, cols } = LAYOUT_CONFIGS[layout];
  const themeConfig = THEME_CONFIGS[theme];
  
  return (
    <div className={`w-full max-w-4xl mx-auto p-4 rounded-lg ${themeConfig.background}`}>
      <div 
        className="grid gap-2 sm:gap-3 lg:gap-4"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            onClick={onCardClick}
            disabled={disabled}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}

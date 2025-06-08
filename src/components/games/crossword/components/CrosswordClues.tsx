import React from 'react';
import { CrosswordClue } from '../types/crosswordTypes';
import { cn } from '@/lib/utils';
interface CrosswordCluesProps {
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  selectedWord: string | null;
  selectedDirection: 'across' | 'down';
  onClueClick: (wordId: string, direction: 'across' | 'down') => void;
}
export function CrosswordClues({
  clues,
  selectedWord,
  selectedDirection,
  onClueClick
}: CrosswordCluesProps) {
  const renderClueList = (clueList: CrosswordClue[], direction: 'across' | 'down') => <div className="space-y-2">
      <h3 className="font-bold text-lg capitalize">{direction}</h3>
      <div className="space-y-1">
        {clueList.map(clue => {
        const wordId = `${clue.number}-${direction}`;
        const isSelected = selectedWord === wordId;
        return <div key={clue.id} className={cn("p-2 rounded cursor-pointer transition-colors", "hover:bg-blue-50 border", {
          "bg-blue-100 border-blue-300": isSelected,
          "bg-white border-gray-200": !isSelected,
          "text-green-600 font-semibold": clue.isCompleted
        })} onClick={() => onClueClick(wordId, direction)} role="button" tabIndex={0} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClueClick(wordId, direction);
          }
        }}>
              <div className="flex items-start gap-2">
                <span className="font-bold text-sm min-w-[2rem] text-zinc-950">
                  {clue.number}.
                </span>
                <span className="text-sm text-neutral-950">
                  {clue.clue}
                  {clue.isCompleted && <span className="ml-2 text-green-600">✓</span>}
                </span>
              </div>
            </div>;
      })}
      </div>
    </div>;
  return <div className="crossword-clues space-y-6">
      {renderClueList(clues.across, 'across')}
      {renderClueList(clues.down, 'down')}
    </div>;
}
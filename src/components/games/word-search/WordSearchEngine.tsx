
import React, { useState, useEffect } from 'react';
import { WordPlacementEngine } from './WordPlacementEngine';
import { WordSelectionValidator } from './WordSelectionValidator';
import { PlacedWord, Cell } from '@/business/engines/word-search/types';
import { stringsToCells, cellsToStrings } from '@/business/engines/word-search/utils';

interface WordSearchEngineProps {
  words: string[];
  gridSize: number;
  onWordFound: (word: string) => void;
  onGameComplete: () => void;
}

export const WordSearchEngine: React.FC<WordSearchEngineProps> = ({
  words,
  gridSize,
  onWordFound,
  onGameComplete
}) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = useState<string[]>([]);
  const [validator, setValidator] = useState<WordSelectionValidator | null>(null);

  useEffect(() => {
    initializeGame();
  }, [words, gridSize]);

  useEffect(() => {
    if (grid.length > 0 && placedWords.length > 0) {
      setValidator(new WordSelectionValidator(placedWords, grid));
    }
  }, [grid, placedWords]);

  const initializeGame = () => {
    // Create empty grid
    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    
    // Place words using the engine
    const newPlacedWords = WordPlacementEngine.placeWords(words, newGrid);
    
    // Fill remaining cells with random letters
    fillEmptyCells(newGrid);
    
    setGrid(newGrid);
    setPlacedWords(newPlacedWords);
    setFoundWords([]);
    setSelectedCells([]);
    setCurrentSelection([]);
  };

  const fillEmptyCells = (grid: string[][]) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  };

  const handleSelectionStart = (cellId: string) => {
    setCurrentSelection([cellId]);
  };

  const handleSelectionMove = (cellId: string) => {
    setCurrentSelection(prev => {
      if (!prev.includes(cellId)) {
        return [...prev, cellId];
      }
      return prev;
    });
  };

  const handleSelectionEnd = () => {
    if (currentSelection.length > 0 && validator) {
      // Convert string cell IDs to Cell objects for validation
      const cellCoords = stringsToCells(currentSelection);
      
      // Validate the selection
      const result = validator.validateSelection(cellCoords);
      
      if (result.isValid && result.word) {
        // Valid word found
        const newFoundWords = [...foundWords, result.word];
        setFoundWords(newFoundWords);
        
        // Add cells to selected cells
        setSelectedCells(prev => [...prev, ...currentSelection]);
        
        // Notify parent component
        onWordFound(result.word);
        
        // Check for game completion
        if (newFoundWords.length === words.length) {
          onGameComplete();
        }
      }
    }
    
    setCurrentSelection([]);
  };

  const renderCell = (row: number, col: number) => {
    const cellId = `${row}-${col}`;
    const isSelected = selectedCells.includes(cellId);
    const isCurrentSelection = currentSelection.includes(cellId);
    const letter = grid[row]?.[col] || '';

    return (
      <div
        key={cellId}
        className={`
          w-8 h-8 border border-gray-300 flex items-center justify-center cursor-pointer
          ${isSelected ? 'bg-green-200' : ''}
          ${isCurrentSelection ? 'bg-blue-200' : ''}
          hover:bg-gray-100
        `}
        onMouseDown={() => handleSelectionStart(cellId)}
        onMouseEnter={() => handleSelectionMove(cellId)}
        onMouseUp={handleSelectionEnd}
      >
        {letter}
      </div>
    );
  };

  return (
    <div className="word-search-engine">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {grid.map((row, rowIndex) =>
          row.map((_, colIndex) => renderCell(rowIndex, colIndex))
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Words to Find:</h3>
        <div className="flex flex-wrap gap-2">
          {words.map(word => (
            <span
              key={word}
              className={`px-2 py-1 rounded ${
                foundWords.includes(word) 
                  ? 'bg-green-200 text-green-800 line-through' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

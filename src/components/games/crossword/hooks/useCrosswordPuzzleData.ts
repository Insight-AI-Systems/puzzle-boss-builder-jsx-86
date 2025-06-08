
import { useState, useEffect } from 'react';
import type { CrosswordPuzzle } from '@/business/engines/crossword/CrosswordEngine';

// Sample crossword puzzle data
const samplePuzzle: CrosswordPuzzle = {
  id: 'sample-crossword-1',
  title: 'Daily Crossword',
  date: new Date().toISOString().split('T')[0],
  difficulty: 'medium',
  size: 10,
  grid: generateSampleGrid(),
  words: generateSampleWords(),
  clues: {
    across: [
      { id: '1-across', number: 1, direction: 'across', clue: 'Feline pet', answer: 'CAT', isCompleted: false },
      { id: '4-across', number: 4, direction: 'across', clue: 'Man\'s best friend', answer: 'DOG', isCompleted: false },
      { id: '6-across', number: 6, direction: 'across', clue: 'Large body of water', answer: 'SEA', isCompleted: false }
    ],
    down: [
      { id: '1-down', number: 1, direction: 'down', clue: 'Vehicle', answer: 'CAR', isCompleted: false },
      { id: '2-down', number: 2, direction: 'down', clue: 'Flying insect', answer: 'BEE', isCompleted: false },
      { id: '3-down', number: 3, direction: 'down', clue: 'Hot beverage', answer: 'TEA', isCompleted: false }
    ]
  }
};

function generateSampleGrid() {
  const grid = Array(10).fill(null).map((_, row) => 
    Array(10).fill(null).map((_, col) => ({
      id: `${row}-${col}`,
      row,
      col,
      letter: '',
      correctLetter: '',
      number: undefined,
      isBlocked: Math.random() > 0.7, // 30% blocked cells
      belongsToWords: [],
      isHighlighted: false,
      isSelected: false
    }))
  );

  // Set up sample words
  // CAT horizontal at 1,1
  grid[1][1] = { ...grid[1][1], correctLetter: 'C', number: 1, isBlocked: false, belongsToWords: ['1-across', '1-down'] };
  grid[1][2] = { ...grid[1][2], correctLetter: 'A', isBlocked: false, belongsToWords: ['1-across'] };
  grid[1][3] = { ...grid[1][3], correctLetter: 'T', isBlocked: false, belongsToWords: ['1-across'] };

  // CAR vertical at 1,1
  grid[2][1] = { ...grid[2][1], correctLetter: 'A', isBlocked: false, belongsToWords: ['1-down'] };
  grid[3][1] = { ...grid[3][1], correctLetter: 'R', isBlocked: false, belongsToWords: ['1-down'] };

  return grid;
}

function generateSampleWords() {
  return [
    {
      id: '1-across',
      clue: 'Feline pet',
      answer: 'CAT',
      startRow: 1,
      startCol: 1,
      direction: 'across' as const,
      number: 1,
      isCompleted: false,
      cells: ['1-1', '1-2', '1-3']
    },
    {
      id: '1-down',
      clue: 'Vehicle',
      answer: 'CAR',
      startRow: 1,
      startCol: 1,
      direction: 'down' as const,
      number: 1,
      isCompleted: false,
      cells: ['1-1', '2-1', '3-1']
    }
  ];
}

export function useCrosswordPuzzleData() {
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading puzzle data
    const loadPuzzle = async () => {
      try {
        setIsLoading(true);
        // TODO: Load actual puzzle data from API
        await new Promise(resolve => setTimeout(resolve, 500));
        setPuzzle(samplePuzzle);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    loadPuzzle();
  }, []);

  return {
    puzzle,
    isLoading,
    error
  };
}

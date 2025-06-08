
import { useState, useEffect } from 'react';
import type { CrosswordPuzzle } from '@/business/engines/crossword/CrosswordEngine';

// Sample crossword puzzle data
const samplePuzzle: CrosswordPuzzle = {
  id: 'sample-crossword-1',
  title: 'Daily Crossword',
  difficulty: 'medium',
  grid: generateSampleGrid(),
  words: generateSampleWords(),
  clues: generateSampleClues()
};

function generateSampleGrid() {
  const grid = Array(10).fill(null).map((_, row) => 
    Array(10).fill(null).map((_, col) => ({
      letter: '',
      isBlocked: true, // Start with all blocked, unblock specific cells
      number: undefined,
      belongsToWords: []
    }))
  );

  // Set up sample words - CAT horizontal at 1,1
  grid[1][1] = { 
    letter: '', 
    number: 1, 
    isBlocked: false, 
    belongsToWords: ['1-across', '1-down'] 
  };
  grid[1][2] = { 
    letter: '', 
    isBlocked: false, 
    belongsToWords: ['1-across'] 
  };
  grid[1][3] = { 
    letter: '', 
    isBlocked: false, 
    belongsToWords: ['1-across'] 
  };

  // CAR vertical at 1,1 (sharing first cell)
  grid[2][1] = { 
    letter: '', 
    isBlocked: false, 
    belongsToWords: ['1-down'] 
  };
  grid[3][1] = { 
    letter: '', 
    isBlocked: false, 
    belongsToWords: ['1-down'] 
  };

  return grid;
}

function generateSampleWords() {
  return [
    {
      id: '1-across',
      word: 'CAT',
      startRow: 1,
      startCol: 1,
      direction: 'across' as const,
      clueId: '1-across-clue'
    },
    {
      id: '1-down',
      word: 'CAR',
      startRow: 1,
      startCol: 1,
      direction: 'down' as const,
      clueId: '1-down-clue'
    }
  ];
}

function generateSampleClues() {
  const allClues = [
    { id: '1-across-clue', number: 1, clue: 'Feline pet', answer: 'CAT', direction: 'across' as const },
    { id: '1-down-clue', number: 1, clue: 'Vehicle', answer: 'CAR', direction: 'down' as const }
  ];

  return {
    across: allClues.filter(clue => clue.direction === 'across'),
    down: allClues.filter(clue => clue.direction === 'down')
  };
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
        console.log('Loading crossword puzzle data...');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Puzzle data loaded:', samplePuzzle);
        setPuzzle(samplePuzzle);
      } catch (err) {
        console.error('Error loading puzzle:', err);
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


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
  console.log('📋 useCrosswordPuzzleData: Generating sample grid...');
  const grid = Array(10).fill(null).map((_, row) => 
    Array(10).fill(null).map((_, col) => ({
      letter: '',
      isBlocked: true,
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
    number: undefined,
    isBlocked: false, 
    belongsToWords: ['1-across'] 
  };
  grid[1][3] = { 
    letter: '', 
    number: undefined,
    isBlocked: false, 
    belongsToWords: ['1-across'] 
  };

  // CAR vertical at 1,1 (sharing first cell)
  grid[2][1] = { 
    letter: '', 
    number: undefined,
    isBlocked: false, 
    belongsToWords: ['1-down'] 
  };
  grid[3][1] = { 
    letter: '', 
    number: undefined,
    isBlocked: false, 
    belongsToWords: ['1-down'] 
  };

  console.log('✅ useCrosswordPuzzleData: Grid generated with dimensions:', grid.length, 'x', grid[0]?.length);
  return grid;
}

function generateSampleWords() {
  console.log('📝 useCrosswordPuzzleData: Generating sample words...');
  const words = [
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
  console.log('✅ useCrosswordPuzzleData: Generated', words.length, 'words');
  return words;
}

function generateSampleClues() {
  console.log('🔍 useCrosswordPuzzleData: Generating sample clues...');
  const allClues = [
    { id: '1-across-clue', number: 1, clue: 'Feline pet', answer: 'CAT', direction: 'across' as const },
    { id: '1-down-clue', number: 1, clue: 'Vehicle', answer: 'CAR', direction: 'down' as const }
  ];

  const result = {
    across: allClues.filter(clue => clue.direction === 'across'),
    down: allClues.filter(clue => clue.direction === 'down')
  };
  
  console.log('✅ useCrosswordPuzzleData: Generated clues:', { 
    across: result.across.length, 
    down: result.down.length 
  });
  return result;
}

export function useCrosswordPuzzleData() {
  console.log('🎯 useCrosswordPuzzleData: Hook initialized');
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading puzzle data
    const loadPuzzle = async () => {
      try {
        console.log('⏳ useCrosswordPuzzleData: Starting to load puzzle data...');
        setIsLoading(true);
        setError(null);
        
        // Simulate API call with shorter delay for better UX
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('📦 useCrosswordPuzzleData: Sample puzzle created:', samplePuzzle);
        console.log('📊 useCrosswordPuzzleData: Puzzle validation:', {
          hasGrid: !!samplePuzzle.grid,
          gridSize: samplePuzzle.grid?.length,
          hasWords: !!samplePuzzle.words,
          wordCount: samplePuzzle.words?.length,
          hasClues: !!samplePuzzle.clues,
          clueCount: (samplePuzzle.clues?.across?.length || 0) + (samplePuzzle.clues?.down?.length || 0)
        });
        
        setPuzzle(samplePuzzle);
        console.log('✅ useCrosswordPuzzleData: Puzzle data loaded successfully');
      } catch (err) {
        console.error('❌ useCrosswordPuzzleData: Error loading puzzle:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load puzzle';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        console.log('🏁 useCrosswordPuzzleData: Loading completed');
      }
    };

    loadPuzzle();
  }, []);

  console.log('📤 useCrosswordPuzzleData: Returning state:', { 
    hasPuzzle: !!puzzle, 
    isLoading, 
    hasError: !!error 
  });

  return {
    puzzle,
    isLoading,
    error
  };
}

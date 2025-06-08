
import { CrosswordPuzzle, CrosswordWord, CrosswordClue } from '../types/crosswordTypes';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateCrosswordPuzzle(puzzle: CrosswordPuzzle): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check basic puzzle structure
  if (!puzzle.words || puzzle.words.length === 0) {
    errors.push('Puzzle must have at least one word');
  }

  if (!puzzle.clues || !puzzle.clues.across || !puzzle.clues.down) {
    errors.push('Puzzle must have clues for both across and down');
  }

  if (puzzle.size <= 0) {
    errors.push('Puzzle size must be greater than 0');
  }

  // 2. Validate word-clue correspondence
  const wordNumbers = new Set(puzzle.words.map(w => `${w.number}-${w.direction}`));
  const clueNumbers = new Set([
    ...puzzle.clues.across.map(c => `${c.number}-across`),
    ...puzzle.clues.down.map(c => `${c.number}-down`)
  ]);

  // Check for words without clues
  for (const wordId of wordNumbers) {
    if (!clueNumbers.has(wordId)) {
      errors.push(`Word ${wordId} has no corresponding clue`);
    }
  }

  // Check for clues without words
  for (const clueId of clueNumbers) {
    if (!wordNumbers.has(clueId)) {
      errors.push(`Clue ${clueId} has no corresponding word`);
    }
  }

  // 3. Validate word positions and bounds
  puzzle.words.forEach(word => {
    if (word.startRow < 0 || word.startCol < 0) {
      errors.push(`Word ${word.number}-${word.direction} has negative starting position`);
    }

    const endRow = word.direction === 'down' ? word.startRow + word.answer.length - 1 : word.startRow;
    const endCol = word.direction === 'across' ? word.startCol + word.answer.length - 1 : word.startCol;

    if (endRow >= puzzle.size || endCol >= puzzle.size) {
      errors.push(`Word ${word.number}-${word.direction} extends beyond puzzle bounds`);
    }

    if (word.answer.length === 0) {
      errors.push(`Word ${word.number}-${word.direction} has empty answer`);
    }

    if (!/^[A-Z]+$/.test(word.answer)) {
      warnings.push(`Word ${word.number}-${word.direction} contains non-alphabetic characters`);
    }
  });

  // 4. Validate intersections
  const grid: (string | null)[][] = Array(puzzle.size).fill(null).map(() => Array(puzzle.size).fill(null));
  
  // Place words on grid and check for conflicts
  puzzle.words.forEach(word => {
    for (let i = 0; i < word.answer.length; i++) {
      const row = word.direction === 'down' ? word.startRow + i : word.startRow;
      const col = word.direction === 'across' ? word.startCol + i : word.startCol;
      
      if (row < puzzle.size && col < puzzle.size) {
        const letter = word.answer[i];
        if (grid[row][col] !== null && grid[row][col] !== letter) {
          errors.push(`Letter conflict at position (${row}, ${col}): ${grid[row][col]} vs ${letter}`);
        }
        grid[row][col] = letter;
      }
    }
  });

  // 5. Check for isolated words (words that don't intersect with others)
  const intersectionCount = new Map<string, number>();
  puzzle.words.forEach(word => {
    intersectionCount.set(`${word.number}-${word.direction}`, 0);
  });

  puzzle.words.forEach(word1 => {
    puzzle.words.forEach(word2 => {
      if (word1.id !== word2.id && doWordsIntersect(word1, word2)) {
        const key1 = `${word1.number}-${word1.direction}`;
        const key2 = `${word2.number}-${word2.direction}`;
        intersectionCount.set(key1, (intersectionCount.get(key1) || 0) + 1);
        intersectionCount.set(key2, (intersectionCount.get(key2) || 0) + 1);
      }
    });
  });

  // Warn about isolated words (except for very small puzzles)
  if (puzzle.words.length > 2) {
    intersectionCount.forEach((count, wordId) => {
      if (count === 0) {
        warnings.push(`Word ${wordId} doesn't intersect with any other words`);
      }
    });
  }

  // 6. Validate clue-answer consistency
  puzzle.clues.across.forEach(clue => {
    const word = puzzle.words.find(w => w.number === clue.number && w.direction === 'across');
    if (word && word.answer !== clue.answer) {
      errors.push(`Clue ${clue.number}-across answer mismatch: word="${word.answer}" vs clue="${clue.answer}"`);
    }
  });

  puzzle.clues.down.forEach(clue => {
    const word = puzzle.words.find(w => w.number === clue.number && w.direction === 'down');
    if (word && word.answer !== clue.answer) {
      errors.push(`Clue ${clue.number}-down answer mismatch: word="${word.answer}" vs clue="${clue.answer}"`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

function doWordsIntersect(word1: CrosswordWord, word2: CrosswordWord): boolean {
  if (word1.direction === word2.direction) return false;

  const [horizontal, vertical] = word1.direction === 'across' ? [word1, word2] : [word2, word1];

  // Check if vertical word crosses horizontal word
  const hRowStart = horizontal.startRow;
  const hColStart = horizontal.startCol;
  const hColEnd = hColStart + horizontal.answer.length - 1;

  const vRowStart = vertical.startRow;
  const vRowEnd = vRowStart + vertical.answer.length - 1;
  const vCol = vertical.startCol;

  return (
    vCol >= hColStart && vCol <= hColEnd &&
    hRowStart >= vRowStart && hRowStart <= vRowEnd
  );
}

export function logValidationResults(puzzleId: string, result: ValidationResult): void {
  if (!result.isValid) {
    console.error(`❌ Puzzle ${puzzleId} validation failed:`);
    result.errors.forEach(error => console.error(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.warn(`⚠️ Puzzle ${puzzleId} validation warnings:`);
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  if (result.isValid && result.warnings.length === 0) {
    console.log(`✅ Puzzle ${puzzleId} validation passed`);
  }
}

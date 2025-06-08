
import { CrosswordPuzzle } from '../types/crosswordTypes';

export const dailyPuzzles: CrosswordPuzzle[] = [
  {
    id: 'daily-2024-001',
    title: 'Daily Crossword #1',
    date: '2024-01-01',
    difficulty: 'easy',
    size: 7,
    grid: [],
    words: [
      {
        id: '1-across',
        clue: 'Feline pet',
        answer: 'CAT',
        startRow: 0,
        startCol: 0,
        direction: 'across',
        number: 1,
        isCompleted: false,
        cells: ['0-0', '0-1', '0-2']
      },
      {
        id: '2-across',
        clue: 'Canine pet',
        answer: 'DOG',
        startRow: 2,
        startCol: 0,
        direction: 'across',
        number: 2,
        isCompleted: false,
        cells: ['2-0', '2-1', '2-2']
      },
      {
        id: '1-down',
        clue: 'Vehicle',
        answer: 'CAR',
        startRow: 0,
        startCol: 0,
        direction: 'down',
        number: 1,
        isCompleted: false,
        cells: ['0-0', '1-0', '2-0']
      },
      {
        id: '3-down',
        clue: 'Large body of water',
        answer: 'OCEAN',
        startRow: 0,
        startCol: 2,
        direction: 'down',
        number: 3,
        isCompleted: false,
        cells: ['0-2', '1-2', '2-2', '3-2', '4-2']
      }
    ],
    clues: {
      across: [
        { id: '1-across', number: 1, direction: 'across', clue: 'Feline pet', answer: 'CAT', isCompleted: false },
        { id: '2-across', number: 2, direction: 'across', clue: 'Canine pet', answer: 'DOG', isCompleted: false }
      ],
      down: [
        { id: '1-down', number: 1, direction: 'down', clue: 'Vehicle', answer: 'CAR', isCompleted: false },
        { id: '3-down', number: 3, direction: 'down', clue: 'Large body of water', answer: 'OCEAN', isCompleted: false }
      ]
    }
  },
  {
    id: 'daily-2024-002',
    title: 'Daily Crossword #2',
    date: '2024-01-02',
    difficulty: 'medium',
    size: 9,
    grid: [],
    words: [
      {
        id: '1-across',
        clue: 'Programming language',
        answer: 'PYTHON',
        startRow: 0,
        startCol: 0,
        direction: 'across',
        number: 1,
        isCompleted: false,
        cells: ['0-0', '0-1', '0-2', '0-3', '0-4', '0-5']
      },
      {
        id: '2-across',
        clue: 'Web development framework',
        answer: 'REACT',
        startRow: 2,
        startCol: 1,
        direction: 'across',
        number: 2,
        isCompleted: false,
        cells: ['2-1', '2-2', '2-3', '2-4', '2-5']
      },
      {
        id: '1-down',
        clue: 'Personal computer',
        answer: 'PC',
        startRow: 0,
        startCol: 0,
        direction: 'down',
        number: 1,
        isCompleted: false,
        cells: ['0-0', '1-0']
      },
      {
        id: '3-down',
        clue: 'Type of computer memory',
        answer: 'RAM',
        startRow: 0,
        startCol: 2,
        direction: 'down',
        number: 3,
        isCompleted: false,
        cells: ['0-2', '1-2', '2-2']
      }
    ],
    clues: {
      across: [
        { id: '1-across', number: 1, direction: 'across', clue: 'Programming language', answer: 'PYTHON', isCompleted: false },
        { id: '2-across', number: 2, direction: 'across', clue: 'Web development framework', answer: 'REACT', isCompleted: false }
      ],
      down: [
        { id: '1-down', number: 1, direction: 'down', clue: 'Personal computer', answer: 'PC', isCompleted: false },
        { id: '3-down', number: 3, direction: 'down', clue: 'Type of computer memory', answer: 'RAM', isCompleted: false }
      ]
    }
  }
];

export function getTodaysPuzzle(): CrosswordPuzzle {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const puzzleIndex = dayOfYear % dailyPuzzles.length;
  return dailyPuzzles[puzzleIndex];
}

export function getPuzzleById(id: string): CrosswordPuzzle | null {
  return dailyPuzzles.find(puzzle => puzzle.id === id) || null;
}

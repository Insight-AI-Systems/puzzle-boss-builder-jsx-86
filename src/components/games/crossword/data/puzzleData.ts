import { CrosswordPuzzle } from '../types/crosswordTypes';

const puzzles: CrosswordPuzzle[] = [
  {
    id: 'daily-2024-01-01',
    title: 'Daily Crossword - January 1st',
    date: '2024-01-01',
    difficulty: 'medium',
    size: 15,
    grid: [], // Will be generated
    words: [
      {
        id: '1-across',
        clue: 'Large feline',
        answer: 'LION',
        startRow: 0,
        startCol: 0,
        direction: 'across',
        number: 1,
        isCompleted: false,
        cells: []
      },
      {
        id: '1-down',
        clue: 'Citrus fruit',
        answer: 'LIME',
        startRow: 0,
        startCol: 0,
        direction: 'down',
        number: 1,
        isCompleted: false,
        cells: []
      },
      {
        id: '5-across',
        clue: 'Water barrier',
        answer: 'DAM',
        startRow: 0,
        startCol: 5,
        direction: 'across',
        number: 5,
        isCompleted: false,
        cells: []
      },
      {
        id: '7-across',
        clue: 'Soak up',
        answer: 'ABSORB',
        startRow: 0,
        startCol: 9,
        direction: 'across',
        number: 7,
        isCompleted: false,
        cells: []
      },
      {
        id: '8-down',
        clue: 'Tree part',
        answer: 'BRANCH',
        startRow: 0,
        startCol: 12,
        direction: 'down',
        number: 8,
        isCompleted: false,
        cells: []
      },
      {
        id: '9-across',
        clue: 'Flying mammal',
        answer: 'BAT',
        startRow: 2,
        startCol: 0,
        direction: 'across',
        number: 9,
        isCompleted: false,
        cells: []
      },
      {
        id: '10-across',
        clue: 'Ocean movement',
        answer: 'TIDE',
        startRow: 2,
        startCol: 4,
        direction: 'across',
        number: 10,
        isCompleted: false,
        cells: []
      },
      {
        id: '11-down',
        clue: 'Garden tool',
        answer: 'HOE',
        startRow: 2,
        startCol: 9,
        direction: 'down',
        number: 11,
        isCompleted: false,
        cells: []
      },
      {
        id: '12-across',
        clue: 'Small seed',
        answer: 'PEA',
        startRow: 4,
        startCol: 0,
        direction: 'across',
        number: 12,
        isCompleted: false,
        cells: []
      },
      {
        id: '13-across',
        clue: 'Kitchen appliance',
        answer: 'OVEN',
        startRow: 4,
        startCol: 4,
        direction: 'across',
        number: 13,
        isCompleted: false,
        cells: []
      },
      {
        id: '14-down',
        clue: 'Frozen water',
        answer: 'ICE',
        startRow: 4,
        startCol: 9,
        direction: 'down',
        number: 14,
        isCompleted: false,
        cells: []
      },
      {
        id: '15-across',
        clue: 'Male sheep',
        answer: 'RAM',
        startRow: 6,
        startCol: 0,
        direction: 'across',
        number: 15,
        isCompleted: false,
        cells: []
      },
      {
        id: '16-across',
        clue: 'Bird home',
        answer: 'NEST',
        startRow: 6,
        startCol: 4,
        direction: 'across',
        number: 16,
        isCompleted: false,
        cells: []
      }
    ],
    clues: {
      across: [
        { id: '1-across', number: 1, direction: 'across', clue: 'Large feline', answer: 'LION', isCompleted: false },
        { id: '5-across', number: 5, direction: 'across', clue: 'Water barrier', answer: 'DAM', isCompleted: false },
        { id: '7-across', number: 7, direction: 'across', clue: 'Soak up', answer: 'ABSORB', isCompleted: false },
        { id: '9-across', number: 9, direction: 'across', clue: 'Flying mammal', answer: 'BAT', isCompleted: false },
        { id: '10-across', number: 10, direction: 'across', clue: 'Ocean movement', answer: 'TIDE', isCompleted: false },
        { id: '12-across', number: 12, direction: 'across', clue: 'Small seed', answer: 'PEA', isCompleted: false },
        { id: '13-across', number: 13, direction: 'across', clue: 'Kitchen appliance', answer: 'OVEN', isCompleted: false },
        { id: '15-across', number: 15, direction: 'across', clue: 'Male sheep', answer: 'RAM', isCompleted: false },
        { id: '16-across', number: 16, direction: 'across', clue: 'Bird home', answer: 'NEST', isCompleted: false }
      ],
      down: [
        { id: '1-down', number: 1, direction: 'down', clue: 'Citrus fruit', answer: 'LIME', isCompleted: false },
        { id: '8-down', number: 8, direction: 'down', clue: 'Tree part', answer: 'BRANCH', isCompleted: false },
        { id: '11-down', number: 11, direction: 'down', clue: 'Garden tool', answer: 'HOE', isCompleted: false },
        { id: '14-down', number: 14, direction: 'down', clue: 'Frozen water', answer: 'ICE', isCompleted: false }
      ]
    }
  },
  {
    id: 'daily-2024-01-02',
    title: 'Daily Crossword - January 2nd',
    date: '2024-01-02',
    difficulty: 'easy',
    size: 10,
    grid: [],
    words: [
      {
        id: '1-across',
        clue: 'Opposite of night',
        answer: 'DAY',
        startRow: 0,
        startCol: 0,
        direction: 'across',
        number: 1,
        isCompleted: false,
        cells: []
      },
      {
        id: '1-down',
        clue: 'Canine pet',
        answer: 'DOG',
        startRow: 0,
        startCol: 0,
        direction: 'down',
        number: 1,
        isCompleted: false,
        cells: []
      },
      {
        id: '4-across',
        clue: 'Feline pet',
        answer: 'CAT',
        startRow: 0,
        startCol: 4,
        direction: 'across',
        number: 4,
        isCompleted: false,
        cells: []
      },
      {
        id: '6-across',
        clue: 'Precipitation',
        answer: 'RAIN',
        startRow: 2,
        startCol: 0,
        direction: 'across',
        number: 6,
        isCompleted: false,
        cells: []
      },
      {
        id: '7-down',
        clue: 'Consume food',
        answer: 'EAT',
        startRow: 2,
        startCol: 2,
        direction: 'down',
        number: 7,
        isCompleted: false,
        cells: []
      },
      {
        id: '8-across',
        clue: 'Celestial body',
        answer: 'STAR',
        startRow: 4,
        startCol: 0,
        direction: 'across',
        number: 8,
        isCompleted: false,
        cells: []
      }
    ],
    clues: {
      across: [
        { id: '1-across', number: 1, direction: 'across', clue: 'Opposite of night', answer: 'DAY', isCompleted: false },
        { id: '4-across', number: 4, direction: 'across', clue: 'Feline pet', answer: 'CAT', isCompleted: false },
        { id: '6-across', number: 6, direction: 'across', clue: 'Precipitation', answer: 'RAIN', isCompleted: false },
        { id: '8-across', number: 8, direction: 'across', clue: 'Celestial body', answer: 'STAR', isCompleted: false }
      ],
      down: [
        { id: '1-down', number: 1, direction: 'down', clue: 'Canine pet', answer: 'DOG', isCompleted: false },
        { id: '7-down', number: 7, direction: 'down', clue: 'Consume food', answer: 'EAT', isCompleted: false }
      ]
    }
  },
  {
    id: 'daily-2024-01-03',
    title: 'Daily Crossword - January 3rd',
    date: '2024-01-03',
    difficulty: 'hard',
    size: 12,
    grid: [],
    words: [
      {
        id: '1-across',
        clue: 'Computer network',
        answer: 'INTERNET',
        startRow: 0,
        startCol: 0,
        direction: 'across',
        number: 1,
        isCompleted: false,
        cells: []
      },
      {
        id: '1-down',
        clue: 'Frozen dessert',
        answer: 'ICECREAM',
        startRow: 0,
        startCol: 0,
        direction: 'down',
        number: 1,
        isCompleted: false,
        cells: []
      },
      {
        id: '2-down',
        clue: 'Cooking appliance',
        answer: 'TOASTER',
        startRow: 0,
        startCol: 3,
        direction: 'down',
        number: 2,
        isCompleted: false,
        cells: []
      },
      {
        id: '3-across',
        clue: 'Stringed instrument',
        answer: 'GUITAR',
        startRow: 2,
        startCol: 0,
        direction: 'across',
        number: 3,
        isCompleted: false,
        cells: []
      },
      {
        id: '4-down',
        clue: 'Timepiece',
        answer: 'WATCH',
        startRow: 2,
        startCol: 5,
        direction: 'down',
        number: 4,
        isCompleted: false,
        cells: []
      },
      {
        id: '5-across',
        clue: 'Illumination device',
        answer: 'LAMP',
        startRow: 4,
        startCol: 0,
        direction: 'across',
        number: 5,
        isCompleted: false,
        cells: []
      },
      {
        id: '6-across',
        clue: 'Keyboard instrument',
        answer: 'PIANO',
        startRow: 6,
        startCol: 0,
        direction: 'across',
        number: 6,
        isCompleted: false,
        cells: []
      },
      {
        id: '7-down',
        clue: 'Optical device',
        answer: 'LENS',
        startRow: 6,
        startCol: 2,
        direction: 'down',
        number: 7,
        isCompleted: false,
        cells: []
      }
    ],
    clues: {
      across: [
        { id: '1-across', number: 1, direction: 'across', clue: 'Computer network', answer: 'INTERNET', isCompleted: false },
        { id: '3-across', number: 3, direction: 'across', clue: 'Stringed instrument', answer: 'GUITAR', isCompleted: false },
        { id: '5-across', number: 5, direction: 'across', clue: 'Illumination device', answer: 'LAMP', isCompleted: false },
        { id: '6-across', number: 6, direction: 'across', clue: 'Keyboard instrument', answer: 'PIANO', isCompleted: false }
      ],
      down: [
        { id: '1-down', number: 1, direction: 'down', clue: 'Frozen dessert', answer: 'ICECREAM', isCompleted: false },
        { id: '2-down', number: 2, direction: 'down', clue: 'Cooking appliance', answer: 'TOASTER', isCompleted: false },
        { id: '4-down', number: 4, direction: 'down', clue: 'Timepiece', answer: 'WATCH', isCompleted: false },
        { id: '7-down', number: 7, direction: 'down', clue: 'Optical device', answer: 'LENS', isCompleted: false }
      ]
    }
  }
];

export function getTodaysPuzzle(): CrosswordPuzzle | null {
  // For demo purposes, return the first puzzle
  return puzzles[0] || null;
}

export function getPuzzleById(id: string): CrosswordPuzzle | null {
  return puzzles.find(puzzle => puzzle.id === id) || null;
}

export function getAllPuzzles(): CrosswordPuzzle[] {
  return puzzles;
}

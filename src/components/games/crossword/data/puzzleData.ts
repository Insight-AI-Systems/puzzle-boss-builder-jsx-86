import { CrosswordPuzzle } from '../types/crosswordTypes';

export const dailyPuzzles: CrosswordPuzzle[] = [
  {
    id: 'daily-2024-001',
    title: 'Daily Crossword #1 - Animals & Nature',
    date: '2024-01-01',
    difficulty: 'easy',
    size: 15,
    grid: [],
    words: [
      // Across words
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
        id: '4-across',
        clue: 'Canine companion',
        answer: 'DOG',
        startRow: 0,
        startCol: 4,
        direction: 'across',
        number: 4,
        isCompleted: false,
        cells: ['0-4', '0-5', '0-6']
      },
      {
        id: '7-across',
        clue: 'Large African mammal with trunk',
        answer: 'ELEPHANT',
        startRow: 2,
        startCol: 0,
        direction: 'across',
        number: 7,
        isCompleted: false,
        cells: ['2-0', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7']
      },
      {
        id: '9-across',
        clue: 'Flying mammal',
        answer: 'BAT',
        startRow: 2,
        startCol: 9,
        direction: 'across',
        number: 9,
        isCompleted: false,
        cells: ['2-9', '2-10', '2-11']
      },
      {
        id: '11-across',
        clue: 'Nocturnal bird of prey',
        answer: 'OWL',
        startRow: 4,
        startCol: 1,
        direction: 'across',
        number: 11,
        isCompleted: false,
        cells: ['4-1', '4-2', '4-3']
      },
      {
        id: '12-across',
        clue: 'King of the jungle',
        answer: 'LION',
        startRow: 4,
        startCol: 5,
        direction: 'across',
        number: 12,
        isCompleted: false,
        cells: ['4-5', '4-6', '4-7', '4-8']
      },
      {
        id: '14-across',
        clue: 'Striped horse-like animal',
        answer: 'ZEBRA',
        startRow: 6,
        startCol: 0,
        direction: 'across',
        number: 14,
        isCompleted: false,
        cells: ['6-0', '6-1', '6-2', '6-3', '6-4']
      },
      {
        id: '16-across',
        clue: 'Long-necked African animal',
        answer: 'GIRAFFE',
        startRow: 6,
        startCol: 6,
        direction: 'across',
        number: 16,
        isCompleted: false,
        cells: ['6-6', '6-7', '6-8', '6-9', '6-10', '6-11', '6-12']
      },
      {
        id: '18-across',
        clue: 'Slithering reptile',
        answer: 'SNAKE',
        startRow: 8,
        startCol: 2,
        direction: 'across',
        number: 18,
        isCompleted: false,
        cells: ['8-2', '8-3', '8-4', '8-5', '8-6']
      },
      {
        id: '20-across',
        clue: 'Aquatic mammal',
        answer: 'WHALE',
        startRow: 10,
        startCol: 0,
        direction: 'across',
        number: 20,
        isCompleted: false,
        cells: ['10-0', '10-1', '10-2', '10-3', '10-4']
      },
      {
        id: '22-across',
        clue: 'Small rodent',
        answer: 'MOUSE',
        startRow: 10,
        startCol: 6,
        direction: 'across',
        number: 22,
        isCompleted: false,
        cells: ['10-6', '10-7', '10-8', '10-9', '10-10']
      },
      {
        id: '24-across',
        clue: 'Hopping marsupial',
        answer: 'KANGAROO',
        startRow: 12,
        startCol: 1,
        direction: 'across',
        number: 24,
        isCompleted: false,
        cells: ['12-1', '12-2', '12-3', '12-4', '12-5', '12-6', '12-7', '12-8']
      },
      // Down words
      {
        id: '1-down',
        clue: 'Vehicle with four wheels',
        answer: 'CAR',
        startRow: 0,
        startCol: 0,
        direction: 'down',
        number: 1,
        isCompleted: false,
        cells: ['0-0', '1-0', '2-0']
      },
      {
        id: '2-down',
        clue: 'Insect that makes honey',
        answer: 'BEE',
        startRow: 0,
        startCol: 1,
        direction: 'down',
        number: 2,
        isCompleted: false,
        cells: ['0-1', '1-1', '2-1']
      },
      {
        id: '3-down',
        clue: 'Farm animal that says moo',
        answer: 'COW',
        startRow: 0,
        startCol: 2,
        direction: 'down',
        number: 3,
        isCompleted: false,
        cells: ['0-2', '1-2', '2-2']
      },
      {
        id: '5-down',
        clue: 'Large body of water',
        answer: 'OCEAN',
        startRow: 0,
        startCol: 4,
        direction: 'down',
        number: 5,
        isCompleted: false,
        cells: ['0-4', '1-4', '2-4', '3-4', '4-4']
      },
      {
        id: '6-down',
        clue: 'Primate that swings on trees',
        answer: 'MONKEY',
        startRow: 0,
        startCol: 5,
        direction: 'down',
        number: 6,
        isCompleted: false,
        cells: ['0-5', '1-5', '2-5', '3-5', '4-5', '5-5']
      },
      {
        id: '8-down',
        clue: 'Bird that cannot fly',
        answer: 'PENGUIN',
        startRow: 2,
        startCol: 7,
        direction: 'down',
        number: 8,
        isCompleted: false,
        cells: ['2-7', '3-7', '4-7', '5-7', '6-7', '7-7', '8-7']
      },
      {
        id: '10-down',
        clue: 'Small songbird',
        answer: 'ROBIN',
        startRow: 2,
        startCol: 9,
        direction: 'down',
        number: 10,
        isCompleted: false,
        cells: ['2-9', '3-9', '4-9', '5-9', '6-9']
      },
      {
        id: '13-down',
        clue: 'Tall tree with coconuts',
        answer: 'PALM',
        startRow: 4,
        startCol: 8,
        direction: 'down',
        number: 13,
        isCompleted: false,
        cells: ['4-8', '5-8', '6-8', '7-8']
      },
      {
        id: '15-down',
        clue: 'Fluffy farm animal',
        answer: 'SHEEP',
        startRow: 6,
        startCol: 2,
        direction: 'down',
        number: 15,
        isCompleted: false,
        cells: ['6-2', '7-2', '8-2', '9-2', '10-2']
      },
      {
        id: '17-down',
        clue: 'Spotted big cat',
        answer: 'LEOPARD',
        startRow: 6,
        startCol: 10,
        direction: 'down',
        number: 17,
        isCompleted: false,
        cells: ['6-10', '7-10', '8-10', '9-10', '10-10', '11-10', '12-10']
      },
      {
        id: '19-down',
        clue: 'Small amphibian',
        answer: 'FROG',
        startRow: 8,
        startCol: 4,
        direction: 'down',
        number: 19,
        isCompleted: false,
        cells: ['8-4', '9-4', '10-4', '11-4']
      },
      {
        id: '21-down',
        clue: 'Slow-moving garden pest',
        answer: 'SNAIL',
        startRow: 10,
        startCol: 0,
        direction: 'down',
        number: 21,
        isCompleted: false,
        cells: ['10-0', '11-0', '12-0', '13-0', '14-0']
      },
      {
        id: '23-down',
        clue: 'Buzzing insect',
        answer: 'FLY',
        startRow: 10,
        startCol: 8,
        direction: 'down',
        number: 23,
        isCompleted: false,
        cells: ['10-8', '11-8', '12-8']
      }
    ],
    clues: {
      across: [
        { id: '1-across', number: 1, direction: 'across', clue: 'Feline pet', answer: 'CAT', isCompleted: false },
        { id: '4-across', number: 4, direction: 'across', clue: 'Canine companion', answer: 'DOG', isCompleted: false },
        { id: '7-across', number: 7, direction: 'across', clue: 'Large African mammal with trunk', answer: 'ELEPHANT', isCompleted: false },
        { id: '9-across', number: 9, direction: 'across', clue: 'Flying mammal', answer: 'BAT', isCompleted: false },
        { id: '11-across', number: 11, direction: 'across', clue: 'Nocturnal bird of prey', answer: 'OWL', isCompleted: false },
        { id: '12-across', number: 12, direction: 'across', clue: 'King of the jungle', answer: 'LION', isCompleted: false },
        { id: '14-across', number: 14, direction: 'across', clue: 'Striped horse-like animal', answer: 'ZEBRA', isCompleted: false },
        { id: '16-across', number: 16, direction: 'across', clue: 'Long-necked African animal', answer: 'GIRAFFE', isCompleted: false },
        { id: '18-across', number: 18, direction: 'across', clue: 'Slithering reptile', answer: 'SNAKE', isCompleted: false },
        { id: '20-across', number: 20, direction: 'across', clue: 'Aquatic mammal', answer: 'WHALE', isCompleted: false },
        { id: '22-across', number: 22, direction: 'across', clue: 'Small rodent', answer: 'MOUSE', isCompleted: false },
        { id: '24-across', number: 24, direction: 'across', clue: 'Hopping marsupial', answer: 'KANGAROO', isCompleted: false }
      ],
      down: [
        { id: '1-down', number: 1, direction: 'down', clue: 'Vehicle with four wheels', answer: 'CAR', isCompleted: false },
        { id: '2-down', number: 2, direction: 'down', clue: 'Insect that makes honey', answer: 'BEE', isCompleted: false },
        { id: '3-down', number: 3, direction: 'down', clue: 'Farm animal that says moo', answer: 'COW', isCompleted: false },
        { id: '5-down', number: 5, direction: 'down', clue: 'Large body of water', answer: 'OCEAN', isCompleted: false },
        { id: '6-down', number: 6, direction: 'down', clue: 'Primate that swings on trees', answer: 'MONKEY', isCompleted: false },
        { id: '8-down', number: 8, direction: 'down', clue: 'Bird that cannot fly', answer: 'PENGUIN', isCompleted: false },
        { id: '10-down', number: 10, direction: 'down', clue: 'Small songbird', answer: 'ROBIN', isCompleted: false },
        { id: '13-down', number: 13, direction: 'down', clue: 'Tall tree with coconuts', answer: 'PALM', isCompleted: false },
        { id: '15-down', number: 15, direction: 'down', clue: 'Fluffy farm animal', answer: 'SHEEP', isCompleted: false },
        { id: '17-down', number: 17, direction: 'down', clue: 'Spotted big cat', answer: 'LEOPARD', isCompleted: false },
        { id: '19-down', number: 19, direction: 'down', clue: 'Small amphibian', answer: 'FROG', isCompleted: false },
        { id: '21-down', number: 21, direction: 'down', clue: 'Slow-moving garden pest', answer: 'SNAIL', isCompleted: false },
        { id: '23-down', number: 23, direction: 'down', clue: 'Buzzing insect', answer: 'FLY', isCompleted: false }
      ]
    }
  },
  {
    id: 'daily-2024-002',
    title: 'Daily Crossword #2 - Technology & Science',
    date: '2024-01-02',
    difficulty: 'medium',
    size: 15,
    grid: [],
    words: [
      // Across words
      {
        id: '1-across',
        clue: 'Popular programming language',
        answer: 'PYTHON',
        startRow: 0,
        startCol: 0,
        direction: 'across',
        number: 1,
        isCompleted: false,
        cells: ['0-0', '0-1', '0-2', '0-3', '0-4', '0-5']
      },
      {
        id: '7-across',
        clue: 'Web development framework',
        answer: 'REACT',
        startRow: 0,
        startCol: 7,
        direction: 'across',
        number: 7,
        isCompleted: false,
        cells: ['0-7', '0-8', '0-9', '0-10', '0-11']
      },
      {
        id: '8-across',
        clue: 'Artificial intelligence',
        answer: 'AI',
        startRow: 2,
        startCol: 0,
        direction: 'across',
        number: 8,
        isCompleted: false,
        cells: ['2-0', '2-1']
      },
      {
        id: '9-across',
        clue: 'Central processing unit',
        answer: 'CPU',
        startRow: 2,
        startCol: 3,
        direction: 'across',
        number: 9,
        isCompleted: false,
        cells: ['2-3', '2-4', '2-5']
      },
      {
        id: '11-across',
        clue: 'Computer memory type',
        answer: 'RAM',
        startRow: 2,
        startCol: 7,
        direction: 'across',
        number: 11,
        isCompleted: false,
        cells: ['2-7', '2-8', '2-9']
      },
      {
        id: '12-across',
        clue: 'Data transmission protocol',
        answer: 'HTTP',
        startRow: 2,
        startCol: 11,
        direction: 'across',
        number: 12,
        isCompleted: false,
        cells: ['2-11', '2-12', '2-13', '2-14']
      },
      {
        id: '14-across',
        clue: 'Version control system',
        answer: 'GIT',
        startRow: 4,
        startCol: 1,
        direction: 'across',
        number: 14,
        isCompleted: false,
        cells: ['4-1', '4-2', '4-3']
      },
      {
        id: '15-across',
        clue: 'Structured query language',
        answer: 'SQL',
        startRow: 4,
        startCol: 5,
        direction: 'across',
        number: 15,
        isCompleted: false,
        cells: ['4-5', '4-6', '4-7']
      },
      {
        id: '17-across',
        clue: 'Application programming interface',
        answer: 'API',
        startRow: 4,
        startCol: 9,
        direction: 'across',
        number: 17,
        isCompleted: false,
        cells: ['4-9', '4-10', '4-11']
      },
      {
        id: '18-across',
        clue: 'JavaScript runtime environment',
        answer: 'NODEJS',
        startRow: 6,
        startCol: 0,
        direction: 'across',
        number: 18,
        isCompleted: false,
        cells: ['6-0', '6-1', '6-2', '6-3', '6-4', '6-5']
      },
      {
        id: '20-across',
        clue: 'Cloud computing platform',
        answer: 'AWS',
        startRow: 6,
        startCol: 7,
        direction: 'across',
        number: 20,
        isCompleted: false,
        cells: ['6-7', '6-8', '6-9']
      },
      {
        id: '21-across',
        clue: 'Machine learning framework',
        answer: 'TENSORFLOW',
        startRow: 8,
        startCol: 2,
        direction: 'across',
        number: 21,
        isCompleted: false,
        cells: ['8-2', '8-3', '8-4', '8-5', '8-6', '8-7', '8-8', '8-9', '8-10', '8-11']
      },
      {
        id: '23-across',
        clue: 'Cascading style sheets',
        answer: 'CSS',
        startRow: 10,
        startCol: 0,
        direction: 'across',
        number: 23,
        isCompleted: false,
        cells: ['10-0', '10-1', '10-2']
      },
      {
        id: '24-across',
        clue: 'Database management system',
        answer: 'MYSQL',
        startRow: 10,
        startCol: 4,
        direction: 'across',
        number: 24,
        isCompleted: false,
        cells: ['10-4', '10-5', '10-6', '10-7', '10-8']
      },
      {
        id: '26-across',
        clue: 'Code repository platform',
        answer: 'GITHUB',
        startRow: 12,
        startCol: 1,
        direction: 'across',
        number: 26,
        isCompleted: false,
        cells: ['12-1', '12-2', '12-3', '12-4', '12-5', '12-6']
      },
      // Down words
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
        id: '2-down',
        clue: 'Programming language by Google',
        answer: 'GO',
        startRow: 0,
        startCol: 1,
        direction: 'down',
        number: 2,
        isCompleted: false,
        cells: ['0-1', '1-1']
      },
      {
        id: '3-down',
        clue: 'TypeScript file extension',
        answer: 'TS',
        startRow: 0,
        startCol: 2,
        direction: 'down',
        number: 3,
        isCompleted: false,
        cells: ['0-2', '1-2']
      },
      {
        id: '4-down',
        clue: 'HyperText Markup Language',
        answer: 'HTML',
        startRow: 0,
        startCol: 3,
        direction: 'down',
        number: 4,
        isCompleted: false,
        cells: ['0-3', '1-3', '2-3', '3-3']
      },
      {
        id: '5-down',
        clue: 'Operating system kernel',
        answer: 'LINUX',
        startRow: 0,
        startCol: 4,
        direction: 'down',
        number: 5,
        isCompleted: false,
        cells: ['0-4', '1-4', '2-4', '3-4', '4-4']
      },
      {
        id: '6-down',
        clue: 'Network protocol',
        answer: 'TCP',
        startRow: 0,
        startCol: 5,
        direction: 'down',
        number: 6,
        isCompleted: false,
        cells: ['0-5', '1-5', '2-5']
      },
      {
        id: '10-down',
        clue: 'Processor manufacturer',
        answer: 'INTEL',
        startRow: 2,
        startCol: 5,
        direction: 'down',
        number: 10,
        isCompleted: false,
        cells: ['2-5', '3-5', '4-5', '5-5', '6-5']
      },
      {
        id: '13-down',
        clue: 'Graphics processing unit',
        answer: 'GPU',
        startRow: 2,
        startCol: 14,
        direction: 'down',
        number: 13,
        isCompleted: false,
        cells: ['2-14', '3-14', '4-14']
      },
      {
        id: '16-down',
        clue: 'Solid state drive',
        answer: 'SSD',
        startRow: 4,
        startCol: 6,
        direction: 'down',
        number: 16,
        isCompleted: false,
        cells: ['4-6', '5-6', '6-6']
      },
      {
        id: '19-down',
        clue: 'JavaScript library',
        answer: 'JQUERY',
        startRow: 6,
        startCol: 3,
        direction: 'down',
        number: 19,
        isCompleted: false,
        cells: ['6-3', '7-3', '8-3', '9-3', '10-3', '11-3']
      },
      {
        id: '22-down',
        clue: 'Internet of Things',
        answer: 'IOT',
        startRow: 8,
        startCol: 9,
        direction: 'down',
        number: 22,
        isCompleted: false,
        cells: ['8-9', '9-9', '10-9']
      },
      {
        id: '25-down',
        clue: 'User interface',
        answer: 'UI',
        startRow: 10,
        startCol: 7,
        direction: 'down',
        number: 25,
        isCompleted: false,
        cells: ['10-7', '11-7']
      }
    ],
    clues: {
      across: [
        { id: '1-across', number: 1, direction: 'across', clue: 'Popular programming language', answer: 'PYTHON', isCompleted: false },
        { id: '7-across', number: 7, direction: 'across', clue: 'Web development framework', answer: 'REACT', isCompleted: false },
        { id: '8-across', number: 8, direction: 'across', clue: 'Artificial intelligence', answer: 'AI', isCompleted: false },
        { id: '9-across', number: 9, direction: 'across', clue: 'Central processing unit', answer: 'CPU', isCompleted: false },
        { id: '11-across', number: 11, direction: 'across', clue: 'Computer memory type', answer: 'RAM', isCompleted: false },
        { id: '12-across', number: 12, direction: 'across', clue: 'Data transmission protocol', answer: 'HTTP', isCompleted: false },
        { id: '14-across', number: 14, direction: 'across', clue: 'Version control system', answer: 'GIT', isCompleted: false },
        { id: '15-across', number: 15, direction: 'across', clue: 'Structured query language', answer: 'SQL', isCompleted: false },
        { id: '17-across', number: 17, direction: 'across', clue: 'Application programming interface', answer: 'API', isCompleted: false },
        { id: '18-across', number: 18, direction: 'across', clue: 'JavaScript runtime environment', answer: 'NODEJS', isCompleted: false },
        { id: '20-across', number: 20, direction: 'across', clue: 'Cloud computing platform', answer: 'AWS', isCompleted: false },
        { id: '21-across', number: 21, direction: 'across', clue: 'Machine learning framework', answer: 'TENSORFLOW', isCompleted: false },
        { id: '23-across', number: 23, direction: 'across', clue: 'Cascading style sheets', answer: 'CSS', isCompleted: false },
        { id: '24-across', number: 24, direction: 'across', clue: 'Database management system', answer: 'MYSQL', isCompleted: false },
        { id: '26-across', number: 26, direction: 'across', clue: 'Code repository platform', answer: 'GITHUB', isCompleted: false }
      ],
      down: [
        { id: '1-down', number: 1, direction: 'down', clue: 'Personal computer', answer: 'PC', isCompleted: false },
        { id: '2-down', number: 2, direction: 'down', clue: 'Programming language by Google', answer: 'GO', isCompleted: false },
        { id: '3-down', number: 3, direction: 'down', clue: 'TypeScript file extension', answer: 'TS', isCompleted: false },
        { id: '4-down', number: 4, direction: 'down', clue: 'HyperText Markup Language', answer: 'HTML', isCompleted: false },
        { id: '5-down', number: 5, direction: 'down', clue: 'Operating system kernel', answer: 'LINUX', isCompleted: false },
        { id: '6-down', number: 6, direction: 'down', clue: 'Network protocol', answer: 'TCP', isCompleted: false },
        { id: '10-down', number: 10, direction: 'down', clue: 'Processor manufacturer', answer: 'INTEL', isCompleted: false },
        { id: '13-down', number: 13, direction: 'down', clue: 'Graphics processing unit', answer: 'GPU', isCompleted: false },
        { id: '16-down', number: 16, direction: 'down', clue: 'Solid state drive', answer: 'SSD', isCompleted: false },
        { id: '19-down', number: 19, direction: 'down', clue: 'JavaScript library', answer: 'JQUERY', isCompleted: false },
        { id: '22-down', number: 22, direction: 'down', clue: 'Internet of Things', answer: 'IOT', isCompleted: false },
        { id: '25-down', number: 25, direction: 'down', clue: 'User interface', answer: 'UI', isCompleted: false }
      ]
    }
  },
  {
    id: 'daily-2024-003',
    title: 'Daily Crossword #3 - Food & Cooking',
    date: '2024-01-03',
    difficulty: 'easy',
    size: 13,
    grid: [],
    words: [
      // Across words
      {
        id: '1-across',
        clue: 'Italian pasta dish',
        answer: 'PIZZA',
        startRow: 0,
        startCol: 0,
        direction: 'across',
        number: 1,
        isCompleted: false,
        cells: ['0-0', '0-1', '0-2', '0-3', '0-4']
      },
      {
        id: '6-across',
        clue: 'Morning meal',
        answer: 'BREAKFAST',
        startRow: 2,
        startCol: 0,
        direction: 'across',
        number: 6,
        isCompleted: false,
        cells: ['2-0', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7', '2-8']
      },
      {
        id: '8-across',
        clue: 'Sweet frozen treat',
        answer: 'ICECREAM',
        startRow: 4,
        startCol: 1,
        direction: 'across',
        number: 8,
        isCompleted: false,
        cells: ['4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7', '4-8']
      },
      {
        id: '10-across',
        clue: 'Hot beverage',
        answer: 'COFFEE',
        startRow: 6,
        startCol: 0,
        direction: 'across',
        number: 10,
        isCompleted: false,
        cells: ['6-0', '6-1', '6-2', '6-3', '6-4', '6-5']
      },
      {
        id: '12-across',
        clue: 'Mexican food wrap',
        answer: 'TACO',
        startRow: 6,
        startCol: 7,
        direction: 'across',
        number: 12,
        isCompleted: false,
        cells: ['6-7', '6-8', '6-9', '6-10']
      },
      {
        id: '14-across',
        clue: 'Japanese rice dish',
        answer: 'SUSHI',
        startRow: 8,
        startCol: 2,
        direction: 'across',
        number: 14,
        isCompleted: false,
        cells: ['8-2', '8-3', '8-4', '8-5', '8-6']
      },
      {
        id: '16-across',
        clue: 'Grilled meat patty',
        answer: 'BURGER',
        startRow: 10,
        startCol: 0,
        direction: 'across',
        number: 16,
        isCompleted: false,
        cells: ['10-0', '10-1', '10-2', '10-3', '10-4', '10-5']
      },
      {
        id: '18-across',
        clue: 'Sweet baked dessert',
        answer: 'CAKE',
        startRow: 10,
        startCol: 7,
        direction: 'across',
        number: 18,
        isCompleted: false,
        cells: ['10-7', '10-8', '10-9', '10-10']
      },
      {
        id: '19-across',
        clue: 'Thanksgiving bird',
        answer: 'TURKEY',
        startRow: 12,
        startCol: 1,
        direction: 'across',
        number: 19,
        isCompleted: false,
        cells: ['12-1', '12-2', '12-3', '12-4', '12-5', '12-6']
      },
      // Down words
      {
        id: '1-down',
        clue: 'Fruit used for guacamole',
        answer: 'AVOCADO',
        startRow: 0,
        startCol: 0,
        direction: 'down',
        number: 1,
        isCompleted: false,
        cells: ['0-0', '1-0', '2-0', '3-0', '4-0', '5-0', '6-0']
      },
      {
        id: '2-down',
        clue: 'Cooking method with oil',
        answer: 'FRY',
        startRow: 0,
        startCol: 1,
        direction: 'down',
        number: 2,
        isCompleted: false,
        cells: ['0-1', '1-1', '2-1']
      },
      {
        id: '3-down',
        clue: 'Dairy product',
        answer: 'CHEESE',
        startRow: 0,
        startCol: 2,
        direction: 'down',
        number: 3,
        isCompleted: false,
        cells: ['0-2', '1-2', '2-2', '3-2', '4-2', '5-2']
      },
      {
        id: '4-down',
        clue: 'Citrus fruit',
        answer: 'ORANGE',
        startRow: 0,
        startCol: 3,
        direction: 'down',
        number: 4,
        isCompleted: false,
        cells: ['0-3', '1-3', '2-3', '3-3', '4-3', '5-3']
      },
      {
        id: '5-down',
        clue: 'Red fruit',
        answer: 'APPLE',
        startRow: 0,
        startCol: 4,
        direction: 'down',
        number: 5,
        isCompleted: false,
        cells: ['0-4', '1-4', '2-4', '3-4', '4-4']
      },
      {
        id: '7-down',
        clue: 'Cooking herb',
        answer: 'BASIL',
        startRow: 2,
        startCol: 6,
        direction: 'down',
        number: 7,
        isCompleted: false,
        cells: ['2-6', '3-6', '4-6', '5-6', '6-6']
      },
      {
        id: '9-down',
        clue: 'Breakfast grain',
        answer: 'OATS',
        startRow: 4,
        startCol: 8,
        direction: 'down',
        number: 9,
        isCompleted: false,
        cells: ['4-8', '5-8', '6-8', '7-8']
      },
      {
        id: '11-down',
        clue: 'Baking ingredient',
        answer: 'FLOUR',
        startRow: 6,
        startCol: 3,
        direction: 'down',
        number: 11,
        isCompleted: false,
        cells: ['6-3', '7-3', '8-3', '9-3', '10-3']
      },
      {
        id: '13-down',
        clue: 'Spicy pepper',
        answer: 'CHILI',
        startRow: 6,
        startCol: 9,
        direction: 'down',
        number: 13,
        isCompleted: false,
        cells: ['6-9', '7-9', '8-9', '9-9', '10-9']
      },
      {
        id: '15-down',
        clue: 'Cooking fat',
        answer: 'BUTTER',
        startRow: 8,
        startCol: 5,
        direction: 'down',
        number: 15,
        isCompleted: false,
        cells: ['8-5', '9-5', '10-5', '11-5', '12-5', '13-5']
      },
      {
        id: '17-down',
        clue: 'Sweet condiment',
        answer: 'HONEY',
        startRow: 10,
        startCol: 1,
        direction: 'down',
        number: 17,
        isCompleted: false,
        cells: ['10-1', '11-1', '12-1', '13-1', '14-1']
      }
    ],
    clues: {
      across: [
        { id: '1-across', number: 1, direction: 'across', clue: 'Italian pasta dish', answer: 'PIZZA', isCompleted: false },
        { id: '6-across', number: 6, direction: 'across', clue: 'Morning meal', answer: 'BREAKFAST', isCompleted: false },
        { id: '8-across', number: 8, direction: 'across', clue: 'Sweet frozen treat', answer: 'ICECREAM', isCompleted: false },
        { id: '10-across', number: 10, direction: 'across', clue: 'Hot beverage', answer: 'COFFEE', isCompleted: false },
        { id: '12-across', number: 12, direction: 'across', clue: 'Mexican food wrap', answer: 'TACO', isCompleted: false },
        { id: '14-across', number: 14, direction: 'across', clue: 'Japanese rice dish', answer: 'SUSHI', isCompleted: false },
        { id: '16-across', number: 16, direction: 'across', clue: 'Grilled meat patty', answer: 'BURGER', isCompleted: false },
        { id: '18-across', number: 18, direction: 'across', clue: 'Sweet baked dessert', answer: 'CAKE', isCompleted: false },
        { id: '19-across', number: 19, direction: 'across', clue: 'Thanksgiving bird', answer: 'TURKEY', isCompleted: false }
      ],
      down: [
        { id: '1-down', number: 1, direction: 'down', clue: 'Fruit used for guacamole', answer: 'AVOCADO', isCompleted: false },
        { id: '2-down', number: 2, direction: 'down', clue: 'Cooking method with oil', answer: 'FRY', isCompleted: false },
        { id: '3-down', number: 3, direction: 'down', clue: 'Dairy product', answer: 'CHEESE', isCompleted: false },
        { id: '4-down', number: 4, direction: 'down', clue: 'Citrus fruit', answer: 'ORANGE', isCompleted: false },
        { id: '5-down', number: 5, direction: 'down', clue: 'Red fruit', answer: 'APPLE', isCompleted: false },
        { id: '7-down', number: 7, direction: 'down', clue: 'Cooking herb', answer: 'BASIL', isCompleted: false },
        { id: '9-down', number: 9, direction: 'down', clue: 'Breakfast grain', answer: 'OATS', isCompleted: false },
        { id: '11-down', number: 11, direction: 'down', clue: 'Baking ingredient', answer: 'FLOUR', isCompleted: false },
        { id: '13-down', number: 13, direction: 'down', clue: 'Spicy pepper', answer: 'CHILI', isCompleted: false },
        { id: '15-down', number: 15, direction: 'down', clue: 'Cooking fat', answer: 'BUTTER', isCompleted: false },
        { id: '17-down', number: 17, direction: 'down', clue: 'Sweet condiment', answer: 'HONEY', isCompleted: false }
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

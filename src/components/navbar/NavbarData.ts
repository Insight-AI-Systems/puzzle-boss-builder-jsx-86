
import { UserRole } from '@/types/userTypes';

// Define the base NavItem interface
export interface NavItem {
  name: string;
  href: string;
}

// Extend NavItem for admin-specific functionality
export interface MainNavItem extends NavItem {
  roles?: UserRole[];
}

// Define games for the dropdown
export interface GameItem {
  name: string;
  href: string;
  description?: string;
}

export const gameItems: GameItem[] = [
  { name: 'Jigsaws', href: '/games/jigsaw', description: 'Traditional jigsaw puzzles' },
  { name: 'Memory Master', href: '/games/memory', description: 'Test your memory skills' },
  { name: 'Word Search Arena', href: '/games/word-search', description: 'Find hidden words' },
  { name: 'Speed Sudoku', href: '/games/sudoku', description: 'Number puzzle challenge' },
  { name: 'Trivia Lightning', href: '/games/trivia', description: 'Quick trivia questions' },
  { name: 'Block Puzzle Pro', href: '/games/block-puzzle', description: 'Tetris-style blocks' },
  { name: 'Daily Crossword', href: '/games/crossword', description: 'Classic crossword puzzles' },
  { name: 'Mahjong', href: '/games/mahjong', description: 'Traditional tile matching' }
];

export const mainNavItems: MainNavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Puzzles', href: '/puzzles' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Prizes Won', href: '/prizes-won' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Categories', href: '/categories' }
];

// Admin navigation items - now empty since admin links are in the user dropdown
export const adminNavItems: MainNavItem[] = [];

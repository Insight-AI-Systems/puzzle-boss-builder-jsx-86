
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

export const mainNavItems: MainNavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Puzzles', href: '/puzzles' },
  { name: 'Jigsaws', href: '/games/unity-jigsaw-puzzle' }, // Now points to JavaScript puzzle selection
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Prizes Won', href: '/prizes-won' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Categories', href: '/categories' }
];

// Admin navigation items - now empty since admin links are in the user dropdown
export const adminNavItems: MainNavItem[] = [];

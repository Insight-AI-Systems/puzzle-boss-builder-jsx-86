
import { UserRole } from '@/types/userTypes';

// Define the base NavItem interface
export interface NavItem {
  name: string;
  path: string;
}

// Extend NavItem for admin-specific functionality
export interface MainNavItem extends NavItem {
  roles?: UserRole[];
}

export const mainNavItems: MainNavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Puzzles', path: '/puzzles' },
  { name: 'Prizes Won', path: '/prizes-won' },
  { name: 'Categories', path: '/categories' }
];


import { NavItem } from './NavLinks';
import { UserRole } from '@/types/userTypes';

export interface MainNavItem extends NavItem {
  roles?: UserRole[];
}

export const mainNavItems: MainNavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Puzzles', path: '/puzzles' },
  { name: 'Prizes', path: '/prizes' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Puzzle Demo', path: '/puzzle-demo' },
  { 
    name: 'Admin', 
    path: '/admin-dashboard',
    roles: ['super_admin', 'admin']
  },
];


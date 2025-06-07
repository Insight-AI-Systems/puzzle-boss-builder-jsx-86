
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
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Prizes Won', path: '/prizes-won' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Categories', path: '/categories' }
];

// Admin navigation items
export const adminNavItems: MainNavItem[] = [
  { name: 'Admin Dashboard', path: '/admin-dashboard', roles: ["super_admin", "admin", "category_manager", "partner_manager", "cfo"] },
  { name: 'Financial Dashboard', path: '/admin-dashboard?tab=finance', roles: ["super_admin", "cfo", "admin"] }
];


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
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Prizes Won', href: '/prizes-won' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Categories', href: '/categories' }
];

// Admin navigation items
export const adminNavItems: MainNavItem[] = [
  { name: 'Admin Dashboard', href: '/admin-dashboard', roles: ["super_admin", "admin", "category_manager", "partner_manager", "cfo"] },
  { name: 'Financial Dashboard', href: '/admin-dashboard?tab=finance', roles: ["super_admin", "cfo", "admin"] }
];

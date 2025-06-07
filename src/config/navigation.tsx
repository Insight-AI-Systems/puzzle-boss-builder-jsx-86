
import React from 'react';
import { 
  Home, 
  Puzzle, 
  Trophy, 
  CreditCard, 
  User, 
  Settings, 
  Shield,
  BarChart3,
  TestTube2
} from 'lucide-react';

export const mainNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Puzzles', href: '/puzzles', icon: Puzzle },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Prizes Won', href: '/prizes', icon: Trophy },
];

export const userMenuItems = [
  { name: 'My Account', href: '/account', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const adminMenuItems = [
  { name: 'Admin Dashboard', href: '/admin', icon: Shield },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Game Testing', href: '/game-testing', icon: TestTube2 },
];

import { ProjectTask, ProjectTest } from '../types/projectTypes';

export const getInitialTasks = (): ProjectTask[] => [
  {
    id: 'setup-project',
    phase: 1,
    name: 'Project Setup',
    description: 'Initialize the project with React, Tailwind CSS, and Supabase',
    status: 'completed'
  },
  {
    id: 'landing-page',
    phase: 1,
    name: 'Landing Page Components',
    description: 'Set up basic landing page structure',
    status: 'completed'
  },
  {
    id: 'supabase-connection',
    phase: 1,
    name: 'Supabase Connection',
    description: 'Connect the project to Supabase backend',
    status: 'completed'
  },
  {
    id: 'auth-signup',
    phase: 2,
    name: 'Signup Flow',
    description: 'Implement user registration with email verification',
    status: 'pending',
    testIds: ['test-signup-flow']
  },
  {
    id: 'auth-login',
    phase: 2,
    name: 'Login Flow',
    description: 'Implement user login and session management',
    status: 'pending',
    dependsOn: ['auth-signup'],
    testIds: ['test-login-flow']
  },
  {
    id: 'user-profiles',
    phase: 2,
    name: 'User Profiles',
    description: 'Implement user profiles with roles',
    status: 'pending',
    dependsOn: ['auth-signup'],
    testIds: ['test-user-profile']
  },
  {
    id: 'puzzle-schema',
    phase: 2,
    name: 'Puzzle Database Schema',
    description: 'Set up database tables for puzzles and categories',
    status: 'pending',
    testIds: ['test-puzzle-schema']
  },
  {
    id: 'game-engine',
    phase: 2,
    name: 'Puzzle Game Engine',
    description: 'Create basic puzzle gameplay mechanics',
    status: 'pending',
    testIds: ['test-puzzle-rendering', 'test-puzzle-interaction']
  },
  {
    id: 'prize-management',
    phase: 3,
    name: 'Prize Management',
    description: 'Set up prize categories and inventory',
    status: 'pending',
    testIds: ['test-prize-management']
  },
  {
    id: 'credit-system',
    phase: 3,
    name: 'Credit System',
    description: 'Implement credit purchase and management',
    status: 'pending',
    testIds: ['test-credit-transactions']
  },
  {
    id: 'leaderboards',
    phase: 3,
    name: 'Leaderboards',
    description: 'Build real-time leaderboards',
    status: 'pending',
    dependsOn: ['game-engine'],
    testIds: ['test-leaderboard']
  },
  {
    id: 'admin-dashboard',
    phase: 4,
    name: 'Admin Dashboard',
    description: 'Create interfaces for each admin role type',
    status: 'pending',
    dependsOn: ['user-profiles'],
    testIds: ['test-admin-access']
  },
  {
    id: 'analytics',
    phase: 4,
    name: 'Analytics & Reporting',
    description: 'Build tracking for key metrics',
    status: 'pending',
    testIds: ['test-analytics']
  },
];

export const getInitialTests = (): ProjectTest[] => [
  {
    id: 'test-signup-flow',
    name: 'Signup Flow Test',
    description: 'Verify user registration process',
    run: async () => {
      console.log('Running signup flow test...');
      return true;
    }
  },
  {
    id: 'test-login-flow',
    name: 'Login Flow Test',
    description: 'Verify user login process',
    run: async () => {
      console.log('Running login flow test...');
      return true;
    }
  }
];

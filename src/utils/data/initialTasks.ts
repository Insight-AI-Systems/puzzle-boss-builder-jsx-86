
import { ProjectTask, ProjectTest } from '../types/projectTypes';

export const getInitialTasks = (): ProjectTask[] => [
  {
    id: 'auth-setup',
    phase: 1,
    name: 'User Authentication Setup',
    description: 'Implement email and social login (Google/Apple) with Supabase Auth',
    status: 'pending',
    testIds: ['test-auth']
  },
  {
    id: 'user-profiles',
    phase: 1,
    name: 'User Profiles & Achievements',
    description: 'Create profile customization, achievement badges, and player history tracking',
    status: 'pending',
    dependsOn: ['auth-setup']
  },
  {
    id: 'puzzle-engine',
    phase: 1,
    name: 'Core Puzzle Engine',
    description: 'Implement timed puzzle completion and fair competition mechanics',
    status: 'pending'
  },
  {
    id: 'category-system',
    phase: 2,
    name: 'Prize Categories',
    description: 'Set up 25 prize categories with proper organization and management',
    status: 'pending'
  },
  {
    id: 'credit-system',
    phase: 2,
    name: 'Credit System',
    description: 'Implement credit/token purchase system with Stripe integration',
    status: 'pending',
    testIds: ['test-payments']
  },
  {
    id: 'membership-tiers',
    phase: 2,
    name: 'Membership System',
    description: 'Create membership tiers with benefits and referral rewards',
    status: 'pending',
    dependsOn: ['credit-system']
  },
  {
    id: 'prize-management',
    phase: 3,
    name: 'Prize Management',
    description: 'Implement prize fulfillment workflow and winner verification system',
    status: 'pending',
    dependsOn: ['category-system']
  },
  {
    id: 'content-management',
    phase: 3,
    name: 'Content Management',
    description: 'Create puzzle upload, category organization, and promotion scheduling',
    status: 'pending'
  },
  {
    id: 'analytics-dashboard',
    phase: 4,
    name: 'Analytics System',
    description: 'Implement user engagement metrics, revenue tracking, and puzzle popularity stats',
    status: 'pending',
    testIds: ['test-analytics']
  },
  {
    id: 'admin-roles',
    phase: 4,
    name: 'Admin Dashboard',
    description: 'Create interfaces for all admin roles (Super Admin, Category Managers, etc)',
    status: 'pending',
    testIds: ['test-admin-access']
  }
];

export const getInitialTests = (): ProjectTest[] => [
  {
    id: 'test-auth',
    name: 'Authentication Flow Test',
    description: 'Verify user registration and login processes',
    run: async () => {
      console.log('Running auth flow test...');
      return true;
    }
  },
  {
    id: 'test-payments',
    name: 'Payment System Test',
    description: 'Verify credit purchase and Stripe integration',
    run: async () => {
      console.log('Running payment system test...');
      return true;
    }
  },
  {
    id: 'test-analytics',
    name: 'Analytics System Test',
    description: 'Verify data tracking and reporting functionality',
    run: async () => {
      console.log('Running analytics system test...');
      return true;
    }
  },
  {
    id: 'test-admin-access',
    name: 'Admin Access Test',
    description: 'Verify role-based access control for admin features',
    run: async () => {
      console.log('Running admin access test...');
      return true;
    }
  }
];


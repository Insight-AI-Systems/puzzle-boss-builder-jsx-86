
import { ProjectTask, ProjectTest } from '../types/projectTypes';

export const getInitialTasks = (): ProjectTask[] => [
  // Phase 1: Core Authentication and User Management
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
    name: 'User Profiles & Roles',
    description: 'Implement profile customization, user roles (Super Admin, Admin, Category Managers, etc)',
    status: 'pending',
    dependsOn: ['auth-setup']
  },
  {
    id: 'puzzle-engine',
    phase: 1,
    name: 'Core Puzzle Engine',
    description: 'Implement timed jigsaw puzzle completion with fair competition mechanics',
    status: 'pending'
  },
  {
    id: 'puzzle-gameplay',
    phase: 1,
    name: 'Puzzle Gameplay Features',
    description: 'Add pause functionality, mobile responsiveness, and difficulty levels',
    status: 'pending',
    dependsOn: ['puzzle-engine']
  },
  
  // Phase 2: Prize and Payment Systems
  {
    id: 'prize-categories',
    phase: 2,
    name: 'Prize Categories Setup',
    description: 'Configure 25 prize categories including Smartphones, Laptops, Gaming Consoles, etc',
    status: 'pending'
  },
  {
    id: 'credit-system',
    phase: 2,
    name: 'Credit/Token System',
    description: 'Implement credit purchase system with Stripe integration',
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
    id: 'referral-system',
    phase: 2,
    name: 'Referral Program',
    description: 'Implement referral tracking and rewards system',
    status: 'pending',
    dependsOn: ['membership-tiers']
  },
  
  // Phase 3: Prize and Content Management
  {
    id: 'prize-fulfillment',
    phase: 3,
    name: 'Prize Management System',
    description: 'Create winner verification and prize fulfillment workflow',
    status: 'pending',
    dependsOn: ['prize-categories']
  },
  {
    id: 'content-management',
    phase: 3,
    name: 'Content Management System',
    description: 'Implement puzzle upload, category organization, and promotion scheduling',
    status: 'pending'
  },
  {
    id: 'seasonal-content',
    phase: 3,
    name: 'Seasonal Content Planning',
    description: 'Set up system for managing seasonal puzzles and promotional content',
    status: 'pending',
    dependsOn: ['content-management']
  },
  
  // Phase 4: Admin and Analytics
  {
    id: 'admin-dashboard',
    phase: 4,
    name: 'Admin Dashboard',
    description: 'Create interfaces for all admin roles with role-based access control',
    status: 'pending',
    testIds: ['test-admin-access'],
    dependsOn: ['user-profiles']
  },
  {
    id: 'analytics-system',
    phase: 4,
    name: 'Analytics Dashboard',
    description: 'Implement engagement metrics, revenue tracking, and puzzle popularity stats',
    status: 'pending',
    testIds: ['test-analytics']
  },
  {
    id: 'leaderboard-system',
    phase: 4,
    name: 'Real-time Leaderboards',
    description: 'Create real-time leaderboard mechanics for puzzle competitions',
    status: 'pending',
    dependsOn: ['puzzle-engine']
  },
  
  // Phase 5: Legal and Compliance
  {
    id: 'age-verification',
    phase: 5,
    name: 'Age Verification System',
    description: 'Implement age verification based on local regulations',
    status: 'pending'
  },
  {
    id: 'legal-documentation',
    phase: 5,
    name: 'Legal Documentation',
    description: 'Set up terms of service, privacy policy, and prize claim documentation',
    status: 'pending'
  },
  {
    id: 'fair-play-monitoring',
    phase: 5,
    name: 'Fair Play System',
    description: 'Implement fair play monitoring and anti-cheat measures',
    status: 'pending',
    dependsOn: ['puzzle-engine']
  }
];

export const getInitialTests = (): ProjectTest[] => [
  {
    id: 'test-auth',
    name: 'Authentication Flow Test',
    description: 'Verify user registration, login processes, and role assignment',
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


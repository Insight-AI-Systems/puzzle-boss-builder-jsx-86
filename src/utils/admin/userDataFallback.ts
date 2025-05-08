
import { UserProfile, UserRole } from '@/types/userTypes';
import { debugLog, DebugLevel } from '@/utils/debug';
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from '@/config/securityConfig';

// Store for locally cached users
let localUserCache: {
  users: UserProfile[];
  timestamp: number;
  expiresAt: number;
} | null = null;

// Mock data for development/testing
const mockUsers: UserProfile[] = [
  {
    id: 'mock-user-1',
    display_name: 'Mock Admin User',
    email: 'admin@example.com',
    bio: 'This is a mock admin user for development',
    avatar_url: null,
    role: 'admin',
    country: 'US',
    categories_played: ['nature', 'architecture'],
    credits: 100,
    achievements: ['early_adopter'],
    referral_code: 'MOCK001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_sign_in: new Date().toISOString(),
    account_locked: false
  },
  {
    id: 'mock-user-2',
    display_name: 'Mock Regular User',
    email: 'user@example.com',
    bio: 'This is a mock regular user for development',
    avatar_url: null,
    role: 'player',
    country: 'UK',
    categories_played: ['animals', 'food'],
    credits: 50,
    achievements: [],
    referral_code: 'MOCK002',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_sign_in: new Date().toISOString(),
    account_locked: false
  },
  {
    id: 'mock-user-3',
    display_name: 'Mock Super Admin',
    email: 'superadmin@example.com',
    bio: 'This is a mock super admin user for development',
    avatar_url: null,
    role: 'super_admin',
    country: 'CA',
    categories_played: [],
    credits: 1000,
    achievements: ['admin_badge'],
    referral_code: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_sign_in: new Date().toISOString(),
    account_locked: false
  },
  {
    id: 'mock-user-4',
    display_name: 'Mock Protected Admin',
    email: PROTECTED_ADMIN_EMAIL,
    bio: 'This is the protected admin account',
    avatar_url: null,
    role: 'super_admin',
    country: 'US',
    categories_played: [],
    credits: 9999,
    achievements: ['protected_admin'],
    referral_code: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_sign_in: new Date().toISOString(),
    account_locked: false
  }
];

/**
 * Utility for managing fallback data for users
 */
export const userDataFallback = {
  /**
   * Cache users locally
   */
  cacheUsers: (users: UserProfile[], ttlMinutes = 30) => {
    if (!Array.isArray(users) || users.length === 0) {
      debugLog('UserDataFallback', 'Not caching empty users array', DebugLevel.WARN);
      return;
    }
    
    const now = Date.now();
    localUserCache = {
      users: [...users],
      timestamp: now,
      expiresAt: now + (ttlMinutes * 60 * 1000)
    };
    
    debugLog('UserDataFallback', `Cached ${users.length} users locally`, DebugLevel.INFO);
  },
  
  /**
   * Get cached users if available
   */
  getCachedUsers: (): UserProfile[] | null => {
    const now = Date.now();
    
    if (!localUserCache) {
      debugLog('UserDataFallback', 'No user cache available', DebugLevel.INFO);
      return null;
    }
    
    if (now > localUserCache.expiresAt) {
      debugLog('UserDataFallback', 'User cache expired', DebugLevel.INFO);
      localUserCache = null;
      return null;
    }
    
    debugLog('UserDataFallback', `Returning ${localUserCache.users.length} cached users`, DebugLevel.INFO);
    return [...localUserCache.users];
  },
  
  /**
   * Clear the cache
   */
  clearCache: () => {
    localUserCache = null;
    debugLog('UserDataFallback', 'User cache cleared', DebugLevel.INFO);
  },
  
  /**
   * Get mock users for development/testing
   */
  getMockUsers: (): UserProfile[] => {
    debugLog('UserDataFallback', 'Returning mock users for development', DebugLevel.INFO);
    return [...mockUsers];
  },
  
  /**
   * Generate fallback user profile based on minimal data
   */
  generateFallbackProfile: (
    userId: string, 
    email?: string | null,
    role: UserRole = 'player'
  ): UserProfile => {
    const displayName = email ? email.split('@')[0] : `User-${userId.substring(0, 6)}`;
    
    // If this is the protected admin, ensure proper role
    if (isProtectedAdmin(email)) {
      role = 'super_admin';
    }
    
    return {
      id: userId,
      display_name: displayName,
      email: email || null,
      bio: null,
      avatar_url: null,
      role: role,
      country: null,
      categories_played: [],
      credits: 0,
      achievements: [],
      referral_code: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sign_in: null,
      account_locked: false
    };
  }
};

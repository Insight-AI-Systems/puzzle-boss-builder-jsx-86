
import { Profile } from './types';

/**
 * Available user roles in the application
 */
export type UserRole = 'admin' | 'category_manager' | 'cfo' | 'social_media_manager' | 'partner_manager' | 'player';

/**
 * Role checking result interface
 */
export interface RoleChecks {
  isAdmin: boolean;
  isCategoryManager: boolean;
  isCFO: boolean;
  isSocialMediaManager: boolean;
  isPartnerManager: boolean;
  isPlayer: boolean;
  hasRole: (role: UserRole) => boolean;
}

/**
 * Determines if a user has specific roles based on their profile data
 * @param profile The user profile containing role information
 * @returns Object with boolean flags for each role and a hasRole utility method
 */
export const useAuthRoles = (profile: Profile | null): RoleChecks => {
  const roles = {
    isAdmin: profile?.role === 'admin',
    isCategoryManager: profile?.role === 'category_manager',
    isCFO: profile?.role === 'cfo',
    isSocialMediaManager: profile?.role === 'social_media_manager',
    isPartnerManager: profile?.role === 'partner_manager',
    isPlayer: profile?.role === 'player',
    
    // Utility method to check any role dynamically
    hasRole: (role: UserRole): boolean => profile?.role === role
  };
  
  return roles;
};

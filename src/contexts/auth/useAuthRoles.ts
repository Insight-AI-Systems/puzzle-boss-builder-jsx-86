
import { Profile } from './types';

/**
 * Determines if a user has specific roles based on their profile data
 */
export const useAuthRoles = (profile: Profile | null) => {
  return {
    isAdmin: profile?.role === 'admin',
    isCategoryManager: profile?.role === 'category_manager',
    isCFO: profile?.role === 'cfo',
    isSocialMediaManager: profile?.role === 'social_media_manager',
    isPartnerManager: profile?.role === 'partner_manager',
    isPlayer: profile?.role === 'player'
  };
};

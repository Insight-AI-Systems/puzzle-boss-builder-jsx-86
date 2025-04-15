
/**
 * Determines if a user has specific roles based on their profile data
 * @param {Object|null} profile - The user profile containing role information
 * @returns {Object} Object with boolean flags for each role and a hasRole utility method
 */
export const useAuthRoles = (profile) => {
  const roles = {
    isAdmin: profile?.role === 'admin',
    isCategoryManager: profile?.role === 'category_manager',
    isCFO: profile?.role === 'cfo',
    isSocialMediaManager: profile?.role === 'social_media_manager',
    isPartnerManager: profile?.role === 'partner_manager',
    isPlayer: profile?.role === 'player',
    
    // Utility method to check any role dynamically
    hasRole: (role) => profile?.role === role
  };
  
  return roles;
};

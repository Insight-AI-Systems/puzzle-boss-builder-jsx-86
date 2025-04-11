
/**
 * Utility functions for checking user permissions and roles
 */

/**
 * Role hierarchy and their permissions
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CATEGORY_MANAGER: 'category_manager',
  CFO: 'cfo',
  SOCIAL_MEDIA_MANAGER: 'social_media_manager',
  PARTNER_MANAGER: 'partner_manager',
  PLAYER: 'player'
};

/**
 * Permission definitions
 */
export const PERMISSIONS = {
  // System-wide permissions
  MANAGE_ALL: 'manage_all',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  
  // Content permissions
  MANAGE_PUZZLES: 'manage_puzzles',
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_CONTENT: 'manage_content',
  
  // Financial permissions
  MANAGE_FINANCES: 'manage_finances',
  VIEW_REPORTS: 'view_reports',
  
  // Social media permissions
  MANAGE_MARKETING: 'manage_marketing',
  MANAGE_WINNERS: 'manage_winners',
  
  // Partner permissions
  MANAGE_PARTNERS: 'manage_partners',
  MANAGE_PRIZES: 'manage_prizes',
  
  // Player permissions
  PLAY_PUZZLES: 'play_puzzles',
  MANAGE_PROFILE: 'manage_profile'
};

/**
 * Role to permission mapping
 */
const rolePermissions = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.MANAGE_ALL,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_PUZZLES,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_FINANCES,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_MARKETING,
    PERMISSIONS.MANAGE_WINNERS,
    PERMISSIONS.MANAGE_PARTNERS,
    PERMISSIONS.MANAGE_PRIZES,
    PERMISSIONS.PLAY_PUZZLES,
    PERMISSIONS.MANAGE_PROFILE
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_PUZZLES,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.PLAY_PUZZLES,
    PERMISSIONS.MANAGE_PROFILE
  ],
  [ROLES.CATEGORY_MANAGER]: [
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.PLAY_PUZZLES,
    PERMISSIONS.MANAGE_PROFILE
  ],
  [ROLES.CFO]: [
    PERMISSIONS.MANAGE_FINANCES,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.PLAY_PUZZLES,
    PERMISSIONS.MANAGE_PROFILE
  ],
  [ROLES.SOCIAL_MEDIA_MANAGER]: [
    PERMISSIONS.MANAGE_MARKETING,
    PERMISSIONS.MANAGE_WINNERS,
    PERMISSIONS.PLAY_PUZZLES,
    PERMISSIONS.MANAGE_PROFILE
  ],
  [ROLES.PARTNER_MANAGER]: [
    PERMISSIONS.MANAGE_PARTNERS,
    PERMISSIONS.MANAGE_PRIZES,
    PERMISSIONS.PLAY_PUZZLES,
    PERMISSIONS.MANAGE_PROFILE
  ],
  [ROLES.PLAYER]: [
    PERMISSIONS.PLAY_PUZZLES,
    PERMISSIONS.MANAGE_PROFILE
  ]
};

/**
 * Check if a user has a specific permission
 * @param {Object} profile - User profile with role information
 * @param {string} permission - Permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const hasPermission = (profile, permission) => {
  if (!profile || !profile.role) return false;
  
  // Super admins can do everything
  if (profile.role === ROLES.SUPER_ADMIN) return true;
  
  // Check if the user's role has the requested permission
  const permissions = rolePermissions[profile.role] || [];
  return permissions.includes(permission);
};

/**
 * Check if a user has a specific role
 * @param {Object} profile - User profile with role information
 * @param {string|string[]} roles - Role or array of roles to check
 * @returns {boolean} - Whether the user has any of the roles
 */
export const hasRole = (profile, roles) => {
  if (!profile || !profile.role) return false;
  
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(profile.role);
};

/**
 * Get a display name for a role
 * @param {string} role - Role constant
 * @returns {string} - Human-readable role name
 */
export const getRoleDisplayName = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return 'Super Admin';
    case ROLES.ADMIN:
      return 'Admin';
    case ROLES.CATEGORY_MANAGER:
      return 'Category Manager';
    case ROLES.CFO:
      return 'Chief Financial Officer';
    case ROLES.SOCIAL_MEDIA_MANAGER:
      return 'Social Media Manager';
    case ROLES.PARTNER_MANAGER:
      return 'Partner Manager';
    case ROLES.PLAYER:
      return 'Player';
    default:
      return 'Unknown Role';
  }
};

/**
 * Get all available permissions for a specific role
 * @param {string} role - Role to get permissions for
 * @returns {string[]} - Array of permissions
 */
export const getPermissionsForRole = (role) => {
  return rolePermissions[role] || [];
};


/**
 * Security Configuration
 * 
 * Contains constants and helper functions for security checks throughout the application
 */

// Protected admin email - centralized configuration
export const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

/**
 * Checks if an email belongs to a protected admin
 * Uses case-insensitive comparison for reliability
 * 
 * @param email - Email to check
 * @returns Boolean indicating if this is a protected admin email
 */
export function isProtectedAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
}

/**
 * Gets the security role weight for comparison
 * Higher weight = higher privileges
 * 
 * @param role - Role to check
 * @returns Numeric weight of the role
 */
export function getRoleWeight(role: string): number {
  switch(role) {
    case 'super_admin': return 100;
    case 'admin': return 80;
    case 'category_manager': return 60;
    case 'social_media_manager': return 50;
    case 'partner_manager': return 50;
    case 'cfo': return 40;
    case 'player': return 10;
    default: return 0;
  }
}

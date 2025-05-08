
/**
 * Security Configuration
 * 
 * Central configuration for security-related constants and utilities
 */

// Protected admin email that should always have admin access
export const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

/**
 * Check if an email belongs to the protected admin
 * Uses case-insensitive comparison for reliability
 * 
 * @param email - Email to check
 * @returns Boolean indicating if this is a protected admin email
 */
export function isProtectedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const result = email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
  console.log(`Security check for email: ${email} against ${PROTECTED_ADMIN_EMAIL}, result: ${result}`);
  return result;
}

/**
 * Get the security role weight for comparison
 * Higher weight means higher permissions
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
    case 'regular': return 10;
    default: return 0;
  }
}

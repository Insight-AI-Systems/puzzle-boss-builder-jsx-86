
/**
 * Application-wide constants 
 */

// Protected admin email that can't be modified
export const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

/**
 * Check if an email belongs to the protected admin
 * @param email - The email to check
 * @returns boolean indicating if this is the protected admin
 */
export function isProtectedAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
}

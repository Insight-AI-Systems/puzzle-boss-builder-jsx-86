
/**
 * Security configuration constants for the application
 */

// Special admin email that should always have access regardless of database role
export const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

// Helper function for case-insensitive email comparison
export const isProtectedAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
};

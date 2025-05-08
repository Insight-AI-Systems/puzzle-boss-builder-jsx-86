
import { UserRole } from '@/types/userTypes';

// Special admin email that should always have admin access
export const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

/**
 * Role hierarchy for determining permissions
 * Higher number = higher privileges
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'super_admin': 100,
  'admin': 80,
  'category_manager': 60,
  'social_media_manager': 50,
  'partner_manager': 50,
  'cfo': 70,
  'player': 10
};

/**
 * Helper function to check if an email is the protected admin
 */
export function isProtectedAdmin(email?: string | null): boolean {
  if (!email) return false;
  // Case-insensitive comparison
  return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
}

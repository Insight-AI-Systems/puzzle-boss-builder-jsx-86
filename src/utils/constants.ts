
/**
 * Application-wide constants to ensure consistency
 */

// Protected administrator email that receives special handling
export const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

// Check if an email is the protected admin
export const isProtectedAdmin = (email?: string | null): boolean => {
  return email === PROTECTED_ADMIN_EMAIL;
};

// Role hierarchy for permission checks
export const ROLE_HIERARCHY: Record<string, number> = {
  'super_admin': 100,
  'admin': 80,
  'category_manager': 60,
  'social_media_manager': 50,
  'partner_manager': 50,
  'cfo': 50,
  'player': 10
};

// Standard error messages for consistency
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You do not have permission to perform this action',
  PROTECTED_ADMIN: 'Protected admin account cannot be modified',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  SERVER_ERROR: 'Server error. Please try again later',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_FAILED: 'Data validation failed. Please check your input',
  UNKNOWN_ERROR: 'An unknown error occurred'
};

// API endpoints for Supabase edge functions
export const API_ENDPOINTS = {
  GET_ALL_USERS: 'get-all-users',
  UPDATE_USER_ROLE: 'admin-update-roles',
  DELETE_USER: 'delete-user',
  CREATE_USER: 'create-user'
};

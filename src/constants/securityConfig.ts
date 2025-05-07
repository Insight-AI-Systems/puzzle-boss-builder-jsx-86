
/**
 * Security Configuration Module
 * 
 * This module contains centralized security constants and helper functions
 * used throughout the application to ensure consistent security practices.
 * 
 * @module securityConfig
 */

// Special admin email that should always have access regardless of database role
export const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

// List of admin roles for role-based access control
export const ADMIN_ROLES = ['admin', 'super_admin', 'category_manager'] as const;

// Security levels for the application
export const SECURITY_LEVELS = {
  NORMAL: 'normal',
  ELEVATED: 'elevated',
  LOCKDOWN: 'lockdown'
};

// Session timeout settings (in seconds)
export const SESSION_TIMEOUTS = {
  DEFAULT: 3600, // 1 hour
  EXTENDED: 86400, // 24 hours
  ADMIN: 1800 // 30 minutes
};

// Maximum login attempts before temporary lockout
export const MAX_LOGIN_ATTEMPTS = 5;

// Lockout duration in minutes after exceeding max attempts
export const LOCKOUT_DURATION_MINUTES = 15;

/**
 * Helper function for case-insensitive email comparison with the protected admin
 * @param email - The email to compare
 * @returns Whether the email matches the protected admin email
 */
export const isProtectedAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
};

/**
 * Check if a role is an admin role
 * @param role - The role to check
 * @returns Whether the role is considered an admin role
 */
export const isAdminRole = (role: string): boolean => {
  return ADMIN_ROLES.includes(role as any);
};

/**
 * Filter sensitive data from logs and error messages
 * @param data - The data to sanitize
 * @returns Sanitized data safe for logging
 */
export const sanitizeDataForLogging = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sanitized = { ...data };
  
  // List of properties that should be redacted in logs
  const sensitiveProps = ['password', 'token', 'apiKey', 'secret', 'credential'];
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveProps.some(prop => key.toLowerCase().includes(prop))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeDataForLogging(sanitized[key]);
    }
  });
  
  return sanitized;
};

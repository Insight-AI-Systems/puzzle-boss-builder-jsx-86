
/**
 * Protected admin email address
 * This email always has full system access
 */
export const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

/**
 * Check if an email is the protected admin
 * @param email - Email to check
 * @returns Boolean indicating if the email is the protected admin
 */
export function isProtectedAdmin(email?: string | null): boolean {
  if (!email) return false;
  
  // Case insensitive comparison
  return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
}

/**
 * Security configuration for the application
 */
export const securityConfig = {
  // Minimum password length
  minPasswordLength: 8,
  
  // Maximum failed login attempts before lockout
  maxFailedLoginAttempts: 5,
  
  // Account lockout duration in minutes
  accountLockoutDuration: 15,
  
  // Session timeout in minutes
  sessionTimeout: 60,
  
  // Password reset token expiry in minutes
  passwordResetExpiry: 30,
  
  // Cookie security settings
  secureCookies: process.env.NODE_ENV === 'production',
  
  // CSRF protection
  csrfProtection: true,
  
  // Content Security Policy enabled
  cspEnabled: process.env.NODE_ENV === 'production',
  
  // Allow dev tools in production for admin users
  allowDevToolsForAdmins: true
};

/**
 * Developer access settings
 */
export const developerAccess = {
  // Additional developer emails that should have admin access
  developerEmails: [
    'rob.small.1234@gmail.com',
    'dev@thepuzzleboss.com',
    'test@puzzleboss.com'
  ],
  
  // Check if email is a developer email
  isDeveloperEmail: (email?: string | null): boolean => {
    if (!email) return false;
    return developerAccess.developerEmails.some(
      devEmail => email.toLowerCase() === devEmail.toLowerCase()
    );
  },
  
  // Check if user should have developer access
  hasDeveloperAccess: (email?: string | null): boolean => {
    return isProtectedAdmin(email) || developerAccess.isDeveloperEmail(email);
  }
};

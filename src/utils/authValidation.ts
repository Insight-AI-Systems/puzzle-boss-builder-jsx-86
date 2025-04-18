
/**
 * Authentication validation utilities
 * Provides consistent validation for authentication forms
 */

interface ValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Validates email format
 * @param email Email address to validate
 * @returns Validation result with status and message
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  
  return { valid: true, message: '' };
}

/**
 * Validates password strength
 * Enforces security requirements:
 * - Minimum length
 * - Uppercase and lowercase letters
 * - Numbers
 * - Special characters
 * 
 * @param password Password to validate
 * @returns Validation result with status and message
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  // Check length
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  
  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one uppercase letter' };
  }
  
  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one lowercase letter' };
  }
  
  // Check for numbers
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must include at least one number' };
  }
  
  // Check for special characters
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must include at least one special character' };
  }
  
  return { valid: true, message: '' };
}

/**
 * Measures password strength score from 0-100
 * @param password Password to evaluate
 * @returns Numeric score (0-100) and descriptive strength label
 */
export function getPasswordStrength(password: string): { score: number, label: string } {
  if (!password) {
    return { score: 0, label: 'None' };
  }
  
  let score = 0;
  
  // Award points for length (up to 25 points)
  score += Math.min(25, Math.floor(password.length * 2.5));
  
  // Award points for character types (up to 25 points each)
  if (/[A-Z]/.test(password)) score += 25;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  
  // Cap at 100
  score = Math.min(100, score);
  
  // Determine label based on score
  let label = 'Very Weak';
  if (score >= 25) label = 'Weak';
  if (score >= 50) label = 'Medium';
  if (score >= 75) label = 'Strong';
  if (score >= 90) label = 'Very Strong';
  
  return { score, label };
}

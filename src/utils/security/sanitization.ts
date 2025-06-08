
/**
 * Input Sanitization Utilities (Enhanced)
 * Provides functions to sanitize and validate user inputs
 */

// Re-export validation utilities for backward compatibility
export * from '@/data/validation/sanitization';

// Legacy compatibility wrapper
export const validatePassword = (password: string): boolean => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
  return strongPasswordRegex.test(password);
};

// Additional sanitization function for backward compatibility
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') {
    return '';
  }
  
  return text
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000); // Max length limit
};


/**
 * Input Sanitization Utilities
 * Provides functions to sanitize and validate user inputs
 */
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
};

/**
 * Sanitizes plain text input (removes HTML tags completely)
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

/**
 * Sanitizes email addresses
 */
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Validates email format (returns boolean)
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitizeEmail(email));
};

/**
 * Sanitizes URL inputs
 */
export const sanitizeUrl = (url: string): string => {
  // First sanitize with DOMPurify
  const sanitized = DOMPurify.sanitize(url);
  
  // Then ensure it's a safe protocol
  try {
    const urlObj = new URL(sanitized);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return '';
    }
    return sanitized;
  } catch (e) {
    // If not a valid URL, return empty string
    return '';
  }
};

/**
 * Encode special characters to prevent injection attacks
 */
export const encodeHtmlEntities = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, containing uppercase, lowercase, number, and special char
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
  return strongPasswordRegex.test(password);
};

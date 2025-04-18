
/**
 * CSRF Protection Utilities
 * Implements functionality to prevent Cross-Site Request Forgery attacks
 */

// Generate a random CSRF token
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Store CSRF token in localStorage (in production, use httpOnly cookies)
export const storeCsrfToken = (token: string): void => {
  localStorage.setItem('csrf_token', token);
};

// Get stored CSRF token
export const getCsrfToken = (): string => {
  return localStorage.getItem('csrf_token') || '';
};

// Validate CSRF token
export const validateCsrfToken = (token: string): boolean => {
  const storedToken = getCsrfToken();
  return storedToken !== '' && storedToken === token;
};

// Include CSRF token in headers for fetch/axios requests
export const getCsrfHeader = (): { 'X-CSRF-Token': string } => {
  return { 'X-CSRF-Token': getCsrfToken() };
};

// Refresh CSRF token (called after authentication or periodically)
export const refreshCsrfToken = (): string => {
  const newToken = generateCsrfToken();
  storeCsrfToken(newToken);
  return newToken;
};

// Initialize CSRF protection
export const initCsrfProtection = (): void => {
  if (!getCsrfToken()) {
    refreshCsrfToken();
  }
};

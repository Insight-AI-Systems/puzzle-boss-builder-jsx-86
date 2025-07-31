
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

// Store CSRF token securely (improved security)
export const storeCsrfToken = (token: string): void => {
  // For improved security, we should use httpOnly cookies in production
  // For now, storing in sessionStorage which is more secure than localStorage
  sessionStorage.setItem('csrf_token', token);
  
  // Set expiration for token rotation
  const expiry = Date.now() + (15 * 60 * 1000); // 15 minutes
  sessionStorage.setItem('csrf_token_expiry', expiry.toString());
};

// Get stored CSRF token with expiry check
export const getCsrfToken = (): string => {
  const token = sessionStorage.getItem('csrf_token') || '';
  const expiry = sessionStorage.getItem('csrf_token_expiry');
  
  // Check if token is expired
  if (expiry && Date.now() > parseInt(expiry)) {
    // Token expired, generate new one
    return refreshCsrfToken();
  }
  
  return token;
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

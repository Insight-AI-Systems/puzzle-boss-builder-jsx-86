
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced CSRF Protection with Secure HTTP-only cookies
 * Implements functionality to prevent Cross-Site Request Forgery attacks
 */

// Generate a random CSRF token
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Set CSRF token as an HTTP-only cookie (API implementation)
export const storeCsrfToken = async (token: string): Promise<void> => {
  try {
    // Store the token using a Supabase edge function that sets secure HTTP-only cookies
    await supabase.functions.invoke('security-cookies', {
      body: { action: 'setCsrfCookie', token }
    });
  } catch (error) {
    console.error('Error storing CSRF token:', error);
    // Fallback to localStorage only if cookie setting fails
    localStorage.setItem('csrf_token_fallback', token);
  }
};

// Get CSRF token (from client-readable duplicate)
export const getCsrfToken = (): string => {
  // Get the paired visible cookie (the HTTP-only one is not accessible via JS)
  const visibleToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token_visible='))
    ?.split('=')[1];
    
  if (visibleToken) {
    return visibleToken;
  }
  
  // Fallback to localStorage in case cookie method failed
  return localStorage.getItem('csrf_token_fallback') || '';
};

// Validate CSRF token via API call (proper server-side validation)
export const validateCsrfToken = async (token: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('security-cookies', {
      body: { action: 'validateCsrfToken', token }
    });
    
    if (error) {
      console.error('Error validating CSRF token:', error);
      return false;
    }
    
    return data.valid;
  } catch (error) {
    console.error('Exception validating CSRF token:', error);
    return false;
  }
};

// Include CSRF token in headers for fetch/axios requests
export const getCsrfHeader = (): { 'X-CSRF-Token': string } => {
  return { 'X-CSRF-Token': getCsrfToken() };
};

// Refresh CSRF token (called after authentication or periodically)
export const refreshCsrfToken = async (): Promise<string> => {
  const newToken = generateCsrfToken();
  await storeCsrfToken(newToken);
  return newToken;
};

// Initialize CSRF protection
export const initCsrfProtection = async (): Promise<void> => {
  const token = getCsrfToken();
  if (!token) {
    await refreshCsrfToken();
  }
};

// Rotate CSRF token after security-sensitive actions
export const rotateCsrfToken = async (): Promise<string> => {
  return await refreshCsrfToken();
};

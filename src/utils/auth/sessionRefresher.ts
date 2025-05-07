
import { supabase } from '@/integrations/supabase/client';

// Default values
const MIN_VALIDITY_PERIOD = 5 * 60 * 1000; // 5 minutes in milliseconds
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// Token refresh state
let refreshPromise: Promise<any> | null = null;
let refreshTimer: ReturnType<typeof setInterval> | null = null; // Fix: Using correct type
let isRefreshing = false;
let retryCount = 0;

/**
 * Check if the current session token is expiring soon
 */
async function isSessionExpiringSoon(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return false;
  
  const expiresAt = data.session.expires_at;
  if (!expiresAt) return true; // Refresh if expiry unknown
  
  const expiryTime = new Date(expiresAt).getTime();
  const now = Date.now();
  
  return expiryTime - now < MIN_VALIDITY_PERIOD;
}

/**
 * Refresh the authentication token
 */
export async function refreshSessionToken(): Promise<void> {
  // Prevent concurrent refresh attempts
  if (isRefreshing) {
    return refreshPromise as Promise<void>;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const isExpiring = await isSessionExpiringSoon();
      
      if (!isExpiring) {
        console.log('Session token is still valid, skipping refresh');
        return;
      }

      console.log('Refreshing authentication token...');
      
      // Get current session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.log('No active session to refresh');
        return;
      }

      // Use the auth-manager edge function to refresh the token
      const { data, error } = await supabase.functions.invoke('auth-manager', {
        body: {
          action: 'refresh',
          token: sessionData.session.access_token
        }
      });

      if (error) {
        throw error;
      }

      // Log successful refresh
      console.log('Authentication token refreshed successfully', { 
        expires_at: data.session.expires_at 
      });
      
      // Reset retry counter on success
      retryCount = 0;
    } catch (error) {
      console.error('Failed to refresh authentication token:', error);
      
      // Implement retry with exponential backoff
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const delay = RETRY_DELAY * Math.pow(2, retryCount - 1);
        console.log(`Retrying token refresh in ${delay / 1000} seconds (attempt ${retryCount}/${MAX_RETRIES})...`);
        setTimeout(refreshSessionToken, delay);
      } else {
        console.error(`Failed to refresh token after ${MAX_RETRIES} attempts`);
        // Consider logging the user out or showing a persistent notification
      }
    } finally {
      isRefreshing = false;
    }
  })();

  return refreshPromise;
}

/**
 * Start automatic session refreshing
 */
export function startSessionRefresher(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  // Do an immediate check
  refreshSessionToken();
  
  // Set up periodic refresh
  refreshTimer = setInterval(() => {
    refreshSessionToken();
  }, REFRESH_INTERVAL);
  
  console.log('Session refresher started');
}

/**
 * Stop automatic session refreshing
 */
export function stopSessionRefresher(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
    console.log('Session refresher stopped');
  }
}

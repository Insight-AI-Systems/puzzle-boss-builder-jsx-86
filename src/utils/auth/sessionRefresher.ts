import { supabase } from '@/integrations/supabase/client';

// Configuration constants
const SESSION_CONFIG = {
  MIN_VALIDITY_PERIOD: 5 * 60 * 1000, // 5 minutes in milliseconds
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes in milliseconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 seconds
  SESSION_CACHE_KEY: 'puzzleBoss_sessionExpiry'
};

// Token refresh state
let refreshPromise: Promise<any> | null = null;
let refreshTimer: ReturnType<typeof setInterval> | null = null;
let isRefreshing = false;
let retryCount = 0;

/**
 * Checks if the current session is cached and still valid
 * This reduces the need for frequent server calls to check expiry
 */
function getSessionExpiryFromCache(): { isExpiring: boolean; expiresAt: number | null } {
  try {
    const cached = localStorage.getItem(SESSION_CONFIG.SESSION_CACHE_KEY);
    if (cached) {
      const { expiresAt } = JSON.parse(cached);
      const now = Date.now();
      // Return whether the token is expiring soon based on cached data
      return {
        isExpiring: expiresAt - now < SESSION_CONFIG.MIN_VALIDITY_PERIOD,
        expiresAt
      };
    }
  } catch (error) {
    console.warn('Error reading session cache:', error);
  }
  
  return { isExpiring: true, expiresAt: null };
}

/**
 * Updates the session expiry cache
 */
function updateSessionExpiryCache(expiresAt: number): void {
  try {
    localStorage.setItem(SESSION_CONFIG.SESSION_CACHE_KEY, JSON.stringify({
      expiresAt,
      updatedAt: Date.now()
    }));
  } catch (error) {
    console.warn('Error updating session cache:', error);
  }
}

/**
 * Check if the current session token is expiring soon
 * Now with caching to reduce API calls
 */
async function isSessionExpiringSoon(): Promise<boolean> {
  // Check cache first
  const { isExpiring, expiresAt } = getSessionExpiryFromCache();
  
  // If we have a cached value that's still valid, use it
  if (expiresAt !== null && !isExpiring) {
    return false;
  }
  
  // Otherwise, check with the server
  const { data } = await supabase.auth.getSession();
  if (!data.session) return false;
  
  const serverExpiresAt = data.session.expires_at;
  if (!serverExpiresAt) return true; // Refresh if expiry unknown
  
  const expiryTime = new Date(serverExpiresAt).getTime();
  const now = Date.now();
  
  // Update cache with new expiry data
  updateSessionExpiryCache(expiryTime);
  
  return expiryTime - now < SESSION_CONFIG.MIN_VALIDITY_PERIOD;
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
      
      // Update cache with new expiry
      if (data.session.expires_at) {
        updateSessionExpiryCache(new Date(data.session.expires_at).getTime());
      }
      
      // Reset retry counter on success
      retryCount = 0;
    } catch (error) {
      console.error('Failed to refresh authentication token:', error);
      
      // Implement retry with exponential backoff
      if (retryCount < SESSION_CONFIG.MAX_RETRIES) {
        retryCount++;
        const delay = SESSION_CONFIG.RETRY_DELAY * Math.pow(2, retryCount - 1);
        console.log(`Retrying token refresh in ${delay / 1000} seconds (attempt ${retryCount}/${SESSION_CONFIG.MAX_RETRIES})...`);
        setTimeout(refreshSessionToken, delay);
      } else {
        console.error(`Failed to refresh token after ${SESSION_CONFIG.MAX_RETRIES} attempts`);
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
  }, SESSION_CONFIG.REFRESH_INTERVAL);
  
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

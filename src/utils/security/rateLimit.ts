
/**
 * Rate Limiting Utilities
 * Implements client-side rate limiting to prevent brute force attacks
 */

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blocked: boolean;
  blockedUntil?: number;
}

const RATE_LIMIT_STORE_KEY = 'auth_rate_limits';

// Key-based rate limiting (e.g., by action type)
const getRateLimitKey = (action: string, identifier: string = ''): string => {
  return `${action}:${identifier}`;
};

// Get current rate limit record
export const getRateLimitRecord = (action: string, identifier: string = ''): RateLimitRecord => {
  try {
    const key = getRateLimitKey(action, identifier);
    const allLimits = JSON.parse(localStorage.getItem(RATE_LIMIT_STORE_KEY) || '{}');
    
    return allLimits[key] || {
      count: 0,
      firstAttempt: Date.now(),
      lastAttempt: Date.now(),
      blocked: false
    };
  } catch (error) {
    console.error('Error retrieving rate limit record:', error);
    return {
      count: 0,
      firstAttempt: Date.now(),
      lastAttempt: Date.now(),
      blocked: false
    };
  }
};

// Update rate limit after an attempt
export const recordRateLimitAttempt = (
  action: string, 
  identifier: string = '', 
  maxAttempts: number = 5,
  timeWindowMs: number = 60000, // 1 minute
  blockDurationMs: number = 300000 // 5 minutes
): RateLimitRecord => {
  const now = Date.now();
  const key = getRateLimitKey(action, identifier);
  
  try {
    // Get all limits
    const allLimits = JSON.parse(localStorage.getItem(RATE_LIMIT_STORE_KEY) || '{}');
    
    // Get or create record for this action
    let record = allLimits[key] || {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false
    };
    
    // Check if record should be reset (time window has passed)
    if (!record.blocked && (now - record.firstAttempt) > timeWindowMs) {
      record = {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false
      };
    } 
    // Check if still in block period
    else if (record.blocked && record.blockedUntil && now < record.blockedUntil) {
      // Still blocked
      record.lastAttempt = now;
    } 
    // Check if block period is over
    else if (record.blocked && record.blockedUntil && now >= record.blockedUntil) {
      // Block period is over, reset
      record = {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false
      };
    }
    // Normal increment within time window
    else {
      record.count += 1;
      record.lastAttempt = now;
      
      // Check if should be blocked
      if (record.count > maxAttempts) {
        record.blocked = true;
        record.blockedUntil = now + blockDurationMs;
      }
    }
    
    // Save updated record
    allLimits[key] = record;
    localStorage.setItem(RATE_LIMIT_STORE_KEY, JSON.stringify(allLimits));
    
    return record;
  } catch (error) {
    console.error('Error updating rate limit record:', error);
    return {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false
    };
  }
};

// Check if an action is rate limited
export const isRateLimited = (action: string, identifier: string = ''): boolean => {
  const record = getRateLimitRecord(action, identifier);
  
  // Check if currently blocked
  if (record.blocked) {
    // If block has an expiration, check if it's still valid
    if (record.blockedUntil) {
      return Date.now() < record.blockedUntil;
    }
    return true;
  }
  
  return false;
};

// Clear rate limit for an action
export const clearRateLimit = (action: string, identifier: string = ''): void => {
  try {
    const key = getRateLimitKey(action, identifier);
    const allLimits = JSON.parse(localStorage.getItem(RATE_LIMIT_STORE_KEY) || '{}');
    
    if (allLimits[key]) {
      delete allLimits[key];
      localStorage.setItem(RATE_LIMIT_STORE_KEY, JSON.stringify(allLimits));
    }
  } catch (error) {
    console.error('Error clearing rate limit:', error);
  }
};


import { supabase } from '@/integrations/supabase/client';

/**
 * Security event types enum
 * This standardized list ensures consistent event tracking across the application
 */
export enum SecurityEventType {
  // Authentication events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE = 'SIGNUP_FAILURE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
  PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE',
  LOGOUT = 'LOGOUT',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Account/permission events
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // Security-related events
  CSRF_VALIDATION_FAILURE = 'CSRF_VALIDATION_FAILURE',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  CONFIG_CHANGE = 'CONFIG_CHANGE',
  
  // Admin actions
  ADMIN_ACTION = 'ADMIN_ACTION',
  
  // Access control events
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  ACCESS_DENIED = 'ACCESS_DENIED'
}

export type SecurityEventSeverity = 'info' | 'warning' | 'error' | 'critical';

interface SecurityLogEvent {
  eventType: SecurityEventType;
  userId?: string;
  email?: string; // Stored with partial masking for privacy
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity: SecurityEventSeverity;
}

// Local caching configuration
const SECURITY_CONFIG = {
  MAX_LOCAL_EVENTS: 100,
  BATCH_SIZE: 10,
  LOCAL_STORAGE_KEYS: {
    EVENTS: 'securityEvents',
    QUEUE: 'securityEventQueue'
  }
};

/**
 * Mask sensitive information like email addresses
 * @param email The email address to mask
 * @returns A masked email address (e.g., "joh***@example.com")
 */
const maskEmail = (email: string): string => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!username || !domain) return '';
  
  const maskedUsername = username.length <= 3 
    ? username.charAt(0) + '***' 
    : username.substring(0, 3) + '***';
  
  return `${maskedUsername}@${domain}`;
};

/**
 * Logs a security event to both local storage and the database
 * Implements batching and caching to improve performance
 * @param event The security event to log
 */
export const logSecurityEvent = async (event: Omit<SecurityLogEvent, 'timestamp'>): Promise<void> => {
  const timestamp = new Date().toISOString();
  const maskedEmail = event.email ? maskEmail(event.email) : undefined;
  
  // Prepare the local event with masked info for privacy
  const localEvent = {
    ...event,
    timestamp,
    email: maskedEmail // Use masked email for local storage
  };
  
  // In development, log to console with style based on severity
  if (process.env.NODE_ENV === 'development') {
    const logStyle = getLogStyle(event.severity);
    console[logStyle]('SECURITY EVENT:', localEvent);
  }
  
  // Store event in the database (ensure this is async to not block UI)
  try {
    // Use the log_security_event RPC function
    await supabase.functions.invoke('security-events', {
      body: {
        action: 'log',
        event_type: event.eventType,
        user_id: event.userId || null,
        email: event.email || null,
        severity: event.severity,
        ip_address: event.ipAddress || null,
        user_agent: event.userAgent || null,
        event_details: event.details || {}
      }
    });
  } catch (dbError) {
    console.error('Failed to store security event in database:', dbError);
    // Attempt to queue the event for retry when online
    queueEventForRetry(event);
  }
  
  // Always store locally as well (for development and as backup)
  storeSecurityEventLocally(localEvent);
};

/**
 * Queue events for retry when connection is restored
 * Implements batching for better network performance
 * @param event The event to queue
 */
const queueEventForRetry = (event: any): void => {
  try {
    const queue = JSON.parse(localStorage.getItem(SECURITY_CONFIG.LOCAL_STORAGE_KEYS.QUEUE) || '[]');
    queue.push({
      ...event,
      queuedAt: new Date().toISOString()
    });
    localStorage.setItem(SECURITY_CONFIG.LOCAL_STORAGE_KEYS.QUEUE, JSON.stringify(queue));
  } catch (error) {
    console.error('Error queueing security event:', error);
  }
};

/**
 * Process queued events when online
 * Uses batching for better performance
 */
export const processQueuedSecurityEvents = async (): Promise<void> => {
  try {
    const queueString = localStorage.getItem(SECURITY_CONFIG.LOCAL_STORAGE_KEYS.QUEUE);
    if (!queueString) return;
    
    const queue = JSON.parse(queueString);
    if (!Array.isArray(queue) || queue.length === 0) return;
    
    // Process in optimized batches
    const batchSize = SECURITY_CONFIG.BATCH_SIZE;
    let successfulBatches = 0;
    
    for (let i = 0; i < queue.length; i += batchSize) {
      const batch = queue.slice(i, i + batchSize);
      
      try {
        // Process batch using the edge function
        for (const event of batch) {
          await supabase.functions.invoke('security-events', {
            body: {
              action: 'log',
              event_type: event.eventType,
              user_id: event.userId || null,
              email: event.email || null,
              severity: event.severity,
              ip_address: event.ipAddress || null,
              user_agent: event.userAgent || null,
              event_details: event.details || {}
            }
          });
        }
        
        // Mark this batch as processed
        successfulBatches++;
      } catch (error) {
        console.error('Error processing queued security events:', error);
        break; // Stop processing on error to retry later
      }
    }
    
    // If we processed some batches successfully, update the queue
    if (successfulBatches > 0) {
      const remainingEvents = queue.slice(successfulBatches * batchSize);
      if (remainingEvents.length > 0) {
        localStorage.setItem(SECURITY_CONFIG.LOCAL_STORAGE_KEYS.QUEUE, JSON.stringify(remainingEvents));
      } else {
        localStorage.removeItem(SECURITY_CONFIG.LOCAL_STORAGE_KEYS.QUEUE);
      }
    }
  } catch (error) {
    console.error('Error processing security event queue:', error);
  }
};

/**
 * Helper to determine console log method based on severity
 */
const getLogStyle = (severity: string): 'log' | 'info' | 'warn' | 'error' => {
  switch (severity) {
    case 'info': return 'info';
    case 'warning': return 'warn';
    case 'error': 
    case 'critical': 
      return 'error';
    default: return 'log';
  }
};

/**
 * Store security events in local storage with LRU cache behavior
 * @param event The event to store locally
 */
const storeSecurityEventLocally = (event: any): void => {
  try {
    const existingEvents = JSON.parse(localStorage.getItem(SECURITY_CONFIG.LOCAL_STORAGE_KEYS.EVENTS) || '[]');
    const updatedEvents = [event, ...existingEvents].slice(0, SECURITY_CONFIG.MAX_LOCAL_EVENTS); // Keep last X events (LRU cache)
    localStorage.setItem(SECURITY_CONFIG.LOCAL_STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));
  } catch (error) {
    console.error('Error storing security event:', error);
  }
};

/**
 * Get security events from local storage (for development/debugging)
 * @returns Array of locally stored security events
 */
export const getSecurityEvents = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem(SECURITY_CONFIG.LOCAL_STORAGE_KEYS.EVENTS) || '[]');
  } catch (error) {
    console.error('Error retrieving security events:', error);
    return [];
  }
};

/**
 * Clear security events from local storage
 */
export const clearSecurityEvents = (): void => {
  localStorage.removeItem(SECURITY_CONFIG.LOCAL_STORAGE_KEYS.EVENTS);
};

/**
 * Initialize event listeners for online/offline status
 * Will automatically process queued events when coming online
 */
export const initSecurityEventListeners = (): void => {
  window.addEventListener('online', async () => {
    await processQueuedSecurityEvents();
  });
  
  // Check network status on init to process any queued events
  if (navigator.onLine) {
    processQueuedSecurityEvents().catch(err => 
      console.error('Failed to process queued events on init:', err)
    );
  }
};

/**
 * Security tests helper - used by the test framework
 * @internal For testing purposes only
 */
export const _securityTestHelpers = {
  maskEmail,
  getLogStyle
};

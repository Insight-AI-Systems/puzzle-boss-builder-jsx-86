import { supabase } from '@/integrations/supabase/client';

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
  
  // Access control events - Adding these to fix the error
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

// Mask sensitive information like email addresses
const maskEmail = (email: string): string => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!username || !domain) return '';
  
  const maskedUsername = username.length <= 3 
    ? username.charAt(0) + '***' 
    : username.substring(0, 3) + '***';
  
  return `${maskedUsername}@${domain}`;
};

// Log security event to both local storage and the database
export const logSecurityEvent = async (event: Omit<SecurityLogEvent, 'timestamp'>): Promise<void> => {
  const timestamp = new Date().toISOString();
  const maskedEmail = event.email ? maskEmail(event.email) : undefined;
  
  // Prepare the local event with masked info for privacy
  const localEvent = {
    ...event,
    timestamp,
    email: maskedEmail // Use masked email for local storage
  };
  
  // In development, log to console
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

// Queue events for retry when connection is restored
const queueEventForRetry = (event: any): void => {
  try {
    const queue = JSON.parse(localStorage.getItem('securityEventQueue') || '[]');
    queue.push(event);
    localStorage.setItem('securityEventQueue', JSON.stringify(queue));
  } catch (error) {
    console.error('Error queueing security event:', error);
  }
};

// Process queued events when online
export const processQueuedSecurityEvents = async (): Promise<void> => {
  try {
    const queueString = localStorage.getItem('securityEventQueue');
    if (!queueString) return;
    
    const queue = JSON.parse(queueString);
    if (!Array.isArray(queue) || queue.length === 0) return;
    
    // Process in batches of 10
    const batchSize = 10;
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
      } catch (error) {
        console.error('Error processing queued security events:', error);
        return; // Stop processing on error to retry later
      }
    }
    
    // Clear the queue after successful processing
    localStorage.removeItem('securityEventQueue');
  } catch (error) {
    console.error('Error processing security event queue:', error);
  }
};

// Helper to determine console log method based on severity
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

// Store security events in local storage (for development/debugging)
const storeSecurityEventLocally = (event: any): void => {
  try {
    const existingEvents = JSON.parse(localStorage.getItem('securityEvents') || '[]');
    const updatedEvents = [event, ...existingEvents].slice(0, 100); // Keep last 100 events
    localStorage.setItem('securityEvents', JSON.stringify(updatedEvents));
  } catch (error) {
    console.error('Error storing security event:', error);
  }
};

// Get security events from local storage (for development/debugging)
export const getSecurityEvents = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('securityEvents') || '[]');
  } catch (error) {
    console.error('Error retrieving security events:', error);
    return [];
  }
};

// Clear security events from local storage
export const clearSecurityEvents = (): void => {
  localStorage.removeItem('securityEvents');
};

// Initialize event listeners for online/offline status
export const initSecurityEventListeners = (): void => {
  window.addEventListener('online', async () => {
    await processQueuedSecurityEvents();
  });
};

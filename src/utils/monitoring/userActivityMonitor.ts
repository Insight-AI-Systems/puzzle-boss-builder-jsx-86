
import { debugLog, DebugLevel } from '@/utils/debug';
import { supabase } from '@/integrations/supabase/client';

// Time in ms between activity flushes
const FLUSH_INTERVAL = 60 * 1000; // 1 minute

interface UserActivity {
  type: string;
  timestamp: number;
  metadata: Record<string, any>;
  userId?: string;
}

/**
 * User Activity Monitor
 * Tracks and records user activity throughout the application
 */
export class UserActivityMonitor {
  private static instance: UserActivityMonitor;
  
  private activities: UserActivity[] = [];
  private flushTimeout: NodeJS.Timeout | null = null;
  private initialized = false;
  private userId: string | null = null;
  private sessionId: string | null = null;
  private pageLoadTime: number = 0;
  private lastActiveTime: number = 0;
  private isActive = true;
  
  private constructor() {
    this.pageLoadTime = Date.now();
    this.lastActiveTime = this.pageLoadTime;
    
    // Will be called in initializeMonitor
    // this.setupEventListeners();
  }
  
  public static getInstance(): UserActivityMonitor {
    if (!UserActivityMonitor.instance) {
      UserActivityMonitor.instance = new UserActivityMonitor();
    }
    return UserActivityMonitor.instance;
  }
  
  /**
   * Initialize the monitor with user ID
   */
  public initializeMonitor(userId?: string): void {
    if (this.initialized) return;
    
    if (userId) {
      this.userId = userId;
    }
    
    // Generate session ID
    this.sessionId = this.generateSessionId();
    
    // Track initial page load
    this.trackActivity('page_load', {
      url: window.location.href,
      referrer: document.referrer || null,
    });
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start flush interval
    this.scheduleFlush();
    
    this.initialized = true;
    
    debugLog('UserActivityMonitor', 'Activity monitoring initialized', DebugLevel.INFO, {
      userId: this.userId,
      sessionId: this.sessionId,
    });
  }
  
  /**
   * Track user activity
   */
  public trackActivity(type: string, metadata: Record<string, any> = {}): void {
    try {
      const activity: UserActivity = {
        type,
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          url: window.location.href,
          sessionId: this.sessionId,
        },
      };
      
      if (this.userId) {
        activity.userId = this.userId;
      }
      
      this.activities.push(activity);
      this.lastActiveTime = Date.now();
      
      debugLog('UserActivityMonitor', `Activity tracked: ${type}`, DebugLevel.DEBUG);
      
      // Schedule flush if not already scheduled
      if (!this.flushTimeout) {
        this.scheduleFlush();
      }
    } catch (error) {
      debugLog('UserActivityMonitor', 'Error tracking activity', DebugLevel.ERROR, { error });
    }
  }
  
  /**
   * Setup DOM event listeners
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;
    
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.isActive = true;
        this.trackActivity('visibility_change', { visible: true });
      } else {
        this.isActive = false;
        this.trackActivity('visibility_change', { visible: false });
      }
    });
    
    // Page navigation
    window.addEventListener('beforeunload', () => {
      this.trackActivity('page_unload', {
        timeOnPage: Date.now() - this.pageLoadTime,
      });
      
      // Force immediate flush on page unload
      this.flushActivities(true);
    });
    
    // Navigation changes (for SPAs)
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      const result = originalPushState.apply(this, args);
      
      // Dispatch custom event
      const event = new Event('pushstate');
      window.dispatchEvent(event);
      
      return result;
    };
    
    window.addEventListener('pushstate', () => {
      this.trackActivity('navigation', {
        url: window.location.href,
      });
    });
    
    window.addEventListener('popstate', () => {
      this.trackActivity('navigation', {
        url: window.location.href,
      });
    });
    
    // User interactions (clicks)
    document.addEventListener('click', (event) => {
      // Get element details
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const classes = target.className;
      const id = target.id;
      
      // Don't track every click, just important ones
      if (tagName === 'button' || tagName === 'a' || id || (classes && classes.length > 0)) {
        this.trackActivity('click', {
          tagName,
          id: id || undefined,
          className: classes || undefined,
          text: target.textContent?.trim().substring(0, 50) || undefined,
          href: tagName === 'a' ? (target as HTMLAnchorElement).href : undefined,
        });
      }
    });
  }
  
  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    try {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    } catch (error) {
      debugLog('UserActivityMonitor', 'Error generating session ID', DebugLevel.ERROR, { error });
      return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
  }
  
  /**
   * Schedule a flush of activities
   */
  private scheduleFlush(): void {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }
    
    this.flushTimeout = setTimeout(() => {
      this.flushActivities();
      this.flushTimeout = null;
      
      // If still active, schedule next flush
      if (this.isActive) {
        this.scheduleFlush();
      }
    }, FLUSH_INTERVAL);
  }
  
  /**
   * Flush activities to server
   */
  private async flushActivities(immediate = false): Promise<void> {
    if (!this.activities.length) return;
    
    const activitiesToSend = [...this.activities];
    this.activities = [];
    
    try {
      debugLog('UserActivityMonitor', `Flushing ${activitiesToSend.length} activities`, DebugLevel.DEBUG);
      
      if (immediate && navigator.sendBeacon) {
        // Use beacon API for unload events
        const endpoint = '/api/analytics/activities';
        const blob = new Blob([JSON.stringify({ activities: activitiesToSend })], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
      } else {
        // Use supabase function for normal flushes
        await supabase.functions.invoke('track-user-activities', {
          body: {
            activities: activitiesToSend,
            sessionId: this.sessionId,
          }
        });
      }
    } catch (error) {
      // Put activities back in queue on error
      this.activities = [...activitiesToSend, ...this.activities];
      
      debugLog('UserActivityMonitor', 'Error flushing activities', DebugLevel.ERROR, { error });
      
      // Limit queue size to prevent memory issues
      if (this.activities.length > 1000) {
        this.activities = this.activities.slice(-1000);
      }
    }
  }
  
  /**
   * Update user ID (e.g. after login)
   */
  public updateUserId(userId: string): void {
    this.userId = userId;
    
    this.trackActivity('user_identified', {
      previousId: this.userId || null,
      newId: userId,
    });
    
    debugLog('UserActivityMonitor', 'User ID updated', DebugLevel.INFO, {
      userId,
      sessionId: this.sessionId,
    });
  }
  
  /**
   * Calculate user session time
   */
  public getSessionDuration(): number {
    return Date.now() - this.pageLoadTime;
  }
  
  /**
   * Get time since last activity
   */
  public getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActiveTime;
  }
  
  /**
   * Force flush activities
   */
  public forceFlush(): Promise<void> {
    return this.flushActivities();
  }
}

export const userActivityMonitor = UserActivityMonitor.getInstance();

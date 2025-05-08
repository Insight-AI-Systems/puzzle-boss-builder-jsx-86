
/**
 * User activity monitoring system for tracking user behavior
 */

interface UserActivity {
  action: string;
  route: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
  userId?: string;
}

interface UserActivityConfig {
  trackRouteChanges: boolean;
  trackClicks: boolean;
  trackForms: boolean;
  trackSession: boolean;
  sampleRate: number;
  enableConsoleLogging: boolean;
  maxActivities: number;
}

class UserActivityMonitor {
  private static instance: UserActivityMonitor;
  private activities: UserActivity[] = [];
  private config: UserActivityConfig = {
    trackRouteChanges: true,
    trackClicks: true,
    trackForms: true,
    trackSession: true,
    sampleRate: 0.25, // Only record 25% of activities by default
    enableConsoleLogging: process.env.NODE_ENV === 'development',
    maxActivities: 500
  };
  
  private sessionStart: number = Date.now();
  private lastActivityTime: number = Date.now();
  private currentRoute: string = '';
  private routeStartTime: number = Date.now();
  
  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupActivityListeners();
    }
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): UserActivityMonitor {
    if (!UserActivityMonitor.instance) {
      UserActivityMonitor.instance = new UserActivityMonitor();
    }
    return UserActivityMonitor.instance;
  }
  
  /**
   * Configure the activity monitor
   */
  public configure(config: Partial<UserActivityConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Track a specific user activity
   */
  public trackActivity(action: string, metadata?: Record<string, any>): void {
    if (Math.random() > this.config.sampleRate) {
      return; // Skip based on sample rate
    }
    
    const activity: UserActivity = {
      action,
      route: this.currentRoute,
      timestamp: Date.now(),
      metadata
    };
    
    this.recordActivity(activity);
  }
  
  /**
   * Record an activity
   */
  private recordActivity(activity: UserActivity): void {
    this.activities.push(activity);
    this.lastActivityTime = Date.now();
    
    // Trim activities if we have too many
    if (this.activities.length > this.config.maxActivities) {
      this.activities = this.activities.slice(-this.config.maxActivities);
    }
    
    // Log to console if enabled
    if (this.config.enableConsoleLogging) {
      console.debug(`User Activity: ${activity.action}`, {
        route: activity.route,
        metadata: activity.metadata
      });
    }
  }
  
  /**
   * Set up activity listeners
   */
  private setupActivityListeners(): void {
    if (this.config.trackRouteChanges) {
      // Use history API to track route changes
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = (...args) => {
        this.handleRouteChange();
        return originalPushState.apply(history, args);
      };
      
      history.replaceState = (...args) => {
        this.handleRouteChange();
        return originalReplaceState.apply(history, args);
      };
      
      window.addEventListener('popstate', () => this.handleRouteChange());
      
      // Set initial route
      this.currentRoute = window.location.pathname;
      this.routeStartTime = Date.now();
    }
    
    if (this.config.trackClicks) {
      document.addEventListener('click', (event) => {
        if (!event.target) return;
        
        const element = event.target as HTMLElement;
        let trackingData: Record<string, any> = {};
        let actionName = 'click';
        
        // Check for data attributes
        if (element.dataset?.trackEvent) {
          actionName = element.dataset.trackEvent;
        }
        
        // Build tracking data from element
        if (element.tagName === 'BUTTON') {
          trackingData.elementType = 'button';
          trackingData.text = element.textContent?.trim();
        } else if (element.tagName === 'A') {
          trackingData.elementType = 'link';
          trackingData.href = (element as HTMLAnchorElement).href;
          trackingData.text = element.textContent?.trim();
        } else {
          trackingData.elementType = element.tagName.toLowerCase();
          trackingData.classes = element.className;
        }
        
        this.trackActivity(`${actionName}:${trackingData.elementType || 'element'}`, trackingData);
      });
    }
    
    if (this.config.trackForms) {
      document.addEventListener('submit', (event) => {
        if (!event.target) return;
        
        const form = event.target as HTMLFormElement;
        const formId = form.id || form.name || 'unknown';
        
        this.trackActivity(`form_submit:${formId}`, {
          formAction: form.action,
          formMethod: form.method
        });
      });
    }
    
    if (this.config.trackSession) {
      // Track session start
      this.trackActivity('session_start', {
        referrer: document.referrer,
        userAgent: navigator.userAgent
      });
      
      // Track session end on page unload
      window.addEventListener('beforeunload', () => {
        const sessionDuration = Date.now() - this.sessionStart;
        
        this.trackActivity('session_end', {
          sessionDuration,
          activitiesCount: this.activities.length
        });
      });
      
      // Track visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.trackActivity('page_hidden');
        } else if (document.visibilityState === 'visible') {
          this.trackActivity('page_visible');
        }
      });
    }
  }
  
  /**
   * Handle a route change
   */
  private handleRouteChange(): void {
    const newRoute = window.location.pathname;
    
    if (newRoute !== this.currentRoute) {
      const now = Date.now();
      const duration = now - this.routeStartTime;
      
      // Record the previous route duration
      this.trackActivity('route_exit', {
        from: this.currentRoute,
        to: newRoute,
        duration
      });
      
      // Update route tracking
      this.currentRoute = newRoute;
      this.routeStartTime = now;
      
      // Record the new route entry
      this.trackActivity('route_enter', {
        route: newRoute
      });
    }
  }
  
  /**
   * Get user session info
   */
  public getSessionInfo(): { 
    duration: number; 
    lastActivity: number;
    activityCount: number;
  } {
    return {
      duration: Date.now() - this.sessionStart,
      lastActivity: Date.now() - this.lastActivityTime,
      activityCount: this.activities.length
    };
  }
  
  /**
   * Get all recorded activities
   */
  public getActivities(): UserActivity[] {
    return [...this.activities];
  }
  
  /**
   * Get activities by type
   */
  public getActivitiesByType(actionType: string): UserActivity[] {
    return this.activities.filter(activity => 
      activity.action === actionType || activity.action.startsWith(`${actionType}:`)
    );
  }
  
  /**
   * Get activities for a specific route
   */
  public getActivitiesByRoute(route: string): UserActivity[] {
    return this.activities.filter(activity => activity.route === route);
  }
  
  /**
   * Clear all activities
   */
  public clearActivities(): void {
    this.activities = [];
  }
  
  /**
   * Export activities to JSON
   */
  public exportToJson(): string {
    return JSON.stringify({
      activities: this.activities,
      sessionInfo: this.getSessionInfo(),
      timestamp: new Date().toISOString()
    }, null, 2);
  }
}

export const userActivityMonitor = UserActivityMonitor.getInstance();

/**
 * React hook for tracking component-level user activity
 */
export function useActivityTracking(componentName: string) {
  const monitor = UserActivityMonitor.getInstance();
  
  React.useEffect(() => {
    monitor.trackActivity(`component_mount:${componentName}`);
    
    return () => {
      monitor.trackActivity(`component_unmount:${componentName}`);
    };
  }, [componentName]);
  
  const trackComponentActivity = React.useCallback((action: string, metadata?: Record<string, any>) => {
    monitor.trackActivity(`${componentName}:${action}`, metadata);
  }, [componentName]);
  
  return { trackComponentActivity };
}

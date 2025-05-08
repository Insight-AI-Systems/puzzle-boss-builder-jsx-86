
import React from 'react';
import { monitoringService } from './monitoringService';
import { EventType } from '@/types/monitoringTypes';
import { debugLog, DebugLevel } from '@/utils/debug';

// Types for user activity events
export interface UserActivityEvent {
  type: string;
  timestamp: number;
  data?: any;
}

export interface UserActivityConfig {
  trackClicks: boolean;
  trackNavigation: boolean;
  trackErrors: boolean;
  trackFormSubmissions: boolean;
  sampleRate: number; // 0-1, percentage of events to track
}

/**
 * Monitor and track user activity in the application
 */
export class UserActivityMonitor {
  private static instance: UserActivityMonitor | null = null;
  private events: UserActivityEvent[] = [];
  private isTracking = false;
  
  private config: UserActivityConfig = {
    trackClicks: true,
    trackNavigation: true,
    trackErrors: true,
    trackFormSubmissions: true,
    sampleRate: 1.0 // Track all events by default
  };
  
  // Private constructor for singleton
  private constructor() {
    debugLog('UserActivityMonitor', 'Initialized', DebugLevel.INFO);
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
    this.config = {
      ...this.config,
      ...config
    };
    
    debugLog('UserActivityMonitor', 'Configuration updated', DebugLevel.INFO, this.config);
  }
  
  /**
   * Start monitoring user activity
   */
  public startTracking(): void {
    if (this.isTracking) {
      return;
    }
    
    this.isTracking = true;
    
    if (this.config.trackClicks) {
      this.setupClickTracking();
    }
    
    if (this.config.trackNavigation) {
      this.setupNavigationTracking();
    }
    
    if (this.config.trackErrors) {
      this.setupErrorTracking();
    }
    
    if (this.config.trackFormSubmissions) {
      this.setupFormTracking();
    }
    
    debugLog('UserActivityMonitor', 'Tracking started', DebugLevel.INFO);
  }
  
  /**
   * Stop monitoring user activity
   */
  public stopTracking(): void {
    if (!this.isTracking) {
      return;
    }
    
    // Remove all event listeners
    document.removeEventListener('click', this.handleClick);
    window.removeEventListener('popstate', this.handleNavigation);
    window.removeEventListener('error', this.handleError);
    document.removeEventListener('submit', this.handleFormSubmit);
    
    this.isTracking = false;
    debugLog('UserActivityMonitor', 'Tracking stopped', DebugLevel.INFO);
  }
  
  /**
   * Record an activity event
   */
  public recordActivity(type: string, data?: any): void {
    // Check if this event should be sampled based on sample rate
    if (Math.random() > this.config.sampleRate) {
      return;
    }
    
    const event: UserActivityEvent = {
      type,
      timestamp: Date.now(),
      data
    };
    
    this.events.push(event);
    
    // Also record in the monitoring service
    monitoringService.recordEvent(EventType.USER_ACTIVITY, event);
    
    debugLog('UserActivityMonitor', `Activity recorded: ${type}`, DebugLevel.DEBUG, data);
  }
  
  /**
   * Get all recorded events
   */
  public getEvents(): UserActivityEvent[] {
    return [...this.events];
  }
  
  /**
   * Clear all recorded events
   */
  public clearEvents(): void {
    this.events = [];
    debugLog('UserActivityMonitor', 'Events cleared', DebugLevel.INFO);
  }
  
  // Setup click tracking
  private setupClickTracking(): void {
    document.addEventListener('click', this.handleClick);
  }
  
  // Handle click events
  private handleClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    
    // Gather relevant info about the clicked element
    const elementInfo = {
      tagName: target.tagName,
      id: target.id,
      className: target.className,
      text: target.textContent?.slice(0, 50) // Limit text length
    };
    
    this.recordActivity('click', elementInfo);
  };
  
  // Setup navigation tracking
  private setupNavigationTracking(): void {
    // Track initial page load
    this.recordActivity('pageview', {
      url: window.location.href,
      referrer: document.referrer
    });
    
    // Track navigation changes
    window.addEventListener('popstate', this.handleNavigation);
    
    // Monkey patch history methods to track programmatic navigation
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleNavigation();
    };
    
    const originalReplaceState = history.replaceState;
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleNavigation();
    };
  }
  
  // Handle navigation events
  private handleNavigation = (): void => {
    this.recordActivity('pageview', {
      url: window.location.href
    });
  };
  
  // Setup error tracking
  private setupErrorTracking(): void {
    window.addEventListener('error', this.handleError);
  }
  
  // Handle error events
  private handleError = (event: ErrorEvent): void => {
    const errorInfo = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    };
    
    this.recordActivity('error', errorInfo);
  };
  
  // Setup form tracking
  private setupFormTracking(): void {
    document.addEventListener('submit', this.handleFormSubmit);
  }
  
  // Handle form submissions
  private handleFormSubmit = (event: Event): void => {
    const form = event.target as HTMLFormElement;
    
    // Get form info without capturing sensitive data
    const formInfo = {
      id: form.id,
      name: form.name,
      action: form.action,
      method: form.method,
      fields: Array.from(form.elements).length
    };
    
    this.recordActivity('form_submit', formInfo);
  };
  
  /**
   * Creates a higher-order component that tracks component usage
   */
  public withActivityTracking<P extends object>(
    Component: React.ComponentType<P>,
    componentName: string
  ): React.FC<P> {
    const TrackedComponent: React.FC<P> = (props) => {
      React.useEffect(() => {
        this.recordActivity('component_mount', {
          component: componentName,
          props: Object.keys(props)
        });
        
        return () => {
          this.recordActivity('component_unmount', {
            component: componentName
          });
        };
      }, []);
      
      return <Component {...props} />;
    };
    
    TrackedComponent.displayName = `ActivityTracked(${componentName})`;
    return TrackedComponent;
  }
}

export const userActivityMonitor = UserActivityMonitor.getInstance();

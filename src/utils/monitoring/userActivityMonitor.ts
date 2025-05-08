
import React from 'react';
import { DebugLevel, debugLog } from '@/utils/debug';
import { monitoringService } from './monitoringService';
import { EventType } from '@/types/monitoringTypes';

/**
 * Inactive threshold in milliseconds (5 minutes)
 */
const INACTIVE_THRESHOLD = 5 * 60 * 1000;

/**
 * Activity check interval in milliseconds (30 seconds)
 */
const ACTIVITY_CHECK_INTERVAL = 30 * 1000;

/**
 * Types of user activities to track
 */
export enum ActivityType {
  CLICK = 'click',
  KEYPRESS = 'keypress',
  MOUSE_MOVE = 'mousemove',
  SCROLL = 'scroll',
  NAVIGATION = 'navigation',
  API_CALL = 'api_call',
  PAGE_VIEW = 'page_view',
  SESSION_START = 'session_start',
  SESSION_END = 'session_end',
  USER_IDLE = 'user_idle',
  USER_ACTIVE = 'user_active'
}

/**
 * User activity event data structure
 */
export interface UserActivityEvent {
  type: ActivityType;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Service for monitoring and tracking user activity
 */
export class UserActivityMonitor {
  private static instance: UserActivityMonitor | null = null;
  private enabled: boolean = false;
  private lastActivity: number = Date.now();
  private activityEvents: UserActivityEvent[] = [];
  private isIdle: boolean = false;
  private checkInterval: number | null = null;
  private eventListeners: Set<() => void> = new Set();
  
  /**
   * Private constructor for singleton
   */
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
   * Enable activity monitoring
   */
  public enable(): void {
    if (!this.enabled) {
      this.enabled = true;
      this.attachEventListeners();
      this.startPeriodicCheck();
      this.recordActivityEvent(ActivityType.SESSION_START, { sessionStart: new Date().toISOString() });
      debugLog('UserActivityMonitor', 'Activity monitoring enabled', DebugLevel.INFO);
    }
  }
  
  /**
   * Disable activity monitoring
   */
  public disable(): void {
    if (this.enabled) {
      this.enabled = false;
      this.detachEventListeners();
      this.stopPeriodicCheck();
      this.recordActivityEvent(ActivityType.SESSION_END, { sessionEnd: new Date().toISOString() });
      debugLog('UserActivityMonitor', 'Activity monitoring disabled', DebugLevel.INFO);
    }
  }
  
  /**
   * Record a user activity event
   */
  public recordActivityEvent(type: ActivityType, metadata?: Record<string, any>): void {
    if (!this.enabled) return;
    
    const event: UserActivityEvent = {
      type,
      timestamp: Date.now(),
      metadata
    };
    
    this.activityEvents.push(event);
    this.lastActivity = event.timestamp;
    
    if (this.isIdle && [ActivityType.CLICK, ActivityType.KEYPRESS, ActivityType.MOUSE_MOVE, ActivityType.SCROLL].includes(type)) {
      this.isIdle = false;
      this.recordActivityEvent(ActivityType.USER_ACTIVE);
    }
    
    // Also record in the central monitoring service
    monitoringService.recordEvent(EventType.USER_ACTIVITY, event);
  }
  
  /**
   * Get all recorded activity events
   */
  public getActivityEvents(): UserActivityEvent[] {
    return [...this.activityEvents];
  }
  
  /**
   * Clear all recorded activity events
   */
  public clearEvents(): void {
    this.activityEvents = [];
    debugLog('UserActivityMonitor', 'Activity events cleared', DebugLevel.INFO);
  }
  
  /**
   * Get time since last activity in milliseconds
   */
  public getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivity;
  }
  
  /**
   * Check if user is currently idle
   */
  public isUserIdle(): boolean {
    return this.isIdle;
  }
  
  /**
   * Register activity listener
   */
  public registerActivityListener(callback: () => void): () => void {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }
  
  /**
   * Attach event listeners for user activity
   */
  private attachEventListeners(): void {
    window.addEventListener('click', this.handleUserInteraction.bind(this, ActivityType.CLICK));
    window.addEventListener('keypress', this.handleUserInteraction.bind(this, ActivityType.KEYPRESS));
    window.addEventListener('mousemove', this.handleUserInteraction.bind(this, ActivityType.MOUSE_MOVE), { passive: true });
    window.addEventListener('scroll', this.handleUserInteraction.bind(this, ActivityType.SCROLL), { passive: true });
  }
  
  /**
   * Detach event listeners for user activity
   */
  private detachEventListeners(): void {
    window.removeEventListener('click', this.handleUserInteraction.bind(this, ActivityType.CLICK));
    window.removeEventListener('keypress', this.handleUserInteraction.bind(this, ActivityType.KEYPRESS));
    window.removeEventListener('mousemove', this.handleUserInteraction.bind(this, ActivityType.MOUSE_MOVE));
    window.removeEventListener('scroll', this.handleUserInteraction.bind(this, ActivityType.SCROLL));
  }
  
  /**
   * Handle user interaction events
   */
  private handleUserInteraction(type: ActivityType, event: Event): void {
    // Throttle mousemove and scroll events
    if (type === ActivityType.MOUSE_MOVE || type === ActivityType.SCROLL) {
      // Throttle to once per second
      const now = Date.now();
      if (now - this.lastActivity < 1000) return;
    }
    
    this.recordActivityEvent(type, {
      target: (event.target as HTMLElement)?.tagName || 'unknown',
      path: (event as any).path?.map((el: HTMLElement) => el?.tagName).filter(Boolean) || []
    });
    
    this.notifyListeners();
  }
  
  /**
   * Notify all registered activity listeners
   */
  private notifyListeners(): void {
    this.eventListeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        debugLog('UserActivityMonitor', 'Error in activity listener', DebugLevel.ERROR, error);
      }
    });
  }
  
  /**
   * Start periodic check for user inactivity
   */
  private startPeriodicCheck(): void {
    this.checkInterval = window.setInterval(() => {
      const timeSinceLastActivity = this.getTimeSinceLastActivity();
      
      // Check if user has become idle
      if (!this.isIdle && timeSinceLastActivity >= INACTIVE_THRESHOLD) {
        this.isIdle = true;
        this.recordActivityEvent(ActivityType.USER_IDLE, {
          idleTime: timeSinceLastActivity,
          lastActivityTime: new Date(this.lastActivity).toISOString()
        });
      }
    }, ACTIVITY_CHECK_INTERVAL);
  }
  
  /**
   * Stop periodic check for user inactivity
   */
  private stopPeriodicCheck(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
  
  /**
   * Creates a higher-order component that tracks component usage
   */
  public withActivityTracking<P extends object>(
    Component: React.ComponentType<P>,
    componentName: string
  ): React.FC<P> {
    const TrackedComponent: React.FC<P> = (props) => {
      React.useEffect(() => {
        this.recordActivityEvent(ActivityType.PAGE_VIEW, {
          component: componentName,
          viewStart: Date.now()
        });
        
        return () => {
          this.recordActivityEvent(ActivityType.NAVIGATION, {
            fromComponent: componentName,
            viewDuration: Date.now() - this.lastActivity
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

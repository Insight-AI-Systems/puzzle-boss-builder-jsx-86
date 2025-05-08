
import { useEffect } from 'react';

export interface UserActivity {
  path: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface SessionInfo {
  sessionStart: number;
  sessionDuration: number;
  pageViews: number;
  lastActive: number;
  currentPage?: string;
  referrer?: string;
  userAgent?: string;
}

export class UserActivityMonitor {
  private activities: UserActivity[] = [];
  private sessionStart: number = Date.now();
  private lastActive: number = Date.now();
  private pageViews: number = 0;
  private isTracking: boolean = false;
  private currentPage: string = '';
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.currentPage = window.location.pathname;
    }
  }

  public startTracking(): void {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.sessionStart = Date.now();
    this.trackPageView();
    
    if (typeof window !== 'undefined') {
      // Track page navigation
      window.addEventListener('popstate', this.handleRouteChange);
      
      // Track user activity
      window.addEventListener('mousemove', this.updateLastActive);
      window.addEventListener('keydown', this.updateLastActive);
      window.addEventListener('click', this.updateLastActive);
      window.addEventListener('scroll', this.updateLastActive);
    }
  }

  public stopTracking(): void {
    if (!this.isTracking) return;
    
    this.isTracking = false;
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.handleRouteChange);
      window.removeEventListener('mousemove', this.updateLastActive);
      window.removeEventListener('keydown', this.updateLastActive);
      window.removeEventListener('click', this.updateLastActive);
      window.removeEventListener('scroll', this.updateLastActive);
    }
  }

  private updateLastActive = (): void => {
    this.lastActive = Date.now();
  }

  private handleRouteChange = (): void => {
    if (typeof window !== 'undefined' && this.currentPage !== window.location.pathname) {
      this.currentPage = window.location.pathname;
      this.trackPageView();
    }
  };

  public trackPageView(): void {
    this.pageViews++;
    this.trackActivity('page_view', { path: this.currentPage });
  }

  public trackActivity(action: string, metadata?: Record<string, any>): void {
    const activity: UserActivity = {
      path: this.currentPage,
      action,
      timestamp: Date.now(),
      metadata
    };
    
    this.activities.push(activity);
    
    // Limit the number of stored activities
    if (this.activities.length > 1000) {
      this.activities = this.activities.slice(-1000);
    }
  }

  public getSessionDuration(): number {
    return Math.floor((Date.now() - this.sessionStart) / 1000);
  }

  public getTimeSinceLastActive(): number {
    return Math.floor((Date.now() - this.lastActive) / 1000);
  }

  public getPageViews(): number {
    return this.pageViews;
  }

  public isUserActive(timeoutSeconds: number = 300): boolean {
    return this.getTimeSinceLastActive() < timeoutSeconds;
  }
  
  public getSessionInfo(): SessionInfo {
    return {
      sessionStart: this.sessionStart,
      sessionDuration: this.getSessionDuration(),
      pageViews: this.pageViews,
      lastActive: this.lastActive,
      currentPage: this.currentPage,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };
  }
  
  public getActivities(): UserActivity[] {
    return [...this.activities];
  }
}

export const userActivityMonitor = new UserActivityMonitor();

export const UseUserActivityTracking = (): void => {
  useEffect(() => {
    userActivityMonitor.startTracking();
    
    return () => {
      userActivityMonitor.stopTracking();
    };
  }, []);
};

export default userActivityMonitor;

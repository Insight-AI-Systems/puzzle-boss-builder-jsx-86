
/**
 * User activity monitoring for tracking user interactions
 */

import React from 'react';
import { debugLog, DebugLevel } from '@/utils/debug';

// Types
interface UserActivityEvent {
  type: string;
  timestamp: number;
  page: string;
  metadata?: Record<string, any>;
}

interface ActivityStats {
  totalEvents: number;
  pageViews: number;
  clicks: number;
  formSubmissions: number;
  errors: number;
  customEvents: number;
}

interface UserActivityConfig {
  trackClicks: boolean;
  trackPageViews: boolean;
  trackErrors: boolean;
  trackFormInteractions: boolean;
  sampleRate: number; // 0.0 to 1.0
}

class UserActivityMonitor {
  private static instance: UserActivityMonitor;
  private events: UserActivityEvent[] = [];
  private maxEvents = 1000;
  private config: UserActivityConfig = {
    trackClicks: true,
    trackPageViews: true,
    trackErrors: true,
    trackFormInteractions: false,
    sampleRate: 1.0,
  };
  private clickListener: ((e: MouseEvent) => void) | null = null;
  private formListener: ((e: Event) => void) | null = null;
  private errorListener: ((e: ErrorEvent) => void) | null = null;
  private currentPage: string = '';

  private constructor() {
    if (typeof window !== 'undefined') {
      this.currentPage = window.location.pathname;
      this.setupListeners();
    }
  }

  /**
   * Get singleton instance of UserActivityMonitor
   */
  public static getInstance(): UserActivityMonitor {
    if (!UserActivityMonitor.instance) {
      UserActivityMonitor.instance = new UserActivityMonitor();
    }
    return UserActivityMonitor.instance;
  }

  /**
   * Configure the user activity monitor
   */
  public configure(config: Partial<UserActivityConfig>): void {
    this.config = { ...this.config, ...config };
    this.removeListeners();
    this.setupListeners();
  }

  /**
   * Set up event listeners
   */
  private setupListeners(): void {
    if (typeof window === 'undefined') return;

    // Page view tracking
    if (this.config.trackPageViews) {
      // Check if URL has changed since last check
      const recordPageView = () => {
        const currentPage = window.location.pathname;
        if (currentPage !== this.currentPage) {
          this.currentPage = currentPage;
          this.trackEvent('pageview', {
            url: window.location.href,
            referrer: document.referrer || '',
            title: document.title,
          });
        }
      };

      // Record initial pageview
      recordPageView();

      // Listen for route changes in single-page apps
      const originalPushState = history.pushState;
      history.pushState = function(...args) {
        originalPushState.apply(this, args);
        recordPageView();
      };

      window.addEventListener('popstate', recordPageView);
    }

    // Click tracking
    if (this.config.trackClicks) {
      this.clickListener = (e: MouseEvent) => {
        if (Math.random() > this.config.sampleRate) return; // Sample based on rate

        // Only track specific elements
        const target = e.target as HTMLElement;
        if (!target) return;

        // Get element information
        const tagName = target.tagName.toLowerCase();
        const id = target.id;
        const classNames = target.className instanceof SVGAnimatedString 
          ? target.className.baseVal 
          : target.className;
          
        // Additional useful attributes
        const href = 'href' in target ? (target as HTMLAnchorElement).href : '';
        const text = target.textContent?.trim().substring(0, 50) || '';
        
        // Identify the element for tracking
        let elementIdentifier = '';
        if (id) {
          elementIdentifier = `#${id}`;
        } else if (classNames) {
          elementIdentifier = `.${classNames.split(' ').join('.')}`;
        } else {
          elementIdentifier = tagName;
        }

        this.trackEvent('click', {
          element: elementIdentifier,
          tagName,
          id,
          class: classNames,
          href,
          text,
          x: e.clientX,
          y: e.clientY,
        });
      };

      window.addEventListener('click', this.clickListener);
    }

    // Form interaction tracking
    if (this.config.trackFormInteractions) {
      this.formListener = (e: Event) => {
        if (Math.random() > this.config.sampleRate) return; // Sample based on rate

        const target = e.target as HTMLFormElement;
        if (!target || target.tagName.toLowerCase() !== 'form') return;
        
        // Don't track password forms or forms with sensitive classes
        if (
          target.querySelector('input[type="password"]') ||
          target.classList.contains('sensitive') ||
          target.classList.contains('private')
        ) {
          this.trackEvent('form_submit', {
            formId: target.id || 'unknown',
            formAction: target.action || 'none',
            hasSensitiveData: true,
          });
          return;
        }
        
        // For non-sensitive forms, collect field names (but not values)
        const fields: string[] = [];
        target.querySelectorAll('input, select, textarea').forEach(field => {
          if (field instanceof HTMLElement) {
            const name = field.getAttribute('name') || field.id || field.className;
            if (name && !field.classList.contains('sensitive')) {
              fields.push(name);
            }
          }
        });

        this.trackEvent('form_submit', {
          formId: target.id || 'unknown',
          formAction: target.action || 'none',
          fields,
        });
      };

      window.addEventListener('submit', this.formListener);
    }

    // Error tracking
    if (this.config.trackErrors) {
      this.errorListener = (e: ErrorEvent) => {
        if (Math.random() > this.config.sampleRate) return; // Sample based on rate

        this.trackEvent('js_error', {
          message: e.message,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
        });
      };

      window.addEventListener('error', this.errorListener);
    }
  }

  /**
   * Remove event listeners
   */
  private removeListeners(): void {
    if (typeof window === 'undefined') return;

    if (this.clickListener) {
      window.removeEventListener('click', this.clickListener);
      this.clickListener = null;
    }

    if (this.formListener) {
      window.removeEventListener('submit', this.formListener);
      this.formListener = null;
    }

    if (this.errorListener) {
      window.removeEventListener('error', this.errorListener);
      this.errorListener = null;
    }
  }

  /**
   * Track a custom event
   */
  public trackEvent(type: string, metadata?: Record<string, any>): void {
    if (Math.random() > this.config.sampleRate) return; // Sample based on rate

    const event: UserActivityEvent = {
      type,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      metadata,
    };

    this.events.push(event);
    
    // Prevent the array from growing too large
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    // Debug log for development
    if (process.env.NODE_ENV === 'development') {
      debugLog('UserActivityMonitor', `Event: ${type}`, DebugLevel.DEBUG, metadata);
    }
  }

  /**
   * Get all tracked events
   */
  public getEvents(eventType?: string): UserActivityEvent[] {
    if (eventType) {
      return this.events.filter(e => e.type === eventType);
    }
    return [...this.events];
  }

  /**
   * Get a summary of user activity
   */
  public getSummary(): ActivityStats {
    const stats: ActivityStats = {
      totalEvents: this.events.length,
      pageViews: this.events.filter(e => e.type === 'pageview').length,
      clicks: this.events.filter(e => e.type === 'click').length,
      formSubmissions: this.events.filter(e => e.type === 'form_submit').length,
      errors: this.events.filter(e => e.type === 'js_error').length,
      customEvents: this.events.filter(e => 
        !['pageview', 'click', 'form_submit', 'js_error'].includes(e.type)
      ).length,
    };
    
    return stats;
  }

  /**
   * Clear all tracked events
   */
  public clearEvents(): void {
    this.events = [];
  }

  /**
   * Get events for a particular page
   */
  public getPageEvents(page: string): UserActivityEvent[] {
    return this.events.filter(e => e.page === page);
  }
}

export const userActivityMonitor = UserActivityMonitor.getInstance();

/**
 * React hook for tracking page views
 */
export function usePageViewTracking(pageName?: string): void {
  React.useEffect(() => {
    // Use the provided page name or get from URL
    const page = pageName || (typeof window !== 'undefined' ? window.location.pathname : '');
    
    // Track page view
    userActivityMonitor.trackEvent('pageview', {
      page,
      title: typeof document !== 'undefined' ? document.title : '',
      timestamp: Date.now(),
    });
    
    // Cleanup not needed as we want to record the view
  }, [pageName]);
}

/**
 * React hook for tracking component mount/unmount
 */
export function useComponentTracking(componentName: string): void {
  React.useEffect(() => {
    // Track component mount
    userActivityMonitor.trackEvent('component_mount', {
      component: componentName,
      timestamp: Date.now(),
    });
    
    return () => {
      // Track component unmount
      userActivityMonitor.trackEvent('component_unmount', {
        component: componentName,
        timestamp: Date.now(),
      });
    };
  }, [componentName]);
}

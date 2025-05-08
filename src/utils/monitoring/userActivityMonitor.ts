/**
 * User activity monitoring service
 * Tracks user interactions and behaviors
 */

import React from 'react';
import { debugLog, DebugLevel } from '@/utils/debug';

// Configuration interface
interface ActivityConfig {
  trackClicks?: boolean;
  trackPageViews?: boolean;
  trackErrors?: boolean;
  trackFormInteractions?: boolean;
  sampleRate?: number;
}

// Event data interface
interface ActivityEvent {
  type: string;
  timestamp: number;
  data?: Record<string, any>;
}

// Default configuration
const DEFAULT_CONFIG: ActivityConfig = {
  trackClicks: true,
  trackPageViews: true,
  trackErrors: true,
  trackFormInteractions: false,
  sampleRate: 0.1, // 10% of events by default (to avoid too much data)
};

/**
 * User Activity Monitor singleton class
 */
class UserActivityMonitor {
  private static instance: UserActivityMonitor;
  private config: ActivityConfig;
  private events: ActivityEvent[] = [];
  private initialized: boolean = false;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private errorHandler: ((e: ErrorEvent) => void) | null = null;
  private formSubmitHandler: ((e: SubmitEvent) => void) | null = null;
  private pageViewTimer: any = null;
  
  private constructor(config: Partial<ActivityConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<ActivityConfig>): UserActivityMonitor {
    if (!UserActivityMonitor.instance) {
      UserActivityMonitor.instance = new UserActivityMonitor(config);
    } else if (config) {
      UserActivityMonitor.instance.configure(config);
    }
    return UserActivityMonitor.instance;
  }
  
  /**
   * Initialize the user activity monitoring
   */
  private initialize(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }
    
    try {
      // Setup page view tracking
      if (this.config.trackPageViews) {
        this.trackPageView();
        
        // Track when URL changes for SPAs
        window.addEventListener('popstate', () => this.trackPageView());
        
        // Check for URL changes periodically (for SPAs that don't use History API)
        let lastUrl = window.location.href;
        this.pageViewTimer = setInterval(() => {
          const currentUrl = window.location.href;
          if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            this.trackPageView();
          }
        }, 2000);
      }
      
      // Setup click tracking
      if (this.config.trackClicks) {
        this.clickHandler = this.handleClick.bind(this);
        document.body.addEventListener('click', this.clickHandler);
      }
      
      // Setup error tracking
      if (this.config.trackErrors) {
        this.errorHandler = this.handleError.bind(this);
        window.addEventListener('error', this.errorHandler);
      }
      
      // Setup form interaction tracking
      if (this.config.trackFormInteractions) {
        this.formSubmitHandler = this.handleFormSubmit.bind(this);
        document.body.addEventListener('submit', this.formSubmitHandler);
      }
      
      this.initialized = true;
      debugLog('UserActivityMonitor', 'User activity monitoring initialized', DebugLevel.INFO);
    } catch (err) {
      debugLog('UserActivityMonitor', 'Error initializing user activity monitoring', DebugLevel.ERROR, { error: err });
    }
  }
  
  /**
   * Update configuration
   */
  public configure(config: Partial<ActivityConfig>): void {
    const previousConfig = { ...this.config };
    this.config = { ...this.config, ...config };
    
    // If not previously initialized, initialize now
    if (!this.initialized && typeof window !== 'undefined') {
      return this.initialize();
    }
    
    // Update event listeners based on configuration changes
    if (typeof window !== 'undefined') {
      // Click tracking
      if (previousConfig.trackClicks !== this.config.trackClicks) {
        if (this.config.trackClicks) {
          this.clickHandler = this.handleClick.bind(this);
          document.body.addEventListener('click', this.clickHandler);
        } else if (this.clickHandler) {
          document.body.removeEventListener('click', this.clickHandler);
          this.clickHandler = null;
        }
      }
      
      // Error tracking
      if (previousConfig.trackErrors !== this.config.trackErrors) {
        if (this.config.trackErrors) {
          this.errorHandler = this.handleError.bind(this);
          window.addEventListener('error', this.errorHandler);
        } else if (this.errorHandler) {
          window.removeEventListener('error', this.errorHandler);
          this.errorHandler = null;
        }
      }
      
      // Form interaction tracking
      if (previousConfig.trackFormInteractions !== this.config.trackFormInteractions) {
        if (this.config.trackFormInteractions) {
          this.formSubmitHandler = this.handleFormSubmit.bind(this);
          document.body.addEventListener('submit', this.formSubmitHandler);
        } else if (this.formSubmitHandler) {
          document.body.removeEventListener('submit', this.formSubmitHandler);
          this.formSubmitHandler = null;
        }
      }
      
      // Page view tracking
      if (previousConfig.trackPageViews !== this.config.trackPageViews) {
        if (this.config.trackPageViews) {
          this.trackPageView();
          window.addEventListener('popstate', () => this.trackPageView());
          
          // Setup URL change detection
          let lastUrl = window.location.href;
          this.pageViewTimer = setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
              lastUrl = currentUrl;
              this.trackPageView();
            }
          }, 2000);
        } else {
          window.removeEventListener('popstate', () => this.trackPageView());
          if (this.pageViewTimer) {
            clearInterval(this.pageViewTimer);
            this.pageViewTimer = null;
          }
        }
      }
    }
  }
  
  /**
   * Handle click events
   */
  private handleClick(e: MouseEvent): void {
    // Apply sampling rate
    if (Math.random() > (this.config.sampleRate || 1)) return;
    
    try {
      // Ignore clicks that aren't on elements
      if (!(e.target instanceof Element)) return;
      
      const target = e.target;
      const tagName = target.tagName.toLowerCase();
      
      // Track more information for interactive elements
      let elementType = tagName;
      let elementId = target.id || undefined;
      let elementClass = target.className && typeof target.className === 'string' ? target.className : undefined;
      let elementText = target.textContent ? target.textContent.trim().substring(0, 50) : undefined;
      let elementHref: string | undefined;
      
      // Get href for links
      if (tagName === 'a') {
        elementHref = (target as HTMLAnchorElement).href;
      }
      
      // Get label text for buttons
      if (tagName === 'button') {
        const ariaLabel = target.getAttribute('aria-label');
        if (ariaLabel) elementText = ariaLabel;
      }
      
      // Look for interactive parent element if the target itself isn't interesting
      if (!['a', 'button', 'input', 'select', 'textarea'].includes(tagName)) {
        let parentElement = target.closest('a, button, [role="button"], .clickable');
        if (parentElement) {
          elementType = `${tagName}-with-parent-${parentElement.tagName.toLowerCase()}`;
          elementId = parentElement.id || elementId;
          elementClass = parentElement.className && typeof parentElement.className === 'string' 
            ? parentElement.className 
            : elementClass;
          
          if (parentElement.tagName.toLowerCase() === 'a') {
            elementHref = (parentElement as HTMLAnchorElement).href;
          }
        }
      }
      
      this.trackEvent('click', {
        elementType,
        elementId,
        elementClass,
        elementText,
        elementHref,
        x: e.clientX,
        y: e.clientY,
        page: window.location.pathname
      });
      
    } catch (err) {
      debugLog('UserActivityMonitor', 'Error handling click event', DebugLevel.ERROR, { error: err });
    }
  }
  
  /**
   * Handle error events
   */
  private handleError(e: ErrorEvent): void {
    // Apply sampling rate
    if (Math.random() > (this.config.sampleRate || 1)) return;
    
    try {
      this.trackEvent('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        page: window.location.pathname
      });
    } catch (err) {
      debugLog('UserActivityMonitor', 'Error handling error event', DebugLevel.ERROR, { error: err });
    }
  }
  
  /**
   * Handle form submission events
   */
  private handleFormSubmit(e: SubmitEvent): void {
    // Apply sampling rate
    if (Math.random() > (this.config.sampleRate || 1)) return;
    
    try {
      if (!(e.target instanceof HTMLFormElement)) return;
      
      const form = e.target;
      const formId = form.id || undefined;
      const formAction = form.action || undefined;
      const formMethod = form.method || undefined;
      
      // Get form element types but no values for privacy
      const formElements = Array.from(form.elements).map((element) => {
        if (element instanceof HTMLInputElement) {
          return {
            type: element.type,
            name: element.name || undefined,
            // Don't track actual values for privacy reasons
            hasValue: element.value.length > 0
          };
        }
        return {
          type: element.tagName.toLowerCase(),
          name: (element as HTMLElement).getAttribute('name') || undefined
        };
      });
      
      this.trackEvent('form_submit', {
        formId,
        formAction,
        formMethod,
        elementCount: formElements.length,
        page: window.location.pathname
      });
    } catch (err) {
      debugLog('UserActivityMonitor', 'Error handling form submit event', DebugLevel.ERROR, { error: err });
    }
  }
  
  /**
   * Track page view
   */
  private trackPageView(): void {
    // Apply sampling rate
    if (Math.random() > (this.config.sampleRate || 1)) return;
    
    try {
      const url = window.location.href;
      const path = window.location.pathname;
      const referrer = document.referrer;
      const title = document.title;
      
      this.trackEvent('page_view', {
        url,
        path,
        referrer,
        title
      });
    } catch (err) {
      debugLog('UserActivityMonitor', 'Error tracking page view', DebugLevel.ERROR, { error: err });
    }
  }
  
  /**
   * Track a custom event
   */
  public trackEvent(eventType: string, data?: Record<string, any>): void {
    // Apply sampling rate for custom events
    if (Math.random() > (this.config.sampleRate || 1)) return;
    
    try {
      const event: ActivityEvent = {
        type: eventType,
        timestamp: Date.now(),
        data
      };
      
      this.events.push(event);
      
      // Keep events array from growing too large
      if (this.events.length > 1000) {
        this.events = this.events.slice(-1000);
      }
      
      // Send event to server asynchronously
      // this.sendEventToAnalytics(event);
      
      debugLog('UserActivityMonitor', `Tracked event: ${eventType}`, DebugLevel.DEBUG, data);
    } catch (err) {
      debugLog('UserActivityMonitor', 'Error tracking event', DebugLevel.ERROR, { error: err, eventType });
    }
  }
  
  /**
   * Get recent events
   */
  public getRecentEvents(limit = 100, eventType?: string): ActivityEvent[] {
    let filteredEvents = this.events;
    
    if (eventType) {
      filteredEvents = filteredEvents.filter(event => event.type === eventType);
    }
    
    return filteredEvents.slice(-limit).reverse();
  }
  
  /**
   * Get summary of tracked events
   */
  public getSummary() {
    // Count event types
    const eventCounts = this.events.reduce((acc, event) => {
      const { type } = event;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get most recent events by type
    const recentEventsByType: Record<string, ActivityEvent | null> = {};
    Object.keys(eventCounts).forEach(type => {
      const event = [...this.events]
        .filter(e => e.type === type)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      recentEventsByType[type] = event || null;
    });
    
    return {
      totalEvents: this.events.length,
      eventCounts,
      recentEventsByType
    };
  }
  
  /**
   * Clear all events
   */
  public clearEvents(): void {
    this.events = [];
  }
}

// Export singleton instance
export const userActivityMonitor = UserActivityMonitor.getInstance();

/**
 * HOC that wraps a component with user activity tracking
 */
export function withActivityTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string,
  trackProps: boolean = false
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
  
  const WithActivityTracking: React.FC<P> = (props) => {
    React.useEffect(() => {
      // Track component mount
      userActivityMonitor.trackEvent('component_mount', {
        component: displayName,
        props: trackProps ? Object.keys(props) : undefined,
        timestamp: Date.now()
      });
      
      // Track component unmount
      return () => {
        userActivityMonitor.trackEvent('component_unmount', {
          component: displayName,
          duration: Date.now() - (Date.now() - 100), // Approximate duration
          timestamp: Date.now()
        });
      };
    }, []);
    
    return <Component {...props} />;
  };
  
  WithActivityTracking.displayName = `WithActivityTracking(${displayName})`;
  return WithActivityTracking;
}

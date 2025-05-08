
/**
 * Error tracking system for monitoring and reporting application errors
 */

import React from 'react';

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorEvent {
  message: string;
  stack?: string;
  componentName?: string;
  timestamp: number;
  severity: ErrorSeverity;
  userId?: string;
  metadata?: Record<string, any>;
  isFatal: boolean;
  url: string;
  isHandled: boolean;
}

interface ErrorTrackerConfig {
  captureGlobalErrors: boolean;
  capturePromiseRejections: boolean;
  captureReactErrors: boolean;
  maxErrors: number;
  sampleRate: number;
  enableConsoleLogging: boolean;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorEvent[] = [];
  private config: ErrorTrackerConfig = {
    captureGlobalErrors: true,
    capturePromiseRejections: true,
    captureReactErrors: true,
    maxErrors: 100,
    sampleRate: 1.0,  // Capture 100% of errors by default
    enableConsoleLogging: process.env.NODE_ENV === 'development'
  };
  private originalConsoleError: typeof console.error;
  
  private constructor() {
    this.originalConsoleError = console.error;
    
    if (typeof window !== 'undefined') {
      this.setupErrorListeners();
    }
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }
  
  /**
   * Configure the error tracker
   */
  public configure(config: Partial<ErrorTrackerConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Re-setup listeners if configuration changes
    if (typeof window !== 'undefined') {
      this.setupErrorListeners();
    }
  }
  
  /**
   * Track a specific error
   */
  public trackError(
    error: Error | string, 
    severity: ErrorSeverity = 'medium', 
    metadata?: Record<string, any>,
    componentName?: string
  ): void {
    if (Math.random() > this.config.sampleRate) {
      return; // Skip based on sample rate
    }
    
    const errorEvent: ErrorEvent = {
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      componentName,
      timestamp: Date.now(),
      severity,
      metadata,
      isFatal: false,
      url: typeof window !== 'undefined' ? window.location.href : '',
      isHandled: true
    };
    
    this.recordError(errorEvent);
  }
  
  /**
   * Track errors from try/catch blocks
   */
  public tryCatch<T>(fn: () => T, componentName?: string): T | undefined {
    try {
      return fn();
    } catch (error) {
      this.trackError(
        error instanceof Error ? error : new Error(String(error)),
        'medium',
        { source: 'tryCatch' },
        componentName
      );
      return undefined;
    }
  }
  
  /**
   * Record an error event
   */
  private recordError(errorEvent: ErrorEvent): void {
    this.errors.unshift(errorEvent); // Add to the beginning for most recent first
    
    // Trim errors if we have too many
    if (this.errors.length > this.config.maxErrors) {
      this.errors = this.errors.slice(0, this.config.maxErrors);
    }
    
    // Log to console if enabled
    if (this.config.enableConsoleLogging) {
      const logMethod = errorEvent.severity === 'critical' || errorEvent.isFatal 
        ? this.originalConsoleError 
        : console.warn;
      
      logMethod(
        `[${errorEvent.severity.toUpperCase()}] ${errorEvent.message}`,
        {
          stack: errorEvent.stack,
          component: errorEvent.componentName,
          metadata: errorEvent.metadata
        }
      );
    }
    
    // Here you would normally send to a backend error tracking service
    // But we'll implement that separately with a proper queue system
  }
  
  /**
   * Set up event listeners for errors
   */
  private setupErrorListeners(): void {
    if (this.config.captureGlobalErrors) {
      window.addEventListener('error', (event) => {
        // Don't capture errors from extensions and other non-app sources
        if (this.shouldIgnoreError(event)) {
          return;
        }
        
        const errorEvent: ErrorEvent = {
          message: event.message || 'Unknown error',
          stack: event.error?.stack,
          timestamp: Date.now(),
          severity: 'high',
          metadata: {
            fileName: event.filename,
            lineNumber: event.lineno,
            columnNumber: event.colno
          },
          isFatal: true,
          url: window.location.href,
          isHandled: false
        };
        
        this.recordError(errorEvent);
      });
    }
    
    if (this.config.capturePromiseRejections) {
      window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason;
        const errorEvent: ErrorEvent = {
          message: error instanceof Error ? error.message : 'Unhandled Promise Rejection',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
          severity: 'high',
          metadata: {
            reason: error instanceof Error ? undefined : error
          },
          isFatal: false,
          url: window.location.href,
          isHandled: false
        };
        
        this.recordError(errorEvent);
      });
    }
    
    // Console error interception
    if (this.config.enableConsoleLogging) {
      console.error = (...args) => {
        // Get the stack trace to find the source component
        const stack = new Error().stack || '';
        const matches = stack.match(/at\s+(.*)\s+\(/);
        const componentName = matches ? matches[1] : undefined;
        
        if (args[0] instanceof Error) {
          this.trackError(args[0], 'medium', { fromConsole: true }, componentName);
        } else if (typeof args[0] === 'string' && args[0].includes('Warning:') && args[0].includes('React')) {
          // React specific warnings
          this.trackError(args[0], 'low', { fromReactWarning: true }, componentName);
        }
        
        // Call original console.error
        this.originalConsoleError.apply(console, args);
      };
    }
  }
  
  /**
   * Check if error should be ignored
   */
  private shouldIgnoreError(event: ErrorEvent): boolean {
    // Ignore errors from external scripts and extensions
    if (event.filename && !event.filename.includes(window.location.origin)) {
      return true;
    }
    
    // Ignore network errors for images, etc.
    if (event.message && (
      event.message.includes('Script error') || 
      event.message.includes('Load failed')
    )) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Get all recorded errors
   */
  public getErrors(): ErrorEvent[] {
    return [...this.errors];
  }
  
  /**
   * Get errors by severity
   */
  public getErrorsBySeverity(severity: ErrorSeverity): ErrorEvent[] {
    return this.errors.filter(error => error.severity === severity);
  }
  
  /**
   * Clear all errors
   */
  public clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Get error stats
   */
  public getStats(): { 
    total: number; 
    bySeverity: Record<ErrorSeverity, number>;
    fatalCount: number;
    handledCount: number;
  } {
    const stats = {
      total: this.errors.length,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      fatalCount: 0,
      handledCount: 0
    };
    
    for (const error of this.errors) {
      stats.bySeverity[error.severity]++;
      
      if (error.isFatal) {
        stats.fatalCount++;
      }
      
      if (error.isHandled) {
        stats.handledCount++;
      }
    }
    
    return stats;
  }
  
  /**
   * Export errors to JSON
   */
  public exportToJson(): string {
    return JSON.stringify({
      errors: this.errors,
      stats: this.getStats(),
      timestamp: new Date().toISOString()
    }, null, 2);
  }
}

export const errorTracker = ErrorTracker.getInstance();

/**
 * HOC for tracking errors in React components
 */
export function withErrorTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  const tracker = ErrorTracker.getInstance();
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
  
  const WrappedComponent: React.FC<P> = (props) => {
    try {
      return <Component {...props} />;
    } catch (error) {
      tracker.trackError(
        error instanceof Error ? error : new Error(String(error)),
        'high',
        { props },
        displayName
      );
      
      return (
        <div className="error-boundary">
          <p>Something went wrong in {displayName}.</p>
        </div>
      );
    }
  };
  
  WrappedComponent.displayName = `WithErrorTracking(${displayName})`;
  
  return WrappedComponent;
}


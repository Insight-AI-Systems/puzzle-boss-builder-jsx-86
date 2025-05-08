
import React from 'react';
import { debugLog, DebugLevel } from '../debug';

// Enhanced ErrorEvent interface with additional properties
interface EnhancedErrorEvent extends ErrorEvent {
  timestamp: number;
  severity: string;
  isFatal: boolean;
  url: string;
  isHandled: boolean;
  filename?: string;
}

// Common configuration interface
interface ErrorTrackerConfig {
  captureGlobalErrors?: boolean;
  capturePromiseRejections?: boolean;
  captureReactErrors?: boolean;
  sampleRate?: number;
  enableConsoleLogging?: boolean;
  maxErrors?: number;
}

// Default configuration
const DEFAULT_CONFIG: ErrorTrackerConfig = {
  captureGlobalErrors: true,
  capturePromiseRejections: true,
  captureReactErrors: true,
  sampleRate: 1.0, // 100% of errors
  enableConsoleLogging: process.env.NODE_ENV === 'development',
  maxErrors: 100
};

// Error service class
export class ErrorTracker {
  private config: ErrorTrackerConfig;
  private errorCount: number = 0;
  private errorsLog: Record<string, any>[] = [];
  private static instance: ErrorTracker;
  private errorHandlersRegistered = false;

  /**
   * Private constructor for singleton pattern
   */
  private constructor(config: ErrorTrackerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize error handlers conditionally
    if (typeof window !== 'undefined') {
      this.initializeErrorHandlers();
    }
  }

  /**
   * Get singleton instance of ErrorTracker
   */
  public static getInstance(config?: ErrorTrackerConfig): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker(config);
    } else if (config) {
      // If config is passed but instance exists, just update the config
      ErrorTracker.instance.configure(config);
    }
    return ErrorTracker.instance;
  }

  /**
   * Set up event listeners for various error types
   */
  private initializeErrorHandlers(): void {
    if (this.errorHandlersRegistered) return;

    if (this.config.captureGlobalErrors) {
      window.addEventListener('error', this.handleGlobalError.bind(this));
    }

    if (this.config.capturePromiseRejections) {
      window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    this.errorHandlersRegistered = true;
    debugLog('ErrorTracker', 'Error handlers initialized', DebugLevel.INFO);
  }

  /**
   * Update configuration
   */
  public configure(config: Partial<ErrorTrackerConfig>): void {
    // Update config
    this.config = { ...this.config, ...config };
    
    // Re-initialize handlers if needed based on new config
    if (!this.errorHandlersRegistered && typeof window !== 'undefined') {
      this.initializeErrorHandlers();
    }
  }

  /**
   * Handle global error events
   */
  private handleGlobalError(event: ErrorEvent): void {
    // Apply sampling
    if (Math.random() > (this.config.sampleRate || 1.0)) return;
    
    try {
      // Convert to enhanced error event format
      const enhancedEvent: Partial<EnhancedErrorEvent> = {
        ...event,
        timestamp: Date.now(),
        severity: 'error',
        isFatal: true,
        url: window.location.href,
        isHandled: false
      };
      
      // Process the error
      this.processError(
        event.error || new Error(event.message || 'Unknown error'),
        'high',
        { 
          type: 'global',
          filename: enhancedEvent.filename || 'unknown',
          lineno: event.lineno,
          colno: event.colno
        }
      );
      
    } catch (err) {
      console.error('Error in error handler:', err);
    }
  }

  /**
   * Handle unhandled promise rejections
   */
  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    // Apply sampling
    if (Math.random() > (this.config.sampleRate || 1.0)) return;
    
    try {
      // Extract error from reason
      let error = event.reason;
      if (!(error instanceof Error)) {
        error = new Error(
          typeof error === 'string' 
            ? error 
            : JSON.stringify(error) || 'Unknown promise rejection'
        );
      }
      
      // Process the error
      this.processError(
        error,
        'medium',
        { 
          type: 'promise',
          url: window.location.href,
          timestamp: Date.now()
        }
      );
      
    } catch (err) {
      console.error('Error handling promise rejection:', err);
    }
  }

  /**
   * Track errors from anywhere in the application
   */
  public trackError(
    error: Error | string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    metadata?: Record<string, any>,
    componentName?: string
  ): void {
    // Apply sampling
    if (Math.random() > (this.config.sampleRate || 1.0)) return;
    
    try {
      // Convert string to Error if needed
      const errorObject = typeof error === 'string' ? new Error(error) : error;
      
      // Add component name to metadata if provided
      const enhancedMetadata = {
        ...metadata,
        ...(componentName ? { component: componentName } : {})
      };
      
      // Process the error
      this.processError(errorObject, severity, enhancedMetadata);
      
    } catch (err) {
      console.error('Error tracking error:', err);
    }
  }

  /**
   * Process errors in a standardized way
   */
  private processError(
    error: Error,
    severity: 'low' | 'medium' | 'high' | 'critical',
    metadata?: Record<string, any>
  ): void {
    // Check if we've reached the max error count
    if (this.errorCount >= (this.config.maxErrors || 100)) {
      if (this.errorCount === (this.config.maxErrors || 100)) {
        console.warn('Maximum error count reached, suppressing further errors');
        this.errorCount++; // Increment to prevent this warning from showing again
      }
      return;
    }
    
    // Construct error entry
    const errorEntry = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      severity,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: metadata || {}
    };
    
    // Add to log
    this.errorsLog.push(errorEntry);
    this.errorCount++;
    
    // Console logging if enabled
    if (this.config.enableConsoleLogging) {
      console.error(
        `[ErrorTracker] ${severity.toUpperCase()}: ${error.message}`,
        { error, metadata }
      );
    }
    
    // Log to server in a real implementation
    // this.sendToServer(errorEntry);
  }

  /**
   * Get error statistics
   */
  public getStats() {
    const severityCounts = this.errorsLog.reduce(
      (acc, error) => {
        const severity = error.severity || 'unknown';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    
    return {
      totalErrors: this.errorCount,
      severityCounts,
      lastError: this.errorsLog.length > 0 ? this.errorsLog[this.errorsLog.length - 1] : null
    };
  }

  /**
   * Clear collected errors
   */
  public clearErrors(): void {
    this.errorsLog = [];
    this.errorCount = 0;
  }
}

// HOC for wrapping components with error tracking
export function withErrorTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';

  const WithErrorTracking: React.FC<P> = (props) => {
    try {
      return <Component {...props} />;
    } catch (error) {
      // Track the error
      errorTracker.trackError(
        error instanceof Error ? error : new Error(String(error)),
        'high',
        { props },
        displayName
      );

      // Render fallback
      return (
        <div className="error-boundary p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-red-700 font-medium">Component Error</h3>
          <p className="text-red-600">{displayName} encountered an error</p>
        </div>
      );
    }
  };

  WithErrorTracking.displayName = `WithErrorTracking(${displayName})`;
  return WithErrorTracking;
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();

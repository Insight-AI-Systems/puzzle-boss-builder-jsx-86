import React from 'react';

export interface ErrorTrackerOptions {
  captureGlobal?: boolean;
  captureReact?: boolean;
  ignorePatterns?: RegExp[];
}

// Extending ErrorEvent interface with additional fields
export interface EnhancedErrorEvent {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
  type?: string;
  timestamp?: number;
}

export interface ErrorData {
  message: string;
  stack?: string;
  filename?: string;
  line?: number;
  column?: number;
  type: string;
  timestamp: number;
  componentStack?: string;
  userAgent?: string;
  url?: string;
  tags?: Record<string, string>;
}

export interface ErrorTrackerInterface {
  init: (options?: ErrorTrackerOptions) => void;
  trackError: (error: Error | string, tags?: Record<string, string>) => void;
  getStats: () => { count: number; byType: Record<string, number> };
}

class ErrorTracker implements ErrorTrackerInterface {
  private errors: ErrorData[] = [];
  private options: ErrorTrackerOptions = {
    captureGlobal: true,
    captureReact: true,
    ignorePatterns: [/ResizeObserver loop/, /Network request failed/]
  };
  private originalConsoleError: typeof console.error;
  private originalOnError: typeof window.onerror;
  private originalOnUnhandledRejection: typeof window.onunhandledrejection;

  constructor() {
    this.originalConsoleError = console.error;
    this.originalOnError = window.onerror || (() => {});
    this.originalOnUnhandledRejection = window.onunhandledrejection || (() => {});
  }

  public init(options?: ErrorTrackerOptions): void {
    this.options = { ...this.options, ...options };

    if (this.options.captureGlobal) {
      this.setupGlobalHandlers();
    }

    if (this.options.captureReact) {
      this.setupReactHandlers();
    }
  }

  private setupGlobalHandlers(): void {
    // Global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      this.originalOnError(message, source, lineno, colno, error);
      
      if (this.shouldIgnoreError(message.toString())) {
        return;
      }

      this.trackError(error || message.toString(), {
        source: 'window.onerror',
        file: source?.toString() || 'unknown'
      });
    };

    // Unhandled promise rejection handler
    window.onunhandledrejection = (event) => {
      this.originalOnUnhandledRejection(event);
      
      const error = event.reason;
      if (this.shouldIgnoreError(error?.message || error?.toString())) {
        return;
      }

      this.trackError(error || 'Unhandled Promise Rejection', {
        source: 'unhandledrejection'
      });
    };

    // Override console.error to capture errors
    console.error = (...args) => {
      this.originalConsoleError.apply(console, args);

      const firstArg = args[0];
      if (typeof firstArg === 'string' && this.shouldIgnoreError(firstArg)) {
        return;
      }

      if (firstArg instanceof Error) {
        this.trackError(firstArg, { source: 'console.error' });
      } else if (typeof firstArg === 'string') {
        this.trackError(firstArg, { source: 'console.error' });
      }
    };
  }

  private setupReactHandlers(): void {
    // React error handling is typically done with an error boundary
    // This is just a placeholder - actual implementation depends on how
    // error boundaries are set up in the application
  }

  private shouldIgnoreError(message: string): boolean {
    if (!message || !this.options.ignorePatterns) return false;
    
    return this.options.ignorePatterns.some(pattern => pattern.test(message));
  }

  public trackError(error: Error | string, tags?: Record<string, string>): void {
    const errorData: ErrorData = {
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : 'StringError',
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      tags
    };

    this.errors.push(errorData);

    // Limit the number of stored errors to prevent memory issues
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }
  }

  public getStats(): { count: number; byType: Record<string, number> } {
    const byType: Record<string, number> = {};
    
    this.errors.forEach(err => {
      byType[err.type] = (byType[err.type] || 0) + 1;
    });
    
    return {
      count: this.errors.length,
      byType
    };
  }
  
  public getErrors(): ErrorData[] {
    return [...this.errors];
  }
}

export const errorTracker = new ErrorTracker();

export default errorTracker;

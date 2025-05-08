
/**
 * Centralized monitoring service for tracking application performance and errors
 */

import React from 'react';
import { errorTracker } from './errorTracker';
import { performanceMonitor } from './performanceMonitor';
import { userActivityMonitor } from './userActivityMonitor';
import { debugLog, DebugLevel } from '@/utils/debug';

// Types
export type MonitoringLevel = 'off' | 'minimal' | 'standard' | 'verbose';

export interface MonitoringConfig {
  errorTracking: boolean;
  performanceTracking: boolean;
  userActivityTracking: boolean;
  level: MonitoringLevel;
  samplingRate: number;
  debugMode: boolean;
}

// Default configuration
const DEFAULT_CONFIG: MonitoringConfig = {
  errorTracking: true,
  performanceTracking: true,
  userActivityTracking: true,
  level: 'standard',
  samplingRate: 1.0, // 100% of events
  debugMode: process.env.NODE_ENV === 'development',
};

/**
 * Monitoring Service
 * A centralized class for managing all monitoring activities
 */
class MonitoringService {
  private static instance: MonitoringService;
  private config: MonitoringConfig;
  private initialized: boolean = false;

  private constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Get singleton instance of MonitoringService
   */
  public static getInstance(config?: Partial<MonitoringConfig>): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService(config);
    } else if (config) {
      MonitoringService.instance.configure(config);
    }
    return MonitoringService.instance;
  }

  /**
   * Initialize the monitoring service
   */
  public initialize(): void {
    if (this.initialized) return;

    try {
      debugLog('MonitoringService', 'Initializing monitoring services', DebugLevel.INFO);

      // Configure error tracking
      if (this.config.errorTracking) {
        errorTracker.configure({
          captureGlobalErrors: true,
          capturePromiseRejections: true,
          captureReactErrors: true,
          sampleRate: this.config.samplingRate,
          enableConsoleLogging: this.config.debugMode,
        });
      }

      // Configure performance monitoring
      if (this.config.performanceTracking) {
        performanceMonitor.configure({
          enableMonitoring: true,
          trackNetworkRequests: this.config.level !== 'minimal',
          trackLongTasks: this.config.level === 'verbose',
          trackResourceTiming: this.config.level !== 'minimal',
          trackMemoryUsage: this.config.level === 'verbose',
          sampleRate: this.config.samplingRate,
        });
      }

      // Configure user activity tracking
      if (this.config.userActivityTracking) {
        userActivityMonitor.configure({
          trackClicks: this.config.level !== 'minimal',
          trackPageViews: true,
          trackErrors: this.config.level !== 'minimal',
          trackFormInteractions: this.config.level === 'verbose',
          sampleRate: this.config.samplingRate,
        });
      }

      this.initialized = true;
      debugLog('MonitoringService', 'Monitoring services initialized', DebugLevel.INFO);
    } catch (err) {
      console.error('Failed to initialize monitoring', err);
    }
  }

  /**
   * Configure the monitoring service
   */
  public configure(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.initialized) {
      // Update sub-service configurations if already initialized
      if (this.config.errorTracking) {
        errorTracker.configure({
          sampleRate: this.config.samplingRate,
          enableConsoleLogging: this.config.debugMode,
        });
      }

      if (this.config.performanceTracking) {
        performanceMonitor.configure({
          enableMonitoring: true,
          sampleRate: this.config.samplingRate,
        });
      }

      if (this.config.userActivityTracking) {
        userActivityMonitor.configure({
          sampleRate: this.config.samplingRate,
        });
      }
    }
  }

  /**
   * Track a specific error
   */
  public trackError(
    error: Error | string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    metadata?: Record<string, any>,
    componentName?: string
  ): void {
    if (!this.config.errorTracking) return;
    errorTracker.trackError(error, severity, metadata, componentName);
  }

  /**
   * Mark the start of a performance measurement
   */
  public markStart(markName: string): void {
    if (!this.config.performanceTracking) return;
    performanceMonitor.markStart(markName);
  }

  /**
   * Mark the end of a performance measurement
   */
  public markEnd(markName: string, metadata?: Record<string, any>): number | null {
    if (!this.config.performanceTracking) return null;
    return performanceMonitor.markEnd(markName, metadata);
  }

  /**
   * Track a custom user event
   */
  public trackEvent(eventName: string, metadata?: Record<string, any>): void {
    if (!this.config.userActivityTracking) return;
    userActivityMonitor.trackEvent(eventName, metadata);
  }

  /**
   * Get a summary of monitoring data
   */
  public getSummary(): Record<string, any> {
    return {
      errors: this.config.errorTracking ? errorTracker.getStats() : null,
      performance: this.config.performanceTracking ? performanceMonitor.getSummary() : null,
      userActivity: this.config.userActivityTracking ? userActivityMonitor.getSummary() : null,
    };
  }
}

// Export singleton instance
export const monitoringService = MonitoringService.getInstance();

/**
 * A HOC that wraps a component with error tracking
 */
export function withMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
  
  const MonitoredComponent: React.FC<P> = (props) => {
    // Mark render start for performance monitoring
    React.useEffect(() => {
      if (!monitoringService.initialized) {
        monitoringService.initialize();
      }
      monitoringService.markStart(`render_${displayName}`);
      
      return () => {
        monitoringService.markEnd(`render_${displayName}`, { componentName: displayName });
      };
    }, []);

    try {
      return <Component {...props} />;
    } catch (error) {
      monitoringService.trackError(
        error instanceof Error ? error : new Error(String(error)),
        'high',
        { props },
        displayName
      );
      
      return (
        <div className="monitoring-error-boundary">
          <p>Component Error: {displayName}</p>
        </div>
      );
    }
  };
  
  MonitoredComponent.displayName = `WithMonitoring(${displayName})`;
  
  return MonitoredComponent;
}

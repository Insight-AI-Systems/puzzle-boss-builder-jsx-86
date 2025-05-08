
/**
 * Monitoring Service
 * Handles application monitoring and telemetry
 */

import { debugLog, DebugLevel } from '@/utils/debug';

export interface MonitoringConfig {
  enabled: boolean;
  logLevel: 'info' | 'warn' | 'error';
  includeUserData: boolean;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private isEnabled: boolean = false;
  private reportingInterval: number | null = null;
  private config: MonitoringConfig = {
    enabled: false,
    logLevel: 'warn',
    includeUserData: false
  };
  
  private constructor() {}
  
  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }
  
  /**
   * Configure the monitoring service
   */
  public configure(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
    debugLog('Monitoring', 'Monitoring service configured', DebugLevel.INFO, { config: this.config });
  }
  
  /**
   * Start collecting and reporting monitoring data
   */
  public startReporting(intervalMs: number = 30000): void {
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
    }
    
    this.isEnabled = true;
    this.reportingInterval = window.setInterval(() => {
      this.collectAndReport();
    }, intervalMs);
    
    debugLog('Monitoring', 'Monitoring reporting started', DebugLevel.INFO, {
      intervalMs,
      firstReportAt: new Date(Date.now() + intervalMs).toISOString()
    });
  }
  
  /**
   * Stop reporting monitoring data
   */
  public stopReporting(): void {
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
      this.reportingInterval = null;
    }
    
    this.isEnabled = false;
    debugLog('Monitoring', 'Monitoring reporting stopped', DebugLevel.INFO);
  }
  
  /**
   * Track a specific event
   */
  public trackEvent(eventName: string, data?: Record<string, any>): void {
    if (!this.isEnabled) return;
    
    debugLog('Monitoring', `Event tracked: ${eventName}`, DebugLevel.INFO, data);
  }
  
  /**
   * Track an error
   */
  public trackError(error: Error, severity: 'low' | 'medium' | 'high' = 'medium', context?: Record<string, any>): void {
    debugLog('Monitoring', `Error tracked: ${error.message}`, DebugLevel.ERROR, {
      error,
      severity,
      ...context
    });
  }
  
  private collectAndReport(): void {
    if (!this.isEnabled) return;
    
    // Collect key metrics
    const metrics = {
      timestamp: new Date().toISOString(),
      memory: {
        jsHeapSize: (performance as any).memory?.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory?.totalJSHeapSize
      },
      timings: {
        navigationStart: performance.timing.navigationStart,
        loadEventEnd: performance.timing.loadEventEnd,
        domComplete: performance.timing.domComplete
      }
    };
    
    debugLog('Monitoring', 'Metrics collected', DebugLevel.INFO, metrics);
  }
}

// User activity monitoring
export class UserActivityMonitor {
  private static instance: UserActivityMonitor;
  private activities: any[] = [];
  
  private constructor() {}
  
  public static getInstance(): UserActivityMonitor {
    if (!UserActivityMonitor.instance) {
      UserActivityMonitor.instance = new UserActivityMonitor();
    }
    return UserActivityMonitor.instance;
  }
  
  // Additional methods for the interface
  public getActivities(): any[] {
    return [...this.activities];
  }
  
  public getSessionInfo(): any {
    return {
      sessionId: this.generateSessionId(),
      startTime: new Date().toISOString(),
      duration: 0,
      active: true
    };
  }
  
  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// Error tracking
export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Error[] = [];
  
  private constructor() {}
  
  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }
  
  // Additional methods for the interface
  public getErrors(): Error[] {
    return [...this.errors];
  }
}

// Export hook for monitoring
export function useMonitoring() {
  return {
    trackEvent: monitoringService.trackEvent.bind(monitoringService),
    trackError: monitoringService.trackError.bind(monitoringService),
    isEnabled: monitoringService.isEnabled,
  };
}

// Export singleton instances
export const monitoringService = MonitoringService.getInstance();
export const userActivityMonitor = UserActivityMonitor.getInstance();
export const errorTracker = ErrorTracker.getInstance();

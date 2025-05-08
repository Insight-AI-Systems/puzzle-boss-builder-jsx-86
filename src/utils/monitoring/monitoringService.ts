/**
 * Central monitoring service that integrates performance, error, and user activity tracking
 */

import { performanceMonitor } from './performanceMonitor';
import { errorTracker } from './errorTracker';
import { userActivityMonitor } from './userActivityMonitor';
import { debugLog } from '../debug';

interface MonitoringConfig {
  performanceMonitoring: boolean;
  errorTracking: boolean;
  userActivityTracking: boolean;
  developerTools: boolean;
  monitoringEndpoint?: string;
  reportFrequency: number; // milliseconds
  samplingRate: number; // 0-1
}

class MonitoringService {
  private static instance: MonitoringService;
  private config: MonitoringConfig = {
    performanceMonitoring: true,
    errorTracking: true,
    userActivityTracking: true,
    developerTools: process.env.NODE_ENV === 'development',
    reportFrequency: 60000, // 1 minute
    samplingRate: 0.1 // 10% of sessions
  };
  private reportingInterval: number | null = null;
  private isEnabled = false;
  private sessionId = this.generateSessionId();
  private isDebugMode = false;
  
  private constructor() {
    // Determine if this session should be monitored based on sampling rate
    this.isEnabled = Math.random() < this.config.samplingRate;
    
    if (typeof window !== 'undefined') {
      this.setupDeveloperTools();
    }
  }
  
  /**
   * Get the singleton instance
   */
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
    
    if (this.config.performanceMonitoring) {
      performanceMonitor.configure({
        sampleRate: this.config.samplingRate,
        enableConsoleLogging: this.config.developerTools
      });
    }
    
    if (this.config.errorTracking) {
      errorTracker.configure({
        sampleRate: this.config.samplingRate,
        enableConsoleLogging: this.config.developerTools
      });
    }
    
    if (this.config.userActivityTracking) {
      userActivityMonitor.configure({
        sampleRate: this.config.samplingRate,
        enableConsoleLogging: this.config.developerTools
      });
    }
    
    // Restart reporting if needed
    this.stopReporting();
    this.startReporting();
  }
  
  /**
   * Start periodic monitoring reporting
   */
  public startReporting(): void {
    if (this.reportingInterval || !this.isEnabled) return;
    
    if (this.config.monitoringEndpoint) {
      this.reportingInterval = window.setInterval(() => {
        this.sendMonitoringData();
      }, this.config.reportFrequency);
    }
  }
  
  /**
   * Stop periodic monitoring reporting
   */
  public stopReporting(): void {
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
      this.reportingInterval = null;
    }
  }
  
  /**
   * Send monitoring data to backend
   */
  private sendMonitoringData(): void {
    if (!this.isEnabled || !this.config.monitoringEndpoint) return;
    
    const payload = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      performance: this.config.performanceMonitoring ? performanceMonitor.getSummary() : null,
      errors: this.config.errorTracking ? errorTracker.getStats() : null,
      userActivity: this.config.userActivityTracking ? userActivityMonitor.getSessionInfo() : null
    };
    
    if (this.isDebugMode) {
      debugLog('MonitoringService', 'Sending monitoring data', 0, payload);
    }
    
    // Use sendBeacon for non-blocking reporting when possible
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        this.config.monitoringEndpoint,
        JSON.stringify(payload)
      );
    } else {
      // Fallback to fetch
      fetch(this.config.monitoringEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // Use keepalive to ensure the request completes even if page unloads
        keepalive: true
      }).catch(error => {
        if (this.isDebugMode) {
          debugLog('MonitoringService', 'Failed to send monitoring data', 0, { error });
        }
      });
    }
  }
  
  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  /**
   * Set up developer tools
   */
  private setupDeveloperTools(): void {
    if (!this.config.developerTools) return;
    
    // Add global monitoring object for debugging
    if (typeof window !== 'undefined') {
      (window as any).__monitoring = {
        getPerformanceMetrics: () => performanceMonitor.getMetrics(),
        getPerformanceSummary: () => performanceMonitor.getSummary(),
        getErrors: () => errorTracker.getErrors(),
        getErrorStats: () => errorTracker.getStats(),
        getUserActivities: () => userActivityMonitor.getActivities(),
        getSessionInfo: () => userActivityMonitor.getSessionInfo(),
        exportAllData: () => ({
          performance: {
            metrics: performanceMonitor.getMetrics(),
            summary: performanceMonitor.getSummary()
          },
          errors: {
            list: errorTracker.getErrors(),
            stats: errorTracker.getStats()
          },
          userActivity: {
            activities: userActivityMonitor.getActivities(),
            session: userActivityMonitor.getSessionInfo()
          },
          sessionId: this.sessionId,
          timestamp: new Date().toISOString()
        })
      };
      
      console.info(
        'Monitoring tools available. Access via window.__monitoring in the browser console.'
      );
    }
  }
  
  /**
   * Enable debug mode
   */
  public enableDebugMode(): void {
    this.isDebugMode = true;
    debugLog('MonitoringService', 'Debug mode enabled', 0);
  }
  
  /**
   * Disable debug mode
   */
  public disableDebugMode(): void {
    this.isDebugMode = false;
  }
  
  /**
   * Create a debugging snapshot
   */
  public createDebugSnapshot(): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      performance: {
        metrics: performanceMonitor.getMetrics().slice(-50), // Last 50 metrics
        summary: performanceMonitor.getSummary()
      },
      errors: {
        recent: errorTracker.getErrors().slice(0, 20), // Most recent 20 errors
        stats: errorTracker.getStats()
      },
      userActivity: {
        recent: userActivityMonitor.getActivities().slice(-50), // Last 50 activities
        session: userActivityMonitor.getSessionInfo()
      },
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href
      }
    };
  }
}

export const monitoringService = MonitoringService.getInstance();

/**
 * React hook for using monitoring service
 */
export function useMonitoring() {
  const [isDebugMode, setIsDebugMode] = React.useState(false);
  
  const toggleDebugMode = React.useCallback(() => {
    if (isDebugMode) {
      monitoringService.disableDebugMode();
      setIsDebugMode(false);
    } else {
      monitoringService.enableDebugMode();
      setIsDebugMode(true);
    }
  }, [isDebugMode]);
  
  const createSnapshot = React.useCallback(() => {
    return monitoringService.createDebugSnapshot();
  }, []);
  
  return {
    isDebugMode,
    toggleDebugMode,
    createSnapshot
  };
}

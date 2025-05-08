
/**
 * Performance monitoring service
 */

import { debugLog, DebugLevel } from '@/utils/debug';

// Extended PerformanceEntry with additional properties
interface EnhancedPerformanceEntry extends PerformanceEntry {
  initiatorType?: string;
  transferSize?: number;
}

// Configuration interface
interface PerformanceConfig {
  enableMonitoring: boolean;
  trackNetworkRequests?: boolean;
  trackResourceTiming?: boolean;
  trackLongTasks?: boolean;
  trackMemoryUsage?: boolean;
  sampleRate?: number;
}

// Default configuration
const DEFAULT_CONFIG: PerformanceConfig = {
  enableMonitoring: true,
  trackNetworkRequests: true,
  trackResourceTiming: true,
  trackLongTasks: false, // Not supported in all browsers
  trackMemoryUsage: false, // Only in Chrome
  sampleRate: 1.0 // 100% of measurements
};

/**
 * Performance Monitor singleton class
 */
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private config: PerformanceConfig;
  private marks: Record<string, number> = {};
  private measures: Record<string, number[]> = {};
  private initialized: boolean = false;
  private longTasksObserver: any = null;
  private resourceObserver: any = null;
  
  private constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<PerformanceConfig>): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(config);
    } else if (config) {
      PerformanceMonitor.instance.configure(config);
    }
    return PerformanceMonitor.instance;
  }
  
  /**
   * Initialize the performance monitoring
   */
  private initialize(): void {
    if (this.initialized || !this.config.enableMonitoring || typeof window === 'undefined') {
      return;
    }
    
    try {
      if (this.config.trackNetworkRequests) {
        this.setupNetworkMonitoring();
      }
      
      if (this.config.trackLongTasks) {
        this.setupLongTasksMonitoring();
      }
      
      if (this.config.trackResourceTiming) {
        this.setupResourceTimingMonitoring();
      }
      
      this.initialized = true;
      debugLog('PerformanceMonitor', 'Performance monitoring initialized', DebugLevel.INFO);
    } catch (err) {
      debugLog('PerformanceMonitor', 'Error initializing performance monitoring', DebugLevel.ERROR, { error: err });
    }
  }
  
  /**
   * Update configuration
   */
  public configure(config: Partial<PerformanceConfig>): void {
    const previouslyEnabled = this.config.enableMonitoring;
    this.config = { ...this.config, ...config };
    
    // If monitoring was disabled and is now enabled, initialize
    if (!previouslyEnabled && this.config.enableMonitoring) {
      this.initialize();
    }
    
    // If tracking options have changed, update observers
    if (this.initialized && this.config.enableMonitoring) {
      if (this.config.trackLongTasks) {
        this.setupLongTasksMonitoring();
      } else {
        this.teardownLongTasksMonitoring();
      }
      
      if (this.config.trackResourceTiming) {
        this.setupResourceTimingMonitoring();
      } else {
        this.teardownResourceTimingMonitoring();
      }
      
      if (this.config.trackNetworkRequests) {
        this.setupNetworkMonitoring();
      }
    }
  }
  
  /**
   * Mark the start of a performance measurement
   */
  public markStart(markName: string): void {
    if (!this.config.enableMonitoring) return;
    
    try {
      this.marks[markName] = performance.now();
    } catch (err) {
      debugLog('PerformanceMonitor', 'Error in markStart', DebugLevel.ERROR, { 
        markName, error: err 
      });
    }
  }
  
  /**
   * Mark the end of a performance measurement
   */
  public markEnd(markName: string, metadata?: Record<string, any>): number | null {
    if (!this.config.enableMonitoring) return null;
    
    try {
      if (!this.marks[markName]) {
        debugLog('PerformanceMonitor', `No start mark found for "${markName}"`, DebugLevel.WARN);
        return null;
      }
      
      const startTime = this.marks[markName];
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Apply sampling
      if (Math.random() <= (this.config.sampleRate || 1.0)) {
        // Store measurement
        if (!this.measures[markName]) {
          this.measures[markName] = [];
        }
        this.measures[markName].push(duration);
      }
      
      // Clean up mark
      delete this.marks[markName];
      
      // Log measurement
      debugLog('PerformanceMonitor', `Performance: ${markName} took ${duration.toFixed(2)}ms`, 
        duration > 100 ? DebugLevel.WARN : DebugLevel.DEBUG, 
        { duration, ...metadata }
      );
      
      return duration;
    } catch (err) {
      debugLog('PerformanceMonitor', 'Error in markEnd', DebugLevel.ERROR, { 
        markName, error: err 
      });
      return null;
    }
  }
  
  /**
   * Set up monitoring for network requests
   */
  private setupNetworkMonitoring(): void {
    if (typeof window === 'undefined' || !window.fetch) return;
    
    try {
      // Store original fetch
      const originalFetch = window.fetch;
      
      // Override fetch
      window.fetch = async (...args) => {
        const startTime = performance.now();
        const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof URL ? args[0].href : 'unknown';
        
        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          this.recordNetworkTiming('fetch', url, startTime, endTime);
          return response;
        } catch (error) {
          const endTime = performance.now();
          this.recordNetworkTiming('fetch', url, startTime, endTime, true);
          throw error;
        }
      };
      
      debugLog('PerformanceMonitor', 'Network monitoring initialized', DebugLevel.INFO);
    } catch (err) {
      debugLog('PerformanceMonitor', 'Failed to setup network monitoring', DebugLevel.ERROR, { error: err });
    }
  }
  
  /**
   * Record network request timing
   */
  private recordNetworkTiming(
    type: string,
    url: string,
    startTime: number,
    endTime: number,
    isError = false
  ): void {
    const duration = endTime - startTime;
    
    // Apply sampling
    if (Math.random() > (this.config.sampleRate || 1.0)) return;
    
    const urlWithoutParams = url.split('?')[0];
    
    debugLog('PerformanceMonitor', 
      `${type} ${isError ? 'failed' : 'completed'}: ${urlWithoutParams} (${duration.toFixed(2)}ms)`, 
      duration > 1000 ? DebugLevel.WARN : DebugLevel.DEBUG, 
      { duration, url: urlWithoutParams, isError }
    );
    
    // In a real implementation, you might want to send this data to your analytics service
  }
  
  /**
   * Set up monitoring for long tasks
   */
  private setupLongTasksMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    if (this.longTasksObserver) return; // Already set up
    
    try {
      // @ts-ignore - PerformanceLongTaskTiming is not recognized by TypeScript
      this.longTasksObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Apply sampling
          if (Math.random() > (this.config.sampleRate || 1.0)) continue;
          
          debugLog('PerformanceMonitor', 
            `Long task detected: ${entry.duration.toFixed(2)}ms`, 
            DebugLevel.WARN, 
            { duration: entry.duration }
          );
        }
      });
      
      // @ts-ignore - 'longtask' is not recognized by TypeScript
      this.longTasksObserver.observe({ entryTypes: ['longtask'] });
      
      debugLog('PerformanceMonitor', 'Long tasks monitoring initialized', DebugLevel.INFO);
    } catch (err) {
      debugLog('PerformanceMonitor', 'Failed to setup long tasks monitoring', DebugLevel.ERROR, { error: err });
      this.longTasksObserver = null;
    }
  }
  
  /**
   * Tear down long tasks monitoring
   */
  private teardownLongTasksMonitoring(): void {
    if (this.longTasksObserver) {
      try {
        this.longTasksObserver.disconnect();
        this.longTasksObserver = null;
      } catch (err) {
        debugLog('PerformanceMonitor', 'Error disconnecting long tasks observer', DebugLevel.ERROR, { error: err });
      }
    }
  }
  
  /**
   * Set up resource timing monitoring
   */
  private setupResourceTimingMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    if (this.resourceObserver) return; // Already set up
    
    try {
      this.resourceObserver = new PerformanceObserver((entryList) => {
        for (const perfEntry of entryList.getEntries()) {
          // Apply sampling
          if (Math.random() > (this.config.sampleRate || 1.0)) continue;
          
          // Cast to our enhanced interface
          const entry = perfEntry as EnhancedPerformanceEntry;
          
          // Only log resources that take longer than 500ms or are larger than 1MB
          if (entry.duration > 500 || (entry.transferSize && entry.transferSize > 1000000)) {
            debugLog('PerformanceMonitor', 
              `Slow resource load: ${entry.name.split('?')[0]} (${entry.duration.toFixed(2)}ms)`, 
              DebugLevel.WARN, 
              { 
                duration: entry.duration,
                size: entry.transferSize,
                type: entry.initiatorType || 'unknown'
              }
            );
          }
        }
      });
      
      this.resourceObserver.observe({ entryTypes: ['resource'] });
      
      debugLog('PerformanceMonitor', 'Resource timing monitoring initialized', DebugLevel.INFO);
    } catch (err) {
      debugLog('PerformanceMonitor', 'Failed to setup resource timing monitoring', DebugLevel.ERROR, { error: err });
      this.resourceObserver = null;
    }
  }
  
  /**
   * Tear down resource timing monitoring
   */
  private teardownResourceTimingMonitoring(): void {
    if (this.resourceObserver) {
      try {
        this.resourceObserver.disconnect();
        this.resourceObserver = null;
      } catch (err) {
        debugLog('PerformanceMonitor', 'Error disconnecting resource observer', DebugLevel.ERROR, { error: err });
      }
    }
  }
  
  /**
   * Get summary of performance measurements
   */
  public getSummary() {
    // Calculate stats for each measure
    const measureStats = Object.keys(this.measures).reduce((acc, key) => {
      const values = this.measures[key];
      if (!values || values.length === 0) {
        acc[key] = { count: 0, avg: 0, min: 0, max: 0 };
        return acc;
      }
      
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      acc[key] = { count: values.length, avg, min, max };
      return acc;
    }, {} as Record<string, { count: number, avg: number, min: number, max: number }>);
    
    return {
      measures: measureStats,
      marks: Object.keys(this.marks).length > 0 ? this.marks : undefined
    };
  }
  
  /**
   * Clear all performance data
   */
  public clearMeasurements(): void {
    this.marks = {};
    this.measures = {};
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

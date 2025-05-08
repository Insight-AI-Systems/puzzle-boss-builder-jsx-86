/**
 * Performance monitoring system for tracking application performance
 */

import { debugLog, DebugLevel } from '@/utils/debug';

// Define interfaces for performance monitoring
interface PerformanceDataPoint {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  entryType: string;
  initiatorType?: string;
  transferSize?: number;
}

interface PerformanceMeasurement {
  name: string;
  startTime: number;
  endTime: number | null;
  duration: number | null;
  metadata?: Record<string, any>;
  completed: boolean;
}

interface MemoryUsage {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  timestamp: number;
}

interface PerformanceMonitorConfig {
  enableMonitoring: boolean;
  trackNetworkRequests: boolean;
  trackLongTasks: boolean;
  trackResourceTiming: boolean;
  trackMemoryUsage: boolean;
  sampleRate: number; // 0.0 to 1.0
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, PerformanceMeasurement> = new Map();
  private dataPoints: PerformanceDataPoint[] = [];
  private memoryUsage: MemoryUsage[] = [];
  private networkRequests: any[] = [];
  private resourceLoads: any[] = [];
  private longTasks: any[] = [];
  private maxDataPoints = 1000;
  private memoryInterval: number | null = null;
  private config: PerformanceMonitorConfig = {
    enableMonitoring: true,
    trackNetworkRequests: true,
    trackLongTasks: false,
    trackResourceTiming: true,
    trackMemoryUsage: false,
    sampleRate: 1.0,
  };

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupPerformanceObservers();
    }
  }

  /**
   * Get singleton instance of PerformanceMonitor
   */
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Configure the performance monitor
   */
  public configure(config: Partial<PerformanceMonitorConfig>): void {
    this.config = { ...this.config, ...config };

    // Clear memory monitoring interval if it exists
    if (this.memoryInterval) {
      window.clearInterval(this.memoryInterval);
      this.memoryInterval = null;
    }

    // If monitoring is enabled and memory tracking is requested
    if (this.config.enableMonitoring && this.config.trackMemoryUsage) {
      this.startMemoryMonitoring();
    }

    // Reset performance observers based on new configuration
    this.setupPerformanceObservers();
  }

  /**
   * Start tracking memory usage
   */
  private startMemoryMonitoring(): void {
    // Check if performance.memory is available (Chrome only)
    const performance = window.performance as any;
    if (performance && performance.memory) {
      this.memoryInterval = window.setInterval(() => {
        if (Math.random() > this.config.sampleRate) return; // Sample based on rate

        this.memoryUsage.push({
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          timestamp: Date.now(),
        });

        // Keep memory usage array from growing too large
        if (this.memoryUsage.length > 100) {
          this.memoryUsage = this.memoryUsage.slice(-100);
        }
      }, 30000); // Check every 30 seconds
    }
  }

  /**
   * Setup performance observers
   */
  private setupPerformanceObservers(): void {
    // Only proceed if in browser and monitoring is enabled
    if (typeof window === 'undefined' || !this.config.enableMonitoring) return;

    try {
      // Reset existing observers (if any)
      this.networkRequests = [];
      this.resourceLoads = [];
      this.longTasks = [];

      // Resource timing for network requests
      if (this.config.trackNetworkRequests && window.PerformanceObserver) {
        try {
          const networkObserver = new PerformanceObserver((list) => {
            if (Math.random() > this.config.sampleRate) return; // Sample based on rate

            const entries = list.getEntries().filter(entry => {
              // We'll treat these as network requests
              const entry2 = entry as unknown as { initiatorType?: string };
              return entry2.initiatorType === 'fetch' || entry2.initiatorType === 'xmlhttprequest';
            });

            entries.forEach(entry => {
              const customEntry = {
                name: entry.name,
                startTime: entry.startTime,
                duration: entry.duration,
                entryType: entry.entryType,
              };
              this.networkRequests.push(customEntry);
            });

            // Keep array from growing too large
            if (this.networkRequests.length > 100) {
              this.networkRequests = this.networkRequests.slice(-100);
            }
          });
          
          networkObserver.observe({ entryTypes: ['resource'] });
        } catch (e) {
          debugLog('PerformanceMonitor', 'Failed to create network observer', DebugLevel.ERROR, { error: e });
        }
      }

      // Resource timing for other resources (images, scripts, etc.)
      if (this.config.trackResourceTiming && window.PerformanceObserver) {
        try {
          const resourceObserver = new PerformanceObserver((list) => {
            if (Math.random() > this.config.sampleRate) return; // Sample based on rate

            const entries = list.getEntries().filter(entry => {
              // Only track non-network resources
              const entry2 = entry as unknown as { initiatorType?: string; transferSize?: number };
              return entry2.initiatorType !== 'fetch' && entry2.initiatorType !== 'xmlhttprequest';
            });

            entries.forEach(entry => {
              const entry2 = entry as unknown as { initiatorType?: string; transferSize?: number };
              
              const customEntry = {
                name: entry.name,
                startTime: entry.startTime,
                duration: entry.duration,
                entryType: entry.entryType,
                initiatorType: entry2.initiatorType || 'unknown',
                transferSize: entry2.transferSize || 0,
              };
              this.resourceLoads.push(customEntry);
            });

            // Keep array from growing too large
            if (this.resourceLoads.length > 100) {
              this.resourceLoads = this.resourceLoads.slice(-100);
            }
          });
          
          resourceObserver.observe({ entryTypes: ['resource'] });
        } catch (e) {
          debugLog('PerformanceMonitor', 'Failed to create resource observer', DebugLevel.ERROR, { error: e });
        }
      }

      // Long tasks
      if (this.config.trackLongTasks && window.PerformanceObserver) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            if (Math.random() > this.config.sampleRate) return; // Sample based on rate

            const entries = list.getEntries();
            entries.forEach(entry => {
              const customEntry = {
                name: entry.name,
                startTime: entry.startTime,
                duration: entry.duration,
                entryType: entry.entryType,
              };
              this.longTasks.push(customEntry);
              
              // Report long tasks over 100ms
              if (entry.duration > 100) {
                debugLog('PerformanceMonitor', `Long task detected: ${entry.duration.toFixed(2)}ms`, DebugLevel.WARN, {
                  name: entry.name,
                  duration: entry.duration,
                });
              }
            });

            // Keep array from growing too large
            if (this.longTasks.length > 50) {
              this.longTasks = this.longTasks.slice(-50);
            }
          });
          
          longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          // Some browsers don't support longtask yet
          debugLog('PerformanceMonitor', 'Long task observation not supported', DebugLevel.INFO);
        }
      }

    } catch (err) {
      debugLog('PerformanceMonitor', 'Error setting up performance observers', DebugLevel.ERROR, { error: err });
    }
  }

  /**
   * Mark the start of a performance measurement
   */
  public markStart(name: string): void {
    if (!this.config.enableMonitoring) return;

    // Create or update a measurement
    const now = performance.now();
    this.measurements.set(name, {
      name,
      startTime: now,
      endTime: null,
      duration: null,
      completed: false,
    });

    if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
      try {
        performance.mark(`${name}_start`);
      } catch (e) {
        // Ignore errors from performance marking
      }
    }
  }

  /**
   * Mark the end of a performance measurement
   * @returns The duration in ms, or null if the start mark wasn't found
   */
  public markEnd(name: string, metadata?: Record<string, any>): number | null {
    if (!this.config.enableMonitoring) return null;
    if (Math.random() > this.config.sampleRate) return null; // Sample based on rate

    const measurement = this.measurements.get(name);
    if (!measurement) {
      debugLog('PerformanceMonitor', `End mark called for "${name}" without a start mark`, DebugLevel.WARN);
      return null;
    }

    const now = performance.now();
    const duration = now - measurement.startTime;

    // Update the measurement
    measurement.endTime = now;
    measurement.duration = duration;
    measurement.completed = true;
    measurement.metadata = metadata;
    this.measurements.set(name, measurement);

    // Add to datapoints for historical analysis
    this.addDataPoint(name, duration, metadata);

    if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
      try {
        performance.mark(`${name}_end`);
        performance.measure(name, `${name}_start`, `${name}_end`);
      } catch (e) {
        // Ignore errors from performance marking
      }
    }

    return duration;
  }

  /**
   * Add a performance data point
   */
  private addDataPoint(name: string, value: number, metadata?: Record<string, any>): void {
    this.dataPoints.push({
      name,
      value,
      timestamp: Date.now(),
      metadata,
    });

    // Prevent the array from growing too large
    if (this.dataPoints.length > this.maxDataPoints) {
      this.dataPoints = this.dataPoints.slice(-this.maxDataPoints);
    }
  }

  /**
   * Get a summary of performance data
   */
  public getSummary(): Record<string, any> {
    const measurements: Record<string, number> = {};
    let completeCount = 0;
    let incompleteCount = 0;

    this.measurements.forEach((m) => {
      if (m.completed && m.duration !== null) {
        measurements[m.name] = m.duration;
        completeCount++;
      } else {
        incompleteCount++;
      }
    });

    return {
      measurements,
      completeCount,
      incompleteCount,
      networkRequestCount: this.networkRequests.length,
      resourceLoadCount: this.resourceLoads.length,
      longTaskCount: this.longTasks.length,
      memoryUsageSamples: this.memoryUsage.length,
      trackingEnabled: this.config.enableMonitoring,
    };
  }

  /**
   * Get all performance data points
   */
  public getDataPoints(name?: string): PerformanceDataPoint[] {
    if (name) {
      return this.dataPoints.filter(dp => dp.name === name);
    }
    return [...this.dataPoints];
  }

  /**
   * Get all network requests
   */
  public getNetworkRequests(): any[] {
    return [...this.networkRequests];
  }

  /**
   * Get all resource loads
   */
  public getResourceLoads(): any[] {
    return [...this.resourceLoads];
  }

  /**
   * Get all long tasks
   */
  public getLongTasks(): any[] {
    return [...this.longTasks];
  }

  /**
   * Get memory usage data
   */
  public getMemoryUsage(): MemoryUsage[] {
    return [...this.memoryUsage];
  }

  /**
   * Clear all performance data
   */
  public clearData(): void {
    this.measurements.clear();
    this.dataPoints = [];
    this.networkRequests = [];
    this.resourceLoads = [];
    this.longTasks = [];
    this.memoryUsage = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

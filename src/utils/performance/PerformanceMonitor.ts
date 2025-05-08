
/**
 * Performance Monitor
 * 
 * Utility for tracking performance metrics, mark points, and navigation timing
 */

export interface PerformanceMonitor {
  /**
   * Mark the start of a performance measurement
   * @param name - Unique identifier for the mark
   */
  markStart: (name: string) => void;
  
  /**
   * Mark the end of a performance measurement and calculate duration
   * @param name - The identifier used in markStart
   * @returns Duration in milliseconds
   */
  markEnd: (name: string) => number;
  
  /**
   * Record a specific performance metric with a value
   * @param metricName - Name of the metric to record
   * @param value - Value to record
   * @param tags - Optional tags for the metric
   */
  recordMetric: (metricName: string, value: number, tags?: Record<string, string>) => void;
  
  /**
   * Get all currently stored performance marks
   */
  getMarks: () => Record<string, { start?: number; end?: number; duration?: number }>;
  
  /**
   * Get all recorded metrics
   */
  getMetrics: () => Record<string, { value: number; timestamp: number; tags?: Record<string, string> }[]>;
  
  /**
   * Clear all stored marks
   */
  clearMarks: () => void;
  
  /**
   * Clear all recorded metrics
   */
  clearMetrics: () => void;
  
  /**
   * Get navigation timing metrics from the browser
   */
  getNavigationTiming: () => Record<string, number> | null;
  
  /**
   * Get a summary of performance metrics
   */
  getSummary: () => any;
}

class PerformanceMonitorImpl implements PerformanceMonitor {
  private marks: Record<string, { start?: number; end?: number; duration?: number }> = {};
  private metrics: Record<string, { value: number; timestamp: number; tags?: Record<string, string> }[]> = {};
  
  constructor() {
    // Initialize with empty marks and metrics
    this.marks = {};
    this.metrics = {};
  }
  
  public markStart(name: string): void {
    this.marks[name] = {
      ...this.marks[name],
      start: performance.now()
    };
  }
  
  public markEnd(name: string): number {
    if (!this.marks[name] || this.marks[name].start === undefined) {
      console.warn(`No start mark found for "${name}"`);
      return 0;
    }
    
    const end = performance.now();
    const duration = end - (this.marks[name].start || 0);
    
    this.marks[name] = {
      ...this.marks[name],
      end,
      duration
    };
    
    return duration;
  }
  
  public recordMetric(metricName: string, value: number, tags?: Record<string, string>): void {
    if (!this.metrics[metricName]) {
      this.metrics[metricName] = [];
    }
    
    this.metrics[metricName].push({
      value,
      timestamp: performance.now(),
      tags
    });
  }
  
  public getMarks(): Record<string, { start?: number; end?: number; duration?: number }> {
    return { ...this.marks };
  }
  
  public getMetrics(): Record<string, { value: number; timestamp: number; tags?: Record<string, string> }[]> {
    return { ...this.metrics };
  }
  
  public clearMarks(): void {
    this.marks = {};
  }
  
  public clearMetrics(): void {
    this.metrics = {};
  }
  
  public getNavigationTiming(): Record<string, number> | null {
    if (typeof window === 'undefined' || !window.performance || !window.performance.timing) {
      return null;
    }
    
    const timing = window.performance.timing;
    
    return {
      // Time to first byte
      ttfb: timing.responseStart - timing.navigationStart,
      
      // DOM load time
      domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
      
      // Page load time
      pageLoad: timing.loadEventEnd - timing.navigationStart,
      
      // DNS resolution time
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      
      // TCP connection time
      tcp: timing.connectEnd - timing.connectStart,
      
      // Request time
      request: timing.responseEnd - timing.requestStart,
      
      // Response time
      response: timing.responseEnd - timing.responseStart,
      
      // DOM processing time
      domProcessing: timing.domComplete - timing.domLoading,
      
      // Unload event time
      unload: timing.unloadEventEnd - timing.unloadEventStart,
    };
  }
  
  public getSummary(): any {
    // Calculate overall stats
    const allMetrics = Object.values(this.metrics).flat();
    const totalCount = allMetrics.length;
    
    if (totalCount === 0) {
      return {
        overallAverage: 0,
        totalCount: 0,
        byName: {}
      };
    }
    
    const overallTotal = allMetrics.reduce((sum, metric) => sum + metric.value, 0);
    const overallAverage = overallTotal / totalCount;
    
    // Calculate stats by metric name
    const byName: Record<string, { count: number; avg: number; min: number; max: number }> = {};
    
    for (const [name, metrics] of Object.entries(this.metrics)) {
      if (metrics.length === 0) continue;
      
      const values = metrics.map(m => m.value);
      const total = values.reduce((sum, val) => sum + val, 0);
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      byName[name] = {
        count: metrics.length,
        avg: total / metrics.length,
        min,
        max
      };
    }
    
    return {
      overallAverage,
      totalCount,
      byName
    };
  }
}

// Export a singleton instance
export const performanceMonitor: PerformanceMonitor = new PerformanceMonitorImpl();

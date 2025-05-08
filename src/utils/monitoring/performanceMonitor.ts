
/**
 * Performance monitoring system for tracking application performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface PerformanceConfig {
  sampleRate: number;
  maxMetrics: number;
  enableConsoleLogging: boolean;
  enableNetworkTiming: boolean;
  slowThreshold: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private config: PerformanceConfig = {
    sampleRate: 0.1, // Only record 10% of metrics by default 
    maxMetrics: 1000, // Maximum number of metrics to store
    enableConsoleLogging: process.env.NODE_ENV === 'development',
    enableNetworkTiming: true,
    slowThreshold: 300 // milliseconds
  };
  
  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupPerformanceObservers();
    }
  }
  
  /**
   * Get the singleton instance
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
  public configure(config: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Record a performance metric
   */
  public recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    if (Math.random() > this.config.sampleRate) {
      return; // Skip recording based on sample rate
    }
    
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags
    };
    
    this.metrics.push(metric);
    
    // Trim metrics if we have too many
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }
    
    // Log to console if enabled
    if (this.config.enableConsoleLogging) {
      if (value > this.config.slowThreshold) {
        console.warn(`Slow performance detected - ${name}: ${value}ms`, tags);
      } else {
        console.debug(`Performance metric - ${name}: ${value}ms`, tags);
      }
    }
  }
  
  /**
   * Time a function execution and record as a metric
   */
  public async timeAsync<T>(
    name: string, 
    fn: () => Promise<T>, 
    tags?: Record<string, string>
  ): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, tags);
    }
  }
  
  /**
   * Time a synchronous function execution and record as a metric
   */
  public timeSync<T>(
    name: string, 
    fn: () => T, 
    tags?: Record<string, string>
  ): T {
    const start = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, tags);
    }
  }
  
  /**
   * Mark the start of a performance measurement
   */
  public markStart(name: string): void {
    performance.mark(`${name}-start`);
  }
  
  /**
   * Mark the end of a performance measurement and record the metric
   */
  public markEnd(name: string, tags?: Record<string, string>): void {
    const markName = `${name}-start`;
    
    try {
      performance.mark(`${name}-end`);
      performance.measure(name, markName, `${name}-end`);
      
      const entries = performance.getEntriesByName(name);
      if (entries.length > 0) {
        this.recordMetric(name, entries[entries.length - 1].duration, tags);
      }
      
      // Clear the marks and measures
      performance.clearMarks(markName);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);
    } catch (error) {
      console.error(`Error measuring performance for ${name}:`, error);
    }
  }
  
  /**
   * Get all recorded metrics
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
  
  /**
   * Get metrics for a specific name
   */
  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }
  
  /**
   * Clear all metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
  }
  
  /**
   * Set up performance observers
   */
  private setupPerformanceObservers(): void {
    if (!window.PerformanceObserver) {
      return;
    }
    
    // Track resource timing for network requests
    if (this.config.enableNetworkTiming) {
      try {
        const resourceObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          
          entries.forEach(entry => {
            if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
              const url = new URL(entry.name);
              
              // Only record API-related requests
              if (url.pathname.includes('/api/') || url.pathname.includes('/functions/')) {
                this.recordMetric(`network:${url.pathname}`, entry.duration, {
                  type: entry.initiatorType,
                  size: entry.transferSize?.toString() || 'unknown',
                  protocol: url.protocol
                });
              }
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.error('Failed to set up resource timing observer:', error);
      }
    }
    
    // Track long tasks (potential UI freezes)
    try {
      const longTaskObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          this.recordMetric('long-task', entry.duration, {
            attribution: 'Unknown',
            startTime: entry.startTime.toString()
          });
        });
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.debug('Long task observer not supported:', error);
    }
  }
  
  /**
   * Get a performance summary
   */
  public getSummary(): { 
    overallAverage: number; 
    byName: Record<string, { avg: number; min: number; max: number; count: number }>
  } {
    const summary: Record<string, { sum: number; min: number; max: number; count: number }> = {};
    let totalSum = 0;
    let totalCount = 0;
    
    for (const metric of this.metrics) {
      if (!summary[metric.name]) {
        summary[metric.name] = { sum: 0, min: Infinity, max: -Infinity, count: 0 };
      }
      
      summary[metric.name].sum += metric.value;
      summary[metric.name].min = Math.min(summary[metric.name].min, metric.value);
      summary[metric.name].max = Math.max(summary[metric.name].max, metric.value);
      summary[metric.name].count++;
      
      totalSum += metric.value;
      totalCount++;
    }
    
    const result: { 
      overallAverage: number; 
      byName: Record<string, { avg: number; min: number; max: number; count: number }> 
    } = {
      overallAverage: totalCount > 0 ? totalSum / totalCount : 0,
      byName: {}
    };
    
    for (const [name, data] of Object.entries(summary)) {
      result.byName[name] = {
        avg: data.sum / data.count,
        min: data.min === Infinity ? 0 : data.min,
        max: data.max === -Infinity ? 0 : data.max,
        count: data.count
      };
    }
    
    return result;
  }
  
  /**
   * Export performance data to JSON
   */
  public exportToJson(): string {
    return JSON.stringify({
      metrics: this.metrics,
      summary: this.getSummary(),
      timestamp: new Date().toISOString()
    }, null, 2);
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

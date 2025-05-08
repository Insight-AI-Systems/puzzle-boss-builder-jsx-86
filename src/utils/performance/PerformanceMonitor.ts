
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Performance Monitoring
 * Tracks performance metrics for the application
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Record<string, number[]> = {};
  private enabled: boolean = true;
  
  private constructor() {}
  
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  /**
   * Record a performance metric
   */
  public recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    if (!this.enabled) return;
    
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    
    this.metrics[name].push(value);
    
    // Log performance metric if it exceeds threshold
    if (value > 1000) {
      debugLog('Performance', `${name} took ${value}ms`, DebugLevel.WARN, { value, ...(tags || {}) });
    }
  }
  
  /**
   * Mark the start of a performance measurement
   */
  public markStart(name: string): void {
    if (!this.enabled) return;
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }
  
  /**
   * Mark the end of a performance measurement and record the result
   */
  public markEnd(name: string): void {
    if (!this.enabled || typeof performance === 'undefined') return;
    
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;
    
    try {
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);
      
      const entries = performance.getEntriesByName(name, 'measure');
      if (entries.length > 0) {
        this.recordMetric(name, entries[0].duration);
      }
      
      // Clean up marks
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(name);
    } catch (e) {
      console.error('Error measuring performance:', e);
    }
  }
  
  /**
   * Get metrics for a specific name
   */
  public getMetrics(name: string): number[] {
    return this.metrics[name] || [];
  }
  
  /**
   * Get average for a specific metric
   */
  public getAverageMetric(name: string): number | null {
    const values = this.metrics[name];
    if (!values || values.length === 0) return null;
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }
  
  /**
   * Enable or disable performance monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  /**
   * Reset all metrics
   */
  public resetMetrics(): void {
    this.metrics = {};
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

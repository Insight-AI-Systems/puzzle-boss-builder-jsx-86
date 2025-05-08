
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
  public recordMetric(name: string, value: number): void {
    if (!this.enabled) return;
    
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    
    this.metrics[name].push(value);
    
    // Log performance metric if it exceeds threshold
    if (value > 1000) {
      debugLog('Performance', `${name} took ${value}ms`, DebugLevel.WARN, { value });
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

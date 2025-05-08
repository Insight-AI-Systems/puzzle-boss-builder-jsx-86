
import { useState, useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '@/utils/performance/PerformanceMonitor';

interface PerformanceOptions {
  componentName: string;
  trackRenders?: boolean;
  trackEffects?: boolean;
  trackCallbacks?: boolean;
  includeProps?: boolean;
}

export function usePerformanceMonitoring({
  componentName,
  trackRenders = true,
  trackEffects = false,
  trackCallbacks = false,
  includeProps = false
}: PerformanceOptions) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const effectStartTime = useRef<number | null>(null);
  const [isSlowRender, setIsSlowRender] = useState(false);
  const props = useRef<Record<string, any> | null>(null);
  
  // Set props reference if includeProps is true
  const setProps = useCallback((newProps: Record<string, any>) => {
    if (includeProps) {
      props.current = { ...newProps };
    }
  }, [includeProps]);
  
  // Measure render time
  useEffect(() => {
    if (!trackRenders) return;
    
    renderCount.current++;
    const renderTime = performance.now() - lastRenderTime.current;
    lastRenderTime.current = performance.now();
    
    // Report slow renders (over 16ms which is roughly 60fps threshold)
    if (renderTime > 16) {
      setIsSlowRender(true);
      // Use safe access to monitor
      if (performanceMonitor && typeof performanceMonitor.recordMetric === 'function') {
        performanceMonitor.recordMetric(`component:${componentName}:slow-render`, renderTime, {
          renderCount: renderCount.current.toString(),
          props: includeProps ? JSON.stringify(props.current) : undefined
        });
      }
    } else {
      setIsSlowRender(false);
      // Use safe access to monitor
      if (performanceMonitor && typeof performanceMonitor.recordMetric === 'function') {
        performanceMonitor.recordMetric(`component:${componentName}:render`, renderTime, {
          renderCount: renderCount.current.toString()
        });
      }
    }
  });
  
  // Measure effect duration
  useEffect(() => {
    if (!trackEffects) return;
    
    effectStartTime.current = performance.now();
    
    return () => {
      if (effectStartTime.current) {
        const effectDuration = performance.now() - effectStartTime.current;
        // Use safe access to monitor
        if (performanceMonitor && typeof performanceMonitor.recordMetric === 'function') {
          performanceMonitor.recordMetric(`component:${componentName}:effect`, effectDuration);
        }
      }
    };
  }, [componentName, trackEffects]);
  
  // Create tracked callback
  const createTrackedCallback = useCallback(<T extends (...args: any[]) => any>(
    name: string,
    callback: T
  ): T => {
    if (!trackCallbacks) return callback;
    
    const trackedFn = ((...args: any[]) => {
      const start = performance.now();
      const result = callback(...args);
      
      // Handle both synchronous and Promise-returning callbacks
      if (result instanceof Promise) {
        return result.then(value => {
          const duration = performance.now() - start;
          // Use safe access to monitor
          if (performanceMonitor && typeof performanceMonitor.recordMetric === 'function') {
            performanceMonitor.recordMetric(`component:${componentName}:callback:${name}`, duration);
          }
          return value;
        }).catch(err => {
          const duration = performance.now() - start;
          // Use safe access to monitor
          if (performanceMonitor && typeof performanceMonitor.recordMetric === 'function') {
            performanceMonitor.recordMetric(`component:${componentName}:callback-error:${name}`, duration);
          }
          throw err;
        });
      } else {
        const duration = performance.now() - start;
        // Use safe access to monitor
        if (performanceMonitor && typeof performanceMonitor.recordMetric === 'function') {
          performanceMonitor.recordMetric(`component:${componentName}:callback:${name}`, duration);
        }
        return result;
      }
    }) as T;
    
    return trackedFn;
  }, [componentName, trackCallbacks]);
  
  return {
    isSlowRender,
    renderCount: renderCount.current,
    setProps,
    createTrackedCallback
  };
}

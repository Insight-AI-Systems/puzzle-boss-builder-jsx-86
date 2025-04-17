import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  warningThreshold?: number;
  criticalThreshold?: number;
  reportToAnalytics?: boolean;
  showMemory?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = process.env.NODE_ENV === 'development', 
  position = 'bottom-right',
  warningThreshold = 30,
  criticalThreshold = 15,
  reportToAnalytics = false,
  showMemory = true
}) => {
  const [fps, setFps] = useState<number>(0);
  const [memory, setMemory] = useState<string>('N/A');
  const [averageFps, setAverageFps] = useState<number>(0);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const framesRef = useRef<number>(0);
  const fpsHistoryRef = useRef<number[]>([]);
  const warningShownRef = useRef<boolean>(false);
  
  // Only show in development mode or if explicitly enabled
  if (!enabled) return null;

  useEffect(() => {
    const measureFps = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      framesRef.current++;
      
      // Update FPS every 500ms
      if (delta >= 500) {
        const currentFps = Math.round((framesRef.current * 1000) / delta);
        setFps(currentFps);
        
        // Store in history for averages (keep last 10 readings)
        fpsHistoryRef.current.push(currentFps);
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift();
        }
        
        // Calculate average FPS
        const avgFps = fpsHistoryRef.current.reduce((sum, val) => sum + val, 0) / 
                       fpsHistoryRef.current.length;
        setAverageFps(Math.round(avgFps));
        
        // Check for performance issues
        if (currentFps < criticalThreshold && !warningShownRef.current) {
          toast({
            title: "Performance Warning",
            description: `Low frame rate detected (${currentFps} FPS). This may affect gameplay.`,
            variant: "destructive"
          });
          warningShownRef.current = true;
          
          // Reset warning after 10 seconds
          setTimeout(() => {
            warningShownRef.current = false;
          }, 10000);
          
          // Send analytics if enabled
          if (reportToAnalytics) {
            sendPerformanceMetric('critical_fps_drop', { fps: currentFps });
          }
        }
        
        framesRef.current = 0;
        lastTimeRef.current = now;
        
        // Memory usage reporting (if available)
        if (showMemory && window.performance && 'memory' in window.performance) {
          const memory = (window.performance as any).memory;
          if (memory && memory.usedJSHeapSize) {
            const usedMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
            const totalMB = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
            setMemory(`${usedMB}MB / ${totalMB}MB`);
            
            // Report high memory usage
            if (usedMB > totalMB * 0.8 && reportToAnalytics) {
              sendPerformanceMetric('high_memory_usage', { 
                usedMB, 
                totalMB,
                percentage: Math.round((usedMB / totalMB) * 100)
              });
            }
          }
        }
      }
      
      frameRef.current = requestAnimationFrame(measureFps);
    };
    
    frameRef.current = requestAnimationFrame(measureFps);
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [criticalThreshold, reportToAnalytics, showMemory]);
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1',
    'bottom-left': 'bottom-1 left-1',
    'bottom-right': 'bottom-1 right-1'
  };
  
  // Analytics function
  const sendPerformanceMetric = (metricName: string, data: Record<string, any>) => {
    // This would connect to your analytics service
    console.log(`[Analytics] ${metricName}:`, data);
    
    // Example implementation with navigator.sendBeacon for non-blocking analytics
    if (navigator.sendBeacon) {
      try {
        const analyticsEndpoint = '/api/analytics'; // Replace with your endpoint
        const payload = {
          event: metricName,
          timestamp: new Date().toISOString(),
          data: data,
          url: window.location.pathname,
          userAgent: navigator.userAgent
        };
        
        // In a production environment, you would uncomment this
        // navigator.sendBeacon(analyticsEndpoint, JSON.stringify(payload));
      } catch (error) {
        console.error('Failed to send analytics:', error);
      }
    }
  };
  
  return (
    <div 
      className={`fixed ${positionClasses[position]} bg-black/80 text-white p-2 text-xs rounded-md z-50 font-mono min-w-[120px]`}
    >
      <div className={fps < criticalThreshold ? 'text-red-400' : fps < warningThreshold ? 'text-yellow-400' : 'text-green-400'}>
        FPS: {fps}
      </div>
      <div className="text-blue-400">
        Avg FPS: {averageFps}
      </div>
      {showMemory && (
        <div className="text-purple-400">
          Memory: {memory}
        </div>
      )}
      <div className="text-xs text-gray-400 mt-1">
        {process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'}
      </div>
    </div>
  );
};

export default PerformanceMonitor;

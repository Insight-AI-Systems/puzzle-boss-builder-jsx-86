
import React, { useState, useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = process.env.NODE_ENV === 'development', 
  position = 'bottom-right' 
}) => {
  const [fps, setFps] = useState<number>(0);
  const [memory, setMemory] = useState<string>('N/A');
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const framesRef = useRef<number>(0);
  
  // Only show in development mode or if explicitly enabled
  if (!enabled) return null;

  useEffect(() => {
    const measureFps = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      framesRef.current++;
      
      // Update FPS every 500ms
      if (delta >= 500) {
        setFps(Math.round((framesRef.current * 1000) / delta));
        framesRef.current = 0;
        lastTimeRef.current = now;
        
        // Memory usage reporting (if available)
        if (window.performance && 'memory' in window.performance) {
          const memory = (window.performance as any).memory;
          if (memory && memory.usedJSHeapSize) {
            const usedMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
            const totalMB = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
            setMemory(`${usedMB}MB / ${totalMB}MB`);
          }
        }
      }
      
      frameRef.current = requestAnimationFrame(measureFps);
    };
    
    frameRef.current = requestAnimationFrame(measureFps);
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1',
    'bottom-left': 'bottom-1 left-1',
    'bottom-right': 'bottom-1 right-1'
  };
  
  return (
    <div 
      className={`fixed ${positionClasses[position]} bg-black/80 text-white p-2 text-xs rounded-md z-50 font-mono`}
    >
      <div className={fps < 30 ? 'text-red-400' : fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
        FPS: {fps}
      </div>
      <div className="text-blue-400">
        Memory: {memory}
      </div>
    </div>
  );
};

export default PerformanceMonitor;

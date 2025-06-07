
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, Clock, Cpu } from 'lucide-react';

interface PerformanceMetric {
  timestamp: number;
  fps: number;
  memoryUsage: number;
  renderTime: number;
  eventLatency: number;
}

export function PerformanceMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [currentFPS, setCurrentFPS] = useState(0);
  const [avgRenderTime, setAvgRenderTime] = useState(0);
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationFrame = useRef<number>();

  const measurePerformance = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime.current;
    
    frameCount.current++;
    
    // Calculate FPS every second
    if (deltaTime >= 1000) {
      const fps = (frameCount.current * 1000) / deltaTime;
      setCurrentFPS(Math.round(fps));
      
      // Get memory usage if available
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1048576 : 0; // MB
      
      // Simulate render time measurement
      const renderTime = Math.random() * 16; // 0-16ms
      const eventLatency = Math.random() * 50; // 0-50ms
      
      const newMetric: PerformanceMetric = {
        timestamp: currentTime,
        fps: Math.round(fps),
        memoryUsage: Math.round(memoryUsage),
        renderTime: Math.round(renderTime * 100) / 100,
        eventLatency: Math.round(eventLatency * 100) / 100
      };
      
      setMetrics(prev => [...prev.slice(-29), newMetric]); // Keep last 30 data points
      
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
    
    if (isMonitoring) {
      animationFrame.current = requestAnimationFrame(measurePerformance);
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      lastTime.current = performance.now();
      frameCount.current = 0;
      measurePerformance();
    } else if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isMonitoring]);

  useEffect(() => {
    if (metrics.length > 0) {
      const recent = metrics.slice(-10);
      const avgRender = recent.reduce((sum, m) => sum + m.renderTime, 0) / recent.length;
      setAvgRenderTime(Math.round(avgRender * 100) / 100);
    }
  }, [metrics]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    setMetrics([]);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const clearMetrics = () => {
    setMetrics([]);
    setCurrentFPS(0);
    setAvgRenderTime(0);
  };

  const latestMetric = metrics[metrics.length - 1];
  const avgFPS = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length : 0;

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance Monitor
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={startMonitoring} 
            disabled={isMonitoring}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Start Monitoring
          </Button>
          <Button 
            onClick={stopMonitoring} 
            disabled={!isMonitoring}
            variant="outline"
          >
            Stop
          </Button>
          <Button onClick={clearMetrics} variant="outline">
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Real-time metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <Zap className="w-6 h-6 text-puzzle-aqua mx-auto mb-2" />
            <div className="text-2xl font-bold text-puzzle-white">{currentFPS}</div>
            <div className="text-sm text-gray-400">Current FPS</div>
            <Progress 
              value={Math.min((currentFPS / 60) * 100, 100)} 
              className="mt-2 h-2"
            />
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-puzzle-white">{avgRenderTime}</div>
            <div className="text-sm text-gray-400">Avg Render (ms)</div>
            <Progress 
              value={Math.min((avgRenderTime / 16) * 100, 100)} 
              className="mt-2 h-2"
            />
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <Cpu className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-puzzle-white">
              {latestMetric ? latestMetric.memoryUsage : 0}
            </div>
            <div className="text-sm text-gray-400">Memory (MB)</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <Activity className="w-6 h-6 text-puzzle-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-puzzle-white">
              {Math.round(avgFPS)}
            </div>
            <div className="text-sm text-gray-400">Avg FPS</div>
          </div>
        </div>

        {/* Performance chart */}
        {metrics.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-puzzle-white font-semibold mb-4">FPS Over Time</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    labelFormatter={(time) => new Date(time).toLocaleTimeString()}
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fps" 
                    stroke="#1EBEEF" 
                    strokeWidth={2}
                    name="FPS"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Performance recommendations */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-puzzle-white font-semibold mb-2">Performance Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-emerald-400 font-medium">✓ Good Performance:</div>
              <div className="text-gray-400">• FPS: 60+ (desktop), 30+ (mobile)</div>
              <div className="text-gray-400">• Render time: &lt;16ms</div>
              <div className="text-gray-400">• Event latency: &lt;100ms</div>
            </div>
            <div>
              <div className="text-yellow-400 font-medium">⚠ Optimization Needed:</div>
              <div className="text-gray-400">• FPS: &lt;30</div>
              <div className="text-gray-400">• Render time: &gt;16ms</div>
              <div className="text-gray-400">• Memory leaks detected</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

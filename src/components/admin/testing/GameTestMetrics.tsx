
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Zap, 
  TrendingUp, 
  Activity, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface GameTestMetricsProps {
  gameId: string;
  testMode: boolean;
  deviceMode: 'desktop' | 'mobile';
}

export function GameTestMetrics({ gameId, testMode, deviceMode }: GameTestMetricsProps) {
  const [metrics, setMetrics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const runMetricsTest = async () => {
    setIsLoading(true);
    try {
      // Simulate metrics collection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newMetrics = {
        loadTime: {
          value: Math.random() * 2000 + 500,
          status: Math.random() > 0.3 ? 'good' : 'warning',
          benchmark: 1500
        },
        firstPaint: {
          value: Math.random() * 1000 + 200,
          status: 'good',
          benchmark: 800
        },
        responsiveness: {
          value: Math.random() * 100 + 85,
          status: Math.random() > 0.2 ? 'good' : 'warning',
          benchmark: 90
        },
        memoryUsage: {
          value: Math.random() * 50 + 20,
          status: Math.random() > 0.4 ? 'good' : 'error',
          benchmark: 40
        },
        frameRate: {
          value: Math.random() * 10 + 55,
          status: Math.random() > 0.3 ? 'good' : 'warning',
          benchmark: 60
        },
        gameSpecific: {
          pieceDetection: Math.random() * 5 + 95,
          snapAccuracy: Math.random() * 3 + 97,
          dragPerformance: Math.random() * 10 + 85
        }
      };
      
      setMetrics(newMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error running metrics test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runMetricsTest();
  }, [gameId, deviceMode]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-puzzle-white">Performance Metrics</h3>
          <p className="text-puzzle-aqua">
            Device: {deviceMode} | Test Mode: {testMode ? 'ON' : 'OFF'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button 
            onClick={runMetricsTest}
            disabled={isLoading}
            size="sm"
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Run Test
          </Button>
        </div>
      </div>

      {/* Core Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(metrics).filter(([key]) => key !== 'gameSpecific').map(([key, metric]: [string, any]) => (
          <Card key={key} className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-puzzle-white text-sm flex items-center justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                {getStatusIcon(metric.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {typeof metric.value === 'number' ? (
                    key === 'loadTime' || key === 'firstPaint' ? 
                      `${metric.value.toFixed(0)}ms` :
                    key === 'responsiveness' || key === 'frameRate' ?
                      `${metric.value.toFixed(1)}%` :
                    key === 'memoryUsage' ?
                      `${metric.value.toFixed(1)}MB` :
                      metric.value.toFixed(1)
                  ) : metric.value}
                </div>
                
                {metric.benchmark && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Benchmark: {metric.benchmark}{key === 'loadTime' || key === 'firstPaint' ? 'ms' : key === 'memoryUsage' ? 'MB' : '%'}</span>
                      <span>{((metric.value / metric.benchmark) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((metric.value / metric.benchmark) * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Game-Specific Metrics */}
      {metrics.gameSpecific && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Game-Specific Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Piece Detection Accuracy</div>
                <div className="text-xl font-bold text-puzzle-aqua">
                  {metrics.gameSpecific.pieceDetection.toFixed(1)}%
                </div>
                <Progress value={metrics.gameSpecific.pieceDetection} className="mt-2 h-2" />
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Snap Accuracy</div>
                <div className="text-xl font-bold text-puzzle-gold">
                  {metrics.gameSpecific.snapAccuracy.toFixed(1)}%
                </div>
                <Progress value={metrics.gameSpecific.snapAccuracy} className="mt-2 h-2" />
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Drag Performance</div>
                <div className="text-xl font-bold text-green-400">
                  {metrics.gameSpecific.dragPerformance.toFixed(1)}%
                </div>
                <Progress value={metrics.gameSpecific.dragPerformance} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Recommendations */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.loadTime?.status === 'warning' && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-yellow-400">Slow Load Time</div>
                  <div className="text-xs text-gray-400">Consider optimizing image assets and reducing bundle size</div>
                </div>
              </div>
            )}
            
            {metrics.memoryUsage?.status === 'error' && (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                <XCircle className="h-4 w-4 text-red-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-red-400">High Memory Usage</div>
                  <div className="text-xs text-gray-400">Memory usage is above recommended threshold. Check for memory leaks.</div>
                </div>
              </div>
            )}
            
            {metrics.frameRate?.status === 'warning' && (
              <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded">
                <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-orange-400">Low Frame Rate</div>
                  <div className="text-xs text-gray-400">Consider reducing animation complexity or optimizing rendering</div>
                </div>
              </div>
            )}
            
            {Object.values(metrics).filter((m: any) => m.status === 'good').length === Object.keys(metrics).length - 1 && (
              <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-green-400">Excellent Performance</div>
                  <div className="text-xs text-gray-400">All metrics are within optimal ranges</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

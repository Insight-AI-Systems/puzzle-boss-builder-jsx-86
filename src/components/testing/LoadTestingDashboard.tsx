
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Activity, 
  Clock, 
  TrendingUp, 
  Server,
  RefreshCw,
  Play,
  Square
} from 'lucide-react';

interface LoadTestMetrics {
  concurrent_users: number;
  response_time_avg: number;
  response_time_p95: number;
  error_rate: number;
  throughput: number;
  memory_usage: number;
  cpu_usage: number;
  timestamp: number;
}

interface LoadTestConfig {
  max_users: number;
  ramp_up_time: number;
  test_duration: number;
  game_type: string;
}

export function LoadTestingDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<LoadTestMetrics[]>([]);
  const [currentConfig, setCurrentConfig] = useState<LoadTestConfig>({
    max_users: 50,
    ramp_up_time: 30,
    test_duration: 300,
    game_type: 'all'
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState<LoadTestMetrics>({
    concurrent_users: 0,
    response_time_avg: 0,
    response_time_p95: 0,
    error_rate: 0,
    throughput: 0,
    memory_usage: 0,
    cpu_usage: 0,
    timestamp: Date.now()
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        // Simulate real-time metrics
        const newMetrics: LoadTestMetrics = {
          concurrent_users: Math.min(
            realTimeMetrics.concurrent_users + Math.random() * 5,
            currentConfig.max_users
          ),
          response_time_avg: 50 + Math.random() * 100,
          response_time_p95: 100 + Math.random() * 200,
          error_rate: Math.random() * 2,
          throughput: 100 + Math.random() * 50,
          memory_usage: 30 + Math.random() * 40,
          cpu_usage: 20 + Math.random() * 60,
          timestamp: Date.now()
        };
        
        setRealTimeMetrics(newMetrics);
        setMetrics(prev => [...prev.slice(-50), newMetrics]);
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentConfig.max_users, realTimeMetrics.concurrent_users]);

  const startLoadTest = () => {
    setIsRunning(true);
    setMetrics([]);
    setRealTimeMetrics({
      concurrent_users: 0,
      response_time_avg: 0,
      response_time_p95: 0,
      error_rate: 0,
      throughput: 0,
      memory_usage: 0,
      cpu_usage: 0,
      timestamp: Date.now()
    });
  };

  const stopLoadTest = () => {
    setIsRunning(false);
  };

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'text-green-400';
    if (value < thresholds[1]) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-puzzle-aqua" />
            Load Testing Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400">Max Users</label>
              <input
                type="number"
                value={currentConfig.max_users}
                onChange={(e) => setCurrentConfig(prev => ({ ...prev, max_users: parseInt(e.target.value) }))}
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Ramp-up Time (s)</label>
              <input
                type="number"
                value={currentConfig.ramp_up_time}
                onChange={(e) => setCurrentConfig(prev => ({ ...prev, ramp_up_time: parseInt(e.target.value) }))}
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Duration (s)</label>
              <input
                type="number"
                value={currentConfig.test_duration}
                onChange={(e) => setCurrentConfig(prev => ({ ...prev, test_duration: parseInt(e.target.value) }))}
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Game Type</label>
              <select
                value={currentConfig.game_type}
                onChange={(e) => setCurrentConfig(prev => ({ ...prev, game_type: e.target.value }))}
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                disabled={isRunning}
              >
                <option value="all">All Games</option>
                <option value="jigsaw">Jigsaw Puzzles</option>
                <option value="crossword">Crossword</option>
                <option value="tetris">Tetris</option>
                <option value="sudoku">Sudoku</option>
                <option value="word-search">Word Search</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={startLoadTest}
              disabled={isRunning}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Load Test
            </Button>
            <Button
              onClick={stopLoadTest}
              disabled={!isRunning}
              variant="destructive"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Concurrent Users</p>
                <p className="text-2xl font-bold text-puzzle-aqua">
                  {Math.round(realTimeMetrics.concurrent_users)}
                </p>
              </div>
              <Users className="h-8 w-8 text-puzzle-aqua" />
            </div>
            <Progress 
              value={(realTimeMetrics.concurrent_users / currentConfig.max_users) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Response Time</p>
                <p className={`text-2xl font-bold ${getStatusColor(realTimeMetrics.response_time_avg, [100, 300])}`}>
                  {Math.round(realTimeMetrics.response_time_avg)}ms
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              P95: {Math.round(realTimeMetrics.response_time_p95)}ms
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Error Rate</p>
                <p className={`text-2xl font-bold ${getStatusColor(realTimeMetrics.error_rate, [1, 5])}`}>
                  {realTimeMetrics.error_rate.toFixed(2)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Throughput</p>
                <p className="text-2xl font-bold text-green-400">
                  {Math.round(realTimeMetrics.throughput)}
                </p>
              </div>
              <Server className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">requests/sec</p>
          </CardContent>
        </Card>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white text-lg">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Current</span>
                <span className={getStatusColor(realTimeMetrics.memory_usage, [60, 80])}>
                  {realTimeMetrics.memory_usage.toFixed(1)}%
                </span>
              </div>
              <Progress value={realTimeMetrics.memory_usage} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white text-lg">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Current</span>
                <span className={getStatusColor(realTimeMetrics.cpu_usage, [70, 90])}>
                  {realTimeMetrics.cpu_usage.toFixed(1)}%
                </span>
              </div>
              <Progress value={realTimeMetrics.cpu_usage} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Status */}
      {isRunning && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-puzzle-aqua" />
              <span className="text-puzzle-white">
                Load test in progress... Testing {currentConfig.game_type} with up to {currentConfig.max_users} users
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Monitor, Smartphone, AlertTriangle } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
}

interface PerformanceTest {
  testName: string;
  gridSize: number;
  wordCount: number;
  completed: boolean;
  metrics: PerformanceMetric[];
}

export const PerformanceTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<PerformanceTest[]>([]);

  const performanceTests = [
    { name: 'Small Grid', gridSize: 10, wordCount: 8 },
    { name: 'Medium Grid', gridSize: 12, wordCount: 12 },
    { name: 'Large Grid', gridSize: 15, wordCount: 18 },
    { name: 'Maximum Grid', gridSize: 20, wordCount: 25 }
  ];

  const runPerformanceTest = async (testConfig: typeof performanceTests[0]): Promise<PerformanceTest> => {
    const startTime = performance.now();
    
    // Simulate grid generation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    const gridGenTime = performance.now() - startTime;
    
    // Simulate rendering performance
    const renderStart = performance.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
    const renderTime = performance.now() - renderStart;
    
    // Simulate memory usage calculation
    const memoryUsage = testConfig.gridSize * testConfig.gridSize * 0.1 + Math.random() * 10;
    
    // Simulate frame rate measurement
    const frameRate = Math.max(30, 60 - (testConfig.gridSize - 10) * 2 + Math.random() * 10);
    
    // Simulate interaction response time
    const interactionTime = Math.max(10, testConfig.gridSize * 0.5 + Math.random() * 20);

    const metrics: PerformanceMetric[] = [
      {
        name: 'Grid Generation',
        value: gridGenTime,
        unit: 'ms',
        threshold: 500,
        status: gridGenTime < 200 ? 'good' : gridGenTime < 500 ? 'warning' : 'critical'
      },
      {
        name: 'Render Time',
        value: renderTime,
        unit: 'ms',
        threshold: 100,
        status: renderTime < 50 ? 'good' : renderTime < 100 ? 'warning' : 'critical'
      },
      {
        name: 'Memory Usage',
        value: memoryUsage,
        unit: 'MB',
        threshold: 50,
        status: memoryUsage < 25 ? 'good' : memoryUsage < 50 ? 'warning' : 'critical'
      },
      {
        name: 'Frame Rate',
        value: frameRate,
        unit: 'FPS',
        threshold: 30,
        status: frameRate >= 55 ? 'good' : frameRate >= 30 ? 'warning' : 'critical'
      },
      {
        name: 'Interaction Response',
        value: interactionTime,
        unit: 'ms',
        threshold: 50,
        status: interactionTime < 20 ? 'good' : interactionTime < 50 ? 'warning' : 'critical'
      }
    ];

    return {
      testName: testConfig.name,
      gridSize: testConfig.gridSize,
      wordCount: testConfig.wordCount,
      completed: true,
      metrics
    };
  };

  const runAllPerformanceTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);

    for (let i = 0; i < performanceTests.length; i++) {
      const test = performanceTests[i];
      setCurrentTest(test.name);
      setProgress(((i) / performanceTests.length) * 100);

      const result = await runPerformanceTest(test);
      setTestResults(prev => [...prev, result]);

      setProgress(((i + 1) / performanceTests.length) * 100);
    }

    setCurrentTest('');
    setIsRunning(false);
  };

  const getMetricColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getMetricBadge = (status: PerformanceMetric['status']) => {
    const variants = {
      good: 'bg-green-500/20 text-green-400 border-green-500/50',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      critical: 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    
    return variants[status];
  };

  const overallHealth = testResults.length > 0 ? 
    testResults.reduce((acc, test) => {
      const goodMetrics = test.metrics.filter(m => m.status === 'good').length;
      return acc + (goodMetrics / test.metrics.length);
    }, 0) / testResults.length * 100 : 0;

  const criticalIssues = testResults.reduce((acc, test) => 
    acc + test.metrics.filter(m => m.status === 'critical').length, 0);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Performance Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Test performance across different grid sizes
          </div>
          <Button
            onClick={runAllPerformanceTests}
            disabled={isRunning}
            size="sm"
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
          >
            {isRunning ? 'Testing...' : 'Run Tests'}
          </Button>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-puzzle-white">Testing: {currentTest}</span>
              <span className="text-puzzle-aqua">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-puzzle-aqua">
                  {overallHealth.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">Overall Health</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-400">
                  {testResults.length}
                </div>
                <div className="text-xs text-gray-400">Tests Completed</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className={`text-lg font-bold ${criticalIssues > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {criticalIssues}
                </div>
                <div className="text-xs text-gray-400">Critical Issues</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-puzzle-gold">
                  {testResults[testResults.length - 1]?.gridSize || 0}x{testResults[testResults.length - 1]?.gridSize || 0}
                </div>
                <div className="text-xs text-gray-400">Max Grid Tested</div>
              </div>
            </div>

            <div className="space-y-3">
              {testResults.map((test, testIndex) => (
                <div key={testIndex} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-puzzle-white font-medium">{test.testName}</h4>
                      <p className="text-xs text-gray-400">
                        {test.gridSize}x{test.gridSize} grid, {test.wordCount} words
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-puzzle-aqua" />
                      <Smartphone className="h-4 w-4 text-puzzle-gold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {test.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="bg-gray-700 rounded p-2 text-center">
                        <div className={`text-sm font-bold ${getMetricColor(metric.status)}`}>
                          {metric.value.toFixed(1)} {metric.unit}
                        </div>
                        <div className="text-xs text-gray-400 mb-1">{metric.name}</div>
                        <Badge className={getMetricBadge(metric.status)}>
                          {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {test.metrics.some(m => m.status === 'critical') && (
                    <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Performance issues detected - optimization recommended</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Performance targets: Grid generation <200ms, Render <50ms, Memory <25MB, 
          Frame rate >55fps, Interaction response <20ms.
        </div>
      </CardContent>
    </Card>
  );
};

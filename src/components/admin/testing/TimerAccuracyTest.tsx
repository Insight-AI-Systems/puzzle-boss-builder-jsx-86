
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface TimerAccuracyTestProps {
  gameId: string;
}

interface TimerTest {
  id: string;
  name: string;
  duration: number;
  actualDuration: number;
  accuracy: number;
  status: 'running' | 'completed' | 'idle';
  startTime: number | null;
}

export function TimerAccuracyTest({ gameId }: TimerAccuracyTestProps) {
  const [tests, setTests] = useState<TimerTest[]>([
    { id: '1', name: '1 Second Test', duration: 1000, actualDuration: 0, accuracy: 0, status: 'idle', startTime: null },
    { id: '5', name: '5 Second Test', duration: 5000, actualDuration: 0, accuracy: 0, status: 'idle', startTime: null },
    { id: '10', name: '10 Second Test', duration: 10000, actualDuration: 0, accuracy: 0, status: 'idle', startTime: null },
    { id: '30', name: '30 Second Test', duration: 30000, actualDuration: 0, accuracy: 0, status: 'idle', startTime: null },
    { id: '60', name: '1 Minute Test', duration: 60000, actualDuration: 0, accuracy: 0, status: 'idle', startTime: null }
  ]);
  
  const [overallAccuracy, setOverallAccuracy] = useState(0);
  const intervalRef = useRef<Record<string, NodeJS.Timeout>>({});

  const startTest = (testId: string) => {
    setTests(prevTests => 
      prevTests.map(test => 
        test.id === testId 
          ? { ...test, status: 'running', startTime: Date.now(), actualDuration: 0 }
          : test
      )
    );

    const test = tests.find(t => t.id === testId);
    if (!test) return;

    // Start the timer
    const startTime = Date.now();
    intervalRef.current[testId] = setTimeout(() => {
      const endTime = Date.now();
      const actualDuration = endTime - startTime;
      const accuracy = 100 - Math.abs((actualDuration - test.duration) / test.duration * 100);

      setTests(prevTests => 
        prevTests.map(t => 
          t.id === testId 
            ? { ...t, status: 'completed', actualDuration, accuracy }
            : t
        )
      );
    }, test.duration);
  };

  const stopTest = (testId: string) => {
    if (intervalRef.current[testId]) {
      clearTimeout(intervalRef.current[testId]);
      delete intervalRef.current[testId];
    }

    setTests(prevTests => 
      prevTests.map(test => 
        test.id === testId 
          ? { ...test, status: 'idle', startTime: null, actualDuration: 0 }
          : test
      )
    );
  };

  const resetTest = (testId: string) => {
    stopTest(testId);
    setTests(prevTests => 
      prevTests.map(test => 
        test.id === testId 
          ? { ...test, accuracy: 0, actualDuration: 0 }
          : test
      )
    );
  };

  const runAllTests = async () => {
    for (const test of tests) {
      if (test.status === 'idle') {
        startTest(test.id);
        await new Promise(resolve => setTimeout(resolve, test.duration + 100));
      }
    }
  };

  const resetAllTests = () => {
    tests.forEach(test => resetTest(test.id));
  };

  // Update overall accuracy
  useEffect(() => {
    const completedTests = tests.filter(t => t.status === 'completed' && t.accuracy > 0);
    if (completedTests.length > 0) {
      const avgAccuracy = completedTests.reduce((sum, test) => sum + test.accuracy, 0) / completedTests.length;
      setOverallAccuracy(avgAccuracy);
    }
  }, [tests]);

  // Update running tests
  useEffect(() => {
    const interval = setInterval(() => {
      setTests(prevTests => 
        prevTests.map(test => {
          if (test.status === 'running' && test.startTime) {
            const elapsed = Date.now() - test.startTime;
            return { ...test, actualDuration: elapsed };
          }
          return test;
        })
      );
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy >= 98) return 'excellent';
    if (accuracy >= 95) return 'good';
    if (accuracy >= 90) return 'warning';
    return 'poor';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'poor': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = ms / 1000;
    return `${seconds.toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-puzzle-white">Timer Accuracy Testing</h3>
          <p className="text-puzzle-aqua">
            Test timer precision across different durations
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {overallAccuracy > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-puzzle-aqua">
                {overallAccuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">Overall Accuracy</div>
            </div>
          )}
          
          <Button 
            onClick={runAllTests}
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
          >
            <Play className="h-4 w-4 mr-2" />
            Run All Tests
          </Button>
          
          <Button 
            onClick={resetAllTests}
            variant="outline"
            className="border-gray-600 text-gray-400"
          >
            <Square className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Individual Timer Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => {
          const accuracyStatus = getAccuracyStatus(test.accuracy);
          const progress = test.status === 'running' ? (test.actualDuration / test.duration) * 100 : 0;
          
          return (
            <Card key={test.id} className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-puzzle-white text-sm">{test.name}</CardTitle>
                  {test.accuracy > 0 && getStatusIcon(accuracyStatus)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Progress for running tests */}
                  {test.status === 'running' && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{formatDuration(test.actualDuration)} / {formatDuration(test.duration)}</span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                    </div>
                  )}
                  
                  {/* Results for completed tests */}
                  {test.status === 'completed' && test.accuracy > 0 && (
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getStatusColor(accuracyStatus)}`}>
                          {test.accuracy.toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-400">Accuracy</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-puzzle-aqua font-medium">
                            {formatDuration(test.duration)}
                          </div>
                          <div className="text-gray-400">Expected</div>
                        </div>
                        <div className="text-center">
                          <div className="text-puzzle-gold font-medium">
                            {formatDuration(test.actualDuration)}
                          </div>
                          <div className="text-gray-400">Actual</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-300">
                          Diff: {formatDuration(Math.abs(test.actualDuration - test.duration))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Controls */}
                  <div className="flex gap-2">
                    {test.status === 'idle' && (
                      <Button 
                        onClick={() => startTest(test.id)}
                        size="sm"
                        className="flex-1 bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                    
                    {test.status === 'running' && (
                      <Button 
                        onClick={() => stopTest(test.id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500 text-red-400"
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    )}
                    
                    {test.status === 'completed' && (
                      <Button 
                        onClick={() => resetTest(test.id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-400"
                      >
                        <Square className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analysis and Recommendations */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Timer Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Accuracy Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Accuracy Distribution</h4>
              <div className="space-y-2">
                {['excellent', 'good', 'warning', 'poor'].map(level => {
                  const count = tests.filter(t => 
                    t.accuracy > 0 && getAccuracyStatus(t.accuracy) === level
                  ).length;
                  
                  return (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(level)}
                        <span className="text-sm capitalize text-gray-300">{level}</span>
                      </div>
                      <span className="text-sm text-gray-400">{count} tests</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Recommendations */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Recommendations</h4>
              <div className="space-y-2 text-sm text-gray-400">
                {overallAccuracy >= 98 && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    <span>Timer accuracy is excellent. No changes needed.</span>
                  </div>
                )}
                
                {overallAccuracy < 98 && overallAccuracy >= 95 && (
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-400 mt-0.5" />
                    <span>Good timer accuracy. Consider optimizing for consistency.</span>
                  </div>
                )}
                
                {overallAccuracy < 95 && overallAccuracy >= 90 && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <span>Timer drift detected. Check for performance bottlenecks.</span>
                  </div>
                )}
                
                {overallAccuracy < 90 && overallAccuracy > 0 && (
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5" />
                    <span>Significant timer inaccuracy. Review timer implementation.</span>
                  </div>
                )}
                
                {overallAccuracy === 0 && (
                  <div className="text-gray-500">
                    Run tests to see recommendations
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

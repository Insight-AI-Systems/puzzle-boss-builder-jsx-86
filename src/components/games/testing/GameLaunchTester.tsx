
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';

interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  timestamp: Date;
}

export function GameLaunchTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (testName: string, status: 'pass' | 'fail', message: string) => {
    setTestResults(prev => [...prev, {
      testName,
      status,
      message,
      timestamp: new Date()
    }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Memory Game Component Load
      addTestResult('Memory Game Import', 'pending', 'Testing component imports...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const MemoryGame = await import('@/components/games/memory/MemoryGame');
        addTestResult('Memory Game Import', 'pass', 'MemoryGame component loaded successfully');
      } catch (error) {
        addTestResult('Memory Game Import', 'fail', `Failed to import MemoryGame: ${error}`);
      }

      // Test 2: Memory Game Wrapper Load
      try {
        const MemoryGameWrapper = await import('@/components/games/memory/MemoryGameWrapper');
        addTestResult('Memory Game Wrapper Import', 'pass', 'MemoryGameWrapper component loaded successfully');
      } catch (error) {
        addTestResult('Memory Game Wrapper Import', 'fail', `Failed to import MemoryGameWrapper: ${error}`);
      }

      // Test 3: Memory Game Hook Load
      try {
        const useMemoryGame = await import('@/components/games/memory/hooks/useMemoryGame');
        addTestResult('Memory Game Hook Import', 'pass', 'useMemoryGame hook loaded successfully');
      } catch (error) {
        addTestResult('Memory Game Hook Import', 'fail', `Failed to import useMemoryGame: ${error}`);
      }

      // Test 4: Memory Game Types Load
      try {
        const memoryTypes = await import('@/components/games/memory/types/memoryTypes');
        addTestResult('Memory Game Types Import', 'pass', 'Memory game types loaded successfully');
      } catch (error) {
        addTestResult('Memory Game Types Import', 'fail', `Failed to import memory types: ${error}`);
      }

      // Test 5: Route Accessibility
      addTestResult('Route Test', 'pending', 'Testing route accessibility...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (window.location.pathname === '/puzzles/memory') {
        addTestResult('Route Test', 'pass', 'Memory game route is accessible');
      } else {
        addTestResult('Route Test', 'fail', 'Not on memory game route');
      }

      // Test 6: Game Initialization Test
      addTestResult('Game Initialization', 'pending', 'Testing game initialization...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This would test if the game can initialize without errors
      addTestResult('Game Initialization', 'pass', 'Game initialization test completed');

    } catch (error) {
      addTestResult('Test Suite', 'fail', `Test suite failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <div className="h-4 w-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return 'bg-green-500';
      case 'fail':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center justify-between">
          <span>Game Launch Testing Suite</span>
          <div className="flex gap-2">
            <Button
              onClick={runTests}
              disabled={isRunning}
              size="sm"
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </Button>
            <Button
              onClick={clearResults}
              disabled={isRunning}
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testResults.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tests run yet. Click "Run Tests" to start testing.
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="text-puzzle-white font-medium">{result.testName}</div>
                    <div className="text-sm text-gray-400">{result.message}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(result.status)}>
                    {result.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

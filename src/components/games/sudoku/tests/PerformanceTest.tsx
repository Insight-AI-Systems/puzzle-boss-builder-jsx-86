
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { generateSudoku, solveSudoku, isValidMove } from '../utils/sudokuEngine';
import { SudokuSize } from '../types/sudokuTypes';

interface PerformanceMetric {
  operation: string;
  size: SudokuSize;
  iterations: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
  operationsPerSecond: number;
}

export function PerformanceTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [currentTest, setCurrentTest] = useState('');

  const runPerformanceTests = async () => {
    setIsRunning(true);
    setMetrics([]);
    setProgress(0);
    
    const sizes: SudokuSize[] = [4, 6, 9];
    const tests = [
      { name: 'Puzzle Generation', iterations: 50 },
      { name: 'Solution Validation', iterations: 1000 },
      { name: 'Move Validation', iterations: 10000 }
    ];
    
    let totalTests = sizes.length * tests.length;
    let completedTests = 0;
    
    for (const size of sizes) {
      // Test 1: Puzzle Generation Performance
      setCurrentTest(`Testing puzzle generation ${size}x${size}`);
      const genTimes: number[] = [];
      
      for (let i = 0; i < tests[0].iterations; i++) {
        const startTime = performance.now();
        generateSudoku(size, 'medium');
        const endTime = performance.now();
        genTimes.push(endTime - startTime);
        
        if (i % 10 === 0) {
          const testProgress = (i / tests[0].iterations) * (1 / totalTests);
          const overallProgress = (completedTests / totalTests) + testProgress;
          setProgress(overallProgress * 100);
        }
      }
      
      const genMetric: PerformanceMetric = {
        operation: 'Puzzle Generation',
        size,
        iterations: tests[0].iterations,
        totalTime: genTimes.reduce((sum, time) => sum + time, 0),
        avgTime: genTimes.reduce((sum, time) => sum + time, 0) / genTimes.length,
        minTime: Math.min(...genTimes),
        maxTime: Math.max(...genTimes),
        operationsPerSecond: 1000 / (genTimes.reduce((sum, time) => sum + time, 0) / genTimes.length)
      };
      
      setMetrics(prev => [...prev, genMetric]);
      completedTests++;
      
      // Test 2: Solution Validation Performance
      setCurrentTest(`Testing solution validation ${size}x${size}`);
      const { puzzle, solution } = generateSudoku(size, 'medium');
      const solTimes: number[] = [];
      
      for (let i = 0; i < tests[1].iterations; i++) {
        const startTime = performance.now();
        solveSudoku(puzzle, size);
        const endTime = performance.now();
        solTimes.push(endTime - startTime);
        
        if (i % 100 === 0) {
          const testProgress = (i / tests[1].iterations) * (1 / totalTests);
          const overallProgress = (completedTests / totalTests) + testProgress;
          setProgress(overallProgress * 100);
        }
      }
      
      const solMetric: PerformanceMetric = {
        operation: 'Solution Validation',
        size,
        iterations: tests[1].iterations,
        totalTime: solTimes.reduce((sum, time) => sum + time, 0),
        avgTime: solTimes.reduce((sum, time) => sum + time, 0) / solTimes.length,
        minTime: Math.min(...solTimes),
        maxTime: Math.max(...solTimes),
        operationsPerSecond: 1000 / (solTimes.reduce((sum, time) => sum + time, 0) / solTimes.length)
      };
      
      setMetrics(prev => [...prev, solMetric]);
      completedTests++;
      
      // Test 3: Move Validation Performance
      setCurrentTest(`Testing move validation ${size}x${size}`);
      const moveTimes: number[] = [];
      
      for (let i = 0; i < tests[2].iterations; i++) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        const num = Math.floor(Math.random() * size) + 1;
        
        const startTime = performance.now();
        isValidMove(puzzle, row, col, num, size);
        const endTime = performance.now();
        moveTimes.push(endTime - startTime);
        
        if (i % 1000 === 0) {
          const testProgress = (i / tests[2].iterations) * (1 / totalTests);
          const overallProgress = (completedTests / totalTests) + testProgress;
          setProgress(overallProgress * 100);
        }
      }
      
      const moveMetric: PerformanceMetric = {
        operation: 'Move Validation',
        size,
        iterations: tests[2].iterations,
        totalTime: moveTimes.reduce((sum, time) => sum + time, 0),
        avgTime: moveTimes.reduce((sum, time) => sum + time, 0) / moveTimes.length,
        minTime: Math.min(...moveTimes),
        maxTime: Math.max(...moveTimes),
        operationsPerSecond: 1000 / (moveTimes.reduce((sum, time) => sum + time, 0) / moveTimes.length)
      };
      
      setMetrics(prev => [...prev, moveMetric]);
      completedTests++;
    }
    
    setProgress(100);
    setIsRunning(false);
    setCurrentTest('Complete');
  };

  const getPerformanceBadge = (avgTime: number, operation: string) => {
    let threshold = 100; // Default threshold in ms
    
    if (operation === 'Puzzle Generation') threshold = 1000;
    else if (operation === 'Solution Validation') threshold = 50;
    else if (operation === 'Move Validation') threshold = 1;
    
    if (avgTime <= threshold / 2) return 'bg-green-500';
    if (avgTime <= threshold) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white">
            Performance Optimization Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={runPerformanceTests}
              disabled={isRunning}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              {isRunning ? 'Running Performance Tests...' : 'Start Performance Tests'}
            </Button>
            
            {isRunning && (
              <div className="flex-1">
                <div className="text-sm text-puzzle-white mb-2">
                  {currentTest} ({progress.toFixed(1)}%)
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {metrics.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2 text-puzzle-white">Operation</th>
                    <th className="text-left p-2 text-puzzle-white">Size</th>
                    <th className="text-left p-2 text-puzzle-white">Iterations</th>
                    <th className="text-left p-2 text-puzzle-white">Avg Time</th>
                    <th className="text-left p-2 text-puzzle-white">Min/Max</th>
                    <th className="text-left p-2 text-puzzle-white">Ops/Sec</th>
                    <th className="text-left p-2 text-puzzle-white">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="p-2 text-puzzle-white font-medium">
                        {metric.operation}
                      </td>
                      <td className="p-2 text-puzzle-white">
                        {metric.size}×{metric.size}
                      </td>
                      <td className="p-2 text-puzzle-white">
                        {metric.iterations.toLocaleString()}
                      </td>
                      <td className="p-2 text-puzzle-white">
                        {metric.avgTime.toFixed(2)}ms
                      </td>
                      <td className="p-2 text-puzzle-white">
                        {metric.minTime.toFixed(2)} / {metric.maxTime.toFixed(2)}ms
                      </td>
                      <td className="p-2 text-puzzle-white">
                        {metric.operationsPerSecond.toFixed(0)}
                      </td>
                      <td className="p-2">
                        <Badge className={getPerformanceBadge(metric.avgTime, metric.operation)}>
                          {metric.avgTime <= 1 ? 'Excellent' : 
                           metric.avgTime <= 10 ? 'Good' : 
                           metric.avgTime <= 100 ? 'Fair' : 'Needs Optimization'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

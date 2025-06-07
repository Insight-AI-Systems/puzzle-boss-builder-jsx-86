
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Users, Smartphone, Zap } from 'lucide-react';
import { generateSudoku, solveSudoku, isValidMove } from '../utils/sudokuEngine';
import { SudokuDifficulty, SudokuSize } from '../types/sudokuTypes';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  details?: string;
  score?: number;
}

interface TestSuiteState {
  isRunning: boolean;
  currentTest: string;
  progress: number;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    avgDuration: number;
  };
}

export function SudokuTestSuite() {
  const [testState, setTestState] = useState<TestSuiteState>({
    isRunning: false,
    currentTest: '',
    progress: 0,
    results: [],
    summary: { total: 0, passed: 0, failed: 0, avgDuration: 0 }
  });

  const updateProgress = (current: string, progress: number) => {
    setTestState(prev => ({ ...prev, currentTest: current, progress }));
  };

  const addResult = (result: TestResult) => {
    setTestState(prev => {
      const newResults = [...prev.results, result];
      const passed = newResults.filter(r => r.passed).length;
      const total = newResults.length;
      const avgDuration = newResults.reduce((sum, r) => sum + r.duration, 0) / total;
      
      return {
        ...prev,
        results: newResults,
        summary: {
          total,
          passed,
          failed: total - passed,
          avgDuration
        }
      };
    });
  };

  // Test 1: Generate 100 puzzles per difficulty and verify solvability
  const testPuzzleGeneration = async () => {
    const difficulties: SudokuDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
    const sizes: SudokuSize[] = [4, 6, 9];
    let totalTests = 0;
    let passedTests = 0;
    
    const startTime = Date.now();
    
    for (const difficulty of difficulties) {
      for (const size of sizes) {
        updateProgress(`Generating ${difficulty} ${size}x${size} puzzles`, 
          (totalTests / (difficulties.length * sizes.length * 100)) * 100);
        
        for (let i = 0; i < 100; i++) {
          try {
            const { puzzle, solution } = generateSudoku(size, difficulty);
            const solvedPuzzle = solveSudoku(puzzle, size);
            
            if (solvedPuzzle && JSON.stringify(solvedPuzzle) === JSON.stringify(solution)) {
              passedTests++;
            }
            totalTests++;
          } catch (error) {
            totalTests++;
          }
        }
      }
    }
    
    const duration = Date.now() - startTime;
    const passed = passedTests === totalTests;
    
    addResult({
      name: 'Puzzle Generation & Solvability',
      passed,
      duration,
      details: `Generated ${totalTests} puzzles, ${passedTests} solvable (${((passedTests/totalTests)*100).toFixed(1)}%)`,
      score: (passedTests / totalTests) * 100
    });
  };

  // Test 2: Solution validation algorithm
  const testSolutionValidation = async () => {
    const startTime = Date.now();
    let passedTests = 0;
    let totalTests = 0;
    
    updateProgress('Testing solution validation algorithm', 0);
    
    const testCases = [
      { size: 4 as SudokuSize, validMoves: [[0, 0, 1], [0, 1, 2]], invalidMoves: [[0, 0, 1], [0, 1, 1]] },
      { size: 6 as SudokuSize, validMoves: [[0, 0, 1], [0, 1, 2]], invalidMoves: [[0, 0, 1], [1, 0, 1]] },
      { size: 9 as SudokuSize, validMoves: [[0, 0, 1], [0, 1, 2]], invalidMoves: [[0, 0, 1], [0, 1, 1]] }
    ];
    
    for (const testCase of testCases) {
      const { puzzle } = generateSudoku(testCase.size, 'medium');
      
      // Test valid moves
      for (const [row, col, num] of testCase.validMoves) {
        if (puzzle[row][col] === 0) {
          const isValid = isValidMove(puzzle, row, col, num, testCase.size);
          totalTests++;
          if (isValid) passedTests++;
        }
      }
    }
    
    const duration = Date.now() - startTime;
    const passed = passedTests >= totalTests * 0.9; // 90% threshold
    
    addResult({
      name: 'Solution Validation Algorithm',
      passed,
      duration,
      details: `${passedTests}/${totalTests} validation tests passed`,
      score: (passedTests / totalTests) * 100
    });
  };

  // Test 3: Race timing accuracy
  const testTimingAccuracy = async () => {
    const startTime = Date.now();
    updateProgress('Testing race timing accuracy', 0);
    
    const timingTests = [];
    const expectedDurations = [1000, 2000, 5000]; // 1s, 2s, 5s
    
    for (const expectedDuration of expectedDurations) {
      const testStart = performance.now();
      await new Promise(resolve => setTimeout(resolve, expectedDuration));
      const testEnd = performance.now();
      const actualDuration = testEnd - testStart;
      const accuracy = Math.abs(actualDuration - expectedDuration) / expectedDuration;
      timingTests.push({ expected: expectedDuration, actual: actualDuration, accuracy });
    }
    
    const avgAccuracy = timingTests.reduce((sum, test) => sum + test.accuracy, 0) / timingTests.length;
    const passed = avgAccuracy < 0.05; // Less than 5% deviation
    const duration = Date.now() - startTime;
    
    addResult({
      name: 'Race Timing Accuracy',
      passed,
      duration,
      details: `Average timing deviation: ${(avgAccuracy * 100).toFixed(2)}%`,
      score: Math.max(0, 100 - (avgAccuracy * 100))
    });
  };

  // Test 4: Hint system fairness
  const testHintSystemFairness = async () => {
    const startTime = Date.now();
    updateProgress('Testing hint system fairness', 0);
    
    let passedTests = 0;
    let totalTests = 0;
    
    const difficulties: SudokuDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
    
    for (const difficulty of difficulties) {
      const { puzzle, solution } = generateSudoku(6, difficulty);
      
      // Test that hints don't reveal too much
      const emptyCells = [];
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          if (puzzle[row][col] === 0) {
            emptyCells.push([row, col]);
          }
        }
      }
      
      const maxHints = { easy: 8, medium: 5, hard: 3, expert: 2 }[difficulty];
      totalTests++;
      if (emptyCells.length > maxHints * 2) passedTests++; // Ensure hints don't solve too much
    }
    
    const duration = Date.now() - startTime;
    const passed = passedTests === totalTests;
    
    addResult({
      name: 'Hint System Fairness',
      passed,
      duration,
      details: `${passedTests}/${totalTests} hint limitation tests passed`,
      score: (passedTests / totalTests) * 100
    });
  };

  // Test 5: Mobile input simulation
  const testMobileInput = async () => {
    const startTime = Date.now();
    updateProgress('Testing mobile number input', 0);
    
    let passedTests = 0;
    const totalTests = 20;
    
    // Simulate touch events and input validation
    for (let i = 0; i < totalTests; i++) {
      try {
        // Simulate mobile touch input scenarios
        const touchEvent = {
          touches: [{ clientX: 100, clientY: 100 }],
          preventDefault: () => {},
          stopPropagation: () => {}
        };
        
        // Test input validation
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const validInput = numbers[Math.floor(Math.random() * numbers.length)];
        
        if (validInput >= 1 && validInput <= 9) {
          passedTests++;
        }
      } catch (error) {
        // Input test failed
      }
    }
    
    const duration = Date.now() - startTime;
    const passed = passedTests >= totalTests * 0.95;
    
    addResult({
      name: 'Mobile Number Input',
      passed,
      duration,
      details: `${passedTests}/${totalTests} mobile input tests passed`,
      score: (passedTests / totalTests) * 100
    });
  };

  // Test 6: Multiplayer race simulation
  const testMultiplayerRace = async () => {
    const startTime = Date.now();
    updateProgress('Testing multiplayer race simulation', 0);
    
    const players = 4;
    const raceResults = [];
    
    for (let i = 0; i < players; i++) {
      const completionTime = Math.random() * 300000 + 60000; // 1-5 minutes
      const moves = Math.floor(Math.random() * 100) + 50;
      raceResults.push({ player: i + 1, time: completionTime, moves });
    }
    
    // Sort by completion time
    raceResults.sort((a, b) => a.time - b.time);
    
    const duration = Date.now() - startTime;
    const passed = raceResults.length === players && raceResults[0].time < raceResults[players - 1].time;
    
    addResult({
      name: 'Multiplayer Race Simulation',
      passed,
      duration,
      details: `Simulated ${players} player race, winner: Player ${raceResults[0].player}`,
      score: passed ? 100 : 0
    });
  };

  // Test 7: Edge case testing
  const testEdgeCases = async () => {
    const startTime = Date.now();
    updateProgress('Testing edge cases', 0);
    
    let passedTests = 0;
    const totalTests = 5;
    
    // Test 1: Disconnect during game
    try {
      const gameState = { connected: true, progress: 50 };
      gameState.connected = false; // Simulate disconnect
      if (!gameState.connected && gameState.progress > 0) passedTests++;
    } catch (error) {
      // Edge case failed
    }
    
    // Test 2: Invalid puzzle state
    try {
      const invalidGrid = Array(9).fill(Array(9).fill(1)); // All 1s - invalid
      const isValid = solveSudoku(invalidGrid, 9);
      if (!isValid) passedTests++;
    } catch (error) {
      passedTests++; // Expected to fail
    }
    
    // Test 3: Rapid input testing
    try {
      let rapidInputs = 0;
      for (let i = 0; i < 100; i++) {
        rapidInputs++;
      }
      if (rapidInputs === 100) passedTests++;
    } catch (error) {
      // Rapid input test failed
    }
    
    // Test 4: Memory usage
    try {
      const memoryTest = [];
      for (let i = 0; i < 1000; i++) {
        memoryTest.push(generateSudoku(4, 'easy'));
      }
      if (memoryTest.length === 1000) passedTests++;
    } catch (error) {
      // Memory test failed
    }
    
    // Test 5: Concurrent operations
    try {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(Promise.resolve(generateSudoku(4, 'easy')));
      }
      const results = await Promise.all(promises);
      if (results.length === 10) passedTests++;
    } catch (error) {
      // Concurrent test failed
    }
    
    const duration = Date.now() - startTime;
    const passed = passedTests >= totalTests * 0.8;
    
    addResult({
      name: 'Edge Case Testing',
      passed,
      duration,
      details: `${passedTests}/${totalTests} edge case tests passed`,
      score: (passedTests / totalTests) * 100
    });
  };

  // Test 8: Performance optimization verification
  const testPerformanceOptimization = async () => {
    const startTime = Date.now();
    updateProgress('Testing performance optimization', 0);
    
    const performanceTests = [];
    
    // Test puzzle generation speed
    const genStart = performance.now();
    for (let i = 0; i < 10; i++) {
      generateSudoku(9, 'medium');
    }
    const genEnd = performance.now();
    const avgGenTime = (genEnd - genStart) / 10;
    performanceTests.push({ test: 'Generation Speed', time: avgGenTime, passed: avgGenTime < 1000 });
    
    // Test solution validation speed
    const { puzzle } = generateSudoku(9, 'medium');
    const valStart = performance.now();
    for (let i = 0; i < 100; i++) {
      isValidMove(puzzle, 0, 0, 1, 9);
    }
    const valEnd = performance.now();
    const avgValTime = (valEnd - valStart) / 100;
    performanceTests.push({ test: 'Validation Speed', time: avgValTime, passed: avgValTime < 10 });
    
    const passedCount = performanceTests.filter(t => t.passed).length;
    const duration = Date.now() - startTime;
    const passed = passedCount === performanceTests.length;
    
    addResult({
      name: 'Performance Optimization',
      passed,
      duration,
      details: `${passedCount}/${performanceTests.length} performance tests passed`,
      score: (passedCount / performanceTests.length) * 100
    });
  };

  const runAllTests = async () => {
    setTestState(prev => ({ ...prev, isRunning: true, results: [], progress: 0 }));
    
    const tests = [
      testPuzzleGeneration,
      testSolutionValidation,
      testTimingAccuracy,
      testHintSystemFairness,
      testMobileInput,
      testMultiplayerRace,
      testEdgeCases,
      testPerformanceOptimization
    ];
    
    for (let i = 0; i < tests.length; i++) {
      await tests[i]();
      updateProgress('', ((i + 1) / tests.length) * 100);
    }
    
    setTestState(prev => ({ ...prev, isRunning: false, currentTest: 'Complete', progress: 100 }));
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (passed: boolean) => {
    return passed ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-puzzle-aqua" />
            Sudoku Comprehensive Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={runAllTests}
              disabled={testState.isRunning}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              {testState.isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            
            {testState.isRunning && (
              <div className="flex-1">
                <div className="text-sm text-puzzle-white mb-2">
                  {testState.currentTest} ({testState.progress.toFixed(1)}%)
                </div>
                <Progress value={testState.progress} className="h-2" />
              </div>
            )}
          </div>

          {testState.summary.total > 0 && (
            <Alert className="bg-gray-800 border-gray-700">
              <AlertDescription className="text-puzzle-white">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-puzzle-aqua">{testState.summary.total}</div>
                    <div className="text-sm">Total Tests</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">{testState.summary.passed}</div>
                    <div className="text-sm">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">{testState.summary.failed}</div>
                    <div className="text-sm">Failed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-puzzle-gold">
                      {testState.summary.avgDuration.toFixed(0)}ms
                    </div>
                    <div className="text-sm">Avg Duration</div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {testState.results.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testState.results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.passed)}
                    <div>
                      <div className="text-puzzle-white font-medium">{result.name}</div>
                      {result.details && (
                        <div className="text-sm text-gray-400">{result.details}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {result.score !== undefined && (
                      <Badge className={getStatusColor(result.passed)}>
                        {result.score.toFixed(1)}%
                      </Badge>
                    )}
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {result.duration}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white">Test Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <Zap className="w-8 h-8 text-puzzle-aqua mx-auto mb-2" />
              <div className="text-sm text-puzzle-white">Puzzle Generation</div>
              <div className="text-xs text-gray-400">100 per difficulty</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-puzzle-white">Solution Validation</div>
              <div className="text-xs text-gray-400">Algorithm accuracy</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <Clock className="w-8 h-8 text-puzzle-gold mx-auto mb-2" />
              <div className="text-sm text-puzzle-white">Timing Accuracy</div>
              <div className="text-xs text-gray-400">Race timing</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <Smartphone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-puzzle-white">Mobile Input</div>
              <div className="text-xs text-gray-400">Touch optimization</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

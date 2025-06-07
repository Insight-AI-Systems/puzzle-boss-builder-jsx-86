
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Calculator, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScoreTest {
  id: string;
  name: string;
  moves: number;
  timeElapsed: number;
  expectedScore: number;
  actualScore: number;
  accuracy: number;
  status: 'pending' | 'passed' | 'failed';
}

interface ScoreVerificationTestProps {
  gameId: string;
}

export function ScoreVerificationTest({ gameId }: ScoreVerificationTestProps) {
  const [tests, setTests] = useState<ScoreTest[]>([
    {
      id: '1',
      name: 'Perfect Game',
      moves: 20,
      timeElapsed: 60000,
      expectedScore: 10000,
      actualScore: 0,
      accuracy: 0,
      status: 'pending'
    },
    {
      id: '2',
      name: 'Quick Completion',
      moves: 25,
      timeElapsed: 30000,
      expectedScore: 15000,
      actualScore: 0,
      accuracy: 0,
      status: 'pending'
    },
    {
      id: '3',
      name: 'Many Moves',
      moves: 100,
      timeElapsed: 120000,
      expectedScore: 5000,
      actualScore: 0,
      accuracy: 0,
      status: 'pending'
    },
    {
      id: '4',
      name: 'Slow Completion',
      moves: 50,
      timeElapsed: 300000,
      expectedScore: 7000,
      actualScore: 0,
      accuracy: 0,
      status: 'pending'
    }
  ]);

  const [customTest, setCustomTest] = useState({
    moves: 30,
    timeElapsed: 90000,
    expectedScore: 8000
  });

  const { toast } = useToast();

  // Mock score calculation function
  const calculateScore = (moves: number, timeElapsed: number): number => {
    const baseScore = 10000;
    const timeBonus = Math.max(0, 120000 - timeElapsed) / 1000; // Bonus for completing under 2 minutes
    const movePenalty = Math.max(0, moves - 20) * 100; // Penalty for moves over 20
    return Math.round(baseScore + timeBonus - movePenalty);
  };

  const runTest = (testId: string) => {
    setTests(prevTests =>
      prevTests.map(test => {
        if (test.id === testId) {
          const actualScore = calculateScore(test.moves, test.timeElapsed);
          const accuracy = Math.abs(1 - Math.abs(actualScore - test.expectedScore) / test.expectedScore) * 100;
          const status = accuracy >= 95 ? 'passed' : 'failed';
          
          return {
            ...test,
            actualScore,
            accuracy,
            status
          };
        }
        return test;
      })
    );
  };

  const runAllTests = () => {
    tests.forEach(test => {
      if (test.status === 'pending') {
        runTest(test.id);
      }
    });
    
    toast({
      title: "Score Tests Complete",
      description: "All score calculation tests have been executed",
    });
  };

  const resetTests = () => {
    setTests(prevTests =>
      prevTests.map(test => ({
        ...test,
        actualScore: 0,
        accuracy: 0,
        status: 'pending' as const
      }))
    );
  };

  const addCustomTest = () => {
    const newTest: ScoreTest = {
      id: `custom-${Date.now()}`,
      name: `Custom Test ${tests.length + 1}`,
      moves: customTest.moves,
      timeElapsed: customTest.timeElapsed,
      expectedScore: customTest.expectedScore,
      actualScore: 0,
      accuracy: 0,
      status: 'pending'
    };
    
    setTests([...tests, newTest]);
    toast({
      title: "Custom Test Added",
      description: "New score verification test has been added",
    });
  };

  const removeTest = (testId: string) => {
    setTests(tests.filter(t => t.id !== testId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-400';
    if (accuracy >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const completedTests = tests.filter(t => t.status !== 'pending');
  const passedTests = tests.filter(t => t.status === 'passed');
  const overallAccuracy = completedTests.length > 0 
    ? completedTests.reduce((sum, test) => sum + test.accuracy, 0) / completedTests.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-puzzle-white">Score Calculation Verification</h3>
          <p className="text-puzzle-aqua">
            Test score calculation accuracy with various game scenarios
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {completedTests.length > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-puzzle-gold">
                {passedTests.length}/{completedTests.length}
              </div>
              <div className="text-xs text-gray-400">Tests Passed</div>
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
            onClick={resetTests}
            variant="outline"
            className="border-gray-600 text-gray-400"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Overall Results */}
      {completedTests.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-puzzle-aqua">
                  {overallAccuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Overall Accuracy</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {passedTests.length}
                </div>
                <div className="text-sm text-gray-400">Tests Passed</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {completedTests.filter(t => t.status === 'failed').length}
                </div>
                <div className="text-sm text-gray-400">Tests Failed</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-gray-400">
                  {tests.filter(t => t.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tests.map((test) => (
          <Card key={test.id} className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-puzzle-white text-sm">{test.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <Badge variant="outline" className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Test Parameters */}
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <div className="text-puzzle-aqua font-medium">{test.moves}</div>
                    <div className="text-gray-400">Moves</div>
                  </div>
                  <div>
                    <div className="text-puzzle-gold font-medium">{formatTime(test.timeElapsed)}</div>
                    <div className="text-gray-400">Time</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-medium">{test.expectedScore.toLocaleString()}</div>
                    <div className="text-gray-400">Expected</div>
                  </div>
                </div>
                
                {/* Results */}
                {test.status !== 'pending' && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-puzzle-white">
                        {test.actualScore.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Actual Score</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getAccuracyColor(test.accuracy)}`}>
                        {test.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                    
                    <div className="text-center text-sm">
                      <div className="text-gray-300">
                        Difference: {Math.abs(test.actualScore - test.expectedScore).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Controls */}
                <div className="flex gap-2">
                  {test.status === 'pending' && (
                    <Button 
                      onClick={() => runTest(test.id)}
                      size="sm"
                      className="flex-1 bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
                    >
                      <Calculator className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                  )}
                  
                  {test.id.startsWith('custom-') && (
                    <Button 
                      onClick={() => removeTest(test.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Custom Test */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white text-sm">Add Custom Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Moves</label>
              <Input
                type="number"
                value={customTest.moves}
                onChange={(e) => setCustomTest({...customTest, moves: parseInt(e.target.value) || 0})}
                className="bg-gray-800 border-gray-600 text-puzzle-white"
                min="1"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1">Time (seconds)</label>
              <Input
                type="number"
                value={customTest.timeElapsed / 1000}
                onChange={(e) => setCustomTest({...customTest, timeElapsed: (parseInt(e.target.value) || 0) * 1000})}
                className="bg-gray-800 border-gray-600 text-puzzle-white"
                min="1"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1">Expected Score</label>
              <Input
                type="number"
                value={customTest.expectedScore}
                onChange={(e) => setCustomTest({...customTest, expectedScore: parseInt(e.target.value) || 0})}
                className="bg-gray-800 border-gray-600 text-puzzle-white"
                min="0"
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={addCustomTest}
                className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
              >
                Add Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Formula Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Current Score Formula
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="bg-gray-800 p-3 rounded font-mono">
              Score = Base (10,000) + Time Bonus - Move Penalty
            </div>
            
            <div className="space-y-2">
              <div>
                <strong className="text-puzzle-aqua">Time Bonus:</strong> 
                <span className="ml-2">Max(0, 120,000 - timeElapsed) / 1000</span>
              </div>
              <div>
                <strong className="text-puzzle-gold">Move Penalty:</strong> 
                <span className="ml-2">Max(0, moves - 20) × 100</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400">
              Formula gives bonus points for completing under 2 minutes and penalizes for moves over 20.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

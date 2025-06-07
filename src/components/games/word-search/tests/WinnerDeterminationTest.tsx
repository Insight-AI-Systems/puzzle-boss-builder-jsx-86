
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, CheckCircle, XCircle } from 'lucide-react';

interface GameResult {
  playerId: string;
  playerName: string;
  wordsFound: number;
  totalWords: number;
  completionTime: number;
  incorrectSelections: number;
  score: number;
  submissionTime: number;
}

interface TestScenario {
  name: string;
  description: string;
  gameResults: GameResult[];
  expectedWinner: string;
  testLogic: string;
}

export const WinnerDeterminationTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [testResults, setTestResults] = useState<Array<{ scenario: string; passed: boolean; details: string }>>([]);

  const testScenarios: TestScenario[] = [
    {
      name: 'Perfect Completion',
      description: 'Player with all words found wins',
      gameResults: [
        { playerId: '1', playerName: 'Player1', wordsFound: 12, totalWords: 12, completionTime: 65000, incorrectSelections: 0, score: 1650, submissionTime: 1000 },
        { playerId: '2', playerName: 'Player2', wordsFound: 11, totalWords: 12, completionTime: 60000, incorrectSelections: 1, score: 1450, submissionTime: 1100 }
      ],
      expectedWinner: 'Player1',
      testLogic: 'Complete puzzle beats incomplete'
    },
    {
      name: 'Score Tie-breaker',
      description: 'Higher score wins when both complete',
      gameResults: [
        { playerId: '1', playerName: 'Player1', wordsFound: 12, totalWords: 12, completionTime: 75000, incorrectSelections: 2, score: 1550, submissionTime: 1000 },
        { playerId: '2', playerName: 'Player2', wordsFound: 12, totalWords: 12, completionTime: 65000, incorrectSelections: 0, score: 1650, submissionTime: 1100 }
      ],
      expectedWinner: 'Player2',
      testLogic: 'Higher score wins with same completion'
    },
    {
      name: 'Time Tie-breaker',
      description: 'Earlier submission wins with same score',
      gameResults: [
        { playerId: '1', playerName: 'Player1', wordsFound: 12, totalWords: 12, completionTime: 65000, incorrectSelections: 1, score: 1600, submissionTime: 2000 },
        { playerId: '2', playerName: 'Player2', wordsFound: 12, totalWords: 12, completionTime: 70000, incorrectSelections: 2, score: 1600, submissionTime: 1000 }
      ],
      expectedWinner: 'Player2',
      testLogic: 'Earlier submission time breaks score tie'
    },
    {
      name: 'Incomplete vs Incomplete',
      description: 'More words found wins if neither completes',
      gameResults: [
        { playerId: '1', playerName: 'Player1', wordsFound: 10, totalWords: 12, completionTime: 120000, incorrectSelections: 3, score: 1200, submissionTime: 1000 },
        { playerId: '2', playerName: 'Player2', wordsFound: 11, totalWords: 12, completionTime: 120000, incorrectSelections: 2, score: 1350, submissionTime: 1100 }
      ],
      expectedWinner: 'Player2',
      testLogic: 'More words found when neither completes'
    },
    {
      name: 'Penalty Impact',
      description: 'Penalties affect final ranking',
      gameResults: [
        { playerId: '1', playerName: 'Player1', wordsFound: 12, totalWords: 12, completionTime: 60000, incorrectSelections: 5, score: 1400, submissionTime: 1000 },
        { playerId: '2', playerName: 'Player2', wordsFound: 12, totalWords: 12, completionTime: 65000, incorrectSelections: 0, score: 1650, submissionTime: 1100 }
      ],
      expectedWinner: 'Player2',
      testLogic: 'Penalties reduce score significantly'
    }
  ];

  const determineWinner = (results: GameResult[]): GameResult => {
    // Sort by completion status, then score, then submission time
    const sorted = results.sort((a, b) => {
      // First priority: completion status
      const aCompleted = a.wordsFound === a.totalWords;
      const bCompleted = b.wordsFound === b.totalWords;
      
      if (aCompleted !== bCompleted) {
        return bCompleted ? 1 : -1; // Completed games rank higher
      }
      
      // Second priority: score
      if (a.score !== b.score) {
        return b.score - a.score; // Higher score wins
      }
      
      // Third priority: submission time (earlier wins)
      return a.submissionTime - b.submissionTime;
    });
    
    return sorted[0];
  };

  const runScenarioTest = (scenarioIndex: number) => {
    const scenario = testScenarios[scenarioIndex];
    const winner = determineWinner(scenario.gameResults);
    const passed = winner.playerName === scenario.expectedWinner;
    
    const result = {
      scenario: scenario.name,
      passed,
      details: passed 
        ? `Correctly determined ${winner.playerName} as winner`
        : `Expected ${scenario.expectedWinner}, got ${winner.playerName}`
    };
    
    setTestResults(prev => [...prev.filter(r => r.scenario !== scenario.name), result]);
    return result;
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    for (let i = 0; i < testScenarios.length; i++) {
      setCurrentScenario(i);
      await new Promise(resolve => setTimeout(resolve, 800));
      runScenarioTest(i);
    }
    
    setIsRunning(false);
    setCurrentScenario(0);
  };

  const passedTests = testResults.filter(test => test.passed).length;
  const totalTests = testResults.length;

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Target className="h-5 w-5" />
          Winner Determination Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Test winner logic and tie-breaker rules
          </div>
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            size="sm"
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
          >
            {isRunning ? 'Testing...' : 'Run Tests'}
          </Button>
        </div>

        {isRunning && (
          <div className="bg-puzzle-aqua/10 border border-puzzle-aqua/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-puzzle-aqua animate-pulse" />
              <span className="text-sm text-puzzle-aqua">
                Testing: {testScenarios[currentScenario]?.name}
              </span>
            </div>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-400">
                  {passedTests}/{totalTests}
                </div>
                <div className="text-xs text-gray-400">Tests Passed</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-puzzle-gold">
                  {totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
            </div>

            <div className="space-y-2">
              {testScenarios.map((scenario, index) => {
                const result = testResults.find(r => r.scenario === scenario.name);
                return (
                  <div key={index} className="bg-gray-800 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result?.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : result?.passed === false ? (
                          <XCircle className="h-4 w-4 text-red-400" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-gray-600" />
                        )}
                        <span className="text-sm font-medium text-puzzle-white">
                          {scenario.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-puzzle-aqua/20 text-puzzle-aqua text-xs">
                          {scenario.expectedWinner}
                        </Badge>
                        {result && (
                          <Badge className={result.passed 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                          }>
                            {result.passed ? 'PASS' : 'FAIL'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400 mb-2">
                      {scenario.description} - {scenario.testLogic}
                    </div>
                    
                    {result && (
                      <div className="text-xs text-gray-300">
                        {result.details}
                      </div>
                    )}
                    
                    <div className="mt-2 space-y-1">
                      {scenario.gameResults.map((gameResult, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-gray-700 rounded p-2">
                          <span className="text-puzzle-white">{gameResult.playerName}</span>
                          <div className="flex items-center gap-3 text-gray-400">
                            <span>{gameResult.wordsFound}/{gameResult.totalWords}</span>
                            <span>{gameResult.score} pts</span>
                            <span>{(gameResult.completionTime / 1000).toFixed(1)}s</span>
                            {gameResult.incorrectSelections > 0 && (
                              <span className="text-red-400">-{gameResult.incorrectSelections}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Winner determination logic: 1) Completion status 2) Score 3) Submission time.
          All scenarios must pass for competitive integrity.
        </div>
      </CardContent>
    </Card>
  );
};

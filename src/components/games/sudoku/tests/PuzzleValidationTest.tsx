
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { generateSudoku, solveSudoku, isValidMove } from '../utils/sudokuEngine';
import { SudokuDifficulty, SudokuSize } from '../types/sudokuTypes';

interface ValidationResult {
  difficulty: SudokuDifficulty;
  size: SudokuSize;
  totalGenerated: number;
  validSolutions: number;
  avgGenerationTime: number;
  uniqueSolutions: number;
}

export function PuzzleValidationTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [currentTest, setCurrentTest] = useState('');

  const runValidationTests = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    
    const difficulties: SudokuDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
    const sizes: SudokuSize[] = [4, 6, 9];
    const puzzlesPerTest = 100;
    
    let totalTests = difficulties.length * sizes.length;
    let completedTests = 0;
    
    for (const difficulty of difficulties) {
      for (const size of sizes) {
        setCurrentTest(`Testing ${difficulty} ${size}x${size}`);
        
        let validSolutions = 0;
        let uniqueSolutions = 0;
        let totalGenerationTime = 0;
        const solutions = new Set<string>();
        
        for (let i = 0; i < puzzlesPerTest; i++) {
          const startTime = performance.now();
          
          try {
            const { puzzle, solution } = generateSudoku(size, difficulty);
            const endTime = performance.now();
            totalGenerationTime += (endTime - startTime);
            
            // Verify the solution is valid
            const solvedPuzzle = solveSudoku(puzzle, size);
            if (solvedPuzzle && JSON.stringify(solvedPuzzle) === JSON.stringify(solution)) {
              validSolutions++;
              
              // Check uniqueness
              const solutionString = JSON.stringify(solution);
              if (!solutions.has(solutionString)) {
                solutions.add(solutionString);
                uniqueSolutions++;
              }
            }
          } catch (error) {
            console.error(`Error generating ${difficulty} ${size}x${size} puzzle:`, error);
          }
          
          // Update progress within current test
          const testProgress = ((i + 1) / puzzlesPerTest) * (1 / totalTests);
          const overallProgress = (completedTests / totalTests) + testProgress;
          setProgress(overallProgress * 100);
        }
        
        const result: ValidationResult = {
          difficulty,
          size,
          totalGenerated: puzzlesPerTest,
          validSolutions,
          avgGenerationTime: totalGenerationTime / puzzlesPerTest,
          uniqueSolutions
        };
        
        setResults(prev => [...prev, result]);
        completedTests++;
        setProgress((completedTests / totalTests) * 100);
      }
    }
    
    setIsRunning(false);
    setCurrentTest('Complete');
  };

  const getSuccessRate = (result: ValidationResult) => {
    return (result.validSolutions / result.totalGenerated) * 100;
  };

  const getUniquenessRate = (result: ValidationResult) => {
    return (result.uniqueSolutions / result.totalGenerated) * 100;
  };

  const getBadgeColor = (rate: number) => {
    if (rate >= 95) return 'bg-green-500';
    if (rate >= 85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white">
            Puzzle Validation Test - 100 Puzzles per Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={runValidationTests}
              disabled={isRunning}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              {isRunning ? 'Running Tests...' : 'Start Validation Tests'}
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

      {results.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white">Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2 text-puzzle-white">Configuration</th>
                    <th className="text-left p-2 text-puzzle-white">Valid Solutions</th>
                    <th className="text-left p-2 text-puzzle-white">Success Rate</th>
                    <th className="text-left p-2 text-puzzle-white">Unique Solutions</th>
                    <th className="text-left p-2 text-puzzle-white">Avg Gen Time</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="p-2">
                        <div className="text-puzzle-white font-medium">
                          {result.difficulty} {result.size}×{result.size}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-puzzle-white">
                          {result.validSolutions}/{result.totalGenerated}
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge className={getBadgeColor(getSuccessRate(result))}>
                          {getSuccessRate(result).toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="text-puzzle-white">
                          {result.uniqueSolutions} ({getUniquenessRate(result).toFixed(1)}%)
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-puzzle-white">
                          {result.avgGenerationTime.toFixed(1)}ms
                        </div>
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

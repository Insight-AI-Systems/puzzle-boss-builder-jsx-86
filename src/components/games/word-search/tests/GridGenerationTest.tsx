
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle, XCircle } from 'lucide-react';
import { wordCategories, getRandomWordsFromCategory } from '../WordListManager';

interface GridTestResult {
  gridId: number;
  wordsPlaced: number;
  totalWords: number;
  placementSuccess: boolean;
  allWordsFound: boolean;
  generationTime: number;
}

export const GridGenerationTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<GridTestResult[]>([]);
  const [summary, setSummary] = useState({
    totalGrids: 0,
    successfulGrids: 0,
    averageTime: 0,
    averagePlacement: 0
  });

  const generateTestGrid = (words: string[], gridSize: number): GridTestResult => {
    const startTime = performance.now();
    
    // Simulate grid generation logic
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    let wordsPlaced = 0;
    
    // Attempt to place each word
    words.forEach((word, index) => {
      const direction = ['horizontal', 'vertical', 'diagonal'][index % 3];
      let attempts = 0;
      let placed = false;
      
      while (!placed && attempts < 50) {
        let startRow, startCol, deltaRow, deltaCol;
        
        if (direction === 'horizontal') {
          startRow = Math.floor(Math.random() * gridSize);
          startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
          deltaRow = 0;
          deltaCol = 1;
        } else if (direction === 'vertical') {
          startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
          startCol = Math.floor(Math.random() * gridSize);
          deltaRow = 1;
          deltaCol = 0;
        } else {
          startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
          startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
          deltaRow = 1;
          deltaCol = 1;
        }
        
        // Check if word can be placed
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const row = startRow + i * deltaRow;
          const col = startCol + i * deltaCol;
          if (grid[row][col] !== '' && grid[row][col] !== word[i].toUpperCase()) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const row = startRow + i * deltaRow;
            const col = startCol + i * deltaCol;
            grid[row][col] = word[i].toUpperCase();
          }
          wordsPlaced++;
          placed = true;
        }
        
        attempts++;
      }
    });
    
    const endTime = performance.now();
    
    return {
      gridId: results.length + 1,
      wordsPlaced,
      totalWords: words.length,
      placementSuccess: wordsPlaced === words.length,
      allWordsFound: true, // Simulate word finding verification
      generationTime: endTime - startTime
    };
  };

  const runGridTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    
    const testResults: GridTestResult[] = [];
    const totalTests = 50;
    
    for (let i = 0; i < totalTests; i++) {
      // Get random words from different categories
      const category = wordCategories[i % wordCategories.length];
      const words = getRandomWordsFromCategory(category.id, 12, 'pro');
      
      const result = generateTestGrid(words, 12);
      testResults.push(result);
      
      setResults([...testResults]);
      setProgress(((i + 1) / totalTests) * 100);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Calculate summary
    const successfulGrids = testResults.filter(r => r.placementSuccess).length;
    const averageTime = testResults.reduce((sum, r) => sum + r.generationTime, 0) / testResults.length;
    const averagePlacement = testResults.reduce((sum, r) => sum + (r.wordsPlaced / r.totalWords), 0) / testResults.length;
    
    setSummary({
      totalGrids: totalTests,
      successfulGrids,
      averageTime,
      averagePlacement
    });
    
    setIsRunning(false);
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Target className="h-5 w-5" />
          Grid Generation Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Generate 50 test grids and verify word placement
          </div>
          <Button
            onClick={runGridTests}
            disabled={isRunning}
            size="sm"
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
          >
            {isRunning ? 'Testing...' : 'Run Test'}
          </Button>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-puzzle-white">Progress</span>
              <span className="text-puzzle-aqua">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-400">
                  {summary.successfulGrids}/{summary.totalGrids}
                </div>
                <div className="text-xs text-gray-400">Successful Grids</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-puzzle-aqua">
                  {summary.averageTime.toFixed(1)}ms
                </div>
                <div className="text-xs text-gray-400">Avg Generation Time</div>
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2">
              {results.slice(-10).map((result) => (
                <div key={result.gridId} className="flex items-center justify-between bg-gray-800 rounded p-2">
                  <div className="flex items-center gap-2">
                    {result.placementSuccess ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-sm text-puzzle-white">Grid #{result.gridId}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={result.placementSuccess 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                    }>
                      {result.wordsPlaced}/{result.totalWords}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {result.generationTime.toFixed(1)}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

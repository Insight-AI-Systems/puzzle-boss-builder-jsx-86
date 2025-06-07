
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy, Target, CheckCircle, Pause, Play } from 'lucide-react';
import { useGameTimer } from '../hooks/useGameTimer';

interface WordSearchEngineProps {
  difficulty: 'rookie' | 'pro' | 'master';
  category: string;
  wordList: string[];
  onComplete?: (stats: { timeElapsed: number; wordsFound: number; totalWords: number }) => void;
  onWordFound?: (word: string, found: number, total: number) => void;
}

const WordSearchEngine: React.FC<WordSearchEngineProps> = ({
  difficulty,
  category,
  wordList,
  onComplete,
  onWordFound
}) => {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  
  const gridSize = difficulty === 'master' ? 15 : difficulty === 'pro' ? 12 : 10;
  const timeLimit = difficulty === 'master' ? 600 : difficulty === 'pro' ? 480 : 360;
  
  const { 
    timeElapsed, 
    isActive, 
    start: startTimer, 
    pause: pauseTimer, 
    resume: resumeTimer 
  } = useGameTimer(timeLimit);

  // Create a stable grid that doesn't change on re-renders
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordPositions, setWordPositions] = useState<Map<string, Array<[number, number]>>>(new Map());
  const gridInitialized = useRef(false);

  // Initialize grid only once
  useEffect(() => {
    if (!gridInitialized.current && wordList.length > 0) {
      const newGrid = generateWordSearchGrid(gridSize, wordList);
      setGrid(newGrid.grid);
      setWordPositions(newGrid.positions);
      gridInitialized.current = true;
    }
  }, [gridSize, wordList]);

  // Reset game state when wordList changes
  useEffect(() => {
    setFoundWords(new Set());
    setGameStarted(false);
    setGameComplete(false);
    setIsPaused(false);
    setScore(0);
    gridInitialized.current = false;
  }, [wordList]);

  const handleGameStart = useCallback(() => {
    if (!gameStarted && !gameComplete) {
      setGameStarted(true);
      startTimer();
    }
  }, [gameStarted, gameComplete, startTimer]);

  const handlePauseToggle = useCallback(() => {
    if (gameStarted && !gameComplete) {
      if (isPaused) {
        setIsPaused(false);
        resumeTimer();
      } else {
        setIsPaused(true);
        pauseTimer();
      }
    }
  }, [gameStarted, gameComplete, isPaused, resumeTimer, pauseTimer]);

  const handleWordFound = useCallback((word: string) => {
    if (!foundWords.has(word)) {
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(word);
      setFoundWords(newFoundWords);
      
      // Calculate score
      const timeBonus = Math.max(0, timeLimit - timeElapsed);
      const wordScore = 100 + Math.floor(timeBonus / 10);
      setScore(prev => prev + wordScore);
      
      onWordFound?.(word, newFoundWords.size, wordList.length);
      
      // Check if game is complete
      if (newFoundWords.size === wordList.length) {
        setGameComplete(true);
        pauseTimer();
        onComplete?.({
          timeElapsed,
          wordsFound: newFoundWords.size,
          totalWords: wordList.length
        });
      }
    }
  }, [foundWords, wordList.length, timeElapsed, timeLimit, onWordFound, onComplete, pauseTimer]);

  const progress = (foundWords.size / wordList.length) * 100;
  const timeRemaining = Math.max(0, timeLimit - timeElapsed);

  if (grid.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-puzzle-aqua border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-puzzle-white">Generating word search puzzle...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Game Stats */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Clock className="h-5 w-5 text-puzzle-aqua mx-auto mb-1" />
              <div className="text-sm text-gray-400">Time Left</div>
              <div className="text-lg font-bold text-puzzle-white">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <div className="text-center">
              <Target className="h-5 w-5 text-puzzle-gold mx-auto mb-1" />
              <div className="text-sm text-gray-400">Found</div>
              <div className="text-lg font-bold text-puzzle-white">
                {foundWords.size}/{wordList.length}
              </div>
            </div>
            <div className="text-center">
              <Trophy className="h-5 w-5 text-puzzle-gold mx-auto mb-1" />
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-lg font-bold text-puzzle-white">{score}</div>
            </div>
            <div className="text-center">
              <CheckCircle className="h-5 w-5 text-puzzle-aqua mx-auto mb-1" />
              <div className="text-sm text-gray-400">Progress</div>
              <div className="text-lg font-bold text-puzzle-white">{Math.round(progress)}%</div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardContent>
      </Card>

      {/* Game Controls */}
      {!gameStarted && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <Button 
              onClick={handleGameStart}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      )}

      {gameStarted && !gameComplete && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <Button 
              onClick={handlePauseToggle}
              variant="outline"
              className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
            >
              {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Word List */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white text-sm">
            Words to Find ({category})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {wordList.map((word) => (
              <Badge
                key={word}
                variant={foundWords.has(word) ? "default" : "outline"}
                className={
                  foundWords.has(word)
                    ? "bg-puzzle-gold text-puzzle-black"
                    : "border-gray-600 text-gray-400"
                }
              >
                {word}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Grid */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <WordSearchGrid
            grid={grid}
            wordPositions={wordPositions}
            foundWords={foundWords}
            onWordFound={handleWordFound}
            disabled={!gameStarted || gameComplete || isPaused}
          />
        </CardContent>
      </Card>

      {gameComplete && (
        <Card className="bg-green-900/20 border-green-500">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 text-puzzle-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold text-puzzle-white mb-2">
              Puzzle Completed!
            </h3>
            <p className="text-gray-300">
              You found all {wordList.length} words in {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-puzzle-gold font-semibold mt-2">
              Final Score: {score}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Simple word search grid component
interface WordSearchGridProps {
  grid: string[][];
  wordPositions: Map<string, Array<[number, number]>>;
  foundWords: Set<string>;
  onWordFound: (word: string) => void;
  disabled: boolean;
}

const WordSearchGrid: React.FC<WordSearchGridProps> = ({
  grid,
  wordPositions,
  foundWords,
  onWordFound,
  disabled
}) => {
  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Array<[number, number]>>([]);

  const handleMouseDown = (row: number, col: number) => {
    if (disabled) return;
    setSelecting(true);
    setSelectedCells([[row, col]]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (disabled || !selecting) return;
    
    const start = selectedCells[0];
    if (!start) return;
    
    const path = getLinePath(start[0], start[1], row, col);
    setSelectedCells(path);
  };

  const handleMouseUp = () => {
    if (disabled || !selecting) return;
    
    setSelecting(false);
    
    // Check if selected cells form a word
    const selectedWord = selectedCells.map(([r, c]) => grid[r]?.[c] || '').join('');
    const reverseWord = selectedWord.split('').reverse().join('');
    
    // Check both forward and backward
    for (const [word, positions] of wordPositions.entries()) {
      if ((selectedWord === word || reverseWord === word) && !foundWords.has(word)) {
        onWordFound(word);
        break;
      }
    }
    
    setSelectedCells([]);
  };

  const getLinePath = (startRow: number, startCol: number, endRow: number, endCol: number): Array<[number, number]> => {
    const path: Array<[number, number]> = [];
    const deltaRow = endRow - startRow;
    const deltaCol = endCol - startCol;
    
    // Ensure we're moving in a straight line (horizontal, vertical, or diagonal)
    if (deltaRow !== 0 && deltaCol !== 0 && Math.abs(deltaRow) !== Math.abs(deltaCol)) {
      return [[startRow, startCol]];
    }
    
    const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
    const stepRow = steps === 0 ? 0 : deltaRow / steps;
    const stepCol = steps === 0 ? 0 : deltaCol / steps;
    
    for (let i = 0; i <= steps; i++) {
      const row = Math.round(startRow + stepRow * i);
      const col = Math.round(startCol + stepCol * i);
      if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
        path.push([row, col]);
      }
    }
    
    return path;
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isCellInFoundWord = (row: number, col: number) => {
    for (const [word, positions] of wordPositions.entries()) {
      if (foundWords.has(word)) {
        if (positions.some(([r, c]) => r === row && c === col)) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div 
      className="grid gap-1 mx-auto w-fit select-none"
      style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))` }}
      onMouseLeave={() => {
        setSelecting(false);
        setSelectedCells([]);
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`
              w-8 h-8 flex items-center justify-center text-sm font-mono border border-gray-600 cursor-pointer
              ${isCellInFoundWord(rowIndex, colIndex) 
                ? 'bg-puzzle-gold text-puzzle-black' 
                : isCellSelected(rowIndex, colIndex)
                  ? 'bg-puzzle-aqua text-puzzle-black'
                  : 'bg-gray-800 text-puzzle-white hover:bg-gray-700'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            onMouseUp={handleMouseUp}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
};

// Generate word search grid
function generateWordSearchGrid(size: number, words: string[]): { grid: string[][]; positions: Map<string, Array<[number, number]>> } {
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
  const positions = new Map<string, Array<[number, number]>>();
  
  // Place words in the grid
  for (const word of words) {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 100) {
      const direction = Math.floor(Math.random() * 8); // 8 directions
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      
      if (canPlaceWord(grid, word, row, col, direction, size)) {
        placeWord(grid, word, row, col, direction, positions);
        placed = true;
      }
      attempts++;
    }
  }
  
  // Fill empty cells with random letters
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  
  return { grid, positions };
}

function canPlaceWord(grid: string[][], word: string, row: number, col: number, direction: number, size: number): boolean {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  const [dRow, dCol] = directions[direction];
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + dRow * i;
    const newCol = col + dCol * i;
    
    if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
      return false;
    }
    
    if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
      return false;
    }
  }
  
  return true;
}

function placeWord(grid: string[][], word: string, row: number, col: number, direction: number, positions: Map<string, Array<[number, number]>>) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  const [dRow, dCol] = directions[direction];
  const wordPositions: Array<[number, number]> = [];
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + dRow * i;
    const newCol = col + dCol * i;
    grid[newRow][newCol] = word[i];
    wordPositions.push([newRow, newCol]);
  }
  
  positions.set(word.toUpperCase(), wordPositions);
}

export default WordSearchEngine;

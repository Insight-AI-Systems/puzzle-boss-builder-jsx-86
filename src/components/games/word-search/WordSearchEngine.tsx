
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Target, Eye } from 'lucide-react';
import { useGameTimer } from '../hooks/useGameTimer';
import { useToast } from '@/hooks/use-toast';

interface WordSearchProps {
  difficulty: 'rookie' | 'pro' | 'master';
  category: string;
  wordList: string[];
  onComplete?: (stats: { timeElapsed: number; wordsFound: number; totalWords: number }) => void;
  onWordFound?: (word: string, wordsFound: number, totalWords: number) => void;
}

interface GridCell {
  letter: string;
  row: number;
  col: number;
  isPartOfWord?: boolean;
  wordId?: string;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse';
  found: boolean;
  cells: { row: number; col: number }[];
}

const WordSearchEngine: React.FC<WordSearchProps> = ({
  difficulty,
  category,
  wordList,
  onComplete,
  onWordFound
}) => {
  const gridSizes = { rookie: 10, pro: 12, master: 15 };
  const gridSize = gridSizes[difficulty];
  
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ row: number; col: number } | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [showHints, setShowHints] = useState(false);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const timer = useGameTimer();
  const { toast } = useToast();

  // Generate random letter
  const getRandomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

  // Check if placement is valid
  const canPlaceWord = (word: string, row: number, col: number, direction: string, currentGrid: GridCell[][]) => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1],
      'diagonal-reverse': [1, -1]
    };
    
    const [dRow, dCol] = directions[direction as keyof typeof directions];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      
      if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
        return false;
      }
      
      const cell = currentGrid[newRow][newCol];
      if (cell.letter !== '' && cell.letter !== word[i]) {
        return false;
      }
    }
    return true;
  };

  // Place word in grid
  const placeWord = (word: string, row: number, col: number, direction: string, currentGrid: GridCell[][], wordId: string) => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1],
      'diagonal-reverse': [1, -1]
    };
    
    const [dRow, dCol] = directions[direction as keyof typeof directions];
    const cells: { row: number; col: number }[] = [];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      
      currentGrid[newRow][newCol] = {
        ...currentGrid[newRow][newCol],
        letter: word[i],
        isPartOfWord: true,
        wordId
      };
      
      cells.push({ row: newRow, col: newCol });
    }
    
    return {
      word,
      startRow: row,
      startCol: col,
      direction: direction as PlacedWord['direction'],
      found: false,
      cells
    };
  };

  // Generate word search grid
  const generateGrid = useCallback(() => {
    // Initialize empty grid
    const newGrid: GridCell[][] = Array(gridSize).fill(null).map((_, row) =>
      Array(gridSize).fill(null).map((_, col) => ({
        letter: '',
        row,
        col,
        isPartOfWord: false,
        isHighlighted: false,
        isSelected: false
      }))
    );

    const newPlacedWords: PlacedWord[] = [];
    const directions = ['horizontal', 'vertical', 'diagonal', 'diagonal-reverse'];
    
    // Place words
    wordList.forEach((word, index) => {
      const upperWord = word.toUpperCase();
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        
        if (canPlaceWord(upperWord, row, col, direction, newGrid)) {
          const placedWord = placeWord(upperWord, row, col, direction, newGrid, `word-${index}`);
          newPlacedWords.push(placedWord);
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells with random letters
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (newGrid[row][col].letter === '') {
          newGrid[row][col].letter = getRandomLetter();
        }
      }
    }

    setGrid(newGrid);
    setPlacedWords(newPlacedWords);
    setFoundWords(new Set());
    timer.start();
  }, [gridSize, wordList, timer]);

  // Initialize game
  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  // Get cells in selection line
  const getCellsInLine = (start: { row: number; col: number }, end: { row: number; col: number }) => {
    const cells: string[] = [];
    const dRow = end.row - start.row;
    const dCol = end.col - start.col;
    const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
    
    if (steps === 0) {
      cells.push(`${start.row}-${start.col}`);
      return cells;
    }
    
    const stepRow = dRow / steps;
    const stepCol = dCol / steps;
    
    for (let i = 0; i <= steps; i++) {
      const row = Math.round(start.row + i * stepRow);
      const col = Math.round(start.col + i * stepCol);
      cells.push(`${row}-${col}`);
    }
    
    return cells;
  };

  // Check if selection matches a word
  const checkWordMatch = (cells: string[]) => {
    const selectedLetters = cells.map(cellKey => {
      const [row, col] = cellKey.split('-').map(Number);
      return grid[row][col].letter;
    }).join('');
    
    const reversedLetters = selectedLetters.split('').reverse().join('');
    
    for (const placedWord of placedWords) {
      if ((placedWord.word === selectedLetters || placedWord.word === reversedLetters) && !placedWord.found) {
        return placedWord;
      }
    }
    return null;
  };

  // Handle mouse events
  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setSelectionEnd({ row, col });
    setSelectedCells(new Set([`${row}-${col}`]));
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting && selectionStart) {
      setSelectionEnd({ row, col });
      const cells = getCellsInLine(selectionStart, { row, col });
      setSelectedCells(new Set(cells));
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectionStart && selectionEnd) {
      const cells = getCellsInLine(selectionStart, selectionEnd);
      const matchedWord = checkWordMatch(cells);
      
      if (matchedWord) {
        // Mark word as found
        const newFoundWords = new Set(foundWords);
        newFoundWords.add(matchedWord.word);
        setFoundWords(newFoundWords);
        
        // Update placed words
        setPlacedWords(prev => prev.map(word => 
          word.word === matchedWord.word ? { ...word, found: true } : word
        ));
        
        // Highlight word cells
        setGrid(prev => prev.map(row => row.map(cell => {
          const cellKey = `${cell.row}-${cell.col}`;
          if (cells.includes(cellKey) && matchedWord.cells.some(c => c.row === cell.row && c.col === cell.col)) {
            return { ...cell, isHighlighted: true };
          }
          return cell;
        })));
        
        toast({
          title: "Word Found!",
          description: `Found: ${matchedWord.word}`,
          icon: "check"
        });
        
        onWordFound?.(matchedWord.word, newFoundWords.size, placedWords.length);
        
        // Check for completion
        if (newFoundWords.size === placedWords.length) {
          timer.stop();
          onComplete?.({
            timeElapsed: timer.timeElapsed,
            wordsFound: newFoundWords.size,
            totalWords: placedWords.length
          });
        }
      }
    }
    
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    setSelectedCells(new Set());
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    handleMouseDown(row, col);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isSelecting && gridRef.current) {
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.dataset.row && element.dataset.col) {
        const row = parseInt(element.dataset.row);
        const col = parseInt(element.dataset.col);
        handleMouseEnter(row, col);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  };

  const getCellClassName = (cell: GridCell) => {
    let className = "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-base font-bold border border-gray-300 cursor-pointer select-none transition-colors duration-200 ";
    
    if (cell.isHighlighted) {
      className += "bg-green-200 text-green-800 ";
    } else if (selectedCells.has(`${cell.row}-${cell.col}`)) {
      className += "bg-blue-200 text-blue-800 ";
    } else if (showHints && cell.isPartOfWord) {
      className += "bg-yellow-100 text-yellow-800 ";
    } else {
      className += "bg-white hover:bg-gray-100 ";
    }
    
    return className;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Game Header */}
      <Card className="mb-4">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Word Search - {category}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                <Clock className="h-3 w-3 mr-1" />
                {timer.formattedTime}
              </Badge>
              <Badge variant="outline" className="text-puzzle-gold border-puzzle-gold">
                {foundWords.size}/{placedWords.length} Words
              </Badge>
              <Badge variant="outline">
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} - {gridSize}x{gridSize}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Word Search Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Find the Words</h3>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 px-3 py-1 bg-puzzle-aqua text-puzzle-black rounded-md hover:bg-puzzle-aqua/80 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  {showHints ? 'Hide' : 'Show'} Hints
                </button>
              </div>
              
              <div 
                ref={gridRef}
                className="inline-block border-2 border-gray-400 select-none touch-none"
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={getCellClassName(cell)}
                        data-row={rowIndex}
                        data-col={colIndex}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleMouseUp}
                        onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                      >
                        {cell.letter}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Word List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Words to Find</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {placedWords.map((placedWord, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded ${
                      placedWord.found 
                        ? 'bg-green-100 text-green-800 line-through' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {placedWord.found && <CheckCircle className="h-4 w-4" />}
                    <span className="font-medium">{placedWord.word}</span>
                  </div>
                ))}
              </div>
              
              {foundWords.size === placedWords.length && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                  <h4 className="font-bold">Congratulations! 🎉</h4>
                  <p>You found all words in {timer.formattedTime}!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WordSearchEngine;

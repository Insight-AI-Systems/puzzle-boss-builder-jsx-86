
import React, { useState, useEffect } from 'react';
import EnhancedJigsawPuzzle from './engines/EnhancedJigsawPuzzle';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DifficultyLevel } from './types/puzzle-types';

// Define props interface for PuzzleGame
interface PuzzleGameProps {
  imageUrl: string;
  difficultyLevel?: DifficultyLevel;
  puzzleId?: string;
  userId?: string;
  isPremium?: boolean;
  onComplete?: (stats: { moves: number, time: number }) => void;
  // Add the following props to fix the TypeScript errors
  rows?: number;
  columns?: number;
  showNumbers?: boolean;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({
  imageUrl,
  difficultyLevel = '4x4',
  puzzleId = 'demo-puzzle',
  userId,
  isPremium = false,
  onComplete,
  // Handle the new props with defaults
  rows,
  columns,
  showNumbers = false
}) => {
  const { toast } = useToast();
  const [showNumbersState, setShowNumbers] = useState(showNumbers);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(difficultyLevel);
  
  // Map difficulty level to grid dimensions if rows/columns are not directly provided
  const getDifficultyConfig = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case '3x3':
        return { rows: 3, columns: 3 };
      case '4x4':
        return { rows: 4, columns: 4 };
      case '5x5':
        return { rows: 5, columns: 5 };
      case '6x6':
        return { rows: 6, columns: 6 };
      default:
        return { rows: 4, columns: 4 };
    }
  };
  
  // Use provided rows/columns or derive from difficulty
  const gridConfig = {
    rows: rows || getDifficultyConfig(selectedDifficulty).rows,
    columns: columns || getDifficultyConfig(selectedDifficulty).columns
  };
  
  const handlePuzzleComplete = (stats: { moves: number, time: number }) => {
    toast({
      title: "Puzzle Completed!",
      description: `You solved it in ${stats.moves} moves and ${Math.floor(stats.time / 60)}:${(stats.time % 60).toString().padStart(2, '0')}!`,
      variant: "default",
    });
    
    if (onComplete) {
      onComplete(stats);
    }
  };
  
  // Only re-render the puzzle when difficulty or image changes to avoid state loss
  const puzzleKey = `${imageUrl}-${selectedDifficulty}-${puzzleId}-${rows}-${columns}`;
  
  // If direct rows/columns are provided, skip the tabs UI
  if (rows && columns) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        <EnhancedJigsawPuzzle
          key={puzzleKey}
          imageUrl={imageUrl}
          rows={gridConfig.rows}
          columns={gridConfig.columns}
          puzzleId={puzzleId}
          userId={userId}
          showNumbers={showNumbersState}
          isPremium={isPremium}
          onComplete={handlePuzzleComplete}
        />
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <Tabs
          value={selectedDifficulty}
          onValueChange={(value) => setSelectedDifficulty(value as DifficultyLevel)}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="3x3">Easy (3×3)</TabsTrigger>
              <TabsTrigger value="4x4">Medium (4×4)</TabsTrigger>
              <TabsTrigger value="5x5">Hard (5×5)</TabsTrigger>
              <TabsTrigger value="6x6">Expert (6×6)</TabsTrigger>
            </TabsList>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showNumbersState}
                onChange={() => setShowNumbers(!showNumbersState)}
                className="rounded border-gray-300 focus:ring-primary"
              />
              <span>Show Numbers</span>
            </label>
          </div>
          
          <TabsContent value="3x3" className="mt-0">
            <EnhancedJigsawPuzzle
              key={`${puzzleKey}-3x3`}
              imageUrl={imageUrl}
              rows={3}
              columns={3}
              puzzleId={`${puzzleId}-easy`}
              userId={userId}
              showNumbers={showNumbersState}
              isPremium={isPremium}
              onComplete={handlePuzzleComplete}
            />
          </TabsContent>
          
          <TabsContent value="4x4" className="mt-0">
            <EnhancedJigsawPuzzle
              key={`${puzzleKey}-4x4`}
              imageUrl={imageUrl}
              rows={4}
              columns={4}
              puzzleId={`${puzzleId}-medium`}
              userId={userId}
              showNumbers={showNumbersState}
              isPremium={isPremium}
              onComplete={handlePuzzleComplete}
            />
          </TabsContent>
          
          <TabsContent value="5x5" className="mt-0">
            <EnhancedJigsawPuzzle
              key={`${puzzleKey}-5x5`}
              imageUrl={imageUrl}
              rows={5}
              columns={5}
              puzzleId={`${puzzleId}-hard`}
              userId={userId}
              showNumbers={showNumbersState}
              isPremium={isPremium}
              onComplete={handlePuzzleComplete}
            />
          </TabsContent>
          
          <TabsContent value="6x6" className="mt-0">
            <EnhancedJigsawPuzzle
              key={`${puzzleKey}-6x6`}
              imageUrl={imageUrl}
              rows={6}
              columns={6}
              puzzleId={`${puzzleId}-expert`}
              userId={userId}
              showNumbers={showNumbersState}
              isPremium={isPremium}
              onComplete={handlePuzzleComplete}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PuzzleGame;

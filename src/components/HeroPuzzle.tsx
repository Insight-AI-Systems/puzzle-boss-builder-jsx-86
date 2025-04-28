
import React, { useState, useEffect, useCallback } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { DEFAULT_IMAGES } from './puzzles/types/puzzle-types';
import CustomPuzzleEngine from './puzzles/playground/engines/CustomPuzzleEngine';

interface Puzzle {
  imageUrl: string;
  rows?: number;
  columns?: number;
}

const PUZZLES: Puzzle[] = [
  { imageUrl: DEFAULT_IMAGES[0], rows: 3, columns: 4 },
  { imageUrl: DEFAULT_IMAGES[1], rows: 4, columns: 4 },
  { imageUrl: DEFAULT_IMAGES[2], rows: 5, columns: 5 },
  { imageUrl: DEFAULT_IMAGES[3], rows: 6, columns: 6 },
  { imageUrl: DEFAULT_IMAGES[4], rows: 7, columns: 7 },
];

interface PuzzleEngineProps {
  key: string;
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers: boolean;
  onComplete: (timeElapsedSeconds: number) => void;
  onReset: () => void;
}

const HeroPuzzle = () => {
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(PUZZLES[0]);
  const [showNumbers, setShowNumbers] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  const handlePuzzleSelect = (puzzle: Puzzle) => {
    setActivePuzzle(puzzle);
    setPuzzleKey(prevKey => prevKey + 1); // Force remount
    setCompletionTime(null); // Reset completion time
  };

  const handleShowNumbersToggle = () => {
    setShowNumbers(prev => !prev);
  };

  const handleComplete = (timeElapsedSeconds: number) => {
    setCompletionTime(timeElapsedSeconds);
  };

  const handleReset = () => {
    setCompletionTime(null);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-b">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Unleash Your Inner Puzzle Solver
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Piece together moments of joy with our interactive online jigsaw puzzle.
            </p>
          </div>
          {/* Puzzle Engine */}
          <div className="relative z-10">
            {/* A time key is used to fully reset the puzzle when imageUrl changes */}
            {activePuzzle && (
              <CustomPuzzleEngine
                key={`${activePuzzle.imageUrl}-${puzzleKey}`}
                imageUrl={activePuzzle.imageUrl}
                rows={activePuzzle.rows || 3}
                columns={activePuzzle.columns || 3}
                showNumbers={showNumbers}
                onComplete={handleComplete}
                onReset={handleReset}
              />
            )}
          </div>
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Select a Puzzle</h3>
              <div className="grid grid-cols-2 gap-4">
                {PUZZLES.map((puzzle, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer ${activePuzzle === puzzle ? "ring-2 ring-primary" : "opacity-75 hover:opacity-100"
                      }`}
                    onClick={() => handlePuzzleSelect(puzzle)}
                  >
                    <CardContent className="flex items-center justify-center p-0">
                      <AspectRatio ratio={4 / 3}>
                        <img
                          src={puzzle.imageUrl}
                          alt={`Puzzle ${index + 1}`}
                          className="object-cover"
                        />
                      </AspectRatio>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="show-numbers"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Numbers
              </label>
              <input
                type="checkbox"
                id="show-numbers"
                checked={showNumbers}
                onChange={handleShowNumbersToggle}
                className="ml-2 h-4 w-4 rounded border-gray-200 text-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus:ring-offset-0"
              />
            </div>
            {completionTime !== null && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Completed in {Math.floor(completionTime / 60)}:{(completionTime % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPuzzle;

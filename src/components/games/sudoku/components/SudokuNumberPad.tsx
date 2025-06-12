
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eraser } from 'lucide-react';
import { SudokuSize } from '../types/sudokuTypes';

interface SudokuNumberPadProps {
  size: SudokuSize;
  selectedNumber: number | null;
  onNumberSelect: (number: number) => void;
  onClear: () => void;
  isActive: boolean;
}

export function SudokuNumberPad({
  size,
  selectedNumber,
  onNumberSelect,
  onClear,
  isActive
}: SudokuNumberPadProps) {
  const numbers = Array.from({ length: size }, (_, i) => i + 1);

  // Responsive button sizes
  const getButtonSize = () => {
    switch (size) {
      case 4: return 'h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18';
      case 6: return 'h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16';
      case 9: return 'h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14';
      default: return 'h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16';
    }
  };

  // Responsive text sizes
  const getTextSize = () => {
    switch (size) {
      case 4: return 'text-lg sm:text-xl md:text-2xl';
      case 6: return 'text-base sm:text-lg md:text-xl';
      case 9: return 'text-sm sm:text-base md:text-lg';
      default: return 'text-base sm:text-lg md:text-xl';
    }
  };

  // Grid columns based on size
  const getGridCols = () => {
    return size <= 4 ? 'grid-cols-2' : 'grid-cols-3';
  };

  const buttonSize = getButtonSize();
  const textSize = getTextSize();
  const gridCols = getGridCols();

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <h3 className="text-puzzle-white font-semibold text-center text-base sm:text-lg">Numbers</h3>
          
          {/* Number buttons */}
          <div className={`grid ${gridCols} gap-2 sm:gap-3`}>
            {numbers.map((number) => (
              <Button
                key={number}
                onClick={() => onNumberSelect(number)}
                disabled={!isActive}
                className={`${buttonSize} ${textSize} font-bold transition-all ${
                  selectedNumber === number
                    ? 'bg-puzzle-aqua text-puzzle-black ring-2 ring-puzzle-aqua'
                    : 'bg-gray-700 hover:bg-gray-600 text-puzzle-white'
                }`}
              >
                {number}
              </Button>
            ))}
          </div>
          
          {/* Clear button */}
          <Button
            onClick={onClear}
            disabled={!isActive}
            className="w-full h-12 sm:h-14 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

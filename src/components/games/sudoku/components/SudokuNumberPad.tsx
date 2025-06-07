
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

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="text-puzzle-white font-semibold text-center">Numbers</h3>
          
          {/* Number buttons */}
          <div className="grid grid-cols-3 gap-2">
            {numbers.map((number) => (
              <Button
                key={number}
                onClick={() => onNumberSelect(number)}
                disabled={!isActive}
                className={`h-12 w-12 text-lg font-bold transition-all ${
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
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

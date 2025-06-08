
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface CrosswordCluesProps {
  clues: {
    across: any[];
    down: any[];
  };
  selectedWord?: string | null;
  selectedDirection?: 'across' | 'down';
  selectedClue?: any;
  onClueClick: (clue: string) => void;
}

export function CrosswordClues({ 
  clues, 
  selectedWord, 
  selectedDirection, 
  selectedClue, 
  onClueClick 
}: CrosswordCluesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Across</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {clues.across.map((clue) => (
              <div
                key={clue.id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => onClueClick(clue.id)}
              >
                <span className="font-bold">{clue.number}.</span> {clue.clue}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Down</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {clues.down.map((clue) => (
              <div
                key={clue.id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => onClueClick(clue.id)}
              >
                <span className="font-bold">{clue.number}.</span> {clue.clue}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

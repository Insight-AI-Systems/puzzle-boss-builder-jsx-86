
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WordsListProps {
  words: string[];
  foundWords: Set<string>;
}

export function WordsList({ words, foundWords }: WordsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Words to Find</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {words.map((word, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm ${
                foundWords.has(word)
                  ? 'bg-green-100 text-green-800 line-through'
                  : 'bg-gray-50'
              }`}
            >
              {word.toUpperCase()}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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
        <ScrollArea className="h-64">
          <div className="space-y-1 pr-4">
            {words.map((word, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm font-medium ${
                  foundWords.has(word)
                    ? 'bg-puzzle-aqua/20 text-puzzle-aqua line-through border border-puzzle-aqua/30'
                    : 'bg-puzzle-black/80 text-puzzle-white border border-puzzle-aqua/20 hover:bg-puzzle-aqua/10'
                }`}
              >
                {word.toUpperCase()}
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" className="w-3">
            <div className="relative flex-1 rounded-full bg-orange-500 hover:bg-orange-400 transition-colors" />
          </ScrollBar>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

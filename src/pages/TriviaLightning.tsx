
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TriviaGame } from '@/components/games/trivia/TriviaGame';
import { TriviaLeaderboard } from '@/components/games/trivia/components/TriviaLeaderboard';
import { useTriviaGame } from '@/components/games/trivia/hooks/useTriviaGame';

export default function TriviaLightning() {
  const { categories } = useTriviaGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-puzzle-white mb-4">
            ⚡ Trivia Lightning ⚡
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Test your knowledge across multiple categories. Answer quickly for bonus points!
          </p>
        </div>

        <Tabs defaultValue="play" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 mb-8">
            <TabsTrigger value="play" className="text-puzzle-white">
              Play Quiz
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-puzzle-white">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="play">
            <TriviaGame />
          </TabsContent>

          <TabsContent value="leaderboard">
            <TriviaLeaderboard categories={categories} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

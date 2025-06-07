
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Clock, Target, Star, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../hooks/useMemoryScoring';
import { MemoryLayout } from '../types/memoryTypes';

interface MemoryLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  layout: MemoryLayout;
  personalBests: {
    highestScore: number;
    fastestTime: number;
    lowestMoves: number;
    bestAccuracy: number;
  };
}

export function MemoryLeaderboard({ 
  leaderboard, 
  layout, 
  personalBests 
}: MemoryLeaderboardProps) {
  const [activeTab, setActiveTab] = useState('score');

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-4 h-4 text-yellow-500" />;
      case 2: return <Trophy className="w-4 h-4 text-gray-400" />;
      case 3: return <Trophy className="w-4 h-4 text-amber-600" />;
      default: return <span className="text-gray-500 font-bold">{rank}</span>;
    }
  };

  const sortedByScore = [...leaderboard].sort((a, b) => b.score - a.score);
  const sortedByTime = [...leaderboard].sort((a, b) => a.timeElapsed - b.timeElapsed);
  const sortedByMoves = [...leaderboard].sort((a, b) => a.moves - b.moves);
  const sortedByAccuracy = [...leaderboard].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-puzzle-gold" />
          Leaderboards - {layout.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Personal Bests */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-puzzle-gold/30">
          <h3 className="text-puzzle-gold font-semibold mb-3">Your Personal Bests</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <Trophy className="w-4 h-4 text-puzzle-gold mx-auto mb-1" />
              <div className="text-sm font-bold text-puzzle-white">
                {personalBests.highestScore.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">High Score</div>
            </div>
            <div className="text-center">
              <Clock className="w-4 h-4 text-puzzle-aqua mx-auto mb-1" />
              <div className="text-sm font-bold text-puzzle-white">
                {personalBests.fastestTime === Infinity ? 'N/A' : formatTime(personalBests.fastestTime)}
              </div>
              <div className="text-xs text-gray-400">Best Time</div>
            </div>
            <div className="text-center">
              <Target className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-puzzle-white">
                {personalBests.lowestMoves === Infinity ? 'N/A' : personalBests.lowestMoves}
              </div>
              <div className="text-xs text-gray-400">Fewest Moves</div>
            </div>
            <div className="text-center">
              <Star className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-puzzle-white">
                {personalBests.bestAccuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">Best Accuracy</div>
            </div>
          </div>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="score" className="text-xs">Score</TabsTrigger>
            <TabsTrigger value="time" className="text-xs">Time</TabsTrigger>
            <TabsTrigger value="moves" className="text-xs">Moves</TabsTrigger>
            <TabsTrigger value="accuracy" className="text-xs">Accuracy</TabsTrigger>
          </TabsList>

          <TabsContent value="score" className="mt-4">
            <div className="space-y-2">
              {sortedByScore.slice(0, 10).map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRankIcon(index + 1)}
                    <div>
                      <div className="font-semibold text-puzzle-white">{entry.playerName}</div>
                      <div className="text-xs text-gray-400">
                        {formatTime(entry.timeElapsed)} • {entry.moves} moves • {entry.accuracy.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-puzzle-gold">{entry.score.toLocaleString()}</div>
                    {entry.isPerfectGame && (
                      <Badge className="bg-puzzle-gold text-puzzle-black text-xs">Perfect</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="time" className="mt-4">
            <div className="space-y-2">
              {sortedByTime.slice(0, 10).map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRankIcon(index + 1)}
                    <div>
                      <div className="font-semibold text-puzzle-white">{entry.playerName}</div>
                      <div className="text-xs text-gray-400">
                        {entry.score.toLocaleString()} pts • {entry.moves} moves
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-puzzle-aqua">{formatTime(entry.timeElapsed)}</div>
                    {entry.isPerfectGame && (
                      <Badge className="bg-puzzle-gold text-puzzle-black text-xs">Perfect</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="moves" className="mt-4">
            <div className="space-y-2">
              {sortedByMoves.slice(0, 10).map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRankIcon(index + 1)}
                    <div>
                      <div className="font-semibold text-puzzle-white">{entry.playerName}</div>
                      <div className="text-xs text-gray-400">
                        {entry.score.toLocaleString()} pts • {formatTime(entry.timeElapsed)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-400">{entry.moves}</div>
                    {entry.isPerfectGame && (
                      <Badge className="bg-puzzle-gold text-puzzle-black text-xs">Perfect</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accuracy" className="mt-4">
            <div className="space-y-2">
              {sortedByAccuracy.slice(0, 10).map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRankIcon(index + 1)}
                    <div>
                      <div className="font-semibold text-puzzle-white">{entry.playerName}</div>
                      <div className="text-xs text-gray-400">
                        {entry.score.toLocaleString()} pts • {entry.moves} moves
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">{entry.accuracy.toFixed(1)}%</div>
                    {entry.isPerfectGame && (
                      <Badge className="bg-puzzle-gold text-puzzle-black text-xs">Perfect</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <div>No scores yet. Be the first to complete a game!</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

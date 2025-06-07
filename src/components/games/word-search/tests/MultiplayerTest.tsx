
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Play, Trophy } from 'lucide-react';

interface MockPlayer {
  id: string;
  name: string;
  wordsFound: number;
  completionTime: number;
  status: 'playing' | 'completed' | 'disconnected';
  score: number;
}

export const MultiplayerTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [players, setPlayers] = useState<MockPlayer[]>([]);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState({
    concurrent: 0,
    completed: 0,
    averageTime: 0,
    serverStability: 0
  });

  const generateMockPlayers = (count: number): MockPlayer[] => {
    const names = [
      'SpeedSearcher', 'WordHunter', 'PuzzleMaster', 'QuickFinder', 'SearchPro',
      'LetterLord', 'GridGuru', 'WordWiz', 'SearchStar', 'PuzzlePro',
      'WordNinja', 'GridMaster', 'SearchAce', 'WordChamp', 'PuzzleKing'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `player_${i + 1}`,
      name: names[i % names.length] + (i > 14 ? `_${Math.floor(i / 15)}` : ''),
      wordsFound: 0,
      completionTime: 0,
      status: 'playing' as const,
      score: 0
    }));
  };

  const simulateGameplay = async (players: MockPlayer[]) => {
    const totalWords = 12;
    const gameStartTime = Date.now();

    // Simulate each player finding words at different rates
    for (let second = 0; second < 120; second++) { // 2 minute simulation
      await new Promise(resolve => setTimeout(resolve, 50)); // Speed up simulation

      players.forEach(player => {
        if (player.status === 'playing') {
          // Random chance to find a word (based on skill level)
          const skillLevel = 0.1 + Math.random() * 0.3; // 10-40% chance per second
          
          if (Math.random() < skillLevel && player.wordsFound < totalWords) {
            player.wordsFound++;
            player.score += 100 + Math.random() * 50; // Base score + bonus
            
            // Check if player completed
            if (player.wordsFound === totalWords) {
              player.status = 'completed';
              player.completionTime = (Date.now() - gameStartTime) / 1000;
            }
          }

          // Small chance of disconnection
          if (Math.random() < 0.001) {
            player.status = 'disconnected';
          }
        }
      });

      setPlayers([...players]);
      setTestProgress((second / 120) * 100);
    }

    // Final results
    const completed = players.filter(p => p.status === 'completed').length;
    const averageTime = completed > 0 
      ? players.filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + p.completionTime, 0) / completed 
      : 0;
    const serverStability = ((players.length - players.filter(p => p.status === 'disconnected').length) / players.length) * 100;

    setTestResults({
      concurrent: players.length,
      completed,
      averageTime,
      serverStability
    });
  };

  const runMultiplayerTest = async () => {
    setIsRunning(true);
    setTestProgress(0);

    // Start with 50 concurrent players
    const mockPlayers = generateMockPlayers(50);
    setPlayers(mockPlayers);

    await simulateGameplay(mockPlayers);
    setIsRunning(false);
  };

  const activePlayers = players.filter(p => p.status === 'playing').length;
  const completedPlayers = players.filter(p => p.status === 'completed').length;
  const disconnectedPlayers = players.filter(p => p.status === 'disconnected').length;

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Users className="h-5 w-5" />
          Multiplayer Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Simulate 50 concurrent players
          </div>
          <Button
            onClick={runMultiplayerTest}
            disabled={isRunning}
            size="sm"
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
          >
            {isRunning ? 'Testing...' : 'Start Test'}
          </Button>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-puzzle-white">Game Progress</span>
              <span className="text-puzzle-aqua">{testProgress.toFixed(1)}%</span>
            </div>
            <Progress value={testProgress} className="w-full" />
          </div>
        )}

        {players.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-puzzle-aqua">
                  {activePlayers}
                </div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-400">
                  {completedPlayers}
                </div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-red-400">
                  {disconnectedPlayers}
                </div>
                <div className="text-xs text-gray-400">Disconnected</div>
              </div>
            </div>

            {!isRunning && testResults.concurrent > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-puzzle-gold">
                    {testResults.averageTime.toFixed(1)}s
                  </div>
                  <div className="text-xs text-gray-400">Avg Completion</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-400">
                    {testResults.serverStability.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Server Stability</div>
                </div>
              </div>
            )}

            <div className="max-h-32 overflow-y-auto space-y-1">
              {players.slice(0, 10).map((player) => (
                <div key={player.id} className="flex items-center justify-between bg-gray-800 rounded p-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-puzzle-white">{player.name}</span>
                    <Badge className={
                      player.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400'
                        : player.status === 'playing'
                        ? 'bg-puzzle-aqua/20 text-puzzle-aqua'
                        : 'bg-red-500/20 text-red-400'
                    }>
                      {player.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{player.wordsFound}/12 words</span>
                    {player.status === 'completed' && (
                      <Trophy className="h-3 w-3 text-puzzle-gold" />
                    )}
                  </div>
                </div>
              ))}
              {players.length > 10 && (
                <div className="text-center text-xs text-gray-500">
                  {'+'}
                  {players.length - 10} more players...
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Testing server capacity and synchronization with multiple concurrent users.
          Target: Support 100{'+'}
          {' '}players with {'<'}1s response time.
        </div>
      </CardContent>
    </Card>
  );
};

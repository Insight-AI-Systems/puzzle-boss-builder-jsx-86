
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Clock } from 'lucide-react';

interface ProfileGameHistoryTabProps {
  userId: string;
}

export const ProfileGameHistoryTab: React.FC<ProfileGameHistoryTabProps> = ({ userId }) => {
  // Mock game data
  const gameHistory: any[] = [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Game Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-puzzle-aqua">0</div>
            <p className="text-sm text-gray-500">Games Played</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-puzzle-gold">0</div>
            <p className="text-sm text-gray-500">Games Won</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">0%</div>
            <p className="text-sm text-gray-500">Win Rate</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameHistory.length === 0 ? (
            <div className="text-center py-8">
              <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No games played yet</h3>
              <p className="text-gray-500">Start playing to see your game history here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {gameHistory.map((game: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{game.puzzle_name}</p>
                      <p className="text-sm text-gray-500">{game.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{game.completion_time}s</p>
                    <Badge variant={game.is_winner ? 'default' : 'secondary'}>
                      {game.is_winner ? 'Won' : 'Completed'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No achievements yet</h3>
            <p className="text-gray-500">Complete puzzles to unlock achievements</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

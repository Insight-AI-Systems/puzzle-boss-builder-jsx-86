import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Clock, MousePointer } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  playerName: string;
  completionTime: number;
  moves: number;
  difficulty: string;
  puzzleName: string;
  completedAt: string;
  score: number;
}

interface PuzzleLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  puzzleId?: string;
  difficulty?: string;
  title?: string;
}

export const PuzzleLeaderboard: React.FC<PuzzleLeaderboardProps> = ({
  entries,
  currentUserId,
  puzzleId,
  difficulty,
  title = "Puzzle Leaderboard"
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-puzzle-gold" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-muted-foreground font-bold">#{rank}</span>;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'medium': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'hard': return 'bg-red-400/20 text-red-400 border-red-400/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (puzzleId && entry.id !== puzzleId) return false;
    if (difficulty && entry.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-puzzle-gold" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No leaderboard entries found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-puzzle-aqua/20">
                <TableHead className="text-puzzle-aqua">Rank</TableHead>
                <TableHead className="text-puzzle-aqua">Player</TableHead>
                <TableHead className="text-puzzle-aqua">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time
                  </div>
                </TableHead>
                <TableHead className="text-puzzle-aqua">
                  <div className="flex items-center gap-1">
                    <MousePointer className="h-4 w-4" />
                    Moves
                  </div>
                </TableHead>
                <TableHead className="text-puzzle-aqua">Difficulty</TableHead>
                <TableHead className="text-puzzle-aqua">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.id === currentUserId;
                
                return (
                  <TableRow 
                    key={entry.id}
                    className={`border-puzzle-aqua/10 ${
                      isCurrentUser ? 'bg-puzzle-aqua/10' : 'hover:bg-muted/20'
                    }`}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getRankIcon(rank)}
                      </div>
                    </TableCell>
                    <TableCell className="text-puzzle-white font-medium">
                      {entry.playerName}
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs text-puzzle-aqua border-puzzle-aqua/50">
                          You
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-puzzle-white">
                      {formatTime(entry.completionTime)}
                    </TableCell>
                    <TableCell className="text-puzzle-white">
                      {entry.moves}
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(entry.difficulty)}>
                        {entry.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-puzzle-gold font-bold">
                      {entry.score.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
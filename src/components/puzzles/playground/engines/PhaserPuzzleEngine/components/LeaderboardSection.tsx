
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface LeaderboardSectionProps {
  puzzleId: string;
}

interface LeaderboardEntry {
  username: string;
  time: number;
  moves: number;
}

// Dummy data for the leaderboard
const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { username: "PuzzleMaster", time: 45, moves: 23 },
  { username: "JigsawQueen", time: 58, moves: 31 },
  { username: "PieceWizard", time: 67, moves: 29 },
];

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ puzzleId }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {SAMPLE_LEADERBOARD.map((entry, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{index + 1}.</span>
                <span>{entry.username}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.floor(entry.time / 60)}:{(entry.time % 60).toString().padStart(2, '0')} ({entry.moves} moves)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardSection;

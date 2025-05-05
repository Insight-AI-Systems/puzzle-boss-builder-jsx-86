
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LeaderboardSectionProps {
  puzzleId: string;
}

// This is a placeholder implementation - in a real app, you would fetch actual leaderboard data
const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ puzzleId }) => {
  const leaderboardEntries = [
    { name: 'Alice', time: '01:45', moves: 24 },
    { name: 'Bob', time: '02:12', moves: 28 },
    { name: 'Charlie', time: '02:30', moves: 32 }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Leaderboard</CardTitle>
        <CardDescription>Fastest completion times</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-sm space-y-2">
          {leaderboardEntries.length > 0 ? (
            <ul className="space-y-2">
              {leaderboardEntries.map((entry, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-1 last:border-0">
                  <span className="font-medium">{entry.name}</span>
                  <span className="text-muted-foreground">{entry.time} ({entry.moves} moves)</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No records yet. Be the first!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardSection;

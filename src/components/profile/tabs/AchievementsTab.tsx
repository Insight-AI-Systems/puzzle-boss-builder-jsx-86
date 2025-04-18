
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from 'lucide-react';

export function AchievementsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-puzzle-gold" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your puzzle-solving achievements and rewards will be displayed here.</p>
      </CardContent>
    </Card>
  );
}

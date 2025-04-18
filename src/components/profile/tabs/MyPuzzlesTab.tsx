
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MyPuzzlesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Puzzles</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your completed and in-progress puzzles will appear here.</p>
      </CardContent>
    </Card>
  );
}

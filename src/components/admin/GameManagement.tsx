
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// PuzzleManagement removed - CodeCanyon system will be added
import HeroPuzzleManager from './hero-puzzle/HeroPuzzleManager';
import { GameManagementAdmin } from './GameManagementAdmin';

export function GameManagement() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="games" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="games">Game Management</TabsTrigger>
          <TabsTrigger value="puzzles">Puzzles</TabsTrigger>
          <TabsTrigger value="hero">Hero Puzzle</TabsTrigger>
          <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="games">
          <GameManagementAdmin />
        </TabsContent>

        <TabsContent value="puzzles">
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Puzzle management will be available with the CodeCanyon system</p>
          </div>
        </TabsContent>

        <TabsContent value="hero">
          <HeroPuzzleManager />
        </TabsContent>
        
        <TabsContent value="leaderboards">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboards</CardTitle>
              <CardDescription>Manage global and puzzle-specific leaderboards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Leaderboard management will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
              <CardDescription>Configure global game settings and parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Game settings configuration will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

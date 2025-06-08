
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameControlPanel } from './game-management/GameControlPanel';
import { GameAnalytics } from './game-management/GameAnalytics';
import { LeaderboardManagement } from './game-management/LeaderboardManagement';
import { PlayerMonitoring } from './game-management/PlayerMonitoring';
import { RevenueTracking } from './game-management/RevenueTracking';
import { GameSettings } from './game-management/GameSettings';
import { Settings, BarChart3, Trophy, Users, DollarSign, Gamepad2 } from 'lucide-react';

export function GameManagementAdmin() {
  const [activeTab, setActiveTab] = useState("control");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-puzzle-white">Game Management</h2>
          <p className="text-puzzle-aqua">Comprehensive game administration and analytics</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="control" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Control Panel
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboards
          </TabsTrigger>
          <TabsTrigger value="players" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Players
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="control">
          <GameControlPanel />
        </TabsContent>

        <TabsContent value="analytics">
          <GameAnalytics />
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardManagement />
        </TabsContent>

        <TabsContent value="players">
          <PlayerMonitoring />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueTracking />
        </TabsContent>

        <TabsContent value="settings">
          <GameSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

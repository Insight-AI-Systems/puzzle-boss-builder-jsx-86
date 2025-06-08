
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, Target, Users } from 'lucide-react';

interface GameRevenue {
  id: string;
  name: string;
  totalRevenue: number;
  playerCount: number;
  avgRevenuePerPlayer: number;
  entryFees: number;
  prizePayout: number;
  netProfit: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  target: number;
}

export function RevenueTracking() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  
  const gameRevenues: GameRevenue[] = [
    {
      id: '1',
      name: 'Memory Game',
      totalRevenue: 8547.32,
      playerCount: 324,
      avgRevenuePerPlayer: 26.38,
      entryFees: 8547.32,
      prizePayout: 2564.20,
      netProfit: 5983.12,
      trend: 'up',
      trendPercentage: 12.5,
      target: 10000
    },
    {
      id: '2',
      name: 'Word Search',
      totalRevenue: 12458.95,
      playerCount: 456,
      avgRevenuePerPlayer: 27.32,
      entryFees: 12458.95,
      prizePayout: 3737.69,
      netProfit: 8721.26,
      trend: 'up',
      trendPercentage: 8.3,
      target: 15000
    },
    {
      id: '3',
      name: 'Sudoku',
      totalRevenue: 3245.87,
      playerCount: 178,
      avgRevenuePerPlayer: 18.24,
      entryFees: 3245.87,
      prizePayout: 973.76,
      netProfit: 2272.11,
      trend: 'down',
      trendPercentage: 5.7,
      target: 5000
    },
    {
      id: '4',
      name: 'Trivia Challenge',
      totalRevenue: 18934.56,
      playerCount: 678,
      avgRevenuePerPlayer: 27.93,
      entryFees: 18934.56,
      prizePayout: 5680.37,
      netProfit: 13254.19,
      trend: 'up',
      trendPercentage: 15.2,
      target: 20000
    },
    {
      id: '5',
      name: 'Block Puzzle Pro',
      totalRevenue: 9876.43,
      playerCount: 389,
      avgRevenuePerPlayer: 25.39,
      entryFees: 9876.43,
      prizePayout: 2962.93,
      netProfit: 6913.50,
      trend: 'stable',
      trendPercentage: 0,
      target: 12000
    },
    {
      id: '6',
      name: 'Daily Crossword',
      totalRevenue: 7654.21,
      playerCount: 445,
      avgRevenuePerPlayer: 17.20,
      entryFees: 7654.21,
      prizePayout: 2296.26,
      netProfit: 5357.95,
      trend: 'up',
      trendPercentage: 6.8,
      target: 9000
    }
  ];

  const totalRevenue = gameRevenues.reduce((sum, game) => sum + game.totalRevenue, 0);
  const totalPlayers = gameRevenues.reduce((sum, game) => sum + game.playerCount, 0);
  const totalNetProfit = gameRevenues.reduce((sum, game) => sum + game.netProfit, 0);
  const totalPrizePayout = gameRevenues.reduce((sum, game) => sum + game.prizePayout, 0);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTargetProgress = (revenue: number, target: number) => {
    return Math.min((revenue / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Revenue Tracking</h3>
          <p className="text-sm text-gray-600">Financial performance metrics for all games</p>
        </div>
        
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              ${totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {totalPlayers.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div className="text-sm text-gray-600">Net Profit</div>
            </div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              ${totalNetProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              <div className="text-sm text-gray-600">Prize Payout</div>
            </div>
            <div className="text-2xl font-bold text-orange-600 mt-1">
              ${totalPrizePayout.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Revenue Details */}
      <div className="grid gap-6">
        {gameRevenues.map((game) => (
          <Card key={game.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{game.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 ${getTrendColor(game.trend)}`}>
                    {getTrendIcon(game.trend)}
                    <span className="text-sm font-medium">
                      {game.trend !== 'stable' && `${game.trendPercentage}%`}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-xl font-bold text-green-600">
                    ${game.totalRevenue.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Players</div>
                  <div className="text-xl font-bold">
                    {game.playerCount.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Avg per Player</div>
                  <div className="text-xl font-bold">
                    ${game.avgRevenuePerPlayer.toFixed(2)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Entry Fees</div>
                  <div className="text-xl font-bold text-blue-600">
                    ${game.entryFees.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Prize Payout</div>
                  <div className="text-xl font-bold text-orange-600">
                    ${game.prizePayout.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Net Profit</div>
                  <div className="text-xl font-bold text-purple-600">
                    ${game.netProfit.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Target Progress</span>
                  <span>${game.totalRevenue.toLocaleString()} / ${game.target.toLocaleString()}</span>
                </div>
                <Progress value={getTargetProgress(game.totalRevenue, game.target)} className="h-2" />
                <div className="text-xs text-gray-600">
                  {getTargetProgress(game.totalRevenue, game.target).toFixed(1)}% of target achieved
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Clock, Trophy, Star } from 'lucide-react';

interface GameMetrics {
  id: string;
  name: string;
  totalPlays: number;
  completionRate: number;
  avgCompletionTime: number;
  activeUsers: number;
  revenue: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export function GameAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  
  const gameMetrics: GameMetrics[] = [
    {
      id: '1',
      name: 'Memory Game',
      totalPlays: 1547,
      completionRate: 78.5,
      avgCompletionTime: 245,
      activeUsers: 324,
      revenue: 2849.32,
      rating: 4.6,
      trend: 'up',
      trendPercentage: 12.5
    },
    {
      id: '2',
      name: 'Word Search',
      totalPlays: 2103,
      completionRate: 85.2,
      avgCompletionTime: 380,
      activeUsers: 456,
      revenue: 4521.18,
      rating: 4.8,
      trend: 'up',
      trendPercentage: 8.3
    },
    {
      id: '3',
      name: 'Sudoku',
      totalPlays: 892,
      completionRate: 65.4,
      avgCompletionTime: 520,
      activeUsers: 178,
      revenue: 1287.45,
      rating: 4.2,
      trend: 'down',
      trendPercentage: 5.7
    },
    {
      id: '4',
      name: 'Trivia Challenge',
      totalPlays: 3456,
      completionRate: 72.8,
      avgCompletionTime: 180,
      activeUsers: 678,
      revenue: 8924.67,
      rating: 4.7,
      trend: 'up',
      trendPercentage: 15.2
    },
    {
      id: '5',
      name: 'Block Puzzle Pro',
      totalPlays: 1876,
      completionRate: 68.9,
      avgCompletionTime: 420,
      activeUsers: 389,
      revenue: 3847.29,
      rating: 4.4,
      trend: 'stable',
      trendPercentage: 0
    },
    {
      id: '6',
      name: 'Daily Crossword',
      totalPlays: 2234,
      completionRate: 81.3,
      avgCompletionTime: 480,
      activeUsers: 445,
      revenue: 4129.85,
      rating: 4.5,
      trend: 'up',
      trendPercentage: 6.8
    }
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Game Analytics & Performance</h3>
          <p className="text-sm text-gray-600">Comprehensive metrics for all games</p>
        </div>
        
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {gameMetrics.map((game) => (
          <Card key={game.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{game.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {game.rating}
                  </Badge>
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
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    Total Plays
                  </div>
                  <div className="text-2xl font-bold">{game.totalPlays.toLocaleString()}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy className="h-4 w-4" />
                    Completion Rate
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{game.completionRate}%</div>
                    <Progress value={game.completionRate} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Avg Time
                  </div>
                  <div className="text-2xl font-bold">{formatTime(game.avgCompletionTime)}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    Active Users
                  </div>
                  <div className="text-2xl font-bold">{game.activeUsers}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    Revenue
                  </div>
                  <div className="text-2xl font-bold">${game.revenue.toLocaleString()}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Performance</div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      Engagement: {Math.round((game.completionRate / 100) * (game.activeUsers / game.totalPlays) * 100)}%
                    </div>
                    <Progress 
                      value={Math.round((game.completionRate / 100) * (game.activeUsers / game.totalPlays) * 100)} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Search, AlertTriangle, Shield, Eye, Ban } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PlayerBehavior {
  id: string;
  playerName: string;
  email: string;
  gamesPlayed: number;
  winRate: number;
  avgSessionTime: number;
  lastActivity: string;
  riskScore: number;
  flagged: boolean;
  status: 'active' | 'suspended' | 'banned';
  reports: number;
}

export function PlayerMonitoring() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [players, setPlayers] = useState<PlayerBehavior[]>([
    {
      id: '1',
      playerName: 'GameMaster',
      email: 'gamemaster@example.com',
      gamesPlayed: 247,
      winRate: 78.5,
      avgSessionTime: 45,
      lastActivity: '2024-01-15 14:30',
      riskScore: 15,
      flagged: false,
      status: 'active',
      reports: 0
    },
    {
      id: '2',
      playerName: 'SpeedRunner',
      email: 'speedrunner@example.com',
      gamesPlayed: 456,
      winRate: 92.3,
      avgSessionTime: 12,
      lastActivity: '2024-01-15 16:45',
      riskScore: 85,
      flagged: true,
      status: 'active',
      reports: 3
    },
    {
      id: '3',
      playerName: 'CasualPlayer',
      email: 'casual@example.com',
      gamesPlayed: 89,
      winRate: 45.2,
      avgSessionTime: 78,
      lastActivity: '2024-01-14 20:15',
      riskScore: 5,
      flagged: false,
      status: 'active',
      reports: 0
    },
    {
      id: '4',
      playerName: 'SuspiciousUser',
      email: 'suspicious@example.com',
      gamesPlayed: 1203,
      winRate: 98.7,
      avgSessionTime: 8,
      lastActivity: '2024-01-15 18:00',
      riskScore: 95,
      flagged: true,
      status: 'suspended',
      reports: 7
    }
  ]);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSuspendPlayer = (playerId: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, status: player.status === 'suspended' ? 'active' : 'suspended' }
        : player
    ));
    
    const player = players.find(p => p.id === playerId);
    toast({
      title: `Player ${player?.status === 'suspended' ? 'Reactivated' : 'Suspended'}`,
      description: `${player?.playerName} has been ${player?.status === 'suspended' ? 'reactivated' : 'suspended'}`
    });
  };

  const handleFlagPlayer = (playerId: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, flagged: !player.flagged }
        : player
    ));
    
    const player = players.find(p => p.id === playerId);
    toast({
      title: `Player ${player?.flagged ? 'Unflagged' : 'Flagged'}`,
      description: `${player?.playerName} has been ${player?.flagged ? 'unflagged' : 'flagged'} for review`
    });
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'bg-green-500' };
    if (score < 70) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'High', color: 'bg-red-500' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-yellow-500';
      case 'banned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Player Behavior Monitoring</CardTitle>
          <CardDescription>
            Monitor player activities and identify suspicious behavior patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">Search Players</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Games</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Avg Session</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player) => {
                    const riskLevel = getRiskLevel(player.riskScore);
                    
                    return (
                      <TableRow key={player.id} className={player.flagged ? "bg-red-50 dark:bg-red-950/20" : ""}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{player.playerName}</span>
                              {player.flagged && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{player.email}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>{player.gamesPlayed}</TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div>{player.winRate}%</div>
                            <Progress value={player.winRate} className="h-2 w-16" />
                          </div>
                        </TableCell>
                        
                        <TableCell>{player.avgSessionTime}m</TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span>{player.riskScore}</span>
                              <Badge className={`${riskLevel.color} text-white`}>
                                {riskLevel.level}
                              </Badge>
                            </div>
                            <Progress value={player.riskScore} className="h-2 w-20" />
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={`${getStatusColor(player.status)} text-white`}>
                            {player.status}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {player.reports > 0 ? (
                            <Badge variant="destructive">{player.reports}</Badge>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFlagPlayer(player.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant={player.status === 'suspended' ? "default" : "secondary"}
                              size="sm"
                              onClick={() => handleSuspendPlayer(player.id)}
                            >
                              {player.status === 'suspended' ? (
                                <Shield className="h-4 w-4" />
                              ) : (
                                <Ban className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {players.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Players</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {players.filter(p => p.flagged).length}
            </div>
            <div className="text-sm text-gray-600">Flagged Players</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {players.filter(p => p.riskScore > 70).length}
            </div>
            <div className="text-sm text-gray-600">High Risk</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {players.reduce((sum, p) => sum + p.reports, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

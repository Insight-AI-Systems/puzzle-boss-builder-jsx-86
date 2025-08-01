import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Activity, 
  Users, 
  Clock, 
  Trophy, 
  Play, 
  Pause, 
  RefreshCw,
  Eye,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GameSession {
  id: string;
  puzzleId: string;
  puzzleName: string;
  imageUrl: string;
  playerId: string;
  playerName: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  startTime: string;
  endTime?: string;
  currentProgress: number;
  totalPieces: number;
  moveCount: number;
  elapsedTime: number;
  difficulty: string;
  lastActivity: string;
}

interface SessionStats {
  totalActiveSessions: number;
  totalCompletedToday: number;
  averageCompletionTime: number;
  topDifficulty: string;
  averageProgress: number;
}

export const GameSessionMonitor: React.FC = () => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    totalActiveSessions: 0,
    totalCompletedToday: 0,
    averageCompletionTime: 0,
    topDifficulty: 'medium',
    averageProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();

  const fetchSessionData = async () => {
    try {
      // Mock data for demonstration - in real implementation, this would query puzzle_progress table
      const mockSessions: GameSession[] = [
        {
          id: 'session-1',
          puzzleId: 'puzzle-1',
          puzzleName: 'Mountain Landscape',
          imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=400&fit=crop',
          playerId: 'player-1',
          playerName: 'Alice Cooper',
          status: 'active',
          startTime: '2024-01-15T10:30:00Z',
          currentProgress: 65,
          totalPieces: 100,
          moveCount: 89,
          elapsedTime: 1245,
          difficulty: 'medium',
          lastActivity: '2024-01-15T10:55:00Z'
        },
        {
          id: 'session-2',
          puzzleId: 'puzzle-2',
          puzzleName: 'Ocean Sunset',
          imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=400&fit=crop',
          playerId: 'player-2',
          playerName: 'Bob Smith',
          status: 'paused',
          startTime: '2024-01-15T09:15:00Z',
          currentProgress: 23,
          totalPieces: 500,
          moveCount: 156,
          elapsedTime: 2890,
          difficulty: 'hard',
          lastActivity: '2024-01-15T10:45:00Z'
        },
        {
          id: 'session-3',
          puzzleId: 'puzzle-3',
          puzzleName: 'City Lights',
          imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
          playerId: 'player-3',
          playerName: 'Carol Johnson',
          status: 'completed',
          startTime: '2024-01-15T08:00:00Z',
          endTime: '2024-01-15T10:30:00Z',
          currentProgress: 100,
          totalPieces: 20,
          moveCount: 45,
          elapsedTime: 8980,
          difficulty: 'easy',
          lastActivity: '2024-01-15T10:30:00Z'
        }
      ];

      setSessions(mockSessions);
      
      // Calculate stats
      const activeSessions = mockSessions.filter(s => s.status === 'active').length;
      const completedToday = mockSessions.filter(s => s.status === 'completed').length;
      const avgTime = mockSessions
        .filter(s => s.status === 'completed')
        .reduce((acc, s) => acc + s.elapsedTime, 0) / Math.max(completedToday, 1);
      const avgProgress = mockSessions
        .filter(s => s.status === 'active')
        .reduce((acc, s) => acc + s.currentProgress, 0) / Math.max(activeSessions, 1);

      setStats({
        totalActiveSessions: activeSessions,
        totalCompletedToday: completedToday,
        averageCompletionTime: avgTime,
        topDifficulty: 'medium',
        averageProgress: avgProgress
      });

    } catch (error) {
      console.error('Error fetching session data:', error);
      toast({
        title: "Error loading session data",
        description: "Failed to fetch current game sessions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchSessionData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      abandoned: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.active}>
        {status}
      </Badge>
    );
  };

  const handleViewSession = (sessionId: string) => {
    // This would open a detailed view of the session
    toast({
      title: "Session Details",
      description: `Viewing session ${sessionId}`,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading session data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">{stats.totalActiveSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">{stats.totalCompletedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Completion</p>
                <p className="text-2xl font-bold">{formatTime(Math.round(stats.averageCompletionTime))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Progress</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageProgress)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Monitor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Active Game Sessions
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {autoRefresh ? 'Pause' : 'Resume'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSessionData}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <Alert>
              <AlertDescription>
                No active game sessions at the moment.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Puzzle</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Moves</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={session.imageUrl}
                            alt={session.puzzleName}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{session.puzzleName}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.totalPieces} pieces
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{session.playerName}</TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${session.currentProgress}%` }}
                            />
                          </div>
                          <span className="text-sm">{session.currentProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatTime(session.elapsedTime)}</TableCell>
                      <TableCell>{session.moveCount}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{session.difficulty}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSession(session.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Play, 
  Pause, 
  Square, 
  Trophy, 
  Clock,
  Target,
  Activity,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MockPlayer {
  id: string;
  name: string;
  skill: 'beginner' | 'intermediate' | 'expert';
  status: 'idle' | 'playing' | 'completed';
  score: number;
  timeElapsed: number;
  moves: number;
  progress: number;
}

interface MockPlayerSimulatorProps {
  gameId: string;
  testMode: boolean;
}

export function MockPlayerSimulator({ gameId, testMode }: MockPlayerSimulatorProps) {
  const [players, setPlayers] = useState<MockPlayer[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState('normal');
  const [newPlayerSkill, setNewPlayerSkill] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');
  const { toast } = useToast();

  const addMockPlayer = () => {
    const newPlayer: MockPlayer = {
      id: `player-${Date.now()}`,
      name: `Player ${players.length + 1}`,
      skill: newPlayerSkill,
      status: 'idle',
      score: 0,
      timeElapsed: 0,
      moves: 0,
      progress: 0
    };
    
    setPlayers([...players, newPlayer]);
    toast({
      title: "Mock Player Added",
      description: `${newPlayer.name} (${newPlayer.skill}) has been added`,
    });
  };

  const removeMockPlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const startSimulation = () => {
    if (players.length === 0) {
      toast({
        title: "No Players",
        description: "Add at least one mock player to start simulation",
        variant: "destructive"
      });
      return;
    }

    setIsSimulating(true);
    setPlayers(players.map(p => ({ ...p, status: 'playing' as const })));
    
    toast({
      title: "Simulation Started",
      description: `${players.length} mock players are now playing`,
    });
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setPlayers(players.map(p => ({ ...p, status: 'idle' as const })));
    
    toast({
      title: "Simulation Stopped",
      description: "All players have been paused",
    });
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setPlayers(players.map(p => ({
      ...p,
      status: 'idle' as const,
      score: 0,
      timeElapsed: 0,
      moves: 0,
      progress: 0
    })));
  };

  // Simulate player progress
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setPlayers(prevPlayers => 
        prevPlayers.map(player => {
          if (player.status !== 'playing') return player;

          const speedMultiplier = simulationSpeed === 'fast' ? 3 : simulationSpeed === 'slow' ? 0.5 : 1;
          const skillMultiplier = player.skill === 'expert' ? 1.5 : player.skill === 'beginner' ? 0.7 : 1;
          
          const progressIncrement = (Math.random() * 2 + 1) * speedMultiplier * skillMultiplier;
          const newProgress = Math.min(player.progress + progressIncrement, 100);
          
          const timeIncrement = 1000;
          const moveIncrement = Math.random() > 0.7 ? 1 : 0;
          const scoreIncrement = moveIncrement * (Math.random() * 100 + 50) * skillMultiplier;

          const updatedPlayer = {
            ...player,
            progress: newProgress,
            timeElapsed: player.timeElapsed + timeIncrement,
            moves: player.moves + moveIncrement,
            score: player.score + scoreIncrement
          };

          // Complete the game if progress reaches 100%
          if (newProgress >= 100) {
            updatedPlayer.status = 'completed';
            updatedPlayer.progress = 100;
          }

          return updatedPlayer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'playing': return 'text-puzzle-aqua';
      case 'completed': return 'text-puzzle-gold';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-puzzle-white">Mock Player Simulation</h3>
          <p className="text-puzzle-aqua">
            Simulate multiple players for leaderboard testing
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={simulationSpeed} onValueChange={setSimulationSpeed}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
            </SelectContent>
          </Select>
          
          {!isSimulating ? (
            <Button 
              onClick={startSimulation}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button 
              onClick={stopSimulation}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          
          <Button 
            onClick={resetSimulation}
            variant="outline"
            className="border-gray-600 text-gray-400"
          >
            <Square className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Add Player Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-puzzle-white text-sm">Add Mock Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select value={newPlayerSkill} onValueChange={(value: any) => setNewPlayerSkill(value)}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={addMockPlayer}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Players List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {players.map((player) => (
          <Card key={player.id} className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-puzzle-white text-sm">{player.name}</CardTitle>
                  <Badge className={`${getSkillColor(player.skill)} text-white text-xs`}>
                    {player.skill}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(player.status)}>
                    {player.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMockPlayer(player.id)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                  >
                    <UserMinus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{player.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={player.progress} className="h-2" />
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-puzzle-gold">
                      {player.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Score</div>
                  </div>
                  
                  <div>
                    <div className="text-lg font-bold text-puzzle-aqua">
                      {formatTime(player.timeElapsed)}
                    </div>
                    <div className="text-xs text-gray-400">Time</div>
                  </div>
                  
                  <div>
                    <div className="text-lg font-bold text-green-400">
                      {player.moves}
                    </div>
                    <div className="text-xs text-gray-400">Moves</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {players.length === 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-puzzle-white mb-2">No Mock Players</h3>
            <p className="text-gray-400 mb-4">Add mock players to start leaderboard simulation testing</p>
            <Button onClick={addMockPlayer} className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First Player
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Preview */}
      {players.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Simulated Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {players
                .filter(p => p.status === 'completed')
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map((player, index) => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-puzzle-gold">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-puzzle-white font-medium">{player.name}</div>
                        <div className="text-xs text-gray-400">{player.skill}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-puzzle-aqua font-bold">
                        {player.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatTime(player.timeElapsed)} | {player.moves} moves
                      </div>
                    </div>
                  </div>
                ))}
              
              {players.filter(p => p.status === 'completed').length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No completed games yet. Start simulation to see results.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

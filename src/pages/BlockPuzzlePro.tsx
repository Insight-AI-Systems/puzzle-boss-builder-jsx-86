
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Zap, Grid3X3, Target, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface GameMode {
  id: string;
  name: string;
  description: string;
  entryFee: number;
  prizePool: number;
  nextTournament: Date;
  activePlayers: number;
  difficulty: 'Standard' | 'Challenging' | 'Expert';
  color: string;
  timeLimit?: string;
}

interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
  mode: string;
  timestamp: Date;
}

interface HighScoreHolder {
  player: string;
  score: number;
  mode: string;
  achievement: string;
}

const BlockPuzzlePro: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data for game modes
  const [gameModes] = useState<GameMode[]>([
    {
      id: 'time-attack',
      name: 'Time Attack',
      description: 'Score maximum points in 3 minutes',
      entryFee: 3,
      prizePool: 120,
      nextTournament: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours from now
      activePlayers: 28,
      difficulty: 'Standard',
      color: 'bg-blue-500',
      timeLimit: '3 min'
    },
    {
      id: 'endless',
      name: 'Endless Mode',
      description: 'Survive as long as possible',
      entryFee: 5,
      prizePool: 200,
      nextTournament: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      activePlayers: 22,
      difficulty: 'Challenging',
      color: 'bg-purple-500',
      timeLimit: 'Unlimited'
    },
    {
      id: 'survival',
      name: 'Survival Challenge',
      description: 'Limited moves, maximum strategy',
      entryFee: 7,
      prizePool: 280,
      nextTournament: new Date(Date.now() + 4.5 * 60 * 60 * 1000), // 4.5 hours from now
      activePlayers: 16,
      difficulty: 'Expert',
      color: 'bg-red-500',
      timeLimit: '50 moves'
    }
  ]);

  // Mock leaderboard data
  const [liveLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, player: 'BlockMaster', score: 125400, mode: 'Time Attack', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { rank: 2, player: 'TetrisKing', score: 89200, mode: 'Endless', timestamp: new Date(Date.now() - 10 * 60 * 1000) },
    { rank: 3, player: 'PuzzleQueen', score: 76800, mode: 'Survival', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
    { rank: 4, player: 'GridGuru', score: 72300, mode: 'Time Attack', timestamp: new Date(Date.now() - 20 * 60 * 1000) },
    { rank: 5, player: 'StrategyPro', score: 68900, mode: 'Endless', timestamp: new Date(Date.now() - 25 * 60 * 1000) }
  ]);

  // Mock high score holders
  const [highScoreHolders] = useState<HighScoreHolder[]>([
    { player: 'BlockMaster', score: 256700, mode: 'Time Attack', achievement: 'Daily Champion' },
    { player: 'InfiniteFlow', score: 189300, mode: 'Endless', achievement: 'Endurance King' },
    { player: 'TacticalMind', score: 145600, mode: 'Survival', achievement: 'Strategy Expert' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (targetDate: Date) => {
    const now = currentTime.getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return "Tournament Starting!";
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalActivePlayers = () => {
    return gameModes.reduce((total, mode) => total + mode.activePlayers, 0);
  };

  const getTotalPrizePool = () => {
    return gameModes.reduce((total, mode) => total + mode.prizePool, 0);
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const formatScore = (score: number) => {
    return score.toLocaleString();
  };

  return (
    <main className="min-h-screen bg-puzzle-black">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-puzzle-black via-gray-900 to-puzzle-black py-20">
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-puzzle-aqua/20 rounded-full">
                <Grid3X3 className="h-16 w-16 text-puzzle-aqua" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-puzzle-white">Block Puzzle Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Strategy Under Pressure
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Users className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
                <div className="text-2xl font-bold text-puzzle-white">{getTotalActivePlayers()}</div>
                <div className="text-sm text-gray-300">Active Players</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Trophy className="h-8 w-8 text-puzzle-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-puzzle-white">${getTotalPrizePool()}</div>
                <div className="text-sm text-gray-300">Today's Prize Pool</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Target className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
                <div className="text-2xl font-bold text-puzzle-white">Live</div>
                <div className="text-sm text-gray-300">Tournaments</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold px-8 py-3"
              >
                <Zap className="h-5 w-5 mr-2" />
                Quick Play
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black px-8 py-3"
              >
                Practice Area
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-puzzle-white mb-4">
              Choose Your Challenge
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Test your block placement skills across different game modes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {gameModes.map((mode) => (
              <Card key={mode.id} className="bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${mode.color} text-white mb-4`}>
                    {mode.difficulty} - {mode.timeLimit}
                  </div>
                  <CardTitle className="text-2xl text-puzzle-white">{mode.name}</CardTitle>
                  <p className="text-sm text-gray-400">{mode.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Entry Fee & Prize Pool */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-puzzle-aqua mb-2">
                      ${mode.entryFee}
                    </div>
                    <div className="text-sm text-gray-400">Entry Fee</div>
                    <div className="mt-4">
                      <div className="text-xl font-semibold text-puzzle-gold">
                        ${mode.prizePool} Prize Pool
                      </div>
                    </div>
                  </div>

                  {/* Tournament Countdown */}
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-4 w-4 text-puzzle-aqua mr-2" />
                      <span className="text-sm text-gray-300">Next Tournament</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-puzzle-white">
                      {formatCountdown(mode.nextTournament)}
                    </div>
                  </div>

                  {/* Active Players */}
                  <div className="flex items-center justify-center text-gray-300">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{mode.activePlayers} players ready</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? 'Join Tournament' : 'Login to Join'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Practice Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Leaderboard & High Score Holders */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Live Scoring Leaderboard */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-puzzle-gold" />
                  Live Scoring Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {liveLeaderboard.map((entry) => (
                    <div 
                      key={entry.rank}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-puzzle-gold font-bold w-6">#{entry.rank}</span>
                        <div>
                          <div className="text-puzzle-white font-medium">{entry.player}</div>
                          <div className="text-sm text-gray-400">{entry.mode}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-puzzle-aqua font-mono font-bold">{formatScore(entry.score)}</div>
                        <div className="text-xs text-gray-400">{formatTimeAgo(entry.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current High Score Holders */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Star className="h-5 w-5 mr-2 text-puzzle-gold" />
                  Current High Score Holders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {highScoreHolders.map((holder, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-puzzle-white font-semibold">{holder.player}</div>
                        <Badge className="bg-puzzle-gold text-puzzle-black">
                          {holder.achievement}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">{holder.mode}</div>
                        <div className="text-xl font-mono font-bold text-puzzle-aqua">
                          {formatScore(holder.score)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tournament Bracket Progression */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-puzzle-white mb-4">
              Tournament Progression
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-puzzle-aqua/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-puzzle-aqua">32</span>
                    </div>
                    <h3 className="text-lg font-semibold text-puzzle-white mb-2">Qualifiers</h3>
                    <p className="text-sm text-gray-400">Top 32 advance to bracket</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-puzzle-aqua/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-puzzle-aqua">8</span>
                    </div>
                    <h3 className="text-lg font-semibold text-puzzle-white mb-2">Quarterfinals</h3>
                    <p className="text-sm text-gray-400">Best of 3 elimination rounds</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-puzzle-aqua/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-puzzle-aqua">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-puzzle-white mb-2">Finals</h3>
                    <p className="text-sm text-gray-400">Winner takes 60% of prize pool</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-puzzle-gold/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-puzzle-gold" />
                    </div>
                    <h3 className="text-lg font-semibold text-puzzle-white mb-2">Champion</h3>
                    <p className="text-sm text-gray-400">Glory and cash prize</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Authentication Prompt */}
      {!isAuthenticated && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-gray-900 rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-puzzle-white mb-4">
                Ready to Stack and Win?
              </h3>
              <p className="text-gray-300 mb-6">
                Create your account to join block puzzle tournaments and compete for prizes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
                >
                  <Link to="/auth?signup=true">Sign Up Now</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default BlockPuzzlePro;

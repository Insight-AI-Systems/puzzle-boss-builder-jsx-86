import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Zap, Grid3X3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { SudokuGameWrapper } from '@/components/games/sudoku/SudokuGameWrapper';
import { SudokuDifficulty, SudokuSize } from '@/components/games/sudoku/types/sudokuTypes';

interface DifficultyTier {
  id: string;
  name: string;
  grid: string;
  entryFee: number;
  prizePool: number;
  nextRace: Date;
  participants: number;
  difficulty: SudokuDifficulty;
  size: SudokuSize;
  color: string;
}

interface LeaderboardEntry {
  rank: number;
  player: string;
  time: string;
  difficulty: string;
}

const SpeedSudoku: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTier, setSelectedTier] = useState<DifficultyTier | null>(null);
  const [showGame, setShowGame] = useState(false);

  // Mock data for difficulty tiers with proper Sudoku configurations
  const [tiers] = useState<DifficultyTier[]>([
    {
      id: 'easy',
      name: 'Lightning Easy',
      grid: '4x4',
      entryFee: 2,
      prizePool: 80,
      nextRace: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      participants: 32,
      difficulty: 'easy' as SudokuDifficulty,
      size: 4 as SudokuSize,
      color: 'bg-green-500'
    },
    {
      id: 'medium',
      name: 'Rapid Medium',
      grid: '6x6',
      entryFee: 5,
      prizePool: 200,
      nextRace: new Date(Date.now() + 3 * 60 * 60 * 1000),
      participants: 24,
      difficulty: 'medium' as SudokuDifficulty,
      size: 6 as SudokuSize,
      color: 'bg-orange-500'
    },
    {
      id: 'expert',
      name: 'Blitz Expert',
      grid: '9x9',
      entryFee: 12,
      prizePool: 480,
      nextRace: new Date(Date.now() + 5 * 60 * 60 * 1000),
      participants: 16,
      difficulty: 'expert' as SudokuDifficulty,
      size: 9 as SudokuSize,
      color: 'bg-red-500'
    }
  ]);

  // Mock leaderboard data
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, player: 'SudokuMaster', time: '1:23', difficulty: 'Expert' },
    { rank: 2, player: 'LogicLord', time: '1:45', difficulty: 'Expert' },
    { rank: 3, player: 'NumberNinja', time: '2:01', difficulty: 'Expert' },
    { rank: 4, player: 'GridGuru', time: '0:45', difficulty: 'Medium' },
    { rank: 5, player: 'PuzzlePro', time: '0:52', difficulty: 'Medium' }
  ]);

  // Mock current participants
  const [currentParticipants] = useState([
    'SudokuMaster', 'LogicLord', 'NumberNinja', 'GridGuru', 'PuzzlePro',
    'BrainBox', 'QuickThink', 'MathWhiz', 'TimeBeater', 'StrategyKing'
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
      return "Race Starting!";
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalParticipants = () => {
    return tiers.reduce((total, tier) => total + tier.participants, 0);
  };

  const getTotalPrizePool = () => {
    return tiers.reduce((total, tier) => total + tier.prizePool, 0);
  };

  const getNextRaceTime = () => {
    const nextRace = tiers.reduce((earliest, tier) => 
      tier.nextRace < earliest ? tier.nextRace : earliest, tiers[0].nextRace
    );
    return formatCountdown(nextRace);
  };

  const handleJoinRace = (tier: DifficultyTier) => {
    setSelectedTier(tier);
    setShowGame(true);
  };

  const handleBackToLobby = () => {
    setShowGame(false);
    setSelectedTier(null);
  };

  if (showGame && selectedTier) {
    return (
      <main className="min-h-screen bg-puzzle-black">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              onClick={handleBackToLobby}
              variant="outline"
              className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
            >
              ← Back to Lobby
            </Button>
          </div>
          
          <SudokuGameWrapper
            difficulty={selectedTier.difficulty}
            size={selectedTier.size}
            requiresPayment={true}
            entryFee={selectedTier.entryFee}
          />
        </div>
      </main>
    );
  }

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
              <span className="text-puzzle-white">Speed Sudoku</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Logic Meets Lightning Reflexes
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Users className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
                <div className="text-2xl font-bold text-puzzle-white">{getTotalParticipants()}</div>
                <div className="text-sm text-gray-300">Active Racers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Trophy className="h-8 w-8 text-puzzle-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-puzzle-white">${getTotalPrizePool()}</div>
                <div className="text-sm text-gray-300">Today's Prize Pool</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Clock className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
                <div className="text-2xl font-bold text-puzzle-white">{getNextRaceTime()}</div>
                <div className="text-sm text-gray-300">Next Race</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold px-8 py-3"
                onClick={() => handleJoinRace(tiers[1])} // Default to medium
              >
                <Zap className="h-5 w-5 mr-2" />
                Quick Race
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black px-8 py-3"
              >
                View Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-puzzle-white mb-4">
              Choose Your Challenge
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Select your difficulty level and race against the clock
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <Card key={tier.id} className="bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tier.color} text-white mb-4`}>
                    {tier.difficulty.charAt(0).toUpperCase() + tier.difficulty.slice(1)} {tier.grid}
                  </div>
                  <CardTitle className="text-2xl text-puzzle-white">{tier.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Entry Fee & Prize Pool */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-puzzle-aqua mb-2">
                      ${tier.entryFee}
                    </div>
                    <div className="text-sm text-gray-400">Entry Fee</div>
                    <div className="mt-4">
                      <div className="text-xl font-semibold text-puzzle-gold">
                        ${tier.prizePool} Prize Pool
                      </div>
                    </div>
                  </div>

                  {/* Race Countdown */}
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-4 w-4 text-puzzle-aqua mr-2" />
                      <span className="text-sm text-gray-300">Next Race</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-puzzle-white">
                      {formatCountdown(tier.nextRace)}
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center justify-center text-gray-300">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{tier.participants} racers ready</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
                      disabled={!isAuthenticated}
                      onClick={() => handleJoinRace(tier)}
                    >
                      {isAuthenticated ? 'Join Race' : 'Login to Race'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                      onClick={() => handleJoinRace(tier)}
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

      {/* Live Participants & Leaderboard */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Current Participants */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-puzzle-aqua" />
                  Current Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {currentParticipants.map((participant, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <span className="text-puzzle-white">{participant}</span>
                      <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                        Ready
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Best Daily Times */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-puzzle-gold" />
                  Best Daily Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div 
                      key={entry.rank}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-puzzle-gold font-bold w-6">#{entry.rank}</span>
                        <span className="text-puzzle-white">{entry.player}</span>
                        <Badge variant="outline" className="text-xs">
                          {entry.difficulty}
                        </Badge>
                      </div>
                      <span className="text-puzzle-aqua font-mono font-bold">
                        {entry.time}
                      </span>
                    </div>
                  ))}
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
                Ready to Race?
              </h3>
              <p className="text-gray-300 mb-6">
                Create your account to join speed sudoku races and compete for prizes
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

export default SpeedSudoku;

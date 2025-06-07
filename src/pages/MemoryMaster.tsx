import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Zap, Brain, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { MemoryGameLauncher } from '@/components/games/memory/MemoryGameLauncher';
import { MemoryLayout, MemoryTheme } from '@/components/games/memory/types/memoryTypes';

interface DifficultyTier {
  id: string;
  name: string;
  cardCount: number;
  entryFee: number;
  prizePool: number;
  nextTournament: Date;
  activePlayers: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  color: string;
  layout: MemoryLayout;
}

interface TournamentBracket {
  round: string;
  matches: Array<{
    player1: string;
    player2: string;
    time1?: string;
    time2?: string;
    winner?: string;
  }>;
}

interface CompletionTime {
  player: string;
  time: string;
  cardCount: number;
  timestamp: Date;
}

interface GameSession {
  isActive: boolean;
  layout: MemoryLayout;
  theme: MemoryTheme;
  requiresPayment: boolean;
  entryFee: number;
}

const MemoryMaster: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [gameSession, setGameSession] = useState<GameSession>({
    isActive: false,
    layout: '3x4',
    theme: 'animals',
    requiresPayment: false,
    entryFee: 0
  });

  // Mock data for difficulty tiers
  const [tiers] = useState<DifficultyTier[]>([
    {
      id: 'beginner',
      name: 'Memory Rookie',
      cardCount: 12,
      entryFee: 1,
      prizePool: 40,
      nextTournament: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      activePlayers: 28,
      difficulty: 'Beginner',
      color: 'bg-green-500',
      layout: '3x4'
    },
    {
      id: 'intermediate',
      name: 'Mind Challenger',
      cardCount: 20,
      entryFee: 4,
      prizePool: 160,
      nextTournament: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
      activePlayers: 20,
      difficulty: 'Intermediate',
      color: 'bg-orange-500',
      layout: '4x5'
    },
    {
      id: 'expert',
      name: 'Memory Master',
      cardCount: 30,
      entryFee: 8,
      prizePool: 320,
      nextTournament: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      activePlayers: 16,
      difficulty: 'Expert',
      color: 'bg-red-500',
      layout: '5x6'
    }
  ]);

  // Mock tournament bracket data
  const [currentBracket] = useState<TournamentBracket[]>([
    {
      round: 'Quarterfinals',
      matches: [
        { player1: 'MemoryKing', player2: 'FlashCard', time1: '0:45', time2: '0:52', winner: 'MemoryKing' },
        { player1: 'BrainBox', player2: 'QuickFlip', time1: '0:38', time2: '0:41', winner: 'QuickFlip' },
        { player1: 'CardMaster', player2: 'MindReader', time1: '0:49', time2: '0:47', winner: 'MindReader' },
        { player1: 'FlipWizard', player2: 'MatchGuru', time1: '0:43', time2: '0:44', winner: 'FlipWizard' }
      ]
    },
    {
      round: 'Semifinals',
      matches: [
        { player1: 'MemoryKing', player2: 'QuickFlip', time1: '0:51', time2: '0:48', winner: 'QuickFlip' },
        { player1: 'MindReader', player2: 'FlipWizard', time1: '0:46', time2: '0:49', winner: 'MindReader' }
      ]
    }
  ]);

  // Mock live completion times
  const [liveCompletions] = useState<CompletionTime[]>([
    { player: 'QuickFlip', time: '0:34', cardCount: 12, timestamp: new Date(Date.now() - 30000) },
    { player: 'MindReader', time: '1:12', cardCount: 20, timestamp: new Date(Date.now() - 45000) },
    { player: 'MemoryKing', time: '0:38', cardCount: 12, timestamp: new Date(Date.now() - 60000) },
    { player: 'FlipWizard', time: '2:15', cardCount: 30, timestamp: new Date(Date.now() - 90000) },
    { player: 'BrainBox', time: '1:05', cardCount: 20, timestamp: new Date(Date.now() - 120000) }
  ]);

  // Mock winner spotlight
  const [todaysWinner] = useState({
    name: 'MindReader',
    time: '0:28',
    cardCount: 12,
    prize: '$85',
    streak: 3
  });

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
    return tiers.reduce((total, tier) => total + tier.activePlayers, 0);
  };

  const getTotalPrizePool = () => {
    return tiers.reduce((total, tier) => total + tier.prizePool, 0);
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Game launching functions
  const handleQuickMatch = () => {
    console.log('Launching quick match game');
    setGameSession({
      isActive: true,
      layout: '3x4',
      theme: 'animals',
      requiresPayment: false,
      entryFee: 0
    });
  };

  const handlePracticeMode = () => {
    console.log('Launching practice mode game');
    setGameSession({
      isActive: true,
      layout: '3x4',
      theme: 'animals',
      requiresPayment: false,
      entryFee: 0
    });
  };

  const handleJoinTournament = (tier: DifficultyTier) => {
    console.log('Joining tournament:', tier.name);
    setGameSession({
      isActive: true,
      layout: tier.layout,
      theme: 'animals',
      requiresPayment: true,
      entryFee: tier.entryFee
    });
  };

  const handleBackToTournament = () => {
    console.log('Returning to tournament view');
    setGameSession({
      isActive: false,
      layout: '3x4',
      theme: 'animals',
      requiresPayment: false,
      entryFee: 0
    });
  };

  // If game is active, show the game launcher
  if (gameSession.isActive) {
    return (
      <MemoryGameLauncher
        initialLayout={gameSession.layout}
        initialTheme={gameSession.theme}
        requiresPayment={gameSession.requiresPayment}
        entryFee={gameSession.entryFee}
        onBackToTournament={handleBackToTournament}
      />
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
                <Brain className="h-16 w-16 text-puzzle-aqua" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-puzzle-white">Memory Master</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Match Fastest, Win Biggest
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
                onClick={handleQuickMatch}
              >
                <Zap className="h-5 w-5 mr-2" />
                Quick Match
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black px-8 py-3"
                onClick={handlePracticeMode}
              >
                Practice Mode
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
              Test your memory skills across different difficulty levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <Card key={tier.id} className="bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tier.color} text-white mb-4`}>
                    {tier.difficulty} - {tier.cardCount} Cards
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

                  {/* Tournament Countdown */}
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-4 w-4 text-puzzle-aqua mr-2" />
                      <span className="text-sm text-gray-300">Next Tournament</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-puzzle-white">
                      {formatCountdown(tier.nextTournament)}
                    </div>
                  </div>

                  {/* Active Players */}
                  <div className="flex items-center justify-center text-gray-300">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{tier.activePlayers} players ready</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
                      disabled={!isAuthenticated}
                      onClick={() => handleJoinTournament(tier)}
                    >
                      {isAuthenticated ? 'Join Tournament' : 'Login to Join'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                      onClick={handlePracticeMode}
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

      {/* Tournament Bracket & Live Times */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Tournament Bracket */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-puzzle-gold" />
                  Live Tournament Bracket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentBracket.map((round, roundIndex) => (
                    <div key={roundIndex}>
                      <h3 className="text-lg font-semibold text-puzzle-aqua mb-3">{round.round}</h3>
                      <div className="space-y-2">
                        {round.matches.map((match, matchIndex) => (
                          <div key={matchIndex} className="bg-gray-800 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <div className={`text-sm ${match.winner === match.player1 ? 'text-puzzle-gold font-semibold' : 'text-gray-300'}`}>
                                  {match.player1} {match.time1 && `(${match.time1})`}
                                </div>
                                <div className={`text-sm ${match.winner === match.player2 ? 'text-puzzle-gold font-semibold' : 'text-gray-300'}`}>
                                  {match.player2} {match.time2 && `(${match.time2})`}
                                </div>
                              </div>
                              {match.winner && (
                                <Badge className="bg-puzzle-gold text-puzzle-black">
                                  Winner
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Completion Times */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-puzzle-aqua" />
                  Live Completion Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {liveCompletions.map((completion, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="text-puzzle-white font-medium">{completion.player}</div>
                        <div className="text-sm text-gray-400">{completion.cardCount} cards</div>
                      </div>
                      <div className="text-right">
                        <div className="text-puzzle-aqua font-mono font-bold">{completion.time}</div>
                        <div className="text-xs text-gray-400">{formatTimeAgo(completion.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Winner Spotlight */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-puzzle-white mb-4">
              Today's Champion
            </h2>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-puzzle-aqua/20 to-puzzle-gold/20 border-puzzle-aqua/50">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-puzzle-gold/20 rounded-full">
                    <Trophy className="h-12 w-12 text-puzzle-gold" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-puzzle-white mb-2">{todaysWinner.name}</h3>
                <p className="text-xl text-puzzle-aqua mb-4">Record Time: {todaysWinner.time}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-puzzle-gold">{todaysWinner.prize}</div>
                    <div className="text-sm text-gray-300">Prize Won</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-puzzle-aqua">{todaysWinner.cardCount}</div>
                    <div className="text-sm text-gray-300">Cards Matched</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-puzzle-white">{todaysWinner.streak}</div>
                    <div className="text-sm text-gray-300">Win Streak</div>
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
                Ready to Test Your Memory?
              </h3>
              <p className="text-gray-300 mb-6">
                Create your account to join memory tournaments and compete for prizes
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

export default MemoryMaster;

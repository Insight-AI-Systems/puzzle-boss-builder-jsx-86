
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Zap, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface CompetitionTier {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  nextTournament: Date;
  activePlayers: number;
  difficulty: 'Rookie' | 'Pro' | 'Master';
  color: string;
}

const WordSearchArena: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data for competition tiers
  const [tiers] = useState<CompetitionTier[]>([
    {
      id: 'rookie',
      name: 'Rookie Arena',
      entryFee: 1,
      prizePool: 50,
      nextTournament: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      activePlayers: 24,
      difficulty: 'Rookie',
      color: 'bg-green-500'
    },
    {
      id: 'pro',
      name: 'Pro Championship',
      entryFee: 5,
      prizePool: 250,
      nextTournament: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      activePlayers: 18,
      difficulty: 'Pro',
      color: 'bg-blue-500'
    },
    {
      id: 'master',
      name: 'Master Elite',
      entryFee: 15,
      prizePool: 750,
      nextTournament: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      activePlayers: 12,
      difficulty: 'Master',
      color: 'bg-purple-500'
    }
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
    return tiers.reduce((total, tier) => total + tier.activePlayers, 0);
  };

  const getTotalPrizePool = () => {
    return tiers.reduce((total, tier) => total + tier.prizePool, 0);
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
                <Search className="h-16 w-16 text-puzzle-aqua" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-puzzle-white">Word Search</span>{' '}
              <span className="text-puzzle-aqua">Arena</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Compete for Cash Prizes in Real-Time Tournaments
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
                <Clock className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
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
                View Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-puzzle-white mb-4">
              Choose Your Arena
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Select your skill level and compete against players worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <Card key={tier.id} className="bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tier.color} text-white mb-4`}>
                    {tier.difficulty}
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
                    <span className="text-sm">{tier.activePlayers} players active</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? 'Enter Tournament' : 'Login to Enter'}
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

      {/* How It Works */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-puzzle-white mb-4">
              How It Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-puzzle-aqua/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-puzzle-aqua">1</span>
              </div>
              <h3 className="text-lg font-semibold text-puzzle-white mb-2">Choose Arena</h3>
              <p className="text-sm text-gray-400">Select your skill level and entry fee</p>
            </div>
            
            <div className="text-center">
              <div className="bg-puzzle-aqua/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-puzzle-aqua">2</span>
              </div>
              <h3 className="text-lg font-semibold text-puzzle-white mb-2">Wait for Start</h3>
              <p className="text-sm text-gray-400">Tournaments begin every few hours</p>
            </div>
            
            <div className="text-center">
              <div className="bg-puzzle-aqua/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-puzzle-aqua">3</span>
              </div>
              <h3 className="text-lg font-semibold text-puzzle-white mb-2">Compete</h3>
              <p className="text-sm text-gray-400">Find words faster than opponents</p>
            </div>
            
            <div className="text-center">
              <div className="bg-puzzle-aqua/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-puzzle-aqua">4</span>
              </div>
              <h3 className="text-lg font-semibold text-puzzle-white mb-2">Win Prizes</h3>
              <p className="text-sm text-gray-400">Top finishers share the prize pool</p>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Prompt */}
      {!isAuthenticated && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-gray-900 rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-puzzle-white mb-4">
                Ready to Compete?
              </h3>
              <p className="text-gray-300 mb-6">
                Create your account to enter tournaments and compete for cash prizes
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

export default WordSearchArena;

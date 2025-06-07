
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Trophy, Users, Search, Star, Crown, Zap, Target, Grid3X3, Brain, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface LeaderboardEntry {
  rank: number;
  player: string;
  avatar?: string;
  score: number;
  timeElapsed?: string;
  completionTime?: number;
  earnings: number;
  gamesPlayed: number;
  isCurrentUser?: boolean;
}

interface RecentWinner {
  player: string;
  puzzle: string;
  prize: number;
  date: string;
  avatar?: string;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTimeFilter, setActiveTimeFilter] = useState('daily');
  const [activePuzzleType, setActivePuzzleType] = useState('jigsaw');

  // Mock data for different puzzle types
  const [jigsawLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, player: 'PuzzleMaster', score: 45280, timeElapsed: '2:34', earnings: 1250, gamesPlayed: 47 },
    { rank: 2, player: 'SpeedSolver', score: 42150, timeElapsed: '2:41', earnings: 980, gamesPlayed: 52 },
    { rank: 3, player: 'BrainBox', score: 39870, timeElapsed: '2:58', earnings: 720, gamesPlayed: 38 },
    { rank: 4, player: user?.email?.split('@')[0] || 'You', score: 35420, timeElapsed: '3:12', earnings: 450, gamesPlayed: 31, isCurrentUser: true },
    { rank: 5, player: 'QuickThink', score: 33280, timeElapsed: '3:24', earnings: 380, gamesPlayed: 29 },
    { rank: 6, player: 'PuzzleQueen', score: 31950, timeElapsed: '3:36', earnings: 320, gamesPlayed: 25 },
    { rank: 7, player: 'MindBender', score: 29840, timeElapsed: '3:48', earnings: 280, gamesPlayed: 22 },
    { rank: 8, player: 'LogicLord', score: 28760, timeElapsed: '4:02', earnings: 240, gamesPlayed: 19 }
  ]);

  const [blockPuzzleLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, player: 'BlockMaster', score: 125400, earnings: 890, gamesPlayed: 34 },
    { rank: 2, player: 'TetrisKing', score: 89200, earnings: 650, gamesPlayed: 28 },
    { rank: 3, player: 'GridGuru', score: 76800, earnings: 420, gamesPlayed: 23 },
    { rank: 4, player: 'StrategyPro', score: 68900, earnings: 380, gamesPlayed: 21 },
    { rank: 5, player: user?.email?.split('@')[0] || 'You', score: 58200, earnings: 290, gamesPlayed: 18, isCurrentUser: true }
  ]);

  const [triviaLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, player: 'QuizMaster', score: 98750, earnings: 720, gamesPlayed: 45 },
    { rank: 2, player: 'BrainiacBot', score: 87320, earnings: 580, gamesPlayed: 39 },
    { rank: 3, player: 'KnowledgeKing', score: 76890, earnings: 460, gamesPlayed: 33 },
    { rank: 4, player: 'FactFinder', score: 69420, earnings: 380, gamesPlayed: 28 },
    { rank: 5, player: user?.email?.split('@')[0] || 'You', score: 62180, earnings: 320, gamesPlayed: 25, isCurrentUser: true }
  ]);

  const [crosswordLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, player: 'WordWizard', score: 156230, earnings: 980, gamesPlayed: 67 },
    { rank: 2, player: 'CrosswordKing', score: 142890, earnings: 850, gamesPlayed: 59 },
    { rank: 3, player: 'ClueHunter', score: 128450, earnings: 720, gamesPlayed: 52 },
    { rank: 4, player: 'WordSmith', score: 115670, earnings: 580, gamesPlayed: 44 },
    { rank: 5, player: user?.email?.split('@')[0] || 'You', score: 98340, earnings: 420, gamesPlayed: 38, isCurrentUser: true }
  ]);

  // Mock recent winners data
  const [recentWinners] = useState<RecentWinner[]>([
    { player: 'PuzzleMaster', puzzle: 'Mountain Vista', prize: 150, date: '2 hours ago' },
    { player: 'WordWizard', puzzle: 'Daily Crossword', prize: 85, date: '4 hours ago' },
    { player: 'BlockMaster', puzzle: 'Time Attack', prize: 120, date: '6 hours ago' },
    { player: 'QuizMaster', puzzle: 'Science Quiz', prize: 95, date: '8 hours ago' },
    { player: 'SpeedSolver', puzzle: 'Ocean Waves', prize: 200, date: '12 hours ago' }
  ]);

  const getCurrentLeaderboard = () => {
    switch (activePuzzleType) {
      case 'block-puzzle': return blockPuzzleLeaderboard;
      case 'trivia': return triviaLeaderboard;
      case 'crossword': return crosswordLeaderboard;
      default: return jigsawLeaderboard;
    }
  };

  const filteredLeaderboard = getCurrentLeaderboard().filter(entry =>
    entry.player.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPuzzleIcon = (type: string) => {
    switch (type) {
      case 'block-puzzle': return Grid3X3;
      case 'trivia': return Brain;
      case 'crossword': return BookOpen;
      default: return Target;
    }
  };

  const getPuzzleTypeLabel = (type: string) => {
    switch (type) {
      case 'block-puzzle': return 'Block Puzzle';
      case 'trivia': return 'Trivia Lightning';
      case 'crossword': return 'Daily Crossword';
      default: return 'Jigsaw Puzzles';
    }
  };

  const formatScore = (score: number) => {
    return score.toLocaleString();
  };

  const formatEarnings = (earnings: number) => {
    return `$${earnings.toFixed(0)}`;
  };

  const getUserRank = () => {
    const currentUser = getCurrentLeaderboard().find(entry => entry.isCurrentUser);
    return currentUser?.rank || 'Unranked';
  };

  return (
    <main className="min-h-screen bg-puzzle-black">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-puzzle-black via-gray-900 to-puzzle-black py-20">
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-puzzle-gold/20 rounded-full">
                <Trophy className="h-16 w-16 text-puzzle-gold" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-puzzle-white">Global Leaderboards</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Compete with players worldwide
            </p>
            
            {/* Current User Ranking */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Crown className="h-8 w-8 text-puzzle-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-puzzle-gold">#{getUserRank()}</div>
                  <div className="text-sm text-gray-300">Your Current Rank</div>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
                  <div className="text-2xl font-bold text-puzzle-white">
                    {getCurrentLeaderboard().find(e => e.isCurrentUser)?.earnings || 0}
                  </div>
                  <div className="text-sm text-gray-300">Total Earnings</div>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
                  <div className="text-2xl font-bold text-puzzle-white">
                    {getCurrentLeaderboard().find(e => e.isCurrentUser)?.gamesPlayed || 0}
                  </div>
                  <div className="text-sm text-gray-300">Games Played</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Winners Carousel */}
      <section className="py-12 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-puzzle-white mb-4">Recent Winners</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4">
              {recentWinners.map((winner, index) => (
                <div
                  key={index}
                  className="flex-none w-72 bg-gray-900 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-puzzle-aqua/20 rounded-full flex items-center justify-center">
                        <Crown className="h-5 w-5 text-puzzle-gold" />
                      </div>
                      <div>
                        <div className="font-semibold text-puzzle-white">{winner.player}</div>
                        <div className="text-sm text-gray-400">{winner.date}</div>
                      </div>
                    </div>
                    <Badge className="bg-puzzle-gold text-puzzle-black">
                      ${winner.prize}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">{winner.puzzle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Leaderboard */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search and Filters */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-puzzle-white placeholder-gray-400 focus:border-puzzle-aqua focus:outline-none"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-puzzle-aqua" />
                    <select
                      value={activeTimeFilter}
                      onChange={(e) => setActiveTimeFilter(e.target.value)}
                      className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-puzzle-white text-sm focus:border-puzzle-aqua focus:outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="all-time">All Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Puzzle Type Tabs */}
            <Tabs value={activePuzzleType} onValueChange={setActivePuzzleType} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8 bg-gray-900 border border-gray-700">
                <TabsTrigger value="jigsaw" className="data-[state=active]:bg-puzzle-aqua data-[state=active]:text-puzzle-black">
                  <Target className="h-4 w-4 mr-2" />
                  Jigsaw
                </TabsTrigger>
                <TabsTrigger value="block-puzzle" className="data-[state=active]:bg-puzzle-aqua data-[state=active]:text-puzzle-black">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Block Puzzle
                </TabsTrigger>
                <TabsTrigger value="trivia" className="data-[state=active]:bg-puzzle-aqua data-[state=active]:text-puzzle-black">
                  <Brain className="h-4 w-4 mr-2" />
                  Trivia
                </TabsTrigger>
                <TabsTrigger value="crossword" className="data-[state=active]:bg-puzzle-aqua data-[state=active]:text-puzzle-black">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Crossword
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activePuzzleType}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Leaderboard */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-puzzle-white flex items-center">
                          {React.createElement(getPuzzleIcon(activePuzzleType), { className: "h-5 w-5 mr-2 text-puzzle-gold" })}
                          {getPuzzleTypeLabel(activePuzzleType)} - {activeTimeFilter.charAt(0).toUpperCase() + activeTimeFilter.slice(1)} Rankings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {filteredLeaderboard.map((entry) => (
                            <div 
                              key={entry.rank}
                              className={`p-4 rounded-lg transition-all duration-200 ${
                                entry.isCurrentUser 
                                  ? 'bg-puzzle-aqua/20 border-2 border-puzzle-aqua' 
                                  : 'bg-gray-800 hover:bg-gray-750'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                    entry.rank === 1 ? 'bg-puzzle-gold text-puzzle-black' :
                                    entry.rank === 2 ? 'bg-gray-400 text-gray-900' :
                                    entry.rank === 3 ? 'bg-orange-500 text-white' :
                                    'bg-gray-600 text-gray-300'
                                  }`}>
                                    {entry.rank}
                                  </div>
                                  <div>
                                    <div className={`font-semibold ${entry.isCurrentUser ? 'text-puzzle-aqua' : 'text-puzzle-white'}`}>
                                      {entry.player}
                                      {entry.isCurrentUser && (
                                        <Badge variant="outline" className="ml-2 text-xs text-puzzle-aqua border-puzzle-aqua">
                                          You
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {entry.gamesPlayed} games • {formatEarnings(entry.earnings)} earned
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-puzzle-gold">
                                    {formatScore(entry.score)}
                                  </div>
                                  {entry.timeElapsed && (
                                    <div className="text-sm text-gray-400">
                                      Best: {entry.timeElapsed}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Side Stats */}
                  <div className="space-y-6">
                    {/* Prize Earnings */}
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-puzzle-white text-lg flex items-center">
                          <Star className="h-5 w-5 mr-2 text-puzzle-gold" />
                          Top Earners
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {getCurrentLeaderboard().slice(0, 5).map((entry, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-puzzle-gold font-bold">#{entry.rank}</span>
                                <span className={`text-sm ${entry.isCurrentUser ? 'text-puzzle-aqua font-semibold' : 'text-puzzle-white'}`}>
                                  {entry.player}
                                </span>
                              </div>
                              <span className="text-puzzle-gold font-bold">
                                {formatEarnings(entry.earnings)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Speed Records */}
                    {activePuzzleType === 'jigsaw' && (
                      <Card className="bg-gray-900 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-puzzle-white text-lg flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-puzzle-aqua" />
                            Speed Records
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {jigsawLeaderboard.slice(0, 5).map((entry, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-puzzle-aqua font-bold">#{entry.rank}</span>
                                  <span className={`text-sm ${entry.isCurrentUser ? 'text-puzzle-aqua font-semibold' : 'text-puzzle-white'}`}>
                                    {entry.player}
                                  </span>
                                </div>
                                <span className="text-puzzle-aqua font-mono">
                                  {entry.timeElapsed}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Quick Actions */}
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-puzzle-white text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button 
                          asChild
                          className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
                        >
                          <Link to="/puzzles">Play Now</Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
                        >
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Leaderboard;

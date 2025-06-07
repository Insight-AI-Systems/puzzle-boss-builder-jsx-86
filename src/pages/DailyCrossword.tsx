
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Zap, Calendar, Target, Star, Archive } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface TodaysPuzzle {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  entryFee: number;
  prizePool: number;
  entryDeadline: Date;
  completions: number;
  averageTime: string;
}

interface LeaderboardEntry {
  rank: number;
  player: string;
  completionTime: string;
  timestamp: Date;
}

interface MonthlyChampion {
  player: string;
  totalWins: number;
  bestTime: string;
  prize: number;
}

interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompleted: Date | null;
}

const DailyCrossword: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock today's puzzle data
  const [todaysPuzzle] = useState<TodaysPuzzle>({
    difficulty: 'Medium',
    entryFee: 4,
    prizePool: 180,
    entryDeadline: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    completions: 47,
    averageTime: '12:34'
  });

  // Mock leaderboard data
  const [todaysLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, player: 'WordWizard', completionTime: '8:42', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { rank: 2, player: 'CrosswordKing', completionTime: '9:15', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { rank: 3, player: 'PuzzleMaster', completionTime: '9:58', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { rank: 4, player: 'WordSmith', completionTime: '10:23', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { rank: 5, player: 'ClueHunter', completionTime: '11:07', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) }
  ]);

  // Mock monthly champions
  const [monthlyChampions] = useState<MonthlyChampion[]>([
    { player: 'WordWizard', totalWins: 12, bestTime: '7:23', prize: 485 },
    { player: 'CrosswordKing', totalWins: 8, bestTime: '8:01', prize: 320 },
    { player: 'PuzzleMaster', totalWins: 6, bestTime: '8:15', prize: 240 }
  ]);

  // Mock user streak data
  const [userStreak] = useState<UserStreak>({
    currentStreak: 7,
    longestStreak: 23,
    lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
  });

  // Mock archive puzzles
  const [archivePuzzles] = useState([
    { date: '2024-01-06', difficulty: 'Hard', completed: true, time: '15:42' },
    { date: '2024-01-05', difficulty: 'Medium', completed: true, time: '11:23' },
    { date: '2024-01-04', difficulty: 'Easy', completed: true, time: '8:15' },
    { date: '2024-01-03', difficulty: 'Medium', completed: false, time: null },
    { date: '2024-01-02', difficulty: 'Hard', completed: true, time: '18:31' }
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
      return "Entries Closed!";
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-orange-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
                <Target className="h-16 w-16 text-puzzle-aqua" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-puzzle-white">Daily Crossword Challenge</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              New Puzzle, New Prize Daily
            </p>
            
            {/* Today's Date */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
              <div className="text-lg text-puzzle-aqua font-semibold">
                {getCurrentDate()}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold px-8 py-3"
                disabled={!isAuthenticated}
              >
                <Zap className="h-5 w-5 mr-2" />
                {isAuthenticated ? 'Play Today\'s Puzzle' : 'Login to Play'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black px-8 py-3"
              >
                <Archive className="h-5 w-5 mr-2" />
                Practice Archive
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Puzzle Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white text-center text-2xl">
                  Today's Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Puzzle Details */}
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(todaysPuzzle.difficulty)} text-white mb-4`}>
                      {todaysPuzzle.difficulty} Difficulty
                    </div>
                    <div className="text-3xl font-bold text-puzzle-aqua mb-2">
                      ${todaysPuzzle.entryFee}
                    </div>
                    <div className="text-sm text-gray-400">Entry Fee</div>
                  </div>

                  {/* Prize Pool */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-puzzle-gold mb-2">
                      ${todaysPuzzle.prizePool}
                    </div>
                    <div className="text-sm text-gray-400">Prize Pool</div>
                    <div className="mt-2 text-puzzle-white">
                      {todaysPuzzle.completions} entries
                    </div>
                  </div>

                  {/* Entry Deadline */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-puzzle-aqua mr-2" />
                      <span className="text-sm text-gray-300">Entry Deadline</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-puzzle-white">
                      {formatCountdown(todaysPuzzle.entryDeadline)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Avg. Time: {todaysPuzzle.averageTime}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Streak Counter & Today's Leaderboard */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* User Streak */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Star className="h-5 w-5 mr-2 text-puzzle-gold" />
                  Your Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-puzzle-aqua mb-2">
                      {userStreak.currentStreak}
                    </div>
                    <div className="text-sm text-gray-400">Current Streak</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-puzzle-white">{userStreak.longestStreak}</div>
                      <div className="text-xs text-gray-400">Longest Streak</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-puzzle-white">
                        {userStreak.lastCompleted ? 'Yesterday' : 'Never'}
                      </div>
                      <div className="text-xs text-gray-400">Last Completed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Leaderboard */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-puzzle-gold" />
                  Today's Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {todaysLeaderboard.map((entry) => (
                    <div 
                      key={entry.rank}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-puzzle-gold font-bold w-6">#{entry.rank}</span>
                        <div>
                          <div className="text-puzzle-white font-medium">{entry.player}</div>
                          <div className="text-xs text-gray-400">{formatTimeAgo(entry.timestamp)}</div>
                        </div>
                      </div>
                      <div className="text-puzzle-aqua font-mono font-bold">
                        {entry.completionTime}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Monthly Champions & Archive */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Monthly Champions */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-puzzle-gold" />
                  Monthly Champions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyChampions.map((champion, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-puzzle-white font-semibold">{champion.player}</div>
                        <Badge className="bg-puzzle-gold text-puzzle-black">
                          ${champion.prize} Won
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Wins: </span>
                          <span className="text-puzzle-aqua font-semibold">{champion.totalWins}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Best: </span>
                          <span className="text-puzzle-aqua font-mono">{champion.bestTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Archive Access */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Archive className="h-5 w-5 mr-2 text-puzzle-aqua" />
                  Practice Archive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {archivePuzzles.map((puzzle, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="text-puzzle-white font-medium">{puzzle.date}</div>
                        <div className={`text-xs px-2 py-1 rounded ${getDifficultyColor(puzzle.difficulty)} text-white inline-block`}>
                          {puzzle.difficulty}
                        </div>
                      </div>
                      <div className="text-right">
                        {puzzle.completed ? (
                          <div>
                            <div className="text-puzzle-aqua font-mono text-sm">{puzzle.time}</div>
                            <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                              Completed
                            </Badge>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs">
                            Practice
                          </Button>
                        )}
                      </div>
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
                Ready for Today's Challenge?
              </h3>
              <p className="text-gray-300 mb-6">
                Create your account to compete in daily crossword challenges and track your progress
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

export default DailyCrossword;

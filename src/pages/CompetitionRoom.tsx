
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, Users, Zap, HelpCircle, Send, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface CompetitorProgress {
  id: string;
  name: string;
  progress: number;
  timeElapsed: string;
  isComplete: boolean;
}

interface CompetitionData {
  id: string;
  title: string;
  timeLimit: number;
  prizePool: number;
  entryFee: number;
  maxPlayers: number;
  hintsAvailable: number;
}

const CompetitionRoom: React.FC = () => {
  const { user } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(true);
  const [showWinner, setShowWinner] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Mock competition data
  const [competition] = useState<CompetitionData>({
    id: 'comp-001',
    title: 'Speed Puzzle Championship',
    timeLimit: 300,
    prizePool: 250,
    entryFee: 5,
    maxPlayers: 20,
    hintsAvailable: 3
  });

  // Mock competitor data
  const [competitors] = useState<CompetitorProgress[]>([
    { id: '1', name: 'PuzzleMaster', progress: 85, timeElapsed: '3:42', isComplete: false },
    { id: '2', name: 'SpeedSolver', progress: 78, timeElapsed: '3:55', isComplete: false },
    { id: '3', name: 'BrainBox', progress: 72, timeElapsed: '4:12', isComplete: false },
    { id: '4', name: 'QuickThink', progress: 68, timeElapsed: '4:20', isComplete: false },
    { id: '5', name: 'PuzzleQueen', progress: 65, timeElapsed: '4:35', isComplete: false },
    { id: 'user', name: user?.email?.split('@')[0] || 'You', progress: userProgress, timeElapsed: formatTime(300 - timeRemaining), isComplete: false }
  ]);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const handleUseHint = () => {
    if (hintsUsed < competition.hintsAvailable) {
      setHintsUsed(prev => prev + 1);
      // Simulate hint helping with progress
      setUserProgress(prev => Math.min(prev + 5, 100));
    }
  };

  const handleSubmit = () => {
    if (userProgress >= 100) {
      setShowWinner(true);
      setIsActive(false);
    }
  };

  const sortedCompetitors = [...competitors].sort((a, b) => b.progress - a.progress);

  return (
    <div className="min-h-screen bg-puzzle-black relative">
      {/* Main Competition Layout */}
      <div className="flex h-screen">
        {/* Central Puzzle Area */}
        <div className="flex-1 flex flex-col p-6">
          {/* Competition Header */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-puzzle-white">{competition.title}</h1>
                <p className="text-gray-400">Prize Pool: <span className="text-puzzle-gold font-semibold">${competition.prizePool}</span></p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center text-puzzle-aqua mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">Time Remaining</span>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-puzzle-white'}`}>
                    {formatTime(timeRemaining)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center text-puzzle-aqua mb-1">
                    <Target className="h-4 w-4 mr-1" />
                    <span className="text-sm">Your Progress</span>
                  </div>
                  <div className="text-2xl font-bold text-puzzle-aqua">
                    {userProgress}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Puzzle Area */}
          <div className="flex-1 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-64 bg-puzzle-aqua/20 rounded-lg border-2 border-dashed border-puzzle-aqua flex items-center justify-center mb-4">
                <div className="text-puzzle-aqua">
                  <Target className="h-16 w-16 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Puzzle Area</p>
                  <p className="text-sm opacity-75">Interactive puzzle goes here</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-puzzle-aqua h-3 rounded-full transition-all duration-500"
                    style={{ width: `${userProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">Progress: {userProgress}% Complete</p>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-gray-900 rounded-lg p-4 mt-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
                  onClick={handleUseHint}
                  disabled={hintsUsed >= competition.hintsAvailable}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Use Hint ({competition.hintsAvailable - hintsUsed} left)
                </Button>
                <div className="text-sm text-gray-400">
                  Hints used: {hintsUsed}/{competition.hintsAvailable}
                </div>
              </div>
              <Button
                className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-puzzle-black font-semibold px-8"
                onClick={handleSubmit}
                disabled={userProgress < 100 || !isActive}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Solution
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
          {/* Live Leaderboard */}
          <div className="flex-1 p-6">
            <Card className="bg-gray-800 border-gray-600 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-puzzle-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-puzzle-gold" />
                  Live Leaderboard
                </CardTitle>
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="h-4 w-4 mr-1" />
                  {sortedCompetitors.length} players competing
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sortedCompetitors.map((competitor, index) => (
                    <div 
                      key={competitor.id}
                      className={`p-3 rounded-lg ${
                        competitor.id === 'user' 
                          ? 'bg-puzzle-aqua/20 border border-puzzle-aqua' 
                          : 'bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold w-6 ${index === 0 ? 'text-puzzle-gold' : 'text-gray-400'}`}>
                            #{index + 1}
                          </span>
                          <span className={`font-medium ${competitor.id === 'user' ? 'text-puzzle-aqua' : 'text-puzzle-white'}`}>
                            {competitor.name}
                          </span>
                          {competitor.id === 'user' && (
                            <Badge variant="outline" className="text-xs text-puzzle-aqua border-puzzle-aqua">
                              You
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-400">{competitor.timeElapsed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 bg-gray-600 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              competitor.id === 'user' ? 'bg-puzzle-aqua' : 'bg-puzzle-gold'
                            }`}
                            style={{ width: `${competitor.progress}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-semibold ${
                          competitor.id === 'user' ? 'text-puzzle-aqua' : 'text-puzzle-white'
                        }`}>
                          {competitor.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prize Pool Info */}
          <div className="p-6 border-t border-gray-700">
            <div className="bg-gradient-to-r from-puzzle-aqua/20 to-puzzle-gold/20 rounded-lg p-4 border border-puzzle-aqua/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-puzzle-gold mb-1">
                  ${competition.prizePool}
                </div>
                <div className="text-sm text-gray-300 mb-3">Total Prize Pool</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div>1st: 60%</div>
                  <div>2nd: 25%</div>
                  <div>3rd: 15%</div>
                  <div>Entry: ${competition.entryFee}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Announcement Overlay */}
      {showWinner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-gradient-to-br from-puzzle-aqua/20 to-puzzle-gold/20 border-puzzle-gold max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Trophy className="h-16 w-16 text-puzzle-gold mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-puzzle-white mb-2">Congratulations!</h2>
                <p className="text-puzzle-aqua text-lg">You completed the puzzle!</p>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-puzzle-aqua">{formatTime(300 - timeRemaining)}</div>
                    <div className="text-sm text-gray-400">Completion Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-puzzle-gold">$150</div>
                    <div className="text-sm text-gray-400">Prize Won</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  asChild
                  className="flex-1 bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
                >
                  <Link to="/puzzles">Play Again</Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  className="flex-1 border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
                >
                  <Link to="/profile">View Stats</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompetitionRoom;

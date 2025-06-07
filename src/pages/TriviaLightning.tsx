
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Zap, Brain, BookOpen, Gamepad2, FlaskConical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface CategoryTier {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  entryFee: number;
  prizePool: number;
  nextQuiz: Date;
  activeQueued: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  color: string;
  description: string;
}

interface QuickStat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
}

interface LivePlayer {
  name: string;
  category: string;
  timeWaiting: string;
}

const TriviaLightning: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data for category tiers
  const [categories] = useState<CategoryTier[]>([
    {
      id: 'general',
      name: 'General Knowledge',
      icon: BookOpen,
      entryFee: 3,
      prizePool: 120,
      nextQuiz: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours from now
      activeQueued: 18,
      difficulty: 'Medium',
      color: 'bg-blue-500',
      description: 'Mixed topics from history to pop culture'
    },
    {
      id: 'sports',
      name: 'Sports & Athletics',
      icon: Trophy,
      entryFee: 4,
      prizePool: 160,
      nextQuiz: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      activeQueued: 22,
      difficulty: 'Hard',
      color: 'bg-green-500',
      description: 'Professional sports, records, and legends'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: Gamepad2,
      entryFee: 3,
      prizePool: 90,
      nextQuiz: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      activeQueued: 15,
      difficulty: 'Easy',
      color: 'bg-purple-500',
      description: 'Movies, music, TV shows, and celebrities'
    },
    {
      id: 'science',
      name: 'Science & Tech',
      icon: FlaskConical,
      entryFee: 5,
      prizePool: 200,
      nextQuiz: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      activeQueued: 12,
      difficulty: 'Expert',
      color: 'bg-orange-500',
      description: 'Physics, chemistry, biology, and technology'
    }
  ]);

  // Mock quick stats
  const [quickStats] = useState<QuickStat[]>([
    { label: 'Questions Answered Today', value: '2,847', icon: Brain },
    { label: 'Fastest Response', value: '0.8s', icon: Zap },
    { label: 'Active Categories', value: '4', icon: BookOpen }
  ]);

  // Mock live player queue
  const [liveQueue] = useState<LivePlayer[]>([
    { name: 'QuizMaster', category: 'General', timeWaiting: '2m' },
    { name: 'SportsFan', category: 'Sports', timeWaiting: '1m' },
    { name: 'SciGeek', category: 'Science', timeWaiting: '3m' },
    { name: 'MovieBuff', category: 'Entertainment', timeWaiting: '1m' },
    { name: 'BrainBox', category: 'General', timeWaiting: '4m' }
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
      return "Quiz Starting!";
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalQueued = () => {
    return categories.reduce((total, category) => total + category.activeQueued, 0);
  };

  const getTotalPrizePool = () => {
    return categories.reduce((total, category) => total + category.prizePool, 0);
  };

  const getNextQuizCategory = () => {
    const nextQuiz = categories.reduce((earliest, category) => 
      category.nextQuiz < earliest.nextQuiz ? category : earliest, categories[0]
    );
    return nextQuiz;
  };

  const nextCategory = getNextQuizCategory();

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
              <span className="text-puzzle-white">Trivia Lightning</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Knowledge Pays
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <stat.icon className="h-8 w-8 text-puzzle-aqua mx-auto mb-2" />
                  <div className="text-2xl font-bold text-puzzle-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Next Quiz Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-puzzle-aqua mr-2" />
                <span className="text-lg text-puzzle-white">Next Quiz: {nextCategory.name}</span>
              </div>
              <div className="text-3xl font-mono font-bold text-puzzle-aqua mb-2">
                {formatCountdown(nextCategory.nextQuiz)}
              </div>
              <p className="text-gray-300">{nextCategory.description}</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold px-8 py-3"
              >
                <Zap className="h-5 w-5 mr-2" />
                Quick Quiz
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

      {/* Category Selection Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-puzzle-white mb-4">
              Choose Your Category
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Test your knowledge across different subjects and compete for prizes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Card key={category.id} className="bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${category.color}/20`}>
                      <category.icon className={`h-8 w-8 ${category.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-puzzle-white">{category.name}</CardTitle>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color} text-white`}>
                    {category.difficulty}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-400 text-center">{category.description}</p>
                  
                  {/* Entry Fee & Prize Pool */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-puzzle-aqua mb-1">
                      ${category.entryFee}
                    </div>
                    <div className="text-xs text-gray-400">Entry Fee</div>
                    <div className="mt-3">
                      <div className="text-lg font-semibold text-puzzle-gold">
                        ${category.prizePool} Pool
                      </div>
                    </div>
                  </div>

                  {/* Quiz Countdown */}
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-3 w-3 text-puzzle-aqua mr-1" />
                      <span className="text-xs text-gray-300">Next Quiz</span>
                    </div>
                    <div className="text-lg font-mono font-bold text-puzzle-white">
                      {formatCountdown(category.nextQuiz)}
                    </div>
                  </div>

                  {/* Queued Players */}
                  <div className="flex items-center justify-center text-gray-300">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{category.activeQueued} in queue</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold text-sm"
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? 'Join Queue' : 'Login to Join'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 text-sm"
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

      {/* Live Player Queue & Stats */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Live Player Queue */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-puzzle-aqua" />
                  Live Player Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {liveQueue.map((player, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="text-puzzle-white font-medium">{player.name}</div>
                        <div className="text-sm text-gray-400">{player.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-puzzle-aqua font-mono text-sm">{player.timeWaiting}</div>
                        <div className="text-xs text-gray-400">waiting</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-puzzle-gold" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <category.icon className={`h-5 w-5 ${category.color.replace('bg-', 'text-')}`} />
                        <div>
                          <div className="text-puzzle-white font-medium">{category.name}</div>
                          <div className="text-sm text-gray-400">{category.activeQueued} active</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-puzzle-gold font-bold">${category.prizePool}</div>
                        <Badge variant="outline" className="text-xs">
                          {category.difficulty}
                        </Badge>
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
                Ready to Test Your Knowledge?
              </h3>
              <p className="text-gray-300 mb-6">
                Create your account to join trivia competitions and compete for prizes
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

export default TriviaLightning;

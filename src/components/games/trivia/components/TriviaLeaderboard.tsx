
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { TriviaLeaderboardEntry, TriviaCategory } from '../types/triviaTypes';
import { Trophy, Medal, Award, Clock, Target } from 'lucide-react';

interface TriviaLeaderboardProps {
  categories: TriviaCategory[];
}

export function TriviaLeaderboard({ categories }: TriviaLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<TriviaLeaderboardEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadLeaderboard = async (categoryId: string | null = null) => {
    setLoading(true);
    try {
      let query = supabase
        .from('trivia_leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(10);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(selectedCategory);
  }, [selectedCategory]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">{rank}</div>;
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    return `${seconds}s`;
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'All Categories';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-puzzle-white mb-2">Trivia Leaderboard</h2>
        <p className="text-gray-400">Top performers across all categories</p>
      </div>

      {/* Category Filter */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-puzzle-aqua text-black" : ""}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-puzzle-aqua text-black" : ""}
              >
                {category.icon} {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {getCategoryName(selectedCategory)} - Top 10
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-700 h-16 rounded-lg"></div>
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No scores yet for this category. Be the first to play!
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg transition-colors
                    ${index < 3 ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gray-700'}
                    hover:bg-gray-600
                  `}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(index + 1)}
                  </div>

                  {/* User Info */}
                  <div className="flex-grow">
                    <div className="font-semibold text-puzzle-white">
                      {entry.username}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(entry.quiz_date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-puzzle-aqua text-lg">
                        {entry.total_score.toLocaleString()}
                      </div>
                      <div className="text-gray-400">Score</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-green-400">
                        <Target className="w-4 h-4" />
                        <span className="font-semibold">
                          {Math.round((entry.correct_answers / entry.total_questions) * 100)}%
                        </span>
                      </div>
                      <div className="text-gray-400">Accuracy</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-blue-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">
                          {formatTime(entry.average_time)}
                        </span>
                      </div>
                      <div className="text-gray-400">Avg Time</div>
                    </div>
                  </div>

                  {/* Badge for top 3 */}
                  {index < 3 && (
                    <Badge 
                      className={
                        index === 0 ? "bg-yellow-500 text-black" :
                        index === 1 ? "bg-gray-400 text-black" :
                        "bg-amber-600 text-white"
                      }
                    >
                      {index === 0 ? "Champion" : index === 1 ? "Runner-up" : "3rd Place"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

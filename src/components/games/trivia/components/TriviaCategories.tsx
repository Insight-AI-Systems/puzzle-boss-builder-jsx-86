
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TriviaCategory } from '../types/triviaTypes';

interface TriviaCategoriesProps {
  categories: TriviaCategory[];
  onSelectCategory: (categoryId: string | null) => void;
  loading: boolean;
}

export function TriviaCategories({ categories, onSelectCategory, loading }: TriviaCategoriesProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-puzzle-white mb-2">Choose Your Trivia Category</h2>
        <p className="text-gray-400">Select a category to test your knowledge!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Mixed Category */}
        <Card 
          className="bg-gray-800 border-gray-700 hover:border-puzzle-aqua transition-colors cursor-pointer group"
          onClick={() => onSelectCategory(null)}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: '#8B5CF6' }}
              >
                🎯
              </div>
              <div>
                <CardTitle className="text-puzzle-white group-hover:text-puzzle-aqua transition-colors">
                  Mixed Topics
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Questions from all categories
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(null);
              }}
            >
              Start Mixed Quiz
            </Button>
          </CardContent>
        </Card>

        {/* Category Cards */}
        {categories.map((category) => (
          <Card 
            key={category.id}
            className="bg-gray-800 border-gray-700 hover:border-puzzle-aqua transition-colors cursor-pointer group"
            onClick={() => onSelectCategory(category.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </div>
                <div>
                  <CardTitle className="text-puzzle-white group-hover:text-puzzle-aqua transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {category.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(category.id);
                }}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

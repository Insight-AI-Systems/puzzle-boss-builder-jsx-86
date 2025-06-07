
import React, { useState, useEffect } from 'react';
import { BaseGameWrapper } from '../BaseGameWrapper';
import { ResponsiveGameContainer } from '../ResponsiveGameContainer';
import WordSearchEngine from './WordSearchEngine';
import { WordSearchInstructions } from './WordSearchInstructions';
import { wordCategories, getRandomWordsFromCategory, getDifficultyWordCount } from './WordListManager';
import { GameConfig } from '../types/GameTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shuffle, RotateCcw, Play } from 'lucide-react';

interface WordSearchGameProps {
  difficulty?: 'rookie' | 'pro' | 'master';
  category?: string;
  entryFee?: number;
  onComplete?: (result: any) => void;
}

const WordSearchGame: React.FC<WordSearchGameProps> = ({
  difficulty = 'rookie',
  category: initialCategory,
  entryFee = 0,
  onComplete
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'animals');
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [gameKey, setGameKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [wordsFound, setWordsFound] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  const gameConfig: GameConfig = {
    gameType: 'word-search',
    hasTimer: true,
    hasScore: true,
    hasMoves: false,
    timeLimit: difficulty === 'master' ? 600 : difficulty === 'pro' ? 480 : 360,
    requiresPayment: entryFee > 0,
    entryFee
  };

  // Initialize words when category or difficulty changes
  useEffect(() => {
    const wordCount = getDifficultyWordCount(difficulty);
    const words = getRandomWordsFromCategory(selectedCategory, wordCount, difficulty);
    setCurrentWords(words);
    setTotalWords(words.length);
    setWordsFound(0);
    setGameStarted(false);
    setShowInstructions(true);
  }, [selectedCategory, difficulty]);

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setGameKey(prev => prev + 1);
    setGameStarted(false);
    setShowInstructions(true);
  };

  const handleNewGame = () => {
    const wordCount = getDifficultyWordCount(difficulty);
    const words = getRandomWordsFromCategory(selectedCategory, wordCount, difficulty);
    setCurrentWords(words);
    setTotalWords(words.length);
    setWordsFound(0);
    setGameKey(prev => prev + 1);
    setGameStarted(false);
    setShowInstructions(true);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
  };

  const handleWordFound = (word: string, found: number, total: number) => {
    setWordsFound(found);
    setTotalWords(total);
  };

  const handleGameComplete = (stats: { timeElapsed: number; wordsFound: number; totalWords: number }) => {
    const score = Math.max(0, 1000 - Math.floor(stats.timeElapsed / 1000) + (stats.wordsFound * 100));
    onComplete?.({
      sessionId: `word-search-${Date.now()}`,
      score,
      timeElapsed: stats.timeElapsed,
      moves: 0,
      completed: true,
      gameType: 'word-search',
      wordsFound: stats.wordsFound,
      totalWords: stats.totalWords
    });
  };

  const categoryOptions = wordCategories.find(cat => cat.id === selectedCategory);

  return (
    <ResponsiveGameContainer maxWidth="full" className="min-h-screen bg-puzzle-black">
      <BaseGameWrapper
        config={gameConfig}
        hooks={{
          onGameStart: () => setGameStarted(true),
          onScoreUpdate: (score) => {
            // Score is calculated based on words found and time
          }
        }}
      >
        <div className="space-y-4">
          {/* Game Configuration */}
          {showInstructions && (
            <>
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-puzzle-white">Game Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-puzzle-white mb-2">
                        Category
                      </label>
                      <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-puzzle-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {wordCategories.map(category => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id}
                              className="text-puzzle-white hover:bg-gray-700"
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <Button
                        onClick={handleNewGame}
                        variant="outline"
                        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
                      >
                        <Shuffle className="h-4 w-4 mr-2" />
                        New Words
                      </Button>
                      
                      <Button
                        onClick={handleStartGame}
                        className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Game
                      </Button>
                    </div>
                  </div>
                  
                  {categoryOptions && (
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-300">{categoryOptions.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {totalWords} words to find • {difficulty} difficulty
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Instructions */}
              <WordSearchInstructions
                difficulty={difficulty}
                category={categoryOptions?.name || 'Unknown'}
                totalWords={totalWords}
              />
            </>
          )}

          {/* Word Search Engine */}
          {gameStarted && currentWords.length > 0 && (
            <WordSearchEngine
              key={gameKey}
              difficulty={difficulty}
              category={categoryOptions?.name || 'Unknown'}
              wordList={currentWords}
              onComplete={handleGameComplete}
              onWordFound={handleWordFound}
            />
          )}

          {/* Game Actions */}
          {gameStarted && (
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    onClick={handleNewGame}
                    variant="outline"
                    className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>
                  
                  <Button
                    onClick={() => handleCategoryChange(selectedCategory)}
                    variant="outline"
                    className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold hover:text-puzzle-black"
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Shuffle Words
                  </Button>
                  
                  <Button
                    onClick={() => setShowInstructions(true)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Show Instructions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </BaseGameWrapper>
    </ResponsiveGameContainer>
  );
};

export default WordSearchGame;

import React, { useState, useEffect } from 'react';
import { BaseGameWrapper } from '../BaseGameWrapper';
import { ResponsiveGameContainer } from '../ResponsiveGameContainer';
import WordSearchEngine from './WordSearchEngine';
import { WordSearchInstructions } from './WordSearchInstructions';
import { wordCategories, getRandomWordsFromCategory, getDifficultyWordCount } from './WordListManager';
import { GameConfig } from '../types/GameTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shuffle, RotateCcw, Play, Clock, Trophy, Coins } from 'lucide-react';
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
  const [enablePenalties] = useState(true); // Always enable penalties for competitive play

  const gameConfig: GameConfig = {
    gameType: 'word-search',
    hasTimer: true,
    hasScore: true,
    hasMoves: false,
    timeLimit: difficulty === 'master' ? 600 : difficulty === 'pro' ? 480 : 360,
    requiresPayment: entryFee > 0,
    entryFee
  };

  // Generate unique session ID for game state persistence
  const [sessionId] = useState(() => `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

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
  const handleStartGame = (startGameFn: () => void) => {
    startGameFn(); // Call the BaseGameWrapper's startGame function
    setGameStarted(true);
    setShowInstructions(false);
  };
  const handleWordFound = (word: string, found: number, total: number) => {
    setWordsFound(found);
    setTotalWords(total);
  };
  const handleGameComplete = (stats: {
    timeElapsed: number;
    wordsFound: number;
    totalWords: number;
    incorrectSelections: number;
  }) => {
    // Calculate competitive score with penalties
    const baseScore = 1000;
    const timeBonus = Math.max(0, (gameConfig.timeLimit! - Math.floor(stats.timeElapsed / 1000)) * 10);
    const completionBonus = stats.wordsFound === stats.totalWords ? 500 : 0;
    const penaltyDeduction = stats.incorrectSelections * 50;
    const finalScore = Math.max(0, baseScore + timeBonus + completionBonus - penaltyDeduction);
    onComplete?.({
      sessionId,
      score: finalScore,
      timeElapsed: stats.timeElapsed,
      moves: 0,
      completed: stats.wordsFound === stats.totalWords,
      gameType: 'word-search',
      wordsFound: stats.wordsFound,
      totalWords: stats.totalWords,
      incorrectSelections: stats.incorrectSelections
    });
  };
  const categoryOptions = wordCategories.find(cat => cat.id === selectedCategory);
  return <ResponsiveGameContainer maxWidth="full" className="min-h-screen bg-puzzle-black">
      <BaseGameWrapper config={gameConfig} hooks={{
      onGameStart: () => setGameStarted(true),
      onScoreUpdate: score => {
        // Score is calculated based on words found, time, and penalties
      }
    }}>
        {({
        gameState,
        startGame,
        timer,
        payment,
        session
      }) => <div className="space-y-4">
            {/* Game Configuration */}
            {showInstructions && <>
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-puzzle-white">Competitive Word Search</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Game Metrics - Always Visible */}
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-puzzle-aqua font-semibold mb-3 text-sm">Live Game Metrics</h4>
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                          <Clock className="h-3 w-3 mr-1" />
                          {timer?.formattedTime || '00:00'}
                        </Badge>
                        
                        <Badge variant="outline" className="text-puzzle-gold border-puzzle-gold">
                          <Trophy className="h-3 w-3 mr-1" />
                          Score: {session?.score?.toLocaleString() || '0'}
                        </Badge>
                        
                        {gameConfig.requiresPayment && <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                            <Coins className="h-3 w-3 mr-1" />
                            Entry: {gameConfig.entryFee} credits
                          </Badge>}
                        
                        <Badge variant="outline" className="text-puzzle-white border-gray-400">
                          Words: {wordsFound}/{totalWords}
                        </Badge>

                        {payment && <Badge variant="outline" className="text-puzzle-gold border-puzzle-gold">
                            <Coins className="h-3 w-3 mr-1" />
                            Available: {payment.paymentStatus?.credits || 0} credits
                          </Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-puzzle-white mb-2">Choose Your Puzzle Category</label>
                        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-puzzle-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {wordCategories.map(category => <SelectItem key={category.id} value={category.id} className="text-puzzle-white hover:bg-gray-700">
                                {category.name}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <Button onClick={handleNewGame} variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black">
                          <Shuffle className="h-4 w-4 mr-2" />
                          New Words
                        </Button>
                        
                        {!gameStarted && gameState === 'not_started' && <Button onClick={() => handleStartGame(startGame)} className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold">
                            <Play className="h-4 w-4 mr-2" />
                            Start Game
                          </Button>}
                      </div>
                    </div>
                    
                    {categoryOptions && <div className="p-3 bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-300">{categoryOptions.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {totalWords} words to find • {difficulty} difficulty
                        </p>
                      </div>}

                    {/* Competitive Features Info */}
                    <div className="p-4 bg-puzzle-aqua/10 border border-puzzle-aqua/30 rounded-lg">
                      <h4 className="text-puzzle-aqua font-semibold mb-2">Competitive Features:</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• ⏱️ Precision timing to milliseconds</li>
                        <li>• 🎯 All words must be found to complete</li>
                        <li>• ⚠️ Penalty system for incorrect selections</li>
                        <li>• 🏆 Real-time leaderboard tracking</li>
                        <li>• 💾 Game state auto-saves (disconnect protection)</li>
                        <li>• ✅ Auto-submit when all words found</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Instructions */}
                <WordSearchInstructions difficulty={difficulty} category={categoryOptions?.name || 'Unknown'} totalWords={totalWords} competitive={true} />
              </>}

            {/* Enhanced Word Search Engine */}
            {gameStarted && currentWords.length > 0 && <WordSearchEngine key={gameKey} difficulty={difficulty} category={categoryOptions?.name || 'Unknown'} wordList={currentWords} onComplete={handleGameComplete} onWordFound={handleWordFound} enablePenalties={enablePenalties} sessionId={sessionId} />}

            {/* Game Actions */}
            {gameStarted && <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button onClick={handleNewGame} variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Game
                    </Button>
                    
                    <Button onClick={() => handleCategoryChange(selectedCategory)} variant="outline" className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold hover:text-puzzle-black">
                      <Shuffle className="h-4 w-4 mr-2" />
                      Shuffle Words
                    </Button>
                    
                    <Button onClick={() => setShowInstructions(true)} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      Show Instructions
                    </Button>
                  </div>
                </CardContent>
              </Card>}
          </div>}
      </BaseGameWrapper>
    </ResponsiveGameContainer>;
};
export default WordSearchGame;
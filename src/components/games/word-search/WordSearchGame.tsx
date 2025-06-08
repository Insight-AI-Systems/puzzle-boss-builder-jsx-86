
import React, { useState, useEffect } from 'react';
import { BaseGameWrapper } from '../BaseGameWrapper';
import { ResponsiveGameContainer } from '../ResponsiveGameContainer';
import { WordSearchEngine, WordSearchState } from '../../../business/engines/word-search/WordSearchEngine';
import { WordSearchInstructions } from './WordSearchInstructions';
import { wordCategories, getRandomWordsFromCategory, getDifficultyWordCount } from './WordListManager';
import { GameConfig } from '../types/GameTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Play, Clock, Trophy, Coins } from 'lucide-react';
import { usePayment } from '../hooks/usePayment';

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
  const [gameEngine, setGameEngine] = useState<WordSearchEngine | null>(null);
  const [gameState, setGameState] = useState<WordSearchState | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Use new payment hook instead of usePaymentVerification
  const { paymentStatus, isProcessing, processPayment } = usePayment(entryFee);

  const gameConfig: GameConfig = {
    gameType: 'word-search',
    hasTimer: true,
    hasScore: true,
    hasMoves: false,
    timeLimit: difficulty === 'master' ? 600 : difficulty === 'pro' ? 480 : 360,
    requiresPayment: entryFee > 0,
    entryFee,
    difficulty
  };

  const [sessionId] = useState(() => `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Initialize game engine when category or difficulty changes
  useEffect(() => {
    const initializeEngine = async () => {
      const wordCount = getDifficultyWordCount(difficulty);
      const words = getRandomWordsFromCategory(selectedCategory, wordCount, difficulty);
      
      const initialState: WordSearchState = {
        id: sessionId,
        status: 'idle',
        startTime: null,
        endTime: null,
        score: 0,
        moves: 0,
        isComplete: false,
        grid: [],
        gridSize: 0,
        words,
        foundWords: new Set(),
        placedWords: [],
        selectedCells: [],
        incorrectSelections: 0,
        category: selectedCategory,
        difficulty
      };

      const engine = new WordSearchEngine(initialState, gameConfig);
      
      // Listen to engine events
      engine.addEventListener((event) => {
        console.log('Game event:', event);
        setGameState(engine.getState());
      });

      await engine.initialize();
      setGameEngine(engine);
      setGameState(engine.getState());
      setGameStarted(false);
      setShowInstructions(true);
    };

    initializeEngine();
  }, [selectedCategory, difficulty, sessionId]);

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setGameKey(prev => prev + 1);
  };

  const handleStartGame = async (startGameFn: () => void) => {
    // Process payment first if required
    if (entryFee > 0) {
      const paymentSuccess = await processPayment(sessionId);
      if (!paymentSuccess) {
        return; // Payment failed, don't start game
      }
    }

    if (gameEngine) {
      gameEngine.start();
      setGameState(gameEngine.getState());
    }
    startGameFn();
    setGameStarted(true);
    setShowInstructions(false);
  };

  const handleCellSelection = (selectedCells: string[]) => {
    if (gameEngine && gameState) {
      gameEngine.makeMove({
        type: 'SELECT_CELLS',
        selectedCells
      });
      setGameState(gameEngine.getState());
    }
  };

  const handleWordValidation = (selectedCells: string[]) => {
    if (gameEngine && gameState) {
      gameEngine.makeMove({
        type: 'VALIDATE_SELECTION',
        selectedCells
      });
      
      const newState = gameEngine.getState();
      setGameState(newState);

      // Check win condition
      const winResult = gameEngine.checkWinCondition();
      if (winResult.isWin) {
        handleGameComplete();
      }
    }
  };

  const handleGameComplete = () => {
    if (!gameState || !gameEngine) return;

    const stats = {
      timeElapsed: gameState.endTime && gameState.startTime 
        ? gameState.endTime - gameState.startTime 
        : 0,
      wordsFound: gameState.foundWords.size,
      totalWords: gameState.words.length,
      incorrectSelections: gameState.incorrectSelections
    };

    onComplete?.({
      sessionId,
      score: gameState.score,
      timeElapsed: stats.timeElapsed,
      moves: gameState.moves,
      completed: stats.wordsFound === stats.totalWords,
      gameType: 'word-search',
      wordsFound: stats.wordsFound,
      totalWords: stats.totalWords,
      incorrectSelections: stats.incorrectSelections
    });
  };

  const categoryOptions = wordCategories.find(cat => cat.id === selectedCategory);

  if (!gameState) {
    return (
      <ResponsiveGameContainer maxWidth="full" className="min-h-screen bg-puzzle-black">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-puzzle-white">Loading game...</div>
        </div>
      </ResponsiveGameContainer>
    );
  }

  return (
    <ResponsiveGameContainer maxWidth="full" className="min-h-screen bg-puzzle-black">
      <BaseGameWrapper 
        config={gameConfig} 
        hooks={{
          onGameStart: () => setGameStarted(true),
          onScoreUpdate: score => {
            // Score updates handled by engine
          }
        }}
      >
        {({ gameState: wrapperState, startGame, timer, payment, session }) => (
          <div className="space-y-4">
            {/* Game Configuration */}
            {showInstructions && (
              <>
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-puzzle-white">Competitive Word Search</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Game Metrics */}
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-puzzle-aqua font-semibold mb-3 text-sm">Live Game Metrics</h4>
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                          <Clock className="h-3 w-3 mr-1" />
                          {timer?.formattedTime || '00:00'}
                        </Badge>
                        
                        <Badge variant="outline" className="text-puzzle-gold border-puzzle-gold">
                          <Trophy className="h-3 w-3 mr-1" />
                          Score: {gameState.score.toLocaleString()}
                        </Badge>
                        
                        {gameConfig.requiresPayment && (
                          <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                            <Coins className="h-3 w-3 mr-1" />
                            Entry: {gameConfig.entryFee} credits
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className="text-puzzle-white border-gray-400">
                          Words: {gameState.foundWords.size}/{gameState.words.length}
                        </Badge>

                        <Badge variant="outline" className="text-puzzle-gold border-puzzle-gold">
                          <Coins className="h-3 w-3 mr-1" />
                          Available: {paymentStatus.credits} credits
                        </Badge>
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
                            {wordCategories.map(category => (
                              <SelectItem key={category.id} value={category.id} className="text-puzzle-white hover:bg-gray-700">
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end gap-2">
                        {!gameStarted && wrapperState === 'not_started' && (
                          <Button 
                            onClick={() => handleStartGame(startGame)} 
                            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
                            disabled={isProcessing || (!paymentStatus.hasAccess && entryFee > 0)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {isProcessing ? 'Processing...' : 'Start Game'}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {categoryOptions && (
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-300">{categoryOptions.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {gameState.words.length} words to find • {difficulty} difficulty
                        </p>
                      </div>
                    )}

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

                <WordSearchInstructions 
                  difficulty={difficulty} 
                  category={categoryOptions?.name || 'Unknown'} 
                  totalWords={gameState.words.length} 
                  competitive={true} 
                />
              </>
            )}

            {/* Game Grid - Render existing WordSearchEngine component */}
            {gameStarted && gameEngine && (
              <div className="bg-gray-900 rounded-lg p-4">
                <WordSearchEngineRenderer
                  key={gameKey}
                  gameState={gameState}
                  onCellSelection={handleCellSelection}
                  onWordValidation={handleWordValidation}
                  sessionId={sessionId}
                />
              </div>
            )}

            {/* Game Actions */}
            {gameStarted && (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button 
                      onClick={() => handleCategoryChange(selectedCategory)} 
                      variant="outline" 
                      className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold hover:text-puzzle-black"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Game
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
        )}
      </BaseGameWrapper>
    </ResponsiveGameContainer>
  );
};

// Temporary renderer component - will be replaced with the existing WordSearchEngine component
const WordSearchEngineRenderer: React.FC<{
  gameState: WordSearchState;
  onCellSelection: (cells: string[]) => void;
  onWordValidation: (cells: string[]) => void;
  sessionId: string;
}> = ({ gameState, onCellSelection, onWordValidation }) => {
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellId = `${rowIndex}-${colIndex}`;
    
    if (!isSelecting) {
      setSelectedCells([cellId]);
      setIsSelecting(true);
    } else {
      const newSelection = [...selectedCells, cellId];
      setSelectedCells(newSelection);
      onCellSelection(newSelection);
    }
  };

  const handleSelectionEnd = () => {
    if (selectedCells.length > 1) {
      onWordValidation(selectedCells);
    }
    setSelectedCells([]);
    setIsSelecting(false);
  };

  return (
    <div className="space-y-4">
      {/* Word List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
        {gameState.words.map((word, index) => (
          <div
            key={index}
            className={`p-2 rounded text-center text-sm font-medium ${
              gameState.foundWords.has(word)
                ? 'bg-puzzle-aqua text-puzzle-black line-through'
                : 'bg-gray-800 text-puzzle-white'
            }`}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Game Grid */}
      <div className="flex justify-center">
        <div className="inline-block">
          <div
            className="grid gap-1 p-4 bg-gray-800 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${gameState.gridSize}, minmax(0, 1fr))`
            }}
          >
            {gameState.grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                const cellId = `${rowIndex}-${colIndex}`;
                const isSelected = selectedCells.includes(cellId);
                
                return (
                  <button
                    key={cellId}
                    className={`
                      w-8 h-8 md:w-10 md:h-10 text-sm md:text-base font-bold rounded
                      transition-colors duration-200 border
                      ${isSelected
                        ? 'bg-puzzle-aqua text-puzzle-black border-puzzle-aqua'
                        : 'bg-gray-700 text-puzzle-white border-gray-600 hover:bg-gray-600'
                      }
                    `}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onMouseUp={handleSelectionEnd}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="flex justify-center gap-4 text-sm text-gray-300">
        <span>Words Found: {gameState.foundWords.size}/{gameState.words.length}</span>
        <span>Incorrect: {gameState.incorrectSelections}</span>
        <span>Score: {gameState.score}</span>
      </div>
    </div>
  );
};

export default WordSearchGame;


import { useState, useCallback, useEffect } from 'react';
import { MahjongGameState, MahjongTile } from '../types/mahjongTypes';
import { 
  MAHJONG_LAYOUTS, 
  createMahjongBoard, 
  updateBlockedStatus, 
  canMatch, 
  findAvailableMatches,
  calculateScore 
} from '../utils/mahjongEngine';

export function useMahjongGame(difficulty: 'rookie' | 'pro' | 'master' = 'rookie') {
  const [gameState, setGameState] = useState<MahjongGameState>(() => {
    const layout = MAHJONG_LAYOUTS.find(l => l.difficulty === difficulty) || MAHJONG_LAYOUTS[0];
    const tiles = updateBlockedStatus(createMahjongBoard(layout));
    
    return {
      tiles,
      selectedTiles: [],
      score: 0,
      moves: 0,
      hintsUsed: 0,
      timeElapsed: 0,
      isComplete: false,
      isGameOver: false,
      difficulty,
      layout: layout.name
    };
  });

  const [hintTiles, setHintTiles] = useState<MahjongTile[]>([]);
  const [startTime] = useState<number>(Date.now());

  // Update time elapsed
  useEffect(() => {
    if (gameState.isComplete || gameState.isGameOver) return;
    
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeElapsed: Math.floor((Date.now() - startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isComplete, gameState.isGameOver, startTime]);

  const handleTileClick = useCallback((clickedTile: MahjongTile) => {
    if (clickedTile.isBlocked || clickedTile.isMatched) return;

    setGameState(prev => {
      const currentSelected = prev.selectedTiles;
      
      // If clicking already selected tile, deselect it
      if (currentSelected.some(t => t.id === clickedTile.id)) {
        return {
          ...prev,
          selectedTiles: currentSelected.filter(t => t.id !== clickedTile.id),
          tiles: prev.tiles.map(t => 
            t.id === clickedTile.id ? { ...t, isSelected: false } : t
          )
        };
      }

      // If no tiles selected, select this one
      if (currentSelected.length === 0) {
        return {
          ...prev,
          selectedTiles: [clickedTile],
          tiles: prev.tiles.map(t => 
            t.id === clickedTile.id ? { ...t, isSelected: true } : t
          )
        };
      }

      // If one tile selected, try to match
      if (currentSelected.length === 1) {
        const firstTile = currentSelected[0];
        
        if (canMatch(firstTile, clickedTile)) {
          // Match found!
          const newTiles = prev.tiles.map(t => {
            if (t.id === firstTile.id || t.id === clickedTile.id) {
              return { ...t, isMatched: true, isSelected: false };
            }
            return { ...t, isSelected: false };
          });

          const updatedTiles = updateBlockedStatus(newTiles);
          const remainingTiles = updatedTiles.filter(t => !t.isMatched);
          const isComplete = remainingTiles.length === 0;
          const availableMatches = findAvailableMatches(updatedTiles);
          const isGameOver = !isComplete && availableMatches.length === 0;

          const newMoves = prev.moves + 1;
          const newScore = isComplete ? 
            calculateScore(newMoves, prev.timeElapsed, prev.hintsUsed) : 
            prev.score + 10;

          return {
            ...prev,
            tiles: updatedTiles,
            selectedTiles: [],
            moves: newMoves,
            score: newScore,
            isComplete,
            isGameOver
          };
        } else {
          // No match, select the new tile instead
          return {
            ...prev,
            selectedTiles: [clickedTile],
            tiles: prev.tiles.map(t => ({
              ...t,
              isSelected: t.id === clickedTile.id
            }))
          };
        }
      }

      return prev;
    });

    // Clear hints when player makes a move
    setHintTiles([]);
  }, []);

  const showHint = useCallback(() => {
    const matches = findAvailableMatches(gameState.tiles);
    if (matches.length > 0) {
      const randomMatch = matches[Math.floor(Math.random() * matches.length)];
      setHintTiles(randomMatch);
      setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
      
      // Clear hint after 3 seconds
      setTimeout(() => setHintTiles([]), 3000);
    }
  }, [gameState.tiles]);

  const shuffleTiles = useCallback(() => {
    // Simple shuffle - randomize positions of remaining tiles
    setGameState(prev => {
      const remainingTiles = prev.tiles.filter(t => !t.isMatched);
      const matchedTiles = prev.tiles.filter(t => t.isMatched);
      
      // Get all available positions
      const layout = MAHJONG_LAYOUTS.find(l => l.difficulty === prev.difficulty) || MAHJONG_LAYOUTS[0];
      const shuffledPositions = [...layout.positions].sort(() => Math.random() - 0.5);
      
      const shuffledTiles = remainingTiles.map((tile, index) => {
        const pos = shuffledPositions[index];
        return {
          ...tile,
          row: pos.row,
          col: pos.col,
          layer: pos.layer,
          x: pos.col * 30 + pos.layer * 2,
          y: pos.row * 40 + pos.layer * 2
        };
      });

      const allTiles = [...shuffledTiles, ...matchedTiles];
      return {
        ...prev,
        tiles: updateBlockedStatus(allTiles),
        selectedTiles: []
      };
    });
  }, []);

  const newGame = useCallback(() => {
    const layout = MAHJONG_LAYOUTS.find(l => l.difficulty === difficulty) || MAHJONG_LAYOUTS[0];
    const tiles = updateBlockedStatus(createMahjongBoard(layout));
    
    setGameState({
      tiles,
      selectedTiles: [],
      score: 0,
      moves: 0,
      hintsUsed: 0,
      timeElapsed: 0,
      isComplete: false,
      isGameOver: false,
      difficulty,
      layout: layout.name
    });
    setHintTiles([]);
  }, [difficulty]);

  const availableMatches = findAvailableMatches(gameState.tiles);
  const canShuffle = availableMatches.length === 0 && !gameState.isComplete;

  return {
    gameState,
    hintTiles,
    handleTileClick,
    showHint,
    shuffleTiles,
    newGame,
    canShuffle,
    hintsRemaining: Math.max(0, 3 - gameState.hintsUsed)
  };
}

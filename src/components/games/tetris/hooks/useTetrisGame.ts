
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TetrisGameState, TetrisControls, HighScore } from '../types/tetrisTypes';
import { createInitialGameState, isValidPosition, placeBlock, clearLines, calculateScore, calculateLevel, calculateDropTime, findGhostPosition } from '../utils/tetrisEngine';
import { createBlock, getRandomBlockType, rotateBlock } from '../utils/tetrisShapes';

export function useTetrisGame() {
  const [gameState, setGameState] = useState<TetrisGameState>(createInitialGameState);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const gameLoopRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  // Load high scores
  const loadHighScores = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tetris_high_scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Type the response data correctly
      const typedData: HighScore[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        username: item.username,
        score: item.score,
        lines: item.lines,
        level: item.level,
        duration: item.duration,
        created_at: item.created_at
      }));
      
      setHighScores(typedData);
    } catch (error) {
      console.error('Error loading high scores:', error);
    }
  }, []);

  // Save high score
  const saveHighScore = useCallback(async (finalState: TetrisGameState) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

      await supabase
        .from('tetris_high_scores')
        .insert({
          user_id: user.id,
          username: profile?.username || 'Anonymous',
          score: finalState.stats.score,
          lines: finalState.stats.lines,
          level: finalState.stats.level,
          duration
        });

      await loadHighScores();
      toast.success(`High score saved: ${finalState.stats.score} points!`);
    } catch (error) {
      console.error('Error saving high score:', error);
      toast.error('Failed to save high score');
    }
  }, [loadHighScores]);

  // Move block
  const moveBlock = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      if (!prev.currentBlock || prev.gameOver || prev.paused) return prev;

      const newPosition = {
        x: prev.currentBlock.position.x + dx,
        y: prev.currentBlock.position.y + dy
      };

      if (isValidPosition(prev.grid, prev.currentBlock, newPosition)) {
        return {
          ...prev,
          currentBlock: {
            ...prev.currentBlock,
            position: newPosition
          }
        };
      }

      // If moving down fails, place the block
      if (dy > 0) {
        const newGrid = placeBlock(prev.grid, prev.currentBlock);
        const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid);
        
        const newScore = prev.stats.score + calculateScore(linesCleared, prev.stats.level);
        const newLines = prev.stats.lines + linesCleared;
        const newLevel = calculateLevel(newLines);
        const newTetrises = prev.stats.tetrises + (linesCleared === 4 ? 1 : 0);

        const nextBlockType = getRandomBlockType();
        const newCurrentBlock = prev.nextBlock;
        const newNextBlock = createBlock(nextBlockType);

        // Check game over
        const gameOver = !isValidPosition(clearedGrid, newCurrentBlock!, newCurrentBlock!.position);

        const newState = {
          ...prev,
          grid: clearedGrid,
          currentBlock: gameOver ? null : newCurrentBlock,
          nextBlock: newNextBlock,
          canHold: true,
          stats: {
            score: newScore,
            lines: newLines,
            level: newLevel,
            tetrises: newTetrises
          },
          gameOver,
          dropTime: calculateDropTime(newLevel)
        };

        if (gameOver) {
          saveHighScore(newState);
        }

        return newState;
      }

      return prev;
    });
  }, [saveHighScore]);

  // Rotate block
  const rotateCurrentBlock = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentBlock || prev.gameOver || prev.paused) return prev;

      const rotatedBlock = rotateBlock(prev.currentBlock);
      
      if (isValidPosition(prev.grid, rotatedBlock, rotatedBlock.position)) {
        return {
          ...prev,
          currentBlock: rotatedBlock
        };
      }

      return prev;
    });
  }, []);

  // Hard drop
  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentBlock || prev.gameOver || prev.paused) return prev;

      const ghostPos = findGhostPosition(prev.grid, prev.currentBlock);
      const dropDistance = ghostPos.y - prev.currentBlock.position.y;
      
      return {
        ...prev,
        currentBlock: {
          ...prev.currentBlock,
          position: ghostPos
        },
        stats: {
          ...prev.stats,
          score: prev.stats.score + dropDistance * 2 // Bonus for hard drop
        }
      };
    });
  }, []);

  // Hold block
  const holdBlock = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentBlock || prev.gameOver || prev.paused || !prev.canHold) return prev;

      const currentBlock = prev.currentBlock;
      let newCurrentBlock;
      let newHoldBlock;

      if (prev.holdBlock) {
        newCurrentBlock = { ...prev.holdBlock, position: { x: 4, y: 0 } };
        newHoldBlock = { ...currentBlock, position: { x: 0, y: 0 } };
      } else {
        newCurrentBlock = prev.nextBlock;
        newHoldBlock = { ...currentBlock, position: { x: 0, y: 0 } };
      }

      return {
        ...prev,
        currentBlock: newCurrentBlock,
        holdBlock: newHoldBlock,
        canHold: false
      };
    });
  }, []);

  // Pause/unpause
  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      paused: !prev.paused
    }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    startTimeRef.current = Date.now();
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.paused) return;

    const gameLoop = () => {
      const now = Date.now();
      if (now - gameState.lastDrop > gameState.dropTime) {
        moveBlock(0, 1);
        setGameState(prev => ({ ...prev, lastDrop: now }));
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameOver, gameState.paused, gameState.dropTime, gameState.lastDrop, moveBlock]);

  // Load high scores on mount
  useEffect(() => {
    loadHighScores();
  }, [loadHighScores]);

  const controls: TetrisControls = {
    moveLeft: () => moveBlock(-1, 0),
    moveRight: () => moveBlock(1, 0),
    moveDown: () => moveBlock(0, 1),
    rotate: rotateCurrentBlock,
    hardDrop,
    hold: holdBlock,
    pause: togglePause
  };

  return {
    gameState,
    controls,
    resetGame,
    highScores,
    loadHighScores
  };
}

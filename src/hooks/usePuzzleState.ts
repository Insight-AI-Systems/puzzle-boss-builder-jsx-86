
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PuzzlePiece {
  id: string;
  position: number;
  correctPosition: number;
  isCorrect: boolean;
  isDragging: boolean;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type GameMode = 'classic' | 'timed' | 'challenge';

export interface GameState {
  pieces: PuzzlePiece[];
  isComplete: boolean;
  moves: number;
  startTime: number | null;
  endTime: number | null;
  difficulty: DifficultyLevel;
  gameMode: GameMode;
  timeLimit: number;
}

export function usePuzzleState(rows: number = 3, columns: number = 3) {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    pieces: [],
    isComplete: false,
    moves: 0,
    startTime: null,
    endTime: null,
    difficulty: 'medium',
    gameMode: 'classic',
    timeLimit: 300
  });

  const initializePuzzle = useCallback(() => {
    const totalPieces = rows * columns;
    const pieces: PuzzlePiece[] = [];
    
    for (let i = 0; i < totalPieces; i++) {
      pieces.push({
        id: `piece-${i}`,
        position: -1, // Start in staging area
        correctPosition: i,
        isCorrect: false,
        isDragging: false
      });
    }
    
    // Shuffle pieces
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    
    setGameState(prev => ({
      ...prev,
      pieces,
      isComplete: false,
      moves: 0,
      startTime: null,
      endTime: null
    }));
  }, [rows, columns]);

  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  const startDragging = useCallback((pieceId: string) => {
    setGameState(prev => ({
      ...prev,
      pieces: prev.pieces.map(piece =>
        piece.id === pieceId
          ? { ...piece, isDragging: true }
          : { ...piece, isDragging: false }
      )
    }));
  }, []);

  const endDragging = useCallback((pieceId: string) => {
    setGameState(prev => ({
      ...prev,
      pieces: prev.pieces.map(piece =>
        piece.id === pieceId
          ? { ...piece, isDragging: false }
          : piece
      )
    }));
  }, []);

  const movePiece = useCallback((pieceId: string, newPosition: number) => {
    setGameState(prev => {
      const piece = prev.pieces.find(p => p.id === pieceId);
      if (!piece) return prev;

      const updatedPieces = prev.pieces.map(p => {
        if (p.id === pieceId) {
          const isCorrect = newPosition === p.correctPosition;
          return {
            ...p,
            position: newPosition,
            isCorrect,
            isDragging: false
          };
        }
        return p;
      });

      const allCorrect = updatedPieces.every(p => p.isCorrect && p.position >= 0);
      const newMoves = prev.moves + 1;

      if (allCorrect && !prev.isComplete) {
        toast({
          title: "Puzzle Complete!",
          description: `Congratulations! You solved it in ${newMoves} moves.`
        });
        
        return {
          ...prev,
          pieces: updatedPieces,
          moves: newMoves,
          isComplete: true,
          endTime: Date.now()
        };
      }

      return {
        ...prev,
        pieces: updatedPieces,
        moves: newMoves
      };
    });
  }, [toast]);

  const resetPuzzle = useCallback(() => {
    initializePuzzle();
    toast({
      title: "Puzzle Reset",
      description: "Starting a new puzzle!"
    });
  }, [initializePuzzle, toast]);

  const getElapsedTime = useCallback(() => {
    if (!gameState.startTime) return 0;
    const endTime = gameState.endTime || Date.now();
    return Math.floor((endTime - gameState.startTime) / 1000);
  }, [gameState.startTime, gameState.endTime]);

  const loadSavedState = useCallback((savedState: any) => {
    setGameState(prev => ({
      ...prev,
      ...savedState,
      startTime: Date.now() - (savedState.timeSpent || 0) * 1000
    }));
  }, []);

  const startNewPuzzle = useCallback((
    difficulty: DifficultyLevel = 'medium',
    gameMode: GameMode = 'classic',
    timeLimit: number = 300
  ) => {
    setGameState(prev => ({
      ...prev,
      difficulty,
      gameMode,
      timeLimit,
      startTime: Date.now()
    }));
    initializePuzzle();
  }, [initializePuzzle]);

  const checkCompletion = useCallback((pieceCount: number, correctCount: number) => {
    return correctCount === pieceCount;
  }, []);

  const formattedTime = useCallback(() => {
    const elapsed = getElapsedTime();
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [getElapsedTime]);

  return {
    ...gameState,
    formattedTime: formattedTime(),
    startNewPuzzle,
    checkCompletion,
    startDragging,
    movePiece,
    endDragging,
    resetPuzzle,
    getElapsedTime,
    loadSavedState
  };
}

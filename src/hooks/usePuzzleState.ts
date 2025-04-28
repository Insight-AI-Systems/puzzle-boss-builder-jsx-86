import { useReducer, useEffect, useCallback } from 'react';
import { PuzzleState, PuzzleAction, PuzzlePiece } from '../types/puzzle-types';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

const initialState: PuzzleState = {
  pieces: [],
  isComplete: false,
  moves: 0,
  startTime: null,
  endTime: null,
};

function puzzleReducer(state: PuzzleState, action: PuzzleAction): PuzzleState {
  switch (action.type) {
    case 'INITIALIZE_PIECES': {
      const { totalPieces } = action.payload;
      const pieces: PuzzlePiece[] = Array.from({ length: totalPieces }, (_, i) => ({
        id: `piece-${i}`,
        position: -1,
        originalPosition: i,
        isDragging: false,
        isCorrect: false,
      }));

      const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
      
      return {
        ...state,
        pieces: shuffledPieces,
        isComplete: false,
        moves: 0,
        startTime: Date.now(),
        endTime: null,
      };
    }

    case 'START_DRAG': {
      const { id } = action.payload;
      return {
        ...state,
        pieces: state.pieces.map(piece => 
          piece.id === id ? { ...piece, isDragging: true } : piece
        ),
      };
    }

    case 'MOVE_PIECE': {
      const { id, position } = action.payload;
      const isCorrectPosition = state.pieces.find(p => p.id === id)?.originalPosition === position;
      
      return {
        ...state,
        moves: state.moves + 1,
        pieces: state.pieces.map(piece => 
          piece.id === id 
            ? { ...piece, position, isCorrect: isCorrectPosition } 
            : piece
        ),
      };
    }

    case 'END_DRAG': {
      const { id } = action.payload;
      return {
        ...state,
        pieces: state.pieces.map(piece => 
          piece.id === id ? { ...piece, isDragging: false } : piece
        ),
      };
    }

    case 'CHECK_COMPLETION': {
      const isComplete = state.pieces.every(piece => 
        piece.position === piece.originalPosition
      );

      return {
        ...state,
        isComplete,
        endTime: isComplete ? Date.now() : state.endTime,
      };
    }

    case 'RESET_PUZZLE': {
      return initialState;
    }

    case 'LOAD_SAVED_STATE': {
      return {
        ...action.payload,
        startTime: Date.now() - (action.payload.timeSpent * 1000)
      };
    }

    default:
      return state;
  }
}

export function usePuzzleState(rows: number, columns: number) {
  const [state, dispatch] = useReducer(puzzleReducer, initialState);
  const { toast } = useToast();

  const initializePuzzle = useCallback(() => {
    dispatch({ 
      type: 'INITIALIZE_PIECES', 
      payload: { totalPieces: rows * columns } 
    });
    toast({
      title: "Puzzle initialized",
      description: `Started ${rows}x${columns} puzzle`,
      // Fix: Convert JSX to string for icon
      icon: "check"
    });
  }, [rows, columns, toast]);

  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  const startDragging = useCallback((id: string) => {
    dispatch({ type: 'START_DRAG', payload: { id } });
  }, []);

  const movePiece = useCallback((id: string, position: number) => {
    dispatch({ type: 'MOVE_PIECE', payload: { id, position } });
    const piece = state.pieces.find(p => p.id === id);
    if (piece && piece.originalPosition === position) {
      toast({
        title: "Perfect fit!",
        description: "Piece placed in correct position",
        // Fix: Convert JSX to string for icon
        icon: "check"
      });
    }
    dispatch({ type: 'CHECK_COMPLETION' });
  }, [state.pieces, toast]);

  const endDragging = useCallback((id: string) => {
    dispatch({ type: 'END_DRAG', payload: { id } });
  }, []);

  const resetPuzzle = useCallback(() => {
    dispatch({ type: 'RESET_PUZZLE' });
    initializePuzzle();
    toast({
      title: "Puzzle reset",
      description: "Starting fresh",
      // Fix: Convert JSX to string for icon
      icon: "info"
    });
  }, [initializePuzzle, toast]);

  useEffect(() => {
    if (state.isComplete) {
      const timeElapsed = getElapsedTime();
      toast({
        title: "Puzzle completed! 🎉",
        description: `Finished in ${state.moves} moves and ${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`,
        // Fix: Convert JSX to string for icon
        icon: "check"
      });
    }
  }, [state.isComplete, state.moves, toast]);

  const getElapsedTime = (): number => {
    if (!state.startTime) return 0;
    const endTime = state.endTime || Date.now();
    return Math.floor((endTime - state.startTime) / 1000);
  };

  const loadSavedState = useCallback((savedState: PuzzleState) => {
    dispatch({ type: 'LOAD_SAVED_STATE', payload: savedState });
    toast({
      title: "Game Restored",
      description: "Your previous progress has been loaded",
      icon: "check"
    });
  }, [toast]);

  return {
    pieces: state.pieces,
    isComplete: state.isComplete,
    moves: state.moves,
    startDragging,
    movePiece,
    endDragging,
    resetPuzzle,
    getElapsedTime,
    loadSavedState,
  };
}


import { useSavedPuzzles } from './hooks/useSavedPuzzles';
import { SavedPuzzleState } from './types/save-types';
import { DifficultyLevel, GameMode, PieceShape, VisualTheme } from './types/puzzle-types';
import { useCallback } from 'react';
import { PuzzlePiece } from './types/puzzle-types';

export function useImagePuzzleSave(
  puzzleState: any,
  difficulty: DifficultyLevel,
  pieces: PuzzlePiece[],
  moveCount: number,
  selectedImage: string,
  gameMode: GameMode,
  pieceShape: PieceShape,
  visualTheme: VisualTheme,
  rotationEnabled: boolean,
  timeLimit: number,
  setPieces: (x: any) => void,
  setMoveCount: (n: number) => void,
  setDifficulty: (d: DifficultyLevel) => void,
  setGameMode: (g: GameMode) => void,
  setPieceShape: (s: PieceShape) => void,
  setVisualTheme: (t: VisualTheme) => void,
  setRotationEnabled: (b: boolean) => void,
  setTimeLimit: (n: number) => void,
) {
  const { savedGames, saveGame, deleteSave } = useSavedPuzzles();
  const [currentGameId] = [ `puzzle-${Date.now()}` ];

  const handleSave = useCallback(() => {
    const saveState: SavedPuzzleState = {
      id: currentGameId,
      name: `${gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Puzzle ${new Date().toLocaleTimeString()}`,
      timestamp: Date.now(),
      difficulty,
      pieces,
      moveCount,
      timeSpent: puzzleState.timeSpent,
      selectedImage,
      version: '1.0.0',
      gameMode,
      pieceShape,
      visualTheme,
      rotationEnabled,
      timeLimit
    };
    saveGame(saveState);
  }, [currentGameId, difficulty, pieces, moveCount, puzzleState.timeSpent, selectedImage, saveGame, gameMode, pieceShape, visualTheme, rotationEnabled, timeLimit]);

  const handleLoad = useCallback((save: SavedPuzzleState) => {
    setPieces(save.pieces);
    setMoveCount(save.moveCount);
    setDifficulty(save.difficulty as DifficultyLevel);
    
    // Load additional game settings if available
    if (save.gameMode) setGameMode(save.gameMode);
    if (save.pieceShape) setPieceShape(save.pieceShape);
    if (save.visualTheme) setVisualTheme(save.visualTheme);
    if (save.rotationEnabled !== undefined) setRotationEnabled(save.rotationEnabled);
    if (save.timeLimit) setTimeLimit(save.timeLimit);

    puzzleState.loadState(save.timeSpent, save.gameMode, save.timeLimit);
  }, [setPieces, setMoveCount, setDifficulty, setGameMode, setPieceShape, setVisualTheme, setRotationEnabled, setTimeLimit, puzzleState]);

  return {
    savedGames,
    saveGame,
    deleteSave,
    handleSave,
    handleLoad,
    currentGameId,
  };
}

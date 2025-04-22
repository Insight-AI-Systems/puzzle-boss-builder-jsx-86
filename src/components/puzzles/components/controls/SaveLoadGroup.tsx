
import React from 'react';
import SaveLoadControls from '../SaveLoadControls';
import { SavedPuzzleState } from '../../types/save-types';

interface SaveLoadGroupProps {
  onSave: () => void;
  onLoad: (save: SavedPuzzleState) => void;
  onDelete: (id: string) => void;
  savedGames: SavedPuzzleState[];
  currentGameId: string;
  isLoading: boolean;
  isMobile: boolean;
}

export const SaveLoadGroup: React.FC<SaveLoadGroupProps> = ({
  onSave,
  onLoad,
  onDelete,
  savedGames,
  currentGameId,
  isLoading,
  isMobile
}) => {
  return (
    <SaveLoadControls
      onSave={onSave}
      onLoad={onLoad}
      onDelete={onDelete}
      savedGames={savedGames}
      currentGameId={currentGameId}
      isLoading={isLoading}
      isMobile={isMobile}
    />
  );
};


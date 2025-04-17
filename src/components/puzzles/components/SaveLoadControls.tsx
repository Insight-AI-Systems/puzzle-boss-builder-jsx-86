
import React from 'react';
import { Button } from '@/components/ui/button';
import { SavedPuzzleState } from '../types/save-types';
import { Save, Trash2, FolderOpen } from 'lucide-react';

interface SaveLoadControlsProps {
  onSave: () => void;
  onLoad: (save: SavedPuzzleState) => void;
  onDelete: (id: string) => void;
  savedGames: SavedPuzzleState[];
  currentGameId?: string;
  isLoading?: boolean;
  isMobile?: boolean;
}

const SaveLoadControls: React.FC<SaveLoadControlsProps> = ({
  onSave,
  onLoad,
  onDelete,
  savedGames,
  currentGameId,
  isLoading,
  isMobile
}) => {
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
      <Button 
        variant="outline" 
        onClick={onSave}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        <span>Save</span>
      </Button>
      
      {savedGames.length > 0 && (
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
          {savedGames.map((save) => (
            <div key={save.id} className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => onLoad(save)}
                disabled={isLoading || save.id === currentGameId}
                className="flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                <span>{save.name}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete(save.id)}
                disabled={isLoading}
                className="flex items-center"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SaveLoadControls;

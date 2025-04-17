
import React from 'react';
import { Button } from '@/components/ui/button';
import { SavedPuzzleState } from '../types/save-types';
import { Save, Trash2, FolderOpen, Clock, Puzzle } from 'lucide-react';
import { formatTime } from '../hooks/usePuzzleState';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const getGameModeIcon = (gameMode?: string) => {
    switch (gameMode) {
      case 'timed':
        return <Clock className="w-3 h-3" />;
      case 'challenge':
        return <Puzzle className="w-3 h-3 rotate-45" />;
      default:
        return <Puzzle className="w-3 h-3" />;
    }
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              onClick={onSave}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save your current puzzle progress</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {savedGames.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Load ({savedGames.length})</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-80 ${isMobile ? 'max-h-60' : 'max-h-96'} overflow-y-auto p-2`}>
            <h4 className="font-medium mb-2">Saved Puzzles</h4>
            <div className="space-y-2">
              {savedGames.map((save) => (
                <div key={save.id} className="flex flex-col border rounded p-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      {getGameModeIcon(save.gameMode)}
                      <span className="font-medium truncate max-w-[120px]">{save.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(save.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{save.difficulty} • {save.moveCount} moves</span>
                    <span>Time: {formatTime(save.timeSpent)}</span>
                  </div>
                  
                  <div className="flex justify-between mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoad(save)}
                      disabled={isLoading || save.id === currentGameId}
                      className="flex items-center gap-1 h-7 px-2 text-xs"
                    >
                      <FolderOpen className="w-3 h-3" />
                      <span>Load</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(save.id)}
                      disabled={isLoading}
                      className="flex items-center h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default SaveLoadControls;

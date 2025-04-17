
import React from 'react';
import { Volume2, VolumeX, Volume } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SoundControlsProps {
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
}

const SoundControls: React.FC<SoundControlsProps> = ({
  muted,
  volume,
  onToggleMute,
  onVolumeChange
}) => {
  return (
    <div className="flex items-center space-x-2 bg-puzzle-black/20 px-3 py-1 rounded-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleMute} 
            className="h-8 w-8 text-puzzle-aqua hover:text-white"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : volume < 0.2 ? (
              <Volume className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {muted ? 'Unmute sounds' : 'Mute sounds'}
        </TooltipContent>
      </Tooltip>
      
      <Slider
        disabled={muted}
        value={[volume]}
        onValueChange={(values) => onVolumeChange(values[0])}
        max={1}
        step={0.01}
        className="w-24"
      />
    </div>
  );
};

export default SoundControls;

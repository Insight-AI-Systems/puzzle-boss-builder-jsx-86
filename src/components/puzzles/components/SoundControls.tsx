
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SoundControlsProps {
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
  isMobile?: boolean;
}

const SoundControls: React.FC<SoundControlsProps> = ({ 
  muted, 
  volume, 
  onToggleMute, 
  onVolumeChange,
  isMobile = false
}) => {
  // More compact for mobile
  if (isMobile) {
    return (
      <TooltipProvider>
        <div className="flex items-center space-x-2 w-full">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onToggleMute}
            className="h-8 w-8 p-0"
          >
            {muted ? 
              <VolumeX className="h-4 w-4" /> : 
              <Volume2 className="h-4 w-4" />
            }
          </Button>
          
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => onVolumeChange(values[0])}
            disabled={muted}
            className="w-full max-w-32 h-8"
          />
        </div>
      </TooltipProvider>
    );
  }
  
  // Full controls for desktop
  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="outline" 
              onClick={onToggleMute}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {muted ? 'Unmute sounds' : 'Mute sounds'}
          </TooltipContent>
        </Tooltip>
        
        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => onVolumeChange(values[0])}
          disabled={muted}
          className="w-32"
        />
      </div>
    </TooltipProvider>
  );
};

export default SoundControls;

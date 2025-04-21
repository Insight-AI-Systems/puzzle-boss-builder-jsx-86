
import React from 'react';
import SoundControls from './SoundControls';
import SimplePuzzleControls from './SimplePuzzleControls';

interface SimplePuzzleControlPanelProps {
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
  isMobile: boolean;
  moveCount: number;
  onShuffle: () => void;
}

const SimplePuzzleControlPanel: React.FC<SimplePuzzleControlPanelProps> = ({
  muted, volume, onToggleMute, onVolumeChange, isMobile, moveCount, onShuffle
}) => (
  <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-2 mb-3`}>
    <div className={`${isMobile ? 'w-full mb-2' : 'mr-4'}`}>
      <SoundControls
        muted={muted}
        volume={volume}
        onToggleMute={onToggleMute}
        onVolumeChange={onVolumeChange}
        isMobile={isMobile}
      />
    </div>
    <SimplePuzzleControls 
      moveCount={moveCount}
      onShuffle={onShuffle}
      isMobile={isMobile}
    />
  </div>
);

export default SimplePuzzleControlPanel;

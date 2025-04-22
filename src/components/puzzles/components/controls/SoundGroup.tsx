
import React from 'react';
import SoundControls from '../SoundControls';

interface SoundGroupProps {
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
  isMobile: boolean;
}

export const SoundGroup: React.FC<SoundGroupProps> = ({
  muted,
  volume,
  onToggleMute,
  onVolumeChange,
  isMobile
}) => {
  return (
    <SoundControls
      muted={muted}
      volume={volume}
      onToggleMute={onToggleMute}
      onVolumeChange={onVolumeChange}
      isMobile={isMobile}
    />
  );
};



import React, { useEffect } from 'react';
import { usePuzzleSound } from '../../hooks/usePuzzleSound';

interface PuzzleAudioManagerProps {
  children: React.ReactNode;
  onPlaySound: (soundName: string) => void;
  onMuteChange: (isMuted: boolean) => void;
  onVolumeChange: (volume: number) => void;
}

export const PuzzleAudioManager: React.FC<PuzzleAudioManagerProps> = ({
  children,
  onPlaySound,
  onMuteChange,
  onVolumeChange
}) => {
  const { playSound, muted, toggleMute, volume, changeVolume } = usePuzzleSound();

  useEffect(() => {
    onPlaySound(playSound);
  }, [playSound, onPlaySound]);

  useEffect(() => {
    onMuteChange(muted);
  }, [muted, onMuteChange]);

  useEffect(() => {
    onVolumeChange(volume);
  }, [volume, onVolumeChange]);

  return (
    <div className="puzzle-audio-context">
      {children}
    </div>
  );
};

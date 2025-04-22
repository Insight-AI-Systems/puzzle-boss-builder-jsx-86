
import React from 'react';
import { PuzzleAudioManager } from './audio/PuzzleAudioManager';

interface AudioProviderProps {
  children: React.ReactNode;
  setPlaySound: (fn: (name: string) => void) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
}

const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  setPlaySound,
  setMuted,
  setVolume
}) => {
  return (
    <PuzzleAudioManager
      onPlaySound={setPlaySound}
      onMuteChange={setMuted}
      onVolumeChange={setVolume}
    >
      {children}
    </PuzzleAudioManager>
  );
};

export default AudioProvider;


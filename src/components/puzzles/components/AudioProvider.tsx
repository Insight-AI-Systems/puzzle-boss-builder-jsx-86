
import React, { useEffect, ReactNode } from 'react';

interface AudioProviderProps {
  children: ReactNode;
  setPlaySound: (fn: (soundName: string) => void) => void;
  muted?: boolean;
  volume?: number;
  setMuted?: (muted: boolean) => void;
  setVolume?: (volume: number) => void;
}

const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  setPlaySound,
  muted = false,
  volume = 50,
  setMuted,
  setVolume
}) => {
  useEffect(() => {
    // Define sound playing function
    const playSound = (name: string) => {
      if (muted) return;
      
      try {
        const audio = new Audio(`/sounds/${name}.mp3`);
        audio.volume = volume / 100;
        audio.play().catch(error => {
          console.error(`Error playing sound ${name}:`, error);
        });
      } catch (error) {
        console.error(`Failed to create audio for sound ${name}:`, error);
      }
    };
    
    // Set the play sound function for parent components to use
    setPlaySound(() => playSound);
  }, [muted, volume, setPlaySound]);

  return <>{children}</>;
};

export default AudioProvider;

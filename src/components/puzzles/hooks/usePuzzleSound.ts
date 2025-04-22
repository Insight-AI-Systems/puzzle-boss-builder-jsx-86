
import { useState, useCallback, useEffect } from 'react';

export function usePuzzleSound() {
  const [muted, setMuted] = useState<boolean>(() => {
    const savedMute = localStorage.getItem('puzzle_sounds_muted');
    return savedMute ? JSON.parse(savedMute) : false;
  });
  
  const [volume, setVolume] = useState<number>(() => {
    const savedVolume = localStorage.getItem('puzzle_sounds_volume');
    return savedVolume ? parseFloat(savedVolume) : 50;
  });

  const playSound = useCallback((name: string) => {
    if (muted) return;
    
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.volume = volume / 100;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  }, [muted, volume]);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(100, newVolume)));
  }, []);

  useEffect(() => {
    localStorage.setItem('puzzle_sounds_muted', JSON.stringify(muted));
  }, [muted]);

  useEffect(() => {
    localStorage.setItem('puzzle_sounds_volume', volume.toString());
  }, [volume]);

  return {
    playSound,
    muted,
    toggleMute,
    volume,
    changeVolume
  };
}

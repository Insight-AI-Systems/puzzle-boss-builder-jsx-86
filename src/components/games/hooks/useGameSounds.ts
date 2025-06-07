
import { useCallback, useRef } from 'react';

interface GameSounds {
  playComplete: () => void;
  playCorrect: () => void;
  playPickup: () => void;
  playPlace: () => void;
  playError: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
}

export function useGameSounds(initialVolume: number = 0.3): GameSounds {
  const volumeRef = useRef(initialVolume);
  const mutedRef = useRef(false);

  const playSound = useCallback((soundPath: string, volume?: number) => {
    if (mutedRef.current) return;
    
    try {
      const audio = new Audio(soundPath);
      audio.volume = volume ?? volumeRef.current;
      audio.play().catch(() => {
        // Silently handle audio play failures
      });
    } catch (error) {
      // Silently handle audio creation failures
    }
  }, []);

  const playComplete = useCallback(() => {
    playSound('/sounds/complete.mp3', 0.5);
  }, [playSound]);

  const playCorrect = useCallback(() => {
    playSound('/sounds/correct.mp3');
  }, [playSound]);

  const playPickup = useCallback(() => {
    playSound('/sounds/pickup.mp3', 0.2);
  }, [playSound]);

  const playPlace = useCallback(() => {
    playSound('/sounds/place.mp3', 0.2);
  }, [playSound]);

  const playError = useCallback(() => {
    // Create a simple error sound using Web Audio API if no file exists
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Silently handle Web Audio API failures
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume));
  }, []);

  const mute = useCallback(() => {
    mutedRef.current = true;
  }, []);

  const unmute = useCallback(() => {
    mutedRef.current = false;
  }, []);

  return {
    playComplete,
    playCorrect,
    playPickup,
    playPlace,
    playError,
    setVolume,
    mute,
    unmute
  };
}

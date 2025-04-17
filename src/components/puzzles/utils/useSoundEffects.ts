
import { useEffect, useRef, useState } from 'react';

// Define the types of sounds our puzzle can play
export type PuzzleSoundType = 
  | 'pickup' 
  | 'place' 
  | 'correct' 
  | 'complete';

// Mapping of sound types to their file paths
const SOUND_FILES: Record<PuzzleSoundType, string> = {
  pickup: '/sounds/pickup.mp3',
  place: '/sounds/place.mp3',
  correct: '/sounds/correct.mp3',
  complete: '/sounds/complete.mp3',
};

export const useSoundEffects = () => {
  const [muted, setMuted] = useState<boolean>(() => {
    // Check if user has previously muted sounds
    const savedMute = localStorage.getItem('puzzle-sounds-muted');
    return savedMute === 'true';
  });
  
  const [volume, setVolume] = useState<number>(() => {
    // Get previously set volume or default to 70%
    const savedVolume = localStorage.getItem('puzzle-sounds-volume');
    return savedVolume ? parseFloat(savedVolume) : 0.7;
  });
  
  // Create audio elements for each sound
  const audioRefs = useRef<Record<PuzzleSoundType, HTMLAudioElement | null>>({
    pickup: null,
    place: null,
    correct: null,
    complete: null,
  });
  
  // Initialize audio elements on component mount
  useEffect(() => {
    // Initialize all audio elements
    Object.entries(SOUND_FILES).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = volume;
      audioRefs.current[key as PuzzleSoundType] = audio;
    });
    
    // Cleanup on unmount
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = muted ? 0 : volume;
      }
    });
    
    // Save settings to localStorage
    localStorage.setItem('puzzle-sounds-muted', muted.toString());
    localStorage.setItem('puzzle-sounds-volume', volume.toString());
  }, [volume, muted]);
  
  // Function to play a sound
  const playSound = (type: PuzzleSoundType) => {
    if (muted) return;
    
    const audio = audioRefs.current[type];
    if (audio) {
      // Reset and play
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn(`Error playing sound: ${err.message}`);
      });
    }
  };
  
  // Toggle mute state
  const toggleMute = () => {
    setMuted(prev => !prev);
  };
  
  // Change volume (0-1 range)
  const changeVolume = (newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };
  
  return {
    playSound,
    muted,
    toggleMute,
    volume,
    changeVolume
  };
};

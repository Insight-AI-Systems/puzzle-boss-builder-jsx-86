
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface SoundEffectConfig {
  name: string;
  url: string;
  volume?: number;
  preload?: boolean;
}

interface SoundEffectsHook {
  play: (name: string) => void;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  isLoaded: boolean;
  error: string | null;
  // Adding these to match what the components are using
  playSound: (name: string) => void;
  muted: boolean;
  volume: number;
  changeVolume: (volume: number) => void;
}

/**
 * Custom hook for handling sound effects in the puzzle game
 * Optimized for production with preloading and error handling
 */
export const useSoundEffects = (
  sounds: SoundEffectConfig[] = [],
  initialVolume: number = 0.5
): SoundEffectsHook => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    // Load mute preference from local storage
    const savedMute = localStorage.getItem('puzzle_sounds_muted');
    return savedMute ? JSON.parse(savedMute) : false;
  });
  
  const [volume, setVolumeState] = useState<number>(() => {
    // Load volume preference from local storage
    const savedVolume = localStorage.getItem('puzzle_sounds_volume');
    return savedVolume ? parseFloat(savedVolume) : initialVolume;
  });
  
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to keep track of audio objects and loading status
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const loadedCount = useRef<number>(0);
  const totalSounds = useRef<number>(sounds.length);
  
  // Preload all sound effects
  useEffect(() => {
    const loadSounds = async () => {
      // Reset loading state
      setIsLoaded(false);
      loadedCount.current = 0;
      
      try {
        // Check if audio context is available (for browser support)
        if (typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined') {
          // Create or clear the audio map
          audioRefs.current = new Map();
          
          // Load each sound
          for (const sound of sounds) {
            const audio = new Audio();
            audio.src = sound.url;
            audio.volume = sound.volume ?? volume;
            
            // Add load event
            audio.addEventListener('canplaythrough', () => {
              loadedCount.current += 1;
              if (loadedCount.current >= totalSounds.current) {
                setIsLoaded(true);
              }
            });
            
            // Add error handling
            audio.addEventListener('error', (e) => {
              console.error(`Error loading sound: ${sound.name}`, e);
              setError(`Failed to load sound: ${sound.name}`);
            });
            
            // Store in our map
            audioRefs.current.set(sound.name, audio);
            
            // Start loading
            if (sound.preload !== false) {
              audio.load();
            }
          }
        } else {
          console.warn('Audio not supported in this browser');
          setIsLoaded(true); // Mark as loaded anyway to prevent blocking
          setError('Audio not supported in this browser');
        }
      } catch (err) {
        console.error('Error setting up audio:', err);
        setError('Failed to initialize audio system');
        setIsLoaded(true); // Mark as loaded to avoid blocking
      }
    };
    
    loadSounds();
    
    // Cleanup audio elements on unmount
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current.clear();
    };
  }, [sounds, volume]); // Only reload when sounds array changes
  
  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('puzzle_sounds_muted', JSON.stringify(isMuted));
  }, [isMuted]);
  
  useEffect(() => {
    localStorage.setItem('puzzle_sounds_volume', volume.toString());
    
    // Update volume for all audio elements
    audioRefs.current.forEach(audio => {
      audio.volume = volume;
    });
  }, [volume]);
  
  // Play a sound by name
  const play = useCallback((name: string) => {
    if (isMuted) return;
    
    const audio = audioRefs.current.get(name);
    if (!audio) {
      console.warn(`Sound not found: ${name}`);
      return;
    }
    
    try {
      // Reset and play
      audio.currentTime = 0;
      const playPromise = audio.play();
      
      // Handle autoplay policy issues
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          if (err.name === 'NotAllowedError') {
            // Autoplay was prevented by browser policy
            console.warn('Audio autoplay prevented by browser. User interaction required.');
          } else {
            console.error('Error playing sound:', err);
          }
        });
      }
    } catch (err) {
      console.error(`Error playing sound ${name}:`, err);
    }
  }, [isMuted]);
  
  // Set volume for all sounds
  const setVolume = useCallback((newVolume: number) => {
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  }, []);
  
  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);
  
  return {
    play,
    setVolume,
    isMuted,
    toggleMute,
    isLoaded,
    error,
    // Adding these aliases to match what the game components are looking for
    playSound: play,
    muted: isMuted,
    volume,
    changeVolume: setVolume
  };
};

export default useSoundEffects;

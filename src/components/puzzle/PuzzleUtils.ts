
/**
 * Interface for puzzle configuration
 */
export interface PuzzleConfig {
  image: string;
  gridSize: number;
}

/**
 * Type for available sound effects in the puzzle
 */
export type SoundEffectType = 'pick' | 'place' | 'success';

/**
 * Cache object for storing audio instances
 */
const soundCache: Record<SoundEffectType, HTMLAudioElement | undefined> = {
  pick: undefined,
  place: undefined,
  success: undefined
};

/**
 * Retrieves puzzle configuration from localStorage or returns defaults
 * @returns {PuzzleConfig} The puzzle configuration
 */
export const getPuzzleConfig = (): PuzzleConfig => {
  try {
    const savedConfig = localStorage.getItem('puzzleConfig');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Error loading puzzle config:', error);
  }
  
  return {
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&h=300&q=80',
    gridSize: 4
  };
};

/**
 * Plays a sound effect for the puzzle
 * @param {SoundEffectType} type - The type of sound to play
 * @param {boolean} muted - Whether sound is muted
 */
export const playSound = (type: SoundEffectType, muted: boolean): void => {
  if (muted) return;
  
  if (!soundCache[type]) {
    const sounds: Record<SoundEffectType, string> = {
      pick: '/sounds/pick.mp3',
      place: '/sounds/place.mp3',
      success: '/sounds/success.mp3'
    };
    
    soundCache[type] = new Audio(sounds[type]);
    soundCache[type]!.volume = 0.3;
  }
  
  try {
    const sound = soundCache[type];
    if (!sound) return;
    
    if (sound.paused || sound.ended) {
      sound.currentTime = 0;
      sound.play().catch(error => console.log('Audio play prevented:', error));
    } else {
      const tempSound = sound.cloneNode() as HTMLAudioElement;
      tempSound.volume = 0.3;
      tempSound.play().catch(error => console.log('Audio play prevented:', error));
    }
  } catch (error) {
    console.log('Sound playback error:', error);
  }
};

/**
 * Preloads a puzzle image to improve performance
 * @param {string} imageUrl - URL of the image to preload
 * @returns {HTMLImageElement | undefined} The preloaded image element
 */
export const preloadPuzzleImage = (imageUrl: string | undefined): HTMLImageElement | undefined => {
  if (!imageUrl) return;
  
  const img = new Image();
  img.src = imageUrl;
  return img;
};

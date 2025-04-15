
/**
 * Interface for puzzle configuration
 */
export interface PuzzleConfig {
  image: string;
  gridSize: number;
}

/**
 * Interface for puzzle piece position coordinates
 */
interface Position {
  row: number;
  col: number;
}

/**
 * Interface for puzzle piece data
 */
interface PuzzlePiece {
  id: number;
  correctPosition: Position;
  currentPosition: Position;
}

/**
 * Interface for saved puzzle state
 */
export interface PuzzleSaveState {
  pieces: PuzzlePiece[];
  gridSize: number;
  moveCount: number;
  elapsedTime: number;
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
 * Saves puzzle configuration to localStorage
 * @param {PuzzleConfig} config - The puzzle configuration to save
 */
export const savePuzzleConfig = (config: PuzzleConfig): void => {
  try {
    localStorage.setItem('puzzleConfig', JSON.stringify(config));
  } catch (error) {
    console.error('Error saving puzzle config:', error);
  }
};

/**
 * Plays a sound effect for the puzzle with volume control
 * @param {SoundEffectType} type - The type of sound to play
 * @param {boolean} muted - Whether sound is muted
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
export const playSound = (type: SoundEffectType, muted: boolean, volume: number = 0.3): void => {
  if (muted) return;
  
  if (!soundCache[type]) {
    const sounds: Record<SoundEffectType, string> = {
      pick: '/sounds/pick.mp3',
      place: '/sounds/place.mp3',
      success: '/sounds/success.mp3'
    };
    
    soundCache[type] = new Audio(sounds[type]);
  }
  
  try {
    const sound = soundCache[type];
    if (!sound) return;
    
    if (sound.paused || sound.ended) {
      sound.currentTime = 0;
      sound.volume = volume;
      sound.play().catch(error => console.log('Audio play prevented:', error));
    } else {
      const tempSound = sound.cloneNode() as HTMLAudioElement;
      tempSound.volume = volume;
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

/**
 * Saves the current puzzle progress to localStorage
 * @param {PuzzleSaveState} state - The current puzzle state to save
 */
export const savePuzzleProgress = (state: PuzzleSaveState): void => {
  try {
    localStorage.setItem('puzzleProgress', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving puzzle progress:', error);
  }
};

/**
 * Loads saved puzzle progress from localStorage
 * @returns {PuzzleSaveState | null} The saved puzzle state or null if none exists
 */
export const loadPuzzleProgress = (): PuzzleSaveState | null => {
  try {
    const savedState = localStorage.getItem('puzzleProgress');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading puzzle progress:', error);
  }
  
  return null;
};

/**
 * Clears saved puzzle progress from localStorage
 */
export const clearPuzzleProgress = (): void => {
  try {
    localStorage.removeItem('puzzleProgress');
  } catch (error) {
    console.error('Error clearing puzzle progress:', error);
  }
};

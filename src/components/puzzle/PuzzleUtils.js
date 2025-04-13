
// Cache for sound effects to prevent creating multiple Audio instances
const soundCache = {};

// Get puzzle configuration from localStorage or use defaults
export const getPuzzleConfig = () => {
  try {
    const savedConfig = localStorage.getItem('puzzleConfig');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Error loading puzzle config:', error);
  }
  
  // Default configuration with optimized image size
  return {
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&h=300&q=80',
    gridSize: 4
  };
};

// Play sound effects for the puzzle with caching
export const playSound = (type, muted) => {
  if (muted) return;
  
  // Create and cache sounds only once
  if (!soundCache[type]) {
    const sounds = {
      pick: '/sounds/pick.mp3',
      place: '/sounds/place.mp3',
      success: '/sounds/success.mp3'
    };
    
    soundCache[type] = new Audio(sounds[type]);
    soundCache[type].volume = 0.3;
  }
  
  // Fallback to prevent errors when sound files aren't available in development
  try {
    // Clone and play to allow overlapping sounds
    const sound = soundCache[type];
    
    // Reset and play if not already playing
    if (sound.paused || sound.ended) {
      sound.currentTime = 0;
      sound.play().catch(error => console.log('Audio play prevented:', error));
    } else {
      // For overlapping sounds, create a temporary clone
      const tempSound = sound.cloneNode();
      tempSound.volume = 0.3;
      tempSound.play().catch(error => console.log('Audio play prevented:', error));
    }
  } catch (error) {
    console.log('Sound playback error:', error);
  }
};

// Preload puzzle images to improve performance
export const preloadPuzzleImage = (imageUrl) => {
  if (!imageUrl) return;
  
  const img = new Image();
  img.src = imageUrl;
  return img;
};

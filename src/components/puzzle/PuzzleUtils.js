
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
  
  // Default configuration
  return {
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&h=300&q=80',
    gridSize: 4
  };
};

// Play sound effects for the puzzle
export const playSound = (type, muted) => {
  if (muted) return;
  
  const sounds = {
    pick: new Audio('/sounds/pick.mp3'),
    place: new Audio('/sounds/place.mp3'),
    success: new Audio('/sounds/success.mp3')
  };
  
  // Fallback to prevent errors when sound files aren't available in development
  try {
    sounds[type].volume = 0.3;
    sounds[type].play().catch(error => console.log('Audio play prevented:', error));
  } catch (error) {
    console.log('Sound playback error:', error);
  }
};

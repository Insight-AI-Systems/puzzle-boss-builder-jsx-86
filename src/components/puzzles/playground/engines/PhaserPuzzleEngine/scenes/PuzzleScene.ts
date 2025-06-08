
export const createPuzzleScene = (scene: any, config: any) => {
  // Mock puzzle scene implementation for now
  return {
    startGame: () => {
      console.log('Starting puzzle game');
    },
    togglePause: () => {
      console.log('Toggling pause');
    },
    resetGame: () => {
      console.log('Resetting game');
    },
    showHint: () => {
      console.log('Showing hint');
    }
  };
};


/**
 * Sets up event handlers for the game UI buttons
 * @returns JavaScript code for the event handlers setup
 */
export function generateEventHandlers(): string {
  return `
    // Initialize buttons
    document.getElementById('reset-button').addEventListener('click', function() {
      const result = window.gameState.resetGame();
      if (result && result.shufflePieces) {
        shufflePieces();
      }
    });
    
    document.getElementById('shuffle-button').addEventListener('click', function() {
      window.gameState.startGame();
      shufflePieces();
      window.gameState.incrementMoves();
    });
    
    document.getElementById('hint-button').addEventListener('click', function() {
      window.gameState.startGame();
      showHint();
      window.gameState.incrementMoves();
    });
  `;
}

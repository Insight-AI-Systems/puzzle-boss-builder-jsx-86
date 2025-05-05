
import { PuzzlePiece } from '../types/puzzleTypes';

/**
 * Utility functions for the Phaser puzzle game
 */

/**
 * Shuffles the puzzle pieces
 * @param pieces Array of puzzle pieces
 * @param width Width of the game board
 * @param height Height of the game board
 */
export function shufflePieces(pieces: PuzzlePiece[], width: number, height: number): void {
  if (!pieces || pieces.length === 0) return;
  
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    
    // Ensure the piece isn't already in the correct position
    let randomX: number, randomY: number;
    do {
      // Keep pieces within the game bounds
      randomX = Phaser.Math.Between(piece.width/2, width - piece.width/2);
      randomY = Phaser.Math.Between(piece.height/2, height - piece.height/2);
    } while (
      Math.abs(randomX - piece.correctX) < piece.width/4 && 
      Math.abs(randomY - piece.correctY) < piece.height/4
    );
    
    if (piece.sprite) {
      piece.sprite.x = randomX;
      piece.sprite.y = randomY;
    }
    piece.isCorrect = false;
    
    // Also move number text
    if (piece.numberText) {
      piece.numberText.x = randomX;
      piece.numberText.y = randomY;
    }
  }
}

/**
 * Shows a hint by highlighting and moving an incorrect piece slightly towards its correct position
 * @param pieces Array of puzzle pieces
 * @param scene The Phaser scene
 */
export function showHint(pieces: PuzzlePiece[], scene: Phaser.Scene): void {
  // Find the first incorrect piece and flash it
  const incorrectPieces = pieces.filter(p => !p.isCorrect);
  if (incorrectPieces.length > 0) {
    const piece = incorrectPieces[0];
    const originalAlpha = piece.sprite?.alpha ?? 1;
    
    // Flash the piece - using individual tweens instead of timeline
    scene.tweens.add({
      targets: piece.sprite,
      alpha: 0.3,
      duration: 200,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        // Reset alpha back to original after flashing
        scene.tweens.add({
          targets: piece.sprite,
          alpha: originalAlpha,
          duration: 200
        });
      }
    });
    
    // Move it slightly towards correct position
    if (piece.sprite) {
      const dx = piece.correctX - piece.sprite.x;
      const dy = piece.correctY - piece.sprite.y;
      piece.sprite.x += dx * 0.2;
      piece.sprite.y += dy * 0.2;
    }
    
    if (piece.numberText) {
      piece.numberText.x = piece.sprite?.x ?? piece.numberText.x;
      piece.numberText.y = piece.sprite?.y ?? piece.numberText.y;
    }
    
    // Count as a move
    const gameStateModule = (window as any).gameState;
    if (gameStateModule) {
      gameStateModule.incrementMoves();
    }
  }
}

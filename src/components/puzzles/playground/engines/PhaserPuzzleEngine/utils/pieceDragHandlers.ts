
/**
 * Drag event handlers for puzzle pieces
 */

import { PuzzlePiece } from '../types/puzzleTypes';

/**
 * Sets up drag events for a puzzle piece
 * @param scene The Phaser scene
 * @param piece The puzzle piece object
 * @param allPieces Array of all puzzle pieces
 * @param width Width of the game board
 * @param height Height of the game board
 */
export function setupPieceDragEvents(
  scene: Phaser.Scene, 
  piece: PuzzlePiece,
  allPieces: PuzzlePiece[], 
  width: number, 
  height: number
): void {
  if (!piece.sprite) return;
  
  piece.sprite.on('dragstart', function(pointer: Phaser.Input.Pointer) {
    // Post message to start the game if not already started
    window.parent.postMessage({ type: 'PHASER_PUZZLE_START' }, '*');
    
    // Bring this piece to top
    this.setDepth(1000);
    if (piece.numberText) {
      piece.numberText.setDepth(1001);
    }
    
    // Count as a move
    const gameStateModule = (window as any).gameState;
    if (gameStateModule) {
      gameStateModule.incrementMoves();
    }
    
    // If piece was in correct position, it's not anymore
    if (piece.isCorrect) {
      piece.isCorrect = false;
    }
  });
  
  piece.sprite.on('drag', function(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
    // Keep the piece within bounds of the game
    const x = Phaser.Math.Clamp(dragX, piece.width/2, width - piece.width/2);
    const y = Phaser.Math.Clamp(dragY, piece.height/2, height - piece.height/2);
    
    this.x = x;
    this.y = y;
    
    // Update number text position if it exists
    if (piece.numberText) {
      piece.numberText.x = x;
      piece.numberText.y = y;
    }
  });
  
  piece.sprite.on('dragend', function(pointer: Phaser.Input.Pointer) {
    // Reset depth
    this.setDepth(0);
    if (piece.numberText) {
      piece.numberText.setDepth(1);
    }
    
    // Check if piece is near its correct position
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y, piece.correctX, piece.correctY
    );
    
    // If close enough, snap to correct position
    if (distance < 30) {
      this.x = piece.correctX;
      this.y = piece.correctY;
      piece.isCorrect = true;
      
      // Update number text position if it exists
      if (piece.numberText) {
        piece.numberText.x = piece.correctX;
        piece.numberText.y = piece.correctY;
      }
      
      // Check if all pieces are correct
      const allCorrect = allPieces.every(p => p.isCorrect);
      if (allCorrect) {
        const gameStateModule = (window as any).gameState;
        if (gameStateModule) {
          gameStateModule.completeGame();
        }
      }
    }
  });
}

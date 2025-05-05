import { PuzzlePiece } from '../types/puzzleTypes';

/**
 * Creates puzzle pieces for the Phaser game
 * @param scene The Phaser scene
 * @param texture The image texture
 * @param rows Number of rows in the puzzle
 * @param columns Number of columns in the puzzle
 * @returns Array of puzzle piece objects
 */
export function createPuzzlePieces(scene: Phaser.Scene, texture: Phaser.Textures.Texture, rows: number, columns: number): PuzzlePiece[] {
  // Get dimensions
  const width = scene.cameras.main.width;
  const height = scene.cameras.main.height;
  const pieceWidth = width / columns;
  const pieceHeight = height / rows;
  
  // Create an array for the pieces
  const piecesArray: PuzzlePiece[] = [];
  
  // Create each piece
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // Calculate correct position for this piece
      const correctX = col * pieceWidth + pieceWidth/2;
      const correctY = row * pieceHeight + pieceHeight/2;
      
      // Create a text element for piece number if needed
      let numberText = null;
      if (scene.game.config.customData?.showNumbers) {
        numberText = scene.add.text(
          correctX, 
          correctY,
          `${row * columns + col + 1}`,
          {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#fbbf24',
            stroke: '#0f172a',
            strokeThickness: 4
          }
        ).setOrigin(0.5).setDepth(100);
      }
      
      // Create a render texture for this piece
      const rt = scene.add.renderTexture(0, 0, pieceWidth, pieceHeight);
      
      // Draw the portion of the source texture to the render texture
      rt.draw(
        texture, 
        -col * pieceWidth, 
        -row * pieceHeight
      );
      
      // Save the texture with a unique name
      const textureName = `piece_${row}_${col}`;
      rt.saveTexture(textureName);
      
      // Create sprite for the piece using the new texture
      const pieceSprite = scene.add.sprite(
        correctX, 
        correctY,
        textureName
      ).setOrigin(0.5);
      
      // Make pieces interactive
      pieceSprite.setInteractive();
      scene.input.setDraggable(pieceSprite);
      
      // Add a border to make pieces visible
      pieceSprite.setStrokeStyle(1, 0x333333);
      
      // Create a piece object
      const piece: PuzzlePiece = {
        id: row * columns + col,
        row,
        col,
        correctX,
        correctY,
        width: pieceWidth,
        height: pieceHeight,
        isCorrect: false,
        sprite: pieceSprite,
        numberText
      };
      
      // Set up drag event handlers for this piece
      setupPieceDragEvents(scene, piece, piecesArray, width, height);
      
      piecesArray.push(piece);
    }
  }
  
  return piecesArray;
}

/**
 * Sets up drag events for a puzzle piece
 * @param scene The Phaser scene
 * @param piece The puzzle piece
 * @param allPieces Array of all puzzle pieces
 * @param boardWidth Width of the game board
 * @param boardHeight Height of the game board
 */
function setupPieceDragEvents(
  scene: Phaser.Scene, 
  piece: PuzzlePiece, 
  allPieces: PuzzlePiece[], 
  boardWidth: number, 
  boardHeight: number
): void {
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
    const x = Phaser.Math.Clamp(dragX, piece.width/2, boardWidth - piece.width/2);
    const y = Phaser.Math.Clamp(dragY, piece.height/2, boardHeight - piece.height/2);
    
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


import { PuzzlePiece } from '../types/puzzleTypes';
import { setupPieceDragEvents } from './pieceDragHandlers';

/**
 * Creates puzzle pieces for the Phaser game
 * @param scene The Phaser scene
 * @param texture The image texture
 * @param rows Number of rows in the puzzle
 * @param columns Number of columns in the puzzle
 * @returns Array of puzzle piece objects
 */
export function createPuzzlePieces(
  scene: Phaser.Scene, 
  texture: Phaser.Textures.Texture, 
  rows: number, 
  columns: number
): PuzzlePiece[] {
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
      let numberText: Phaser.GameObjects.Text | undefined = undefined;
      // Access config data safely using the game's registry instead of customData
      const showNumbers = scene.registry.get('showNumbers') || false;
      if (showNumbers) {
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
      
      // Add a border using graphics object instead of setStrokeStyle
      const border = scene.add.graphics();
      border.lineStyle(1, 0x333333);
      border.strokeRect(
        -pieceWidth/2, 
        -pieceHeight/2, 
        pieceWidth, 
        pieceHeight
      );
      
      // Create a container to hold both sprite and border
      const container = scene.add.container(correctX, correctY, [pieceSprite]);
      container.add(border);
      
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

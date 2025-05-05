import { PuzzleConfig } from '../types/puzzleTypes';
import { generateGameStateManager } from './gameStateManager';
import { generateEventHandlers } from './gameEventHandlers';
import { generateGameScene } from './gameSceneGenerator';

/**
 * Generates the JavaScript code for the Phaser puzzle game
 * @param puzzleConfig The configuration for the puzzle
 * @returns A script tag with the complete game code
 */
export function generateGameScript(puzzleConfig: PuzzleConfig): string {
  return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        try {
          // Tell the parent frame we're starting to load
          window.parent.postMessage({ type: 'PHASER_PUZZLE_LOADING' }, '*');
          
          const loadMessage = document.querySelector('.load-message');
          const spinner = document.querySelector('.spinner');
          const timerEl = document.getElementById('timer');
          
          // Config from parent
          const config = ${JSON.stringify(puzzleConfig)};
          
          // Game state management
          ${generateGameStateManager()}
          
          // UI Event handlers
          ${generateEventHandlers()}
          
          let game;
          let puzzleImage;
          let pieces = [];
          
          // Initialize the Phaser game
          function initGame(image) {
            // Create our game configuration
            const gameConfig = {
              type: Phaser.AUTO,
              width: 600,
              height: 600,
              backgroundColor: '#1e293b',
              parent: 'phaser-game',
              scene: {
                create: create
              }
            };
            
            // Create the game instance
            game = new Phaser.Game(gameConfig);
            puzzleImage = image;
            
            // Function to set up the game scene
            function create() {
              const scene = this;
              const width = scene.cameras.main.width;
              const height = scene.cameras.main.height;
              
              // Add image as texture
              const texture = scene.textures.addImage('puzzleImage', puzzleImage);
              
              // Create pieces
              pieces = createPuzzlePieces(scene, texture, config.rows, config.columns);
              
              // Shuffle the pieces
              shufflePieces();
              
              // Set up input handling for all pieces
              scene.input.on('dragstart', function(pointer, gameObject) {
                gameObject.setDepth(100);
                scene.children.bringToTop(gameObject);
              });
              
              scene.input.on('drag', function(pointer, gameObject, dragX, dragY) {
                gameObject.x = dragX;
                gameObject.y = dragY;
              });
              
              scene.input.on('dragend', function(pointer, gameObject) {
                gameObject.setDepth(0);
              });
              
              // Tell the parent we're ready
              window.parent.postMessage({ type: 'PHASER_PUZZLE_LOADED' }, '*');
            }
          }
          
          // Load the puzzle image
          const image = new Image();
          image.crossOrigin = "anonymous";
          
          image.onload = function() {
            loadMessage.style.display = 'none';
            spinner.style.display = 'none';
            
            // Tell the parent we've loaded
            window.parent.postMessage({ type: 'PHASER_PUZZLE_LOADED' }, '*');
            
            initGame(image);
          };
          
          image.onerror = function(err) {
            loadMessage.textContent = 'Error loading puzzle image';
            spinner.style.display = 'none';
            console.error("Image load error:", err);
            window.parent.postMessage({ 
              type: 'PHASER_PUZZLE_ERROR',
              error: 'Failed to load puzzle image'
            }, '*');
          };
          
          // Add cache buster to prevent image caching issues
          const cacheBuster = config.cacheBuster || Date.now();
          const imageUrl = config.imageUrl + (config.imageUrl.includes('?') ? '&' : '?') + 'cb=' + cacheBuster;
          console.log("Loading image:", imageUrl);
          image.src = imageUrl;
          
          // Track loading status with timeout
          let loadingTimeout = setTimeout(function() {
            if (!image.complete) {
              console.error("Image loading timeout");
              window.parent.postMessage({ 
                type: 'PHASER_PUZZLE_ERROR',
                error: 'Image loading timeout. Please try again.'
              }, '*');
            }
          }, 10000);
          
          // Clear timeout when image loads or errors
          image.onload = function() {
            clearTimeout(loadingTimeout);
            loadMessage.style.display = 'none';
            spinner.style.display = 'none';
            
            // Tell the parent we've loaded
            window.parent.postMessage({ type: 'PHASER_PUZZLE_LOADED' }, '*');
            
            initGame(image);
          };
          
          // Import the game scene setup
          ${generateGameScene()}

          // Inject the actual puzzle piece creation function
          createPuzzlePieces = function(scene, texture, rows, columns) {
            // Get dimensions
            const width = scene.cameras.main.width;
            const height = scene.cameras.main.height;
            const pieceWidth = width / columns;
            const pieceHeight = height / rows;
            
            // Create an array for the pieces
            const piecesArray = [];
            
            // Create each piece
            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < columns; col++) {
                // Calculate correct position for this piece
                const correctX = col * pieceWidth + pieceWidth/2;
                const correctY = row * pieceHeight + pieceHeight/2;
                
                // Create a text element for piece number if needed
                let numberText = null;
                if (config.showNumbers) {
                  numberText = scene.add.text(
                    correctX, 
                    correctY,
                    \`\${row * columns + col + 1}\`,
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
                const textureName = \`piece_\${row}_\${col}\`;
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
                const border = scene.add.graphics();
                border.lineStyle(1, 0x333333);
                border.strokeRect(-pieceWidth/2, -pieceHeight/2, pieceWidth, pieceHeight);
                pieceSprite.addChild(border);
                
                // Create a piece object
                const piece = {
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
                
                // Handle drag events
                pieceSprite.on('dragstart', function(pointer, dragX, dragY) {
                  if (!gameStarted) {
                    window.gameState.startGame();
                  }
                  // Bring this piece to top
                  this.setDepth(1000);
                  if (piece.numberText) {
                    piece.numberText.setDepth(1001);
                  }
                  
                  // Count as a move
                  window.gameState.incrementMoves();
                  
                  // If piece was in correct position, it's not anymore
                  if (piece.isCorrect) {
                    piece.isCorrect = false;
                  }
                });
                
                pieceSprite.on('drag', function(pointer, dragX, dragY) {
                  // Keep the piece within bounds of the game
                  const x = Phaser.Math.Clamp(dragX, pieceWidth/2, width - pieceWidth/2);
                  const y = Phaser.Math.Clamp(dragY, pieceHeight/2, height - pieceHeight/2);
                  
                  this.x = x;
                  this.y = y;
                  
                  // Update number text position if it exists
                  if (piece.numberText) {
                    piece.numberText.x = x;
                    piece.numberText.y = y;
                  }
                });
                
                pieceSprite.on('dragend', function(pointer) {
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
                    const allCorrect = piecesArray.every(p => p.isCorrect);
                    if (allCorrect && !gameCompleted) {
                      window.gameState.completeGame();
                    }
                  }
                });
                
                piecesArray.push(piece);
              }
            }
            
            return piecesArray;
          };

          // Inject the shuffle pieces function
          shufflePieces = function() {
            if (!pieces || pieces.length === 0) return;
            
            const width = game.config.width;
            const height = game.config.height;
            
            for (let i = 0; i < pieces.length; i++) {
              const piece = pieces[i];
              
              // Ensure the piece isn't already in the correct position
              let randomX, randomY;
              do {
                // Keep pieces within the game bounds
                randomX = Phaser.Math.Between(piece.width/2, width - piece.width/2);
                randomY = Phaser.Math.Between(piece.height/2, height - piece.height/2);
              } while (
                Math.abs(randomX - piece.correctX) < piece.width/4 && 
                Math.abs(randomY - piece.correctY) < piece.height/4
              );
              
              piece.sprite.x = randomX;
              piece.sprite.y = randomY;
              piece.isCorrect = false;
              
              // Also move number text
              if (piece.numberText) {
                piece.numberText.x = randomX;
                piece.numberText.y = randomY;
              }
            }
          };

          // Inject the showHint function
          showHint = function() {
            // Find the first incorrect piece and flash it
            const incorrectPieces = pieces.filter(p => !p.isCorrect);
            if (incorrectPieces.length > 0) {
              const piece = incorrectPieces[0];
              const originalAlpha = piece.sprite.alpha;
              
              // Flash the piece - using individual tweens instead of timeline
              game.scene.scenes[0].tweens.add({
                targets: piece.sprite,
                alpha: 0.3,
                duration: 200,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                  // Reset alpha back to original after flashing
                  game.scene.scenes[0].tweens.add({
                    targets: piece.sprite,
                    alpha: originalAlpha,
                    duration: 200
                  });
                }
              });
              
              // Move it slightly towards correct position
              const dx = piece.correctX - piece.sprite.x;
              const dy = piece.correctY - piece.sprite.y;
              piece.sprite.x += dx * 0.2;
              piece.sprite.y += dy * 0.2;
              
              if (piece.numberText) {
                piece.numberText.x = piece.sprite.x;
                piece.numberText.y = piece.sprite.y;
              }
            }
          };
          
        } catch (e) {
          console.error('Critical error in phaser game:', e);
          window.parent.postMessage({ 
            type: 'PHASER_PUZZLE_ERROR',
            error: 'Critical error: ' + e.message
          }, '*');
        }
      });
    </script>
  `;
}

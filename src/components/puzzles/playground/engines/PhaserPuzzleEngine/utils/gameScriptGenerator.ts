import { PuzzleConfig } from '../types/puzzleTypes';

/**
 * Generates the JavaScript code for the Phaser puzzle game
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
          let startTime = 0;
          let timerInterval;
          let gameStarted = false;
          let gameCompleted = false;
          let moves = 0;
          
          // Config from parent
          const config = ${JSON.stringify(puzzleConfig)};
          
          // Initialize buttons
          document.getElementById('reset-button').addEventListener('click', function() {
            resetGame();
            window.parent.postMessage({ type: 'PHASER_PUZZLE_RESET' }, '*');
          });
          
          document.getElementById('shuffle-button').addEventListener('click', function() {
            if (!gameStarted) {
              startGame();
            }
            shufflePieces();
            moves += 5;
            updateMoveCount();
          });
          
          document.getElementById('hint-button').addEventListener('click', function() {
            if (!gameStarted) {
              startGame();
            }
            showHint();
            moves += 1;
            updateMoveCount();
          });

          function updateMoveCount() {
            window.parent.postMessage({ 
              type: 'PHASER_PUZZLE_MOVE',
              stats: { moves }
            }, '*');
          }
          
          let game;
          let puzzleImage;
          let pieces = [];
          
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
          const cacheBuster = config.cacheBuster || '?cb=' + Date.now();
          image.src = config.imageUrl + (config.imageUrl.includes('?') ? '&' : '?') + cacheBuster;
          
          function initGame(imageElement) {
            const gameConfig = {
              type: Phaser.AUTO,
              width: 500,
              height: 500,
              parent: 'phaser-game',
              backgroundColor: '#0f172a',
              scene: {
                preload: preload,
                create: create
              }
            };
            
            try {
              game = new Phaser.Game(gameConfig);
            } catch (error) {
              console.error('Phaser game initialization error:', error);
              loadMessage.textContent = 'Error initializing puzzle game';
              loadMessage.style.display = 'block';
              window.parent.postMessage({ 
                type: 'PHASER_PUZZLE_ERROR',
                error: 'Failed to initialize Phaser game: ' + error.message
              }, '*');
            }
            
            function preload() {
              try {
                // Create a base64 texture from the image element
                const canvas = document.createElement('canvas');
                canvas.width = imageElement.width;
                canvas.height = imageElement.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imageElement, 0, 0);
                const base64 = canvas.toDataURL('image/png');
                
                // Load the image as a base64 texture
                this.textures.addBase64('puzzleImage', base64);
              } catch (error) {
                console.error('Error in preload:', error);
              }
            }
            
            function create() {
              try {
                const { rows, columns } = config;
                const pieceWidth = this.cameras.main.width / columns;
                const pieceHeight = this.cameras.main.height / rows;
                
                // Check if the texture exists
                if (!this.textures.exists('puzzleImage')) {
                  console.error('Puzzle image texture not found!');
                  window.parent.postMessage({ 
                    type: 'PHASER_PUZZLE_ERROR',
                    error: 'Failed to create puzzle texture'
                  }, '*');
                  return;
                }
                
                // Get the texture
                const texture = this.textures.get('puzzleImage');
                
                // Create our puzzle container
                const puzzleContainer = this.add.container(0, 0);
                
                // Create a full-size image for reference
                const fullImage = this.add.image(
                  this.cameras.main.centerX,
                  this.cameras.main.centerY,
                  'puzzleImage'
                ).setOrigin(0.5);
                
                // Scale to fit
                const scaleX = this.cameras.main.width / fullImage.width;
                const scaleY = this.cameras.main.height / fullImage.height;
                const scale = Math.min(scaleX, scaleY);
                fullImage.setScale(scale);
                
                // Hide the original image - we'll use it as reference only
                fullImage.setVisible(false);
                
                // Create pieces
                pieces = createPuzzlePieces(this, texture, rows, columns);
                
                // Shuffle pieces
                shufflePieces();
              } catch (error) {
                console.error('Error in create:', error);
                window.parent.postMessage({ 
                  type: 'PHASER_PUZZLE_ERROR',
                  error: 'Failed to create game scene: ' + error.message
                }, '*');
              }
            }
          }
          
          function createPuzzlePieces(scene, texture, rows, columns) {
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
                pieceSprite.setStrokeStyle(1, 0x333333);
                
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
                    startGame();
                  }
                  // Bring this piece to top
                  this.setDepth(1000);
                  if (piece.numberText) {
                    piece.numberText.setDepth(1001);
                  }
                  
                  // Count as a move
                  moves++;
                  updateMoveCount();
                  
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
                      completeGame();
                    }
                  }
                });
                
                piecesArray.push(piece);
              }
            }
            
            return piecesArray;
          }
          
          function shufflePieces() {
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
          }
          
          function showHint() {
            // Find the first incorrect piece and flash it
            const incorrectPieces = pieces.filter(p => !p.isCorrect);
            if (incorrectPieces.length > 0) {
              const piece = incorrectPieces[0];
              const originalAlpha = piece.sprite.alpha;
              
              // Flash the piece
              const timeline = game.scene.scenes[0].tweens.createTimeline();
              timeline.add({
                targets: piece.sprite,
                alpha: 0.3,
                duration: 200,
                yoyo: true,
                repeat: 2
              });
              timeline.add({
                targets: piece.sprite,
                alpha: originalAlpha,
                duration: 200
              });
              timeline.play();
              
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
          }
          
          function startGame() {
            if (gameStarted) return;
            
            gameStarted = true;
            startTime = Date.now();
            
            timerInterval = setInterval(updateTimer, 1000);
            updateTimer();
            
            window.parent.postMessage({ type: 'PHASER_PUZZLE_START' }, '*');
          }
          
          function updateTimer() {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            timerEl.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
          }
          
          function completeGame() {
            if (gameCompleted) return;
            
            gameCompleted = true;
            clearInterval(timerInterval);
            
            const completionTime = Math.floor((Date.now() - startTime) / 1000);
            
            window.parent.postMessage({ 
              type: 'PHASER_PUZZLE_COMPLETE',
              stats: {
                time: completionTime,
                moves: moves
              }
            }, '*');
            
            // Show completion animation
            const gameContainer = document.getElementById('game-container');
            const completionMsg = document.createElement('div');
            completionMsg.style.position = 'absolute';
            completionMsg.style.top = '50%';
            completionMsg.style.left = '50%';
            completionMsg.style.transform = 'translate(-50%, -50%)';
            completionMsg.style.background = 'rgba(15, 23, 42, 0.9)';
            completionMsg.style.color = '#fbbf24';
            completionMsg.style.padding = '24px';
            completionMsg.style.borderRadius = '8px';
            completionMsg.style.textAlign = 'center';
            completionMsg.style.zIndex = '1000';
            
            completionMsg.innerHTML = \`
              <h2 style="margin-top:0">Puzzle Complete!</h2>
              <p>Time: \${Math.floor(completionTime / 60)}:\${(completionTime % 60).toString().padStart(2, '0')}</p>
              <p>Moves: \${moves}</p>
              <button class="btn primary">Play Again</button>
            \`;
            
            gameContainer.appendChild(completionMsg);
            
            completionMsg.querySelector('button').addEventListener('click', function() {
              completionMsg.remove();
              resetGame();
            });
          }
          
          function resetGame() {
            gameStarted = false;
            gameCompleted = false;
            moves = 0;
            updateMoveCount();
            clearInterval(timerInterval);
            timerEl.textContent = '00:00';
            
            // Shuffle pieces
            if (pieces && pieces.length > 0) {
              shufflePieces();
            } else {
              // If no pieces were created yet, reload the game
              window.location.reload();
            }
            
            // Remove any completion message if present
            const completionMsg = document.querySelector('#game-container > div:last-child');
            if (completionMsg && completionMsg.querySelector('h2')) {
              completionMsg.remove();
            }
          }
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

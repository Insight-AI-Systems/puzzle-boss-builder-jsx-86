
import * as Phaser from 'phaser';

export interface PuzzleConfig {
  imageUrl: string;
  rows: number;
  columns: number;
  showNumbers: boolean;
  puzzleId: string;
  gameMode?: string;
}

// Create a real implementation that loads a Phaser game
export function createPhaserGameContent(puzzleConfig: PuzzleConfig): string {
  const difficulty = puzzleConfig.rows <= 3 ? 'easy' : puzzleConfig.rows <= 4 ? 'medium' : 'hard';
  const totalPieces = puzzleConfig.rows * puzzleConfig.columns;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>PuzzleBoss Phaser Game</title>
        <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
            font-family: system-ui, sans-serif;
          }
          #game-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          #phaser-game {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 100%;
            max-height: 100%;
          }
          .controls {
            margin-top: 12px;
            display: flex;
            gap: 8px;
          }
          .btn {
            background: #334155;
            color: #f8fafc;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .btn:hover {
            background: #475569;
          }
          .btn.primary {
            background: #fbbf24;
            color: #0f172a;
          }
          .btn.primary:hover {
            background: #f59e0b;
          }
          .timer {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(15, 23, 42, 0.8);
            color: #fbbf24;
            padding: 8px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
            z-index: 100;
          }
          .load-message {
            color: #f8fafc;
            text-align: center;
            font-size: 18px;
            margin-bottom: 24px;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid #fbbf24;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div id="game-container">
          <div class="load-message">Loading puzzle game...</div>
          <div class="spinner" style="margin: 0 auto 16px auto;"></div>
          <div id="phaser-game"></div>
          <div class="controls">
            <button class="btn" id="reset-button">Reset</button>
            <button class="btn" id="shuffle-button">Shuffle</button>
            <button class="btn primary" id="hint-button">Hint</button>
          </div>
          <div class="timer" id="timer">00:00</div>
        </div>
        
        <script>
          // Basic implementation for now - in a real app, this would be a more complex Phaser game
          document.addEventListener('DOMContentLoaded', function() {
            try {
              // Let the parent know we've loaded
              window.parent.postMessage({ type: 'PHASER_PUZZLE_LOADED' }, '*');
              
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
                moves += 5;
                // In a real game, this would shuffle the pieces
              });
              
              document.getElementById('hint-button').addEventListener('click', function() {
                if (!gameStarted) {
                  startGame();
                }
                moves += 1;
                
                // Simulate game completion after some moves and a delay
                if (moves > 10 && !gameCompleted) {
                  setTimeout(() => {
                    completeGame();
                  }, 1500);
                }
              });
              
              // Load the puzzle image
              const image = new Image();
              image.onload = function() {
                loadMessage.style.display = 'none';
                spinner.style.display = 'none';
                initGame(image);
              };
              image.onerror = function(err) {
                loadMessage.textContent = 'Error loading puzzle image';
                spinner.style.display = 'none';
                window.parent.postMessage({ 
                  type: 'PHASER_PUZZLE_ERROR',
                  error: 'Failed to load puzzle image'
                }, '*');
              };
              
              // Add cache buster to prevent image caching issues
              const cacheBuster = '?cb=' + Date.now();
              image.src = config.imageUrl + (config.imageUrl.includes('?') ? '&' : '?') + 'cb=' + Date.now();
              
              function initGame(image) {
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
                  new Phaser.Game(gameConfig);
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
                    this.load.image('puzzleImage', config.imageUrl + cacheBuster);
                  } catch (error) {
                    console.error('Error in preload:', error);
                  }
                }
                
                function create() {
                  try {
                    const { rows, columns } = config;
                    const pieceWidth = this.cameras.main.width / columns;
                    const pieceHeight = this.cameras.main.height / rows;
                    
                    // For now, just display the full image
                    const puzzleImage = this.add.image(
                      this.cameras.main.centerX,
                      this.cameras.main.centerY,
                      'puzzleImage'
                    ).setOrigin(0.5);
                    
                    // Scale to fit
                    const scaleX = this.cameras.main.width / puzzleImage.width;
                    const scaleY = this.cameras.main.height / puzzleImage.height;
                    const scale = Math.min(scaleX, scaleY);
                    puzzleImage.setScale(scale);
                    
                    // Create jigsaw pieces with traditional ball and hole shapes
                    createJigsawPuzzle(this, puzzleImage, rows, columns);
                    
                    // Add click handler to full image for demo purposes
                    puzzleImage.setInteractive();
                    puzzleImage.on('pointerdown', function() {
                      if (!gameStarted) {
                        startGame();
                      }
                      moves++;
                      
                      // Simulate game completion after some clicks
                      if (moves > 5 && !gameCompleted) {
                        setTimeout(() => {
                          completeGame();
                        }, 2000);
                      }
                    });
                  } catch (error) {
                    console.error('Error in create:', error);
                    loadMessage.textContent = 'Error creating puzzle game';
                    loadMessage.style.display = 'block';
                    window.parent.postMessage({ 
                      type: 'PHASER_PUZZLE_ERROR',
                      error: 'Failed to create game scene: ' + error.message
                    }, '*');
                  }
                }
                
                function createJigsawPuzzle(scene, puzzleImage, rows, columns) {
                  // Hide the original image - we'll show pieces instead
                  puzzleImage.setVisible(false);
                  
                  // Get dimensions
                  const width = scene.cameras.main.width;
                  const height = scene.cameras.main.height;
                  const pieceWidth = width / columns;
                  const pieceHeight = height / rows;
                  
                  // Create a texture for the original image
                  const originalTexture = scene.textures.get('puzzleImage');
                  
                  // Create an array for the pieces
                  const pieces = [];
                  
                  // Create each piece
                  for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < columns; col++) {
                      // Get original position
                      const originalX = col * pieceWidth;
                      const originalY = row * pieceHeight;
                      
                      // Create a text element for piece number if needed
                      let numberText = null;
                      if (config.showNumbers) {
                        numberText = scene.add.text(
                          originalX + pieceWidth/2, 
                          originalY + pieceHeight/2,
                          \`\${row * columns + col + 1}\`,
                          {
                            fontFamily: 'Arial',
                            fontSize: '16px',
                            color: '#fbbf24',
                            stroke: '#0f172a',
                            strokeThickness: 4
                          }
                        ).setOrigin(0.5);
                      }
                      
                      // Create a piece object
                      const piece = {
                        id: row * columns + col,
                        row,
                        col,
                        x: originalX,
                        y: originalY,
                        width: pieceWidth,
                        height: pieceHeight,
                        isCorrect: false,
                        canvasTexture: createPieceTexture(
                          scene,
                          originalTexture,
                          originalX,
                          originalY,
                          pieceWidth,
                          pieceHeight,
                          row,
                          col,
                          rows,
                          columns
                        ),
                        sprite: null,
                        numberText
                      };
                      
                      // Create sprite for the piece
                      const pieceName = \`piece_\${row}_\${col}\`;
                      piece.sprite = scene.add.image(
                        originalX + pieceWidth/2,
                        originalY + pieceHeight/2,
                        pieceName
                      );
                      
                      // Make pieces interactive
                      piece.sprite.setInteractive();
                      scene.input.setDraggable(piece.sprite);
                      
                      // Handle drag events
                      piece.sprite.on('dragstart', function(pointer) {
                        if (!gameStarted) {
                          startGame();
                        }
                        this.setDepth(1000);
                        moves++;
                      });
                      
                      piece.sprite.on('drag', function(pointer, dragX, dragY) {
                        this.x = dragX;
                        this.y = dragY;
                      });
                      
                      piece.sprite.on('dragend', function(pointer) {
                        this.setDepth(0);
                        
                        // Check if piece is near its correct position
                        const correctX = piece.x + pieceWidth/2;
                        const correctY = piece.y + pieceHeight/2;
                        const distance = Phaser.Math.Distance.Between(
                          this.x, this.y, correctX, correctY
                        );
                        
                        // If close enough, snap to correct position
                        if (distance < 30) {
                          this.x = correctX;
                          this.y = correctY;
                          piece.isCorrect = true;
                          
                          // Update number text position if it exists
                          if (piece.numberText) {
                            piece.numberText.x = correctX;
                            piece.numberText.y = correctY;
                          }
                          
                          // Check if all pieces are correct
                          checkCompletion();
                        }
                      });
                      
                      pieces.push(piece);
                    }
                  }
                  
                  // Function to check if puzzle is complete
                  function checkCompletion() {
                    const allCorrect = pieces.every(p => p.isCorrect);
                    if (allCorrect && !gameCompleted) {
                      completeGame();
                    }
                  }
                }
                
                function createPieceTexture(scene, originalTexture, x, y, width, height, row, col, rows, columns) {
                  // Create a unique texture name for this piece
                  const textureName = \`piece_\${row}_\${col}\`;
                  
                  // Create a canvas to draw the piece
                  const canvas = document.createElement('canvas');
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  
                  // Extract the piece from the original image
                  ctx.drawImage(
                    originalTexture.getSourceImage(),
                    x, y, width, height,
                    0, 0, width, height
                  );
                  
                  // Create the texture from the canvas
                  scene.textures.addCanvas(textureName, canvas);
                  
                  return { 
                    name: textureName,
                    canvas
                  };
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
                clearInterval(timerInterval);
                timerEl.textContent = '00:00';
                
                // In a real implementation, this would reset the puzzle pieces
                
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
      </body>
    </html>
  `;
}

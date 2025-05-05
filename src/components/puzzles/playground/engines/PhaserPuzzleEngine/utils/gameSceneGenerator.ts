
/**
 * Generates the Phaser scene initialization and creation code
 * @returns JavaScript code for the Phaser scene setup
 */
export function generateGameScene(): string {
  return `
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
        },
        customData: config
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
      // This is a placeholder - the actual implementation will be injected
      return [];
    }
    
    function shufflePieces() {
      // This is a placeholder - the actual implementation will be injected
      return;
    }
    
    function showHint() {
      // This is a placeholder - the actual implementation will be injected
      return;
    }
  `;
}

// CodeCanyon Jigsaw Deluxe - Game Engine Core
class CGame {
    constructor(options = {}) {
        this.canvas = null;
        this.ctx = null;
        this.pieces = [];
        this.imageUrl = options.imageUrl || '';
        this.rows = options.rows || 3;
        this.columns = options.columns || 3;
        this.pieceWidth = 0;
        this.pieceHeight = 0;
        this.draggedPiece = null;
        this.isComplete = false;
        this.onComplete = options.onComplete || null;
        
        this.init(options.containerId);
    }
    
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');
        
        container.appendChild(this.canvas);
        
        // Load image and initialize puzzle
        this.loadImage();
        
        // Add event listeners
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }
    
    loadImage() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.sourceImage = img;
            this.createPieces();
            this.shufflePieces();
            this.render();
        };
        img.src = this.imageUrl;
    }
    
    createPieces() {
        this.pieces = [];
        this.pieceWidth = this.canvas.width / this.columns;
        this.pieceHeight = this.canvas.height / this.rows;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const piece = new CPiece({
                    id: row * this.columns + col,
                    sourceX: col * (this.sourceImage.width / this.columns),
                    sourceY: row * (this.sourceImage.height / this.rows),
                    sourceWidth: this.sourceImage.width / this.columns,
                    sourceHeight: this.sourceImage.height / this.rows,
                    targetX: col * this.pieceWidth,
                    targetY: row * this.pieceHeight,
                    currentX: col * this.pieceWidth,
                    currentY: row * this.pieceHeight,
                    width: this.pieceWidth,
                    height: this.pieceHeight,
                    correctPosition: { row, col }
                });
                this.pieces.push(piece);
            }
        }
    }
    
    shufflePieces() {
        // Simple shuffle - randomly swap positions
        for (let i = 0; i < 100; i++) {
            const piece1 = this.pieces[Math.floor(Math.random() * this.pieces.length)];
            const piece2 = this.pieces[Math.floor(Math.random() * this.pieces.length)];
            
            if (piece1 !== piece2) {
                const tempX = piece1.currentX;
                const tempY = piece1.currentY;
                piece1.currentX = piece2.currentX;
                piece1.currentY = piece2.currentY;
                piece2.currentX = tempX;
                piece2.currentY = tempY;
            }
        }
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        for (let i = 0; i <= this.columns; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.pieceWidth, 0);
            this.ctx.lineTo(i * this.pieceWidth, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.pieceHeight);
            this.ctx.lineTo(this.canvas.width, i * this.pieceHeight);
            this.ctx.stroke();
        }
        
        // Draw pieces
        this.pieces.forEach(piece => {
            piece.draw(this.ctx, this.sourceImage);
        });
        
        if (this.isComplete) {
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PUZZLE COMPLETE!', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find piece at mouse position
        this.draggedPiece = this.pieces.find(piece => 
            x >= piece.currentX && x < piece.currentX + piece.width &&
            y >= piece.currentY && y < piece.currentY + piece.height
        );
        
        if (this.draggedPiece) {
            this.draggedPiece.isDragging = true;
            this.draggedPiece.dragOffsetX = x - this.draggedPiece.currentX;
            this.draggedPiece.dragOffsetY = y - this.draggedPiece.currentY;
        }
    }
    
    handleMouseMove(e) {
        if (!this.draggedPiece) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.draggedPiece.currentX = x - this.draggedPiece.dragOffsetX;
        this.draggedPiece.currentY = y - this.draggedPiece.dragOffsetY;
        
        this.render();
    }
    
    handleMouseUp(e) {
        if (!this.draggedPiece) return;
        
        // Snap to grid
        const gridX = Math.round(this.draggedPiece.currentX / this.pieceWidth) * this.pieceWidth;
        const gridY = Math.round(this.draggedPiece.currentY / this.pieceHeight) * this.pieceHeight;
        
        // Check if position is occupied
        const occupiedPiece = this.pieces.find(piece => 
            piece !== this.draggedPiece && piece.currentX === gridX && piece.currentY === gridY
        );
        
        if (occupiedPiece) {
            // Swap positions
            occupiedPiece.currentX = this.draggedPiece.currentX;
            occupiedPiece.currentY = this.draggedPiece.currentY;
        }
        
        this.draggedPiece.currentX = gridX;
        this.draggedPiece.currentY = gridY;
        this.draggedPiece.isDragging = false;
        this.draggedPiece = null;
        
        this.checkComplete();
        this.render();
    }
    
    checkComplete() {
        const complete = this.pieces.every(piece => 
            piece.currentX === piece.targetX && piece.currentY === piece.targetY
        );
        
        if (complete && !this.isComplete) {
            this.isComplete = true;
            if (this.onComplete) {
                this.onComplete();
            }
        }
    }
}

// Make it globally available
window.CGame = CGame;
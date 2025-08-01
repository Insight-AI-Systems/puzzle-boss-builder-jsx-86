// CodeCanyon Jigsaw Deluxe - Puzzle Piece Class
class CPiece {
    constructor(options = {}) {
        this.id = options.id || 0;
        this.sourceX = options.sourceX || 0;
        this.sourceY = options.sourceY || 0;
        this.sourceWidth = options.sourceWidth || 100;
        this.sourceHeight = options.sourceHeight || 100;
        this.targetX = options.targetX || 0;
        this.targetY = options.targetY || 0;
        this.currentX = options.currentX || 0;
        this.currentY = options.currentY || 0;
        this.width = options.width || 100;
        this.height = options.height || 100;
        this.correctPosition = options.correctPosition || { row: 0, col: 0 };
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
    }
    
    draw(ctx, sourceImage) {
        if (!sourceImage) return;
        
        // Add shadow if dragging
        if (this.isDragging) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        }
        
        // Draw the piece of the image
        ctx.drawImage(
            sourceImage,
            this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight,
            this.currentX, this.currentY, this.width, this.height
        );
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw border
        ctx.strokeStyle = this.isDragging ? '#00ff00' : '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.currentX, this.currentY, this.width, this.height);
        
        // Draw piece number (for debugging)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(this.currentX + 5, this.currentY + 5, 20, 20);
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(this.id.toString(), this.currentX + 10, this.currentY + 18);
    }
    
    isInCorrectPosition() {
        return this.currentX === this.targetX && this.currentY === this.targetY;
    }
    
    snapToGrid(gridWidth, gridHeight) {
        this.currentX = Math.round(this.currentX / gridWidth) * gridWidth;
        this.currentY = Math.round(this.currentY / gridHeight) * gridHeight;
    }
}

// Make it globally available
window.CPiece = CPiece;
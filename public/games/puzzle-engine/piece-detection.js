/**
 * PuzzleBoss.com Jigsaw Puzzle Engine - Piece Detection
 * Handles mouse/touch events and piece selection
 */

class PieceDetection {
  constructor(canvas, puzzleCore) {
    this.canvas = canvas;
    this.puzzleCore = puzzleCore;
    this.draggedPiece = null;
    this.dragOffset = { x: 0, y: 0 };
    this.isMouseDown = false;
    this.isTouchDevice = 'ontouchstart' in window;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.isTouchDevice) {
      this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    } else {
      this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
      this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    }
  }

  getCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    if (event.touches) {
      const touch = event.touches[0] || event.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
    const coords = this.getCoordinates(event);
    this.startDrag(coords.x, coords.y);
  }

  handleMouseMove(event) {
    if (!this.draggedPiece) return;
    event.preventDefault();
    const coords = this.getCoordinates(event);
    this.updateDrag(coords.x, coords.y);
  }

  handleMouseUp(event) {
    if (this.draggedPiece) {
      event.preventDefault();
      this.endDrag();
    }
  }

  handleTouchStart(event) {
    event.preventDefault();
    const coords = this.getCoordinates(event);
    this.startDrag(coords.x, coords.y);
  }

  handleTouchMove(event) {
    if (!this.draggedPiece) return;
    event.preventDefault();
    const coords = this.getCoordinates(event);
    this.updateDrag(coords.x, coords.y);
  }

  handleTouchEnd(event) {
    if (this.draggedPiece) {
      event.preventDefault();
      this.endDrag();
    }
  }

  startDrag(x, y) {
    const piece = this.puzzleCore.getPieceAt(x, y);
    if (!piece || piece.isCorrect) return;

    this.draggedPiece = piece;
    this.draggedPiece.isDragging = true;
    
    // Calculate offset from piece top-left corner
    this.dragOffset.x = x - piece.currentX;
    this.dragOffset.y = y - piece.currentY;

    // Move piece to end of array for top rendering
    const pieces = this.puzzleCore.pieces;
    const index = pieces.indexOf(piece);
    if (index > -1) {
      pieces.splice(index, 1);
      pieces.push(piece);
    }

    this.canvas.style.cursor = 'grabbing';
  }

  updateDrag(x, y) {
    if (!this.draggedPiece) return;

    const newX = x - this.dragOffset.x;
    const newY = y - this.dragOffset.y;
    
    // Keep piece within canvas bounds
    const maxX = this.canvas.width - this.draggedPiece.width;
    const maxY = this.canvas.height - this.draggedPiece.height;
    
    this.draggedPiece.currentX = Math.max(0, Math.min(newX, maxX));
    this.draggedPiece.currentY = Math.max(0, Math.min(newY, maxY));
  }

  endDrag() {
    if (!this.draggedPiece) return;

    const snapResult = this.puzzleCore.checkPieceSnap(this.draggedPiece.id);
    
    this.draggedPiece.isDragging = false;
    this.draggedPiece = null;
    this.canvas.style.cursor = 'default';

    if (snapResult.snapped) {
      // Check if puzzle is complete
      if (this.puzzleCore.isComplete()) {
        setTimeout(() => {
          this.puzzleCore.onComplete();
        }, 100);
      }
    }
  }

  cleanup() {
    // Remove all event listeners
    if (this.isTouchDevice) {
      this.canvas.removeEventListener('touchstart', this.handleTouchStart);
      this.canvas.removeEventListener('touchmove', this.handleTouchMove);
      this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    } else {
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
      this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PieceDetection;
} else if (typeof window !== 'undefined') {
  window.PieceDetection = PieceDetection;
}

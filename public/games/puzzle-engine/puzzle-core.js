/**
 * PuzzleBoss.com Jigsaw Puzzle Engine - Core Logic
 * Handles puzzle piece generation, validation, and completion
 */

class PuzzleCore {
  constructor(config) {
    this.imageUrl = config.imageUrl;
    this.difficulty = config.difficulty || 'medium';
    this.dimensions = this.getDimensionsByDifficulty(config.difficulty);
    this.pieces = [];
    this.placedPieces = new Map();
    this.completedPieces = new Set();
    this.onComplete = config.onComplete || (() => {});
    this.onPiecePlace = config.onPiecePlace || (() => {});
    this.snapThreshold = 30;
  }

  getDimensionsByDifficulty(difficulty) {
    const difficulties = {
      easy: { rows: 3, cols: 3, pieces: 9 },
      medium: { rows: 4, cols: 4, pieces: 16 },
      hard: { rows: 5, cols: 5, pieces: 25 },
      expert: { rows: 6, cols: 6, pieces: 36 }
    };
    return difficulties[difficulty] || difficulties.medium;
  }

  async initialize(imageElement) {
    return new Promise((resolve) => {
      this.imageElement = imageElement;
      this.generatePieces();
      this.shufflePieces();
      resolve(this.pieces);
    });
  }

  generatePieces() {
    const { rows, cols } = this.dimensions;
    const pieceWidth = this.imageElement.width / cols;
    const pieceHeight = this.imageElement.height / rows;

    this.pieces = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const piece = {
          id: `${row}-${col}`,
          row,
          col,
          correctX: col * pieceWidth,
          correctY: row * pieceHeight,
          currentX: 0,
          currentY: 0,
          width: pieceWidth,
          height: pieceHeight,
          isPlaced: false,
          isCorrect: false,
          isDragging: false
        };
        this.pieces.push(piece);
      }
    }
  }

  shufflePieces() {
    // Simple shuffle algorithm
    for (let i = this.pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.pieces[i], this.pieces[j]] = [this.pieces[j], this.pieces[i]];
    }

    // Position pieces in staging area
    this.pieces.forEach((piece, index) => {
      const stagingCols = Math.ceil(Math.sqrt(this.pieces.length));
      const stagingRow = Math.floor(index / stagingCols);
      const stagingCol = index % stagingCols;
      
      piece.currentX = stagingCol * (piece.width + 10) + 50;
      piece.currentY = stagingRow * (piece.height + 10) + 50;
    });
  }

  movePiece(pieceId, x, y) {
    const piece = this.pieces.find(p => p.id === pieceId);
    if (!piece) return false;

    piece.currentX = x;
    piece.currentY = y;
    
    return true;
  }

  checkPieceSnap(pieceId) {
    const piece = this.pieces.find(p => p.id === pieceId);
    if (!piece) return { snapped: false };

    const distanceX = Math.abs(piece.currentX - piece.correctX);
    const distanceY = Math.abs(piece.currentY - piece.correctY);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance <= this.snapThreshold) {
      piece.currentX = piece.correctX;
      piece.currentY = piece.correctY;
      piece.isPlaced = true;
      piece.isCorrect = true;
      
      this.completedPieces.add(pieceId);
      this.onPiecePlace(piece);

      return { snapped: true, piece };
    }

    return { snapped: false };
  }

  isComplete() {
    return this.completedPieces.size === this.pieces.length;
  }

  getProgress() {
    return (this.completedPieces.size / this.pieces.length) * 100;
  }

  getPieceAt(x, y) {
    // Find the topmost piece at the given coordinates
    for (let i = this.pieces.length - 1; i >= 0; i--) {
      const piece = this.pieces[i];
      if (x >= piece.currentX && x <= piece.currentX + piece.width &&
          y >= piece.currentY && y <= piece.currentY + piece.height) {
        return piece;
      }
    }
    return null;
  }

  reset() {
    this.completedPieces.clear();
    this.placedPieces.clear();
    this.pieces.forEach(piece => {
      piece.isPlaced = false;
      piece.isCorrect = false;
      piece.isDragging = false;
    });
    this.shufflePieces();
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PuzzleCore;
} else if (typeof window !== 'undefined') {
  window.PuzzleCore = PuzzleCore;
}
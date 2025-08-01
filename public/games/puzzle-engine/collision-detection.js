/**
 * PuzzleBoss.com Jigsaw Puzzle Engine - Collision Detection
 * Handles piece overlap detection and boundary checking
 */

class CollisionDetection {
  constructor(puzzleCore) {
    this.puzzleCore = puzzleCore;
  }

  checkBoundaries(piece, canvasWidth, canvasHeight) {
    const result = {
      x: piece.currentX,
      y: piece.currentY,
      adjusted: false
    };

    // Check left boundary
    if (piece.currentX < 0) {
      result.x = 0;
      result.adjusted = true;
    }

    // Check right boundary
    if (piece.currentX + piece.width > canvasWidth) {
      result.x = canvasWidth - piece.width;
      result.adjusted = true;
    }

    // Check top boundary
    if (piece.currentY < 0) {
      result.y = 0;
      result.adjusted = true;
    }

    // Check bottom boundary
    if (piece.currentY + piece.height > canvasHeight) {
      result.y = canvasHeight - piece.height;
      result.adjusted = true;
    }

    return result;
  }

  checkPieceOverlap(piece1, piece2) {
    // Simple rectangular overlap detection
    return !(
      piece1.currentX + piece1.width <= piece2.currentX ||
      piece2.currentX + piece2.width <= piece1.currentX ||
      piece1.currentY + piece1.height <= piece2.currentY ||
      piece2.currentY + piece2.height <= piece1.currentY
    );
  }

  resolveOverlaps(movingPiece) {
    const overlappingPieces = [];
    
    this.puzzleCore.pieces.forEach(piece => {
      if (piece.id !== movingPiece.id && 
          !piece.isCorrect && 
          this.checkPieceOverlap(movingPiece, piece)) {
        overlappingPieces.push(piece);
      }
    });

    return overlappingPieces;
  }

  getValidDropZones(piece) {
    const dropZones = [];
    
    // Always include the correct position as a drop zone
    dropZones.push({
      x: piece.correctX,
      y: piece.correctY,
      type: 'correct',
      score: 100
    });

    // Add staging area zones
    const stagingCols = Math.ceil(Math.sqrt(this.puzzleCore.pieces.length));
    for (let i = 0; i < this.puzzleCore.pieces.length; i++) {
      const stagingRow = Math.floor(i / stagingCols);
      const stagingCol = i % stagingCols;
      
      dropZones.push({
        x: stagingCol * (piece.width + 10) + 50,
        y: stagingRow * (piece.height + 10) + 50,
        type: 'staging',
        score: 0
      });
    }

    return dropZones;
  }

  findNearestDropZone(piece) {
    const dropZones = this.getValidDropZones(piece);
    let nearestZone = null;
    let minDistance = Infinity;

    dropZones.forEach(zone => {
      const distance = Math.sqrt(
        Math.pow(piece.currentX - zone.x, 2) + 
        Math.pow(piece.currentY - zone.y, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestZone = { ...zone, distance };
      }
    });

    return nearestZone;
  }

  isValidPosition(piece, x, y, canvasWidth, canvasHeight) {
    // Create temporary piece at position for testing
    const testPiece = {
      ...piece,
      currentX: x,
      currentY: y
    };

    // Check boundaries
    const boundaryCheck = this.checkBoundaries(testPiece, canvasWidth, canvasHeight);
    if (boundaryCheck.adjusted) {
      return false;
    }

    // Check overlaps with placed pieces
    const overlaps = this.resolveOverlaps(testPiece);
    const hasBlockingOverlap = overlaps.some(p => p.isCorrect);
    
    return !hasBlockingOverlap;
  }

  snapToGrid(piece, gridSize = 10) {
    return {
      x: Math.round(piece.currentX / gridSize) * gridSize,
      y: Math.round(piece.currentY / gridSize) * gridSize
    };
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CollisionDetection;
} else if (typeof window !== 'undefined') {
  window.CollisionDetection = CollisionDetection;
}
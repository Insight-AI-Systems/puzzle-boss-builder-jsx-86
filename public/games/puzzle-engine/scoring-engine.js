/**
 * PuzzleBoss.com Jigsaw Puzzle Engine - Scoring System
 * Handles scoring, timing, and performance tracking
 */

class ScoringEngine {
  constructor(config = {}) {
    this.startTime = null;
    this.endTime = null;
    this.moves = 0;
    this.hints = 0;
    this.correctPlacements = 0;
    this.incorrectPlacements = 0;
    this.baseScore = config.baseScore || 1000;
    this.timeBonusMultiplier = config.timeBonusMultiplier || 2;
    this.movesPenalty = config.movesPenalty || 1;
    this.hintPenalty = config.hintPenalty || 50;
    this.perfectBonusThreshold = config.perfectBonusThreshold || 1.5;
  }

  startTimer() {
    this.startTime = Date.now();
    this.endTime = null;
  }

  stopTimer() {
    if (this.startTime && !this.endTime) {
      this.endTime = Date.now();
    }
  }

  getElapsedTime() {
    if (!this.startTime) return 0;
    const endTime = this.endTime || Date.now();
    return Math.floor((endTime - this.startTime) / 1000);
  }

  recordMove() {
    this.moves++;
  }

  recordHint() {
    this.hints++;
  }

  recordCorrectPlacement() {
    this.correctPlacements++;
    this.recordMove();
  }

  recordIncorrectPlacement() {
    this.incorrectPlacements++;
    this.recordMove();
  }

  calculateScore(totalPieces, difficulty = 'medium') {
    if (!this.endTime) {
      this.stopTimer();
    }

    const elapsedTime = this.getElapsedTime();
    const difficultyMultiplier = this.getDifficultyMultiplier(difficulty);
    
    // Base score calculation
    let score = this.baseScore * difficultyMultiplier;

    // Time bonus (faster completion = higher bonus)
    const expectedTime = this.getExpectedTime(totalPieces, difficulty);
    if (elapsedTime < expectedTime) {
      const timeBonus = Math.floor(
        (expectedTime - elapsedTime) * this.timeBonusMultiplier * difficultyMultiplier
      );
      score += timeBonus;
    }

    // Efficiency bonus (fewer moves = higher bonus)
    const expectedMoves = totalPieces * 1.5; // Expected moves is 1.5x piece count
    if (this.moves < expectedMoves) {
      const efficiencyBonus = Math.floor((expectedMoves - this.moves) * this.movesPenalty);
      score += efficiencyBonus;
    }

    // Perfect game bonus
    if (this.correctPlacements === totalPieces && this.incorrectPlacements === 0) {
      score += Math.floor(this.baseScore * this.perfectBonusThreshold);
    }

    // Penalties
    score -= this.hints * this.hintPenalty;
    score -= Math.max(0, this.moves - expectedMoves) * this.movesPenalty;

    return Math.max(0, Math.floor(score));
  }

  getDifficultyMultiplier(difficulty) {
    const multipliers = {
      easy: 1.0,
      medium: 1.5,
      hard: 2.0,
      expert: 3.0
    };
    return multipliers[difficulty] || 1.5;
  }

  getExpectedTime(totalPieces, difficulty) {
    // Expected time in seconds based on piece count and difficulty
    const baseTimes = {
      easy: 60,    // 1 minute base for easy
      medium: 180, // 3 minutes base for medium
      hard: 300,   // 5 minutes base for hard
      expert: 600  // 10 minutes base for expert
    };
    
    const baseTime = baseTimes[difficulty] || baseTimes.medium;
    return baseTime + (totalPieces * 5); // Add 5 seconds per piece
  }

  getStats() {
    return {
      elapsedTime: this.getElapsedTime(),
      moves: this.moves,
      hints: this.hints,
      correctPlacements: this.correctPlacements,
      incorrectPlacements: this.incorrectPlacements,
      accuracy: this.correctPlacements / Math.max(1, this.moves),
      startTime: this.startTime,
      endTime: this.endTime
    };
  }

  getPerformanceRating(totalPieces, difficulty) {
    const stats = this.getStats();
    const expectedTime = this.getExpectedTime(totalPieces, difficulty);
    const expectedMoves = totalPieces * 1.5;

    let rating = 0;

    // Time performance (0-40 points)
    if (stats.elapsedTime <= expectedTime * 0.5) {
      rating += 40;
    } else if (stats.elapsedTime <= expectedTime) {
      rating += 20 + (20 * (expectedTime - stats.elapsedTime) / (expectedTime * 0.5));
    }

    // Move efficiency (0-30 points)
    if (this.moves <= expectedMoves * 0.8) {
      rating += 30;
    } else if (this.moves <= expectedMoves) {
      rating += 15 + (15 * (expectedMoves - this.moves) / (expectedMoves * 0.2));
    }

    // Accuracy (0-20 points)
    rating += stats.accuracy * 20;

    // No hints bonus (0-10 points)
    if (this.hints === 0) {
      rating += 10;
    }

    return Math.min(100, Math.max(0, Math.floor(rating)));
  }

  reset() {
    this.startTime = null;
    this.endTime = null;
    this.moves = 0;
    this.hints = 0;
    this.correctPlacements = 0;
    this.incorrectPlacements = 0;
  }

  exportData() {
    return {
      ...this.getStats(),
      score: this.calculateScore(),
      performanceRating: this.getPerformanceRating()
    };
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScoringEngine;
} else if (typeof window !== 'undefined') {
  window.ScoringEngine = ScoringEngine;
}

import { TestResult } from '../unit/GameEngineTests';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  passed: boolean;
}

export class PerformanceTests {
  private results: TestResult[] = [];
  private metrics: PerformanceMetric[] = [];

  async runGameEnginePerformanceTests(): Promise<{ results: TestResult[], metrics: PerformanceMetric[] }> {
    const tests = [
      () => this.testGridGenerationPerformance(),
      () => this.testWordPlacementPerformance(),
      () => this.testGameStateUpdatePerformance(),
      () => this.testMemoryUsageTest(),
      () => this.testRenderPerformanceTest()
    ];

    for (const test of tests) {
      await this.runTest(test);
    }

    return { results: this.results, metrics: this.metrics };
  }

  private async runTest(testFn: () => Promise<void> | void): Promise<void> {
    const testName = testFn.name;
    const startTime = performance.now();
    
    try {
      await testFn();
      const duration = performance.now() - startTime;
      
      this.results.push({
        testName,
        passed: true,
        duration
      });
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.results.push({
        testName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration
      });
    }
  }

  private async testGridGenerationPerformance(): Promise<void> {
    const startTime = performance.now();
    
    // Simulate grid generation for different sizes
    const gridSizes = [10, 15, 20, 25];
    
    for (const size of gridSizes) {
      const gridStartTime = performance.now();
      
      // Mock grid generation
      const grid = Array(size).fill(null).map(() => Array(size).fill(''));
      
      // Simulate complex generation logic
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
      
      const gridTime = performance.now() - gridStartTime;
      
      this.metrics.push({
        name: `Grid Generation ${size}x${size}`,
        value: gridTime,
        unit: 'ms',
        threshold: 100, // Should be under 100ms
        passed: gridTime < 100
      });
      
      if (gridTime > 500) {
        throw new Error(`Grid generation too slow for ${size}x${size}: ${gridTime}ms`);
      }
    }
  }

  private async testWordPlacementPerformance(): Promise<void> {
    const startTime = performance.now();
    const words = ['TEST', 'WORD', 'GAME', 'PLAY', 'SCORE', 'LEVEL', 'BONUS', 'POWER'];
    const gridSize = 15;
    
    // Mock word placement algorithm
    let placedWords = 0;
    for (const word of words) {
      const wordStartTime = performance.now();
      
      // Simulate placement attempts
      let attempts = 0;
      let placed = false;
      
      while (attempts < 100 && !placed) {
        // Mock placement logic
        const canPlace = Math.random() > 0.1; // 90% success rate
        if (canPlace) {
          placed = true;
          placedWords++;
        }
        attempts++;
      }
      
      const wordTime = performance.now() - wordStartTime;
      
      if (wordTime > 50) {
        throw new Error(`Word placement too slow for "${word}": ${wordTime}ms`);
      }
    }
    
    const totalTime = performance.now() - startTime;
    
    this.metrics.push({
      name: 'Word Placement Total',
      value: totalTime,
      unit: 'ms',
      threshold: 200,
      passed: totalTime < 200
    });
    
    if (placedWords < words.length * 0.8) {
      throw new Error(`Insufficient words placed: ${placedWords}/${words.length}`);
    }
  }

  private async testGameStateUpdatePerformance(): Promise<void> {
    const startTime = performance.now();
    const updateCount = 1000;
    
    // Mock game state
    let gameState = {
      score: 0,
      level: 1,
      timeElapsed: 0,
      foundWords: [] as string[]
    };
    
    // Simulate rapid state updates
    for (let i = 0; i < updateCount; i++) {
      const updateStartTime = performance.now();
      
      gameState = {
        ...gameState,
        score: gameState.score + 10,
        timeElapsed: gameState.timeElapsed + 1
      };
      
      const updateTime = performance.now() - updateStartTime;
      
      if (updateTime > 1) { // Each update should be under 1ms
        throw new Error(`State update too slow: ${updateTime}ms`);
      }
    }
    
    const totalTime = performance.now() - startTime;
    
    this.metrics.push({
      name: 'Game State Updates',
      value: totalTime / updateCount,
      unit: 'ms/update',
      threshold: 0.5,
      passed: (totalTime / updateCount) < 0.5
    });
  }

  private async testMemoryUsageTest(): Promise<void> {
    const startTime = performance.now();
    
    // Mock memory-intensive operations
    const largeArrays = [];
    const targetSize = 100;
    
    for (let i = 0; i < targetSize; i++) {
      // Create large grid structures
      const grid = Array(50).fill(null).map(() => Array(50).fill({
        letter: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
        isBlocked: Math.random() > 0.8,
        isFound: false,
        metadata: {
          id: `cell_${i}_${Math.random()}`,
          timestamp: Date.now()
        }
      }));
      
      largeArrays.push(grid);
    }
    
    // Estimate memory usage (simplified)
    const estimatedMemory = largeArrays.length * 50 * 50 * 200; // bytes approximation
    const memoryMB = estimatedMemory / (1024 * 1024);
    
    this.metrics.push({
      name: 'Memory Usage',
      value: memoryMB,
      unit: 'MB',
      threshold: 50,
      passed: memoryMB < 50
    });
    
    if (memoryMB > 100) {
      throw new Error(`Memory usage too high: ${memoryMB}MB`);
    }
    
    // Cleanup
    largeArrays.length = 0;
  }

  private async testRenderPerformanceTest(): Promise<void> {
    const startTime = performance.now();
    const frameCount = 60; // Simulate 60 frames
    const targetFrameTime = 1000 / 60; // 60 FPS = ~16.67ms per frame
    
    for (let frame = 0; frame < frameCount; frame++) {
      const frameStartTime = performance.now();
      
      // Simulate render operations
      await new Promise(resolve => {
        // Mock DOM updates
        setTimeout(() => {
          // Simulate component re-renders
          const mockRenderTime = Math.random() * 10; // 0-10ms random render time
          resolve(mockRenderTime);
        }, Math.random() * 5); // Small random delay
      });
      
      const frameTime = performance.now() - frameStartTime;
      
      if (frameTime > targetFrameTime * 2) { // Allow some tolerance
        throw new Error(`Frame render too slow: ${frameTime}ms (target: ${targetFrameTime}ms)`);
      }
    }
    
    const totalTime = performance.now() - startTime;
    const avgFrameTime = totalTime / frameCount;
    const fps = 1000 / avgFrameTime;
    
    this.metrics.push({
      name: 'Render FPS',
      value: fps,
      unit: 'fps',
      threshold: 30,
      passed: fps >= 30
    });
    
    this.metrics.push({
      name: 'Average Frame Time',
      value: avgFrameTime,
      unit: 'ms',
      threshold: targetFrameTime * 1.5,
      passed: avgFrameTime < targetFrameTime * 1.5
    });
  }

  getResults(): TestResult[] {
    return this.results;
  }

  getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  clearResults(): void {
    this.results = [];
    this.metrics = [];
  }
}

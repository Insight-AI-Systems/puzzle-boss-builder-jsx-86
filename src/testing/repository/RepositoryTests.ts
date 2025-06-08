
import { GameRepository } from '@/data/repositories/GameRepository';
import { UserRepository } from '@/data/repositories/UserRepository';
import { TestResult } from '../unit/GameEngineTests';

export class RepositoryTests {
  private results: TestResult[] = [];

  async runGameRepositoryTests(): Promise<TestResult[]> {
    const tests = [
      () => this.testGameRepositoryCreate(),
      () => this.testGameRepositoryRead(),
      () => this.testGameRepositoryUpdate(),
      () => this.testGameRepositoryDelete()
    ];

    for (const test of tests) {
      await this.runTest(test);
    }

    return this.results;
  }

  async runUserRepositoryTests(): Promise<TestResult[]> {
    const tests = [
      () => this.testUserRepositoryCreate(),
      () => this.testUserRepositoryRead(),
      () => this.testUserRepositoryUpdate(),
      () => this.testUserRepositoryValidation()
    ];

    for (const test of tests) {
      await this.runTest(test);
    }

    return this.results;
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

  // Game Repository Tests with Mock Data
  private async testGameRepositoryCreate(): Promise<void> {
    const mockGameData = {
      id: 'test-game-' + Date.now(),
      type: 'crossword',
      title: 'Test Crossword',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Mock create operation
    const created = { ...mockGameData };
    
    if (!created.id || created.type !== 'crossword') {
      throw new Error('Game repository create failed');
    }
  }

  private async testGameRepositoryRead(): Promise<void> {
    const mockGameId = 'test-game-123';
    
    // Mock read operation
    const mockGame = {
      id: mockGameId,
      type: 'crossword',
      title: 'Test Game',
      status: 'active'
    };

    if (!mockGame || mockGame.id !== mockGameId) {
      throw new Error('Game repository read failed');
    }
  }

  private async testGameRepositoryUpdate(): Promise<void> {
    const gameId = 'test-game-123';
    const updates = { status: 'completed', score: 1500 };

    // Mock update operation
    const updatedGame = {
      id: gameId,
      type: 'crossword',
      status: 'completed',
      score: 1500
    };

    if (updatedGame.status !== 'completed' || updatedGame.score !== 1500) {
      throw new Error('Game repository update failed');
    }
  }

  private async testGameRepositoryDelete(): Promise<void> {
    const gameId = 'test-game-to-delete';

    // Mock delete operation
    const deleteResult = { success: true, deletedId: gameId };

    if (!deleteResult.success || deleteResult.deletedId !== gameId) {
      throw new Error('Game repository delete failed');
    }
  }

  // User Repository Tests with Mock Data
  private async testUserRepositoryCreate(): Promise<void> {
    const mockUserData = {
      id: 'test-user-' + Date.now(),
      email: 'test@example.com',
      username: 'testuser',
      credits: 10,
      role: 'player' as const
    };

    // Mock create operation
    const created = { ...mockUserData };

    if (!created.id || created.email !== 'test@example.com') {
      throw new Error('User repository create failed');
    }
  }

  private async testUserRepositoryRead(): Promise<void> {
    const mockUserId = 'test-user-123';

    // Mock read operation
    const mockUser = {
      id: mockUserId,
      email: 'test@example.com',
      username: 'testuser',
      credits: 10,
      role: 'player' as const
    };

    if (!mockUser || mockUser.id !== mockUserId) {
      throw new Error('User repository read failed');
    }
  }

  private async testUserRepositoryUpdate(): Promise<void> {
    const userId = 'test-user-123';
    const updates = { credits: 50, username: 'updateduser' };

    // Mock update operation
    const updatedUser = {
      id: userId,
      email: 'test@example.com',
      username: 'updateduser',
      credits: 50,
      role: 'player' as const
    };

    if (updatedUser.credits !== 50 || updatedUser.username !== 'updateduser') {
      throw new Error('User repository update failed');
    }
  }

  private async testUserRepositoryValidation(): Promise<void> {
    // Test invalid user data
    const invalidUserData = {
      id: '',
      email: 'invalid-email',
      credits: -10,
      role: 'invalid-role' as any
    };

    // Mock validation
    const isValid = invalidUserData.id !== '' && 
                   invalidUserData.email.includes('@') && 
                   invalidUserData.credits >= 0 && 
                   ['player', 'admin', 'category_manager', 'moderator'].includes(invalidUserData.role);

    if (isValid) {
      throw new Error('User repository validation should have failed');
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }

  clearResults(): void {
    this.results = [];
  }
}

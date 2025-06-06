
/**
 * Continuous Testing Loop - Main entry point (now using coordinated components)
 */

import { TestingCoordinator, ComprehensiveTestResult } from './TestingCoordinator';

// Export types for backward compatibility
export type { ComprehensiveTestResult };

// Re-export FixResult for backward compatibility
export interface FixResult {
  success: boolean;
  errorId: string;
  fixDescription: string;
  rollbackReason?: string;
  compilationStatus: 'passed' | 'failed';
}

export class ContinuousTestingLoop {
  private coordinator: TestingCoordinator;
  
  constructor() {
    this.coordinator = new TestingCoordinator();
  }

  async runComprehensiveBugFix(): Promise<ComprehensiveTestResult> {
    return await this.coordinator.runComprehensiveTest();
  }
}

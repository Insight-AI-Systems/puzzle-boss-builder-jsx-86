
/**
 * Unified Testing System - Single entry point for all testing functionality
 */

import { TestManager } from '../managers/TestManager';
import { TestSummary, VerificationResult, TestResult, ProjectTest } from './types/testTypes';
import { TEST_RESULTS } from './constants/testResults';
import { testingLog, DebugLevel } from '../debug';

export class UnifiedTestingSystem {
  private static instance: UnifiedTestingSystem;
  private testManager: TestManager;
  private isRunning = false;

  private constructor() {
    this.testManager = new TestManager();
    testingLog('UnifiedTestingSystem', 'Initialized unified testing system', DebugLevel.INFO);
  }

  static getInstance(): UnifiedTestingSystem {
    if (!UnifiedTestingSystem.instance) {
      UnifiedTestingSystem.instance = new UnifiedTestingSystem();
    }
    return UnifiedTestingSystem.instance;
  }

  async runAllTests(): Promise<TestSummary> {
    if (this.isRunning) {
      testingLog('UnifiedTestingSystem', 'Tests already running, skipping', DebugLevel.WARN);
      return this.getEmptyTestSummary();
    }

    this.isRunning = true;
    testingLog('UnifiedTestingSystem', 'Starting comprehensive test run', DebugLevel.INFO);

    try {
      const summary = await this.testManager.runAllTests();
      testingLog('UnifiedTestingSystem', `Test run completed: ${summary.passedTests}/${summary.totalTests} passed`, DebugLevel.INFO);
      return summary;
    } catch (error) {
      testingLog('UnifiedTestingSystem', 'Test run failed', DebugLevel.ERROR, error);
      return this.getErrorTestSummary();
    } finally {
      this.isRunning = false;
    }
  }

  async runTestSuite(suiteId: string): Promise<TestSummary> {
    testingLog('UnifiedTestingSystem', `Running test suite: ${suiteId}`, DebugLevel.INFO);
    return await this.testManager.runTestSuite(suiteId);
  }

  async verifyChange(changeId: string, description: string): Promise<VerificationResult> {
    testingLog('UnifiedTestingSystem', `Verifying change: ${changeId}`, DebugLevel.INFO);

    const summary = await this.runAllTests();
    
    let status: TestResult;
    let message: string;

    if (summary.status === TEST_RESULTS.VERIFIED) {
      status = TEST_RESULTS.VERIFIED;
      message = `All ${summary.totalTests} tests passed`;
    } else if (summary.status === TEST_RESULTS.PARTIAL) {
      status = TEST_RESULTS.PARTIAL;
      message = `${summary.passedTests} of ${summary.totalTests} tests passed`;
    } else {
      status = TEST_RESULTS.FAILED;
      message = `Testing failed: ${summary.failedTests} failures`;
    }

    return {
      status,
      message,
      changeId,
      description,
      details: {
        summary,
        reports: this.testManager.getAllTestReports()
      }
    };
  }

  addTest(test: ProjectTest): void {
    this.testManager.addTest(test);
    testingLog('UnifiedTestingSystem', `Added test: ${test.name}`, DebugLevel.DEBUG);
  }

  getTestSummary(): TestSummary {
    return this.testManager.summarizeResults();
  }

  isTestRunning(): boolean {
    return this.isRunning;
  }

  private getEmptyTestSummary(): TestSummary {
    return {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      timestamp: new Date(),
      status: TEST_RESULTS.SKIPPED
    };
  }

  private getErrorTestSummary(): TestSummary {
    return {
      totalTests: 1,
      passedTests: 0,
      failedTests: 1,
      duration: 0,
      timestamp: new Date(),
      status: TEST_RESULTS.FAILED
    };
  }
}

// Export singleton instance
export const unifiedTestingSystem = UnifiedTestingSystem.getInstance();

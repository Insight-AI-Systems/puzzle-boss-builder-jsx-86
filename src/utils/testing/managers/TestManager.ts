
import { TestReport, VerificationResult } from '../types/testTypes';

/**
 * TestManager singleton class
 * Manages all test-related operations
 */
export class TestManager {
  private static instance: TestManager;
  private testReports: TestReport[] = [];
  private listeners: ((report: TestReport) => void)[] = [];
  private maxReports = 50;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get singleton instance of TestManager
   */
  public static getInstance(): TestManager {
    if (!TestManager.instance) {
      TestManager.instance = new TestManager();
    }
    return TestManager.instance;
  }

  /**
   * Run tests for a given task
   * @param taskId The ID of the task to run tests for
   * @returns Promise that resolves to the test results
   */
  public async runTaskTests(taskId: string): Promise<boolean> {
    console.log(`Running tests for task: ${taskId}`);
    return true; // Placeholder implementation
  }

  /**
   * Add a new test to the manager
   * @param test The test to add
   */
  public addTest(test: any): void {
    console.log(`Added test: ${test.id || 'unknown'}`);
  }

  /**
   * Get all registered tests
   */
  public getAllTests(): any[] {
    return []; // Placeholder implementation
  }

  /**
   * Record a test report
   * @param report The test report to record
   */
  public recordReport(report: TestReport): void {
    // Add to front of array
    this.testReports.unshift(report);
    
    // Limit the number of stored reports
    if (this.testReports.length > this.maxReports) {
      this.testReports = this.testReports.slice(0, this.maxReports);
    }
    
    // Notify listeners
    this.listeners.forEach(listener => listener(report));
  }

  /**
   * Subscribe to test report events
   * @param listener The listener function to call when a report is added
   * @returns Function to unsubscribe
   */
  public subscribe(listener: (report: TestReport) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Get all recorded test reports
   */
  public getReports(): TestReport[] {
    return [...this.testReports];
  }

  /**
   * Verify a change has been implemented correctly
   * @param description Description of the change
   * @param checkFn Function that returns true if the change passes validation
   */
  public verifyChange(description: string, checkFn: () => boolean): VerificationResult {
    try {
      const success = checkFn();
      return {
        description,
        success,
        error: success ? null : 'Verification failed'
      };
    } catch (e) {
      return {
        description,
        success: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
  }

  /**
   * Clear all test reports
   */
  public clearReports(): void {
    this.testReports = [];
  }
}

// Export the singleton instance
export default TestManager.getInstance();

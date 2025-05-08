
import { TestReport } from '@/utils/testing/types/testTypes';

/**
 * Manages test runs and reporting
 */
export class TestManager {
  private static instance: TestManager;
  private listeners: ((report: TestReport) => void)[] = [];
  private testReports: TestReport[] = [];
  private maxReports = 50;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TestManager {
    if (!TestManager.instance) {
      TestManager.instance = new TestManager();
    }
    return TestManager.instance;
  }

  /**
   * Record a successful test run
   */
  public recordSuccess(testData: {
    id: string;
    testId: string;
    name: string;
    testName: string;
    results: boolean[];
    duration: number;
    details: Record<string, any>;
  }): void {
    // Generate counts based on results array
    const totalTests = testData.results.length;
    const passedTests = testData.results.filter(r => r === true).length;
    
    // Create a standardized report
    const report: TestReport = {
      id: testData.id,
      testId: testData.testId,
      name: testData.name,
      testName: testData.testName,
      success: true,
      result: true,
      passedTests: passedTests,
      totalTests: totalTests,
      status: "VERIFIED",
      results: testData.results,
      duration: testData.duration,
      timestamp: Date.now(),
      details: testData.details,
      taskResults: {} // Initialize empty taskResults
    };

    this.addReport(report);
  }

  /**
   * Record a failed test run
   */
  public recordFailure(testData: {
    id: string;
    testId: string;
    name: string;
    testName: string;
    results: boolean[];
    duration: number;
    error: string;
    details: Record<string, any>;
  }): void {
    // Generate counts based on results array
    const totalTests = testData.results.length;
    const passedTests = testData.results.filter(r => r === true).length;
    
    // Create a standardized report
    const report: TestReport = {
      id: testData.id,
      testId: testData.testId,
      name: testData.name,
      testName: testData.testName,
      success: false,
      result: false,
      passedTests: passedTests,
      totalTests: totalTests,
      status: "FAILED",
      results: testData.results,
      duration: testData.duration,
      timestamp: Date.now(),
      error: testData.error,
      details: testData.details,
      failureReason: testData.error,
      taskResults: {} // Initialize empty taskResults
    };

    this.addReport(report);
  }

  /**
   * Add a report and notify listeners
   */
  private addReport(report: TestReport): void {
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
   * Subscribe to test reports
   */
  public subscribe(listener: (report: TestReport) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Get all test reports
   */
  public getReports(): TestReport[] {
    return [...this.testReports];
  }

  /**
   * Clear all test reports
   */
  public clearReports(): void {
    this.testReports = [];
  }

  /**
   * Add additional methods needed for compatibility
   */
  public runTests(testIds: string[]): Promise<boolean> {
    // Mock implementation for compatibility
    console.log(`Running tests: ${testIds.join(', ')}`);
    return Promise.resolve(true);
  }

  public addTest(test: any): void {
    // Mock implementation for compatibility
    console.log(`Added test: ${test.name || 'unknown'}`);
  }

  public getAllTests(): any[] {
    // Mock implementation for compatibility
    return [];
  }

  public summarizeResults(): { passedTests: number, totalTests: number, failedTests: number } {
    const totalTests = this.testReports.reduce((sum, report) => sum + report.totalTests, 0);
    const passedTests = this.testReports.reduce((sum, report) => sum + report.passedTests, 0);
    
    return {
      passedTests,
      totalTests,
      failedTests: totalTests - passedTests
    };
  }
}

// Export the singleton instance
export const TestManagerInstance = TestManager.getInstance();

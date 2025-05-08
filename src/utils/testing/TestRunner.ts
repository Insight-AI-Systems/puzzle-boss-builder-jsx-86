
import { TestReport, TestSummary, TestSuite, TestCategory, VerificationResult } from './types/testTypes';

/**
 * Test runner for executing different types of tests
 */
export class TestRunner {
  private tests: Record<string, any> = {};
  private results: Record<string, TestReport> = {};
  
  /**
   * Add a test to the test runner
   * 
   * @param testId Unique identifier for the test
   * @param testFn Function that performs the test
   * @param metadata Optional metadata for the test
   */
  addTest(testId: string, testFn: () => Promise<boolean>, metadata: Record<string, any> = {}) {
    this.tests[testId] = {
      id: testId,
      run: testFn,
      metadata
    };
  }
  
  /**
   * Run a specific test by ID
   * 
   * @param testId ID of the test to run
   * @returns Result of the test
   */
  async runTest(testId: string): Promise<boolean> {
    if (!this.tests[testId]) {
      console.error(`Test ${testId} not found`);
      return false;
    }
    
    const test = this.tests[testId];
    const startTime = Date.now();
    
    try {
      const result = await test.run();
      const endTime = Date.now();
      
      this.results[testId] = {
        id: testId,
        testId: testId, // For backward compatibility
        name: test.metadata.name || testId,
        testName: test.metadata.name || testId, // For backward compatibility
        status: result ? 'VERIFIED' : 'FAILED',
        results: [result],
        result: result, // For backward compatibility
        success: result, // For backward compatibility
        timestamp: Date.now(),
        duration: endTime - startTime,
        metadata: test.metadata
      };
      
      return result;
    } catch (error) {
      this.results[testId] = {
        id: testId,
        testId: testId,
        name: test.metadata.name || testId,
        testName: test.metadata.name || testId,
        status: 'FAILED',
        results: [false],
        result: false, // For backward compatibility
        success: false, // For backward compatibility
        timestamp: Date.now(),
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };
      
      return false;
    }
  }
  
  /**
   * Run all registered tests
   * 
   * @returns Summary of test results
   */
  async runAllTests(): Promise<TestSummary> {
    const startTime = Date.now();
    const testIds = Object.keys(this.tests);
    
    await Promise.all(testIds.map(id => this.runTest(id)));
    
    return this.summarizeResults();
  }
  
  /**
   * Get a specific test result
   * 
   * @param testId ID of the test
   * @returns Test report, if available
   */
  getResult(testId: string): TestReport | undefined {
    return this.results[testId];
  }
  
  /**
   * Get all test results
   * 
   * @returns Array of test reports
   */
  getAllResults(): TestReport[] {
    return Object.values(this.results);
  }
  
  /**
   * Summarize all test results
   * 
   * @returns Test summary
   */
  summarizeResults(): TestSummary {
    const results = Object.values(this.results);
    const total = results.length;
    const passed = results.filter(r => r.status === 'VERIFIED' || r.success === true).length;
    const skipped = results.filter(r => r.status === 'SKIPPED').length;
    const failed = total - passed - skipped;
    
    return {
      totalTests: total,
      passedTests: passed,
      failedTests: failed,
      skippedTests: skipped,
      status: this.getOverallStatus(passed, total),
      duration: results.reduce((sum, r) => sum + r.duration, 0),
      timestamp: Date.now()
    };
  }
  
  /**
   * Get overall test status
   * 
   * @param passed Number of passed tests
   * @param total Total number of tests
   * @returns Overall status string
   */
  private getOverallStatus(passed: number, total: number): string {
    if (total === 0) return 'SKIPPED';
    if (passed === total) return 'VERIFIED';
    if (passed > 0) return 'PARTIAL';
    return 'FAILED';
  }
  
  /**
   * Create a verification result
   * 
   * @param status Status of the verification
   * @param message Message describing the result
   * @param changeId ID of the change being verified
   * @param description Description of the verification
   * @param details Optional details about the verification
   * @returns Verification result object
   */
  static createVerificationResult(
    status: 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'SKIPPED',
    message: string,
    changeId: string,
    description: string,
    details?: Record<string, any>
  ): VerificationResult {
    return {
      status,
      message,
      changeId,
      description,
      details,
      success: status === 'VERIFIED'
    };
  }
}

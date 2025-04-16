
import { ProjectTest } from '../types/projectTypes';

export class TestManager {
  private tests: Record<string, ProjectTest> = {};
  private testReports: Record<string, TestReport> = {};

  // Test report types
  public static readonly RESULT_VERIFIED = 'VERIFIED';
  public static readonly RESULT_PARTIAL = 'PARTIAL';
  public static readonly RESULT_FAILED = 'FAILED';

  addTest(test: ProjectTest) {
    this.tests[test.id] = test;
  }

  async runTest(testId: string): Promise<boolean> {
    if (!this.tests[testId]) {
      console.error(`Test ${testId} not found`);
      return false;
    }
    
    const test = this.tests[testId];
    console.log(`Running test: ${test.name}`);
    
    try {
      const startTime = Date.now();
      const result = await test.run();
      const endTime = Date.now();
      
      test.lastRun = new Date();
      test.lastResult = result;
      
      // Store test report
      this.testReports[testId] = {
        testId,
        testName: test.name,
        result,
        duration: endTime - startTime,
        timestamp: new Date(),
        details: test.details || {}
      };
      
      return result;
    } catch (error) {
      console.error(`Test ${testId} failed with error:`, error);
      test.lastRun = new Date();
      test.lastResult = false;
      
      // Store error report
      this.testReports[testId] = {
        testId,
        testName: test.name,
        result: false,
        duration: 0,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : String(error),
        details: test.details || {}
      };
      
      return false;
    }
  }

  async runTests(testIds: string[]): Promise<boolean> {
    if (!testIds || testIds.length === 0) {
      return true;
    }
    
    const results = await Promise.all(
      testIds.map(testId => this.runTest(testId))
    );
    
    return results.every(result => result === true);
  }

  async runAllTests(): Promise<TestSummary> {
    const allTests = this.getAllTests();
    const testIds = allTests.map(test => test.id);
    
    const startTime = Date.now();
    await Promise.all(testIds.map(testId => this.runTest(testId)));
    const endTime = Date.now();
    
    const results = Object.values(this.testReports);
    const passed = results.filter(report => report.result).length;
    
    return {
      totalTests: testIds.length,
      passedTests: passed,
      failedTests: testIds.length - passed,
      duration: endTime - startTime,
      timestamp: new Date(),
      status: passed === testIds.length 
        ? TestManager.RESULT_VERIFIED 
        : (passed > 0 ? TestManager.RESULT_PARTIAL : TestManager.RESULT_FAILED)
    };
  }

  getTestReport(testId: string): TestReport | undefined {
    return this.testReports[testId];
  }

  getAllTestReports(): TestReport[] {
    return Object.values(this.testReports);
  }

  getAllTests(): ProjectTest[] {
    return Object.values(this.tests);
  }

  clearReports(): void {
    this.testReports = {};
  }
}

export interface TestReport {
  testId: string;
  testName: string;
  result: boolean;
  duration: number;
  timestamp: Date;
  error?: string;
  details?: Record<string, any>;
}

export interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  timestamp: Date;
  status: string;
}

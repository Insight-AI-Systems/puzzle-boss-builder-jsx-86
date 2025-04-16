import { ProjectTest } from '../types/projectTypes';
import { TestReport, TestSummary, TestSuite, TestCategory } from '../testing/types/testTypes';

export class TestManager {
  private tests: Record<string, ProjectTest> = {};
  private testReports: Record<string, TestReport> = {};
  private testSuites: Record<string, TestSuite> = {};

  // Test result constants
  public static readonly RESULT_VERIFIED = 'VERIFIED';
  public static readonly RESULT_PARTIAL = 'PARTIAL';
  public static readonly RESULT_FAILED = 'FAILED';

  addTest(test: ProjectTest) {
    this.tests[test.id] = test;
  }

  addTestSuite(suite: TestSuite) {
    this.testSuites[suite.id] = suite;
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

  async runTestSuite(suiteId: string): Promise<TestSummary> {
    const suite = this.testSuites[suiteId];
    if (!suite) {
      console.error(`Test suite ${suiteId} not found`);
      return {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        duration: 0,
        timestamp: new Date(),
        status: TestManager.RESULT_FAILED
      };
    }

    const startTime = Date.now();
    const results = await Promise.all(suite.testIds.map(testId => this.runTest(testId)));
    const endTime = Date.now();

    const passed = results.filter(result => result === true).length;

    return {
      totalTests: suite.testIds.length,
      passedTests: passed,
      failedTests: suite.testIds.length - passed,
      duration: endTime - startTime,
      timestamp: new Date(),
      status: this.getTestStatus(passed, suite.testIds.length)
    };
  }

  async runTestsByCategory(category: TestCategory): Promise<TestSummary> {
    const suitesInCategory = Object.values(this.testSuites).filter(suite => suite.category === category);
    const testIds = [...new Set(suitesInCategory.flatMap(suite => suite.testIds))];
    
    const startTime = Date.now();
    await Promise.all(testIds.map(testId => this.runTest(testId)));
    const endTime = Date.now();
    
    const results = testIds.map(testId => this.testReports[testId]?.result || false);
    const passed = results.filter(result => result === true).length;
    
    return {
      totalTests: testIds.length,
      passedTests: passed,
      failedTests: testIds.length - passed,
      duration: endTime - startTime,
      timestamp: new Date(),
      status: this.getTestStatus(passed, testIds.length)
    };
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

  getTestSuite(suiteId: string): TestSuite | undefined {
    return this.testSuites[suiteId];
  }

  getTestSuitesByCategory(category: TestCategory): TestSuite[] {
    return Object.values(this.testSuites).filter(suite => suite.category === category);
  }

  getAllTestReports(): TestReport[] {
    return Object.values(this.testReports);
  }

  getAllTests(): ProjectTest[] {
    return Object.values(this.tests);
  }

  getAllTestSuites(): TestSuite[] {
    return Object.values(this.testSuites);
  }

  clearReports(): void {
    this.testReports = {};
  }

  private getTestStatus(passed: number, total: number): string {
    if (passed === total) return TestManager.RESULT_VERIFIED;
    return passed > 0 ? TestManager.RESULT_PARTIAL : TestManager.RESULT_FAILED;
  }
}


import { ProjectTest } from '../types/projectTypes';
import { TestReport, TestSummary, TestSuite, TestCategory } from '../testing/types/testTypes';
import { TEST_RESULTS } from '../testing/constants/testResults';
import { TestReportManager } from './TestReportManager';
import { TestSuiteManager } from './TestSuiteManager';

export class TestManager {
  private tests: Record<string, ProjectTest> = {};
  private reportManager: TestReportManager;
  private suiteManager: TestSuiteManager;

  constructor() {
    this.reportManager = new TestReportManager();
    this.suiteManager = new TestSuiteManager();
  }

  // Test result constants for backward compatibility
  public static readonly RESULT_VERIFIED = TEST_RESULTS.VERIFIED;
  public static readonly RESULT_PARTIAL = TEST_RESULTS.PARTIAL;
  public static readonly RESULT_FAILED = TEST_RESULTS.FAILED;

  addTest(test: ProjectTest) {
    this.tests[test.id] = test;
  }

  addTestSuite(suite: TestSuite) {
    this.suiteManager.addTestSuite(suite);
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
      
      this.reportManager.addReport({
        id: testId,
        testId: testId, // For backward compatibility
        name: test.name,
        testName: test.name, // For backward compatibility
        result: result, // For backward compatibility
        success: result, // For backward compatibility
        status: result ? TEST_RESULTS.VERIFIED : TEST_RESULTS.FAILED,
        results: [result],
        duration: endTime - startTime,
        timestamp: Date.now(),
        details: test.details || {}
      });
      
      return result;
    } catch (error) {
      console.error(`Test ${testId} failed with error:`, error);
      test.lastRun = new Date();
      test.lastResult = false;
      
      this.reportManager.addReport({
        id: testId,
        testId: testId, // For backward compatibility
        testName: test.name,
        name: test.name,
        result: false, // For backward compatibility
        success: false, // For backward compatibility
        status: TEST_RESULTS.FAILED,
        results: [false],
        duration: 0,
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : String(error),
        details: test.details || {}
      });
      
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
    
    return this.summarizeResults();
  }

  async runTestSuite(suiteId: string): Promise<TestSummary> {
    const suite = this.suiteManager.getTestSuite(suiteId);
    if (!suite) {
      console.error(`Test suite ${suiteId} not found`);
      return {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0,
        duration: 0,
        timestamp: Date.now(), // Add timestamp to fix the build error
        status: TestManager.RESULT_FAILED
      };
    }

    const startTime = Date.now();
    // Use tests array if available, otherwise use testIds for backward compatibility
    const testsToRun = suite.tests?.map(test => test.id || test) || suite.testIds || [];
    await this.runTests(testsToRun);
    const endTime = Date.now();

    return this.summarizeResults();
  }

  // Delegate to managers
  getTestReport = (testId: string) => this.reportManager.getReport(testId);
  getTestSuite = (suiteId: string) => this.suiteManager.getTestSuite(suiteId);
  getTestSuitesByCategory = (category: TestCategory) => this.suiteManager.getTestSuitesByCategory(category);
  getAllTestReports = () => this.reportManager.getAllReports();
  getAllTests = () => Object.values(this.tests);
  getAllTestSuites = () => this.suiteManager.getAllTestSuites();
  clearReports = () => this.reportManager.clearReports();
  summarizeResults = () => this.reportManager.summarizeResults();
}

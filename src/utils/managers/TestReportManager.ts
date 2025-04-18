
import { TestReport, TestSummary } from '../testing/types/testTypes';
import { TestResult } from '../testing/constants/testResults';
import { TEST_RESULTS } from '../testing/constants/testResults';

export class TestReportManager {
  private testReports: Record<string, TestReport> = {};

  addReport(report: TestReport) {
    this.testReports[report.testId] = report;
  }

  getReport(testId: string): TestReport | undefined {
    return this.testReports[testId];
  }

  getAllReports(): TestReport[] {
    return Object.values(this.testReports);
  }

  clearReports(): void {
    this.testReports = {};
  }

  summarizeResults(): TestSummary {
    const results = Object.values(this.testReports);
    const passed = results.filter(report => report.result).length;
    const total = results.length;
    
    return {
      totalTests: total,
      passedTests: passed,
      failedTests: total - passed,
      duration: results.reduce((sum, report) => sum + report.duration, 0),
      timestamp: new Date(),
      status: this.getTestStatus(passed, total)
    };
  }

  private getTestStatus(passed: number, total: number): TestResult {
    if (passed === total) return TEST_RESULTS.VERIFIED;
    return passed > 0 ? TEST_RESULTS.PARTIAL : TEST_RESULTS.FAILED;
  }
}

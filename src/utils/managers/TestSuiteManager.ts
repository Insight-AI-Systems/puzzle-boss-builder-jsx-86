
import { TestSuite, TestCategory } from '../testing/types/testTypes';

export class TestSuiteManager {
  private testSuites: Record<string, TestSuite> = {};

  addTestSuite(suite: TestSuite) {
    this.testSuites[suite.id] = suite;
  }

  getTestSuite(suiteId: string): TestSuite | undefined {
    return this.testSuites[suiteId];
  }

  getAllTestSuites(): TestSuite[] {
    return Object.values(this.testSuites);
  }

  getTestSuitesByCategory(category: TestCategory): TestSuite[] {
    return Object.values(this.testSuites).filter(suite => suite.category === category);
  }
}

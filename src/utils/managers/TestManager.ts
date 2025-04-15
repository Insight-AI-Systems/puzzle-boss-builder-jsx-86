
import { ProjectTest } from '../types/projectTypes';

export class TestManager {
  private tests: Record<string, ProjectTest> = {};

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
      const result = await test.run();
      test.lastRun = new Date();
      test.lastResult = result;
      return result;
    } catch (error) {
      console.error(`Test ${testId} failed with error:`, error);
      test.lastRun = new Date();
      test.lastResult = false;
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

  getAllTests(): ProjectTest[] {
    return Object.values(this.tests);
  }
}

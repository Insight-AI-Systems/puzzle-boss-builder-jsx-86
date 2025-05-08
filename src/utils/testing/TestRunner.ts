
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Test Runner
 * Utility for running tests and verification
 */
export class TestRunner {
  private static tasks: Record<string, () => boolean> = {};
  
  /**
   * Register a new test task
   */
  public static registerTask(name: string, testFn: () => boolean): void {
    this.tasks[name] = testFn;
  }
  
  /**
   * Run a specific test by name
   */
  public static runTest(name: string): boolean {
    if (!this.tasks[name]) {
      debugLog('TestRunner', `Test "${name}" not found`, DebugLevel.ERROR);
      return false;
    }
    
    try {
      const result = this.tasks[name]();
      debugLog('TestRunner', `Test "${name}" ${result ? 'passed' : 'failed'}`, result ? DebugLevel.INFO : DebugLevel.ERROR);
      return result;
    } catch (error) {
      debugLog('TestRunner', `Test "${name}" threw an exception: ${error}`, DebugLevel.ERROR);
      return false;
    }
  }
  
  /**
   * Run all registered tests
   */
  public static runAllTests(): Record<string, boolean> {
    const results: Record<string, boolean> = {};
    
    for (const name in this.tasks) {
      results[name] = this.runTest(name);
    }
    
    return results;
  }
  
  /**
   * Run all task tests
   */
  public static runAllTaskTests(): Record<string, boolean> {
    const taskTests = Object.keys(this.tasks).filter(name => name.startsWith('task:'));
    const results: Record<string, boolean> = {};
    
    for (const name of taskTests) {
      results[name] = this.runTest(name);
    }
    
    return results;
  }
  
  /**
   * Verify that a change was correctly implemented
   */
  public static verifyChange(changeName: string, options?: any): boolean {
    const testName = `change:${changeName}`;
    if (!this.tasks[testName]) {
      debugLog('TestRunner', `No verification for "${changeName}" exists`, DebugLevel.WARN);
      return false;
    }
    
    return this.runTest(testName);
  }
}

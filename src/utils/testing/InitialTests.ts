
/**
 * Initial Tests - Simplified initial test runner
 */

import { unifiedTestingSystem } from './UnifiedTestingSystem';
import { testingLog, DebugLevel } from '../debug';

export const runInitialTests = async (): Promise<boolean> => {
  if (process.env.NODE_ENV !== 'development') {
    return true;
  }

  testingLog('InitialTests', 'Running initial test suite', DebugLevel.INFO);

  try {
    const summary = await unifiedTestingSystem.runAllTests();
    
    if (summary.totalTests === 0) {
      testingLog('InitialTests', 'No tests configured', DebugLevel.INFO);
      return true;
    }

    const success = summary.passedTests === summary.totalTests;
    testingLog('InitialTests', `Initial tests ${success ? 'passed' : 'failed'}: ${summary.passedTests}/${summary.totalTests}`, 
      success ? DebugLevel.INFO : DebugLevel.WARN);
    
    return success;
  } catch (error) {
    testingLog('InitialTests', 'Initial tests crashed', DebugLevel.ERROR, error);
    return false;
  }
};

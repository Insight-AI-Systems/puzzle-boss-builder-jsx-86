
/**
 * Simplified Test Runner - Now delegates to UnifiedTestingSystem
 */

import { unifiedTestingSystem } from './UnifiedTestingSystem';
import { VerificationResult, TestSummary } from './types/testTypes';
import { testingLog, DebugLevel } from '../debug';

export class TestRunner {
  private static verificationEnabled = true;
  private static environment = process.env.NODE_ENV || 'development';
  
  static setEnvironment(env: 'development' | 'test' | 'production'): void {
    TestRunner.environment = env;
    testingLog('TestRunner', `Environment set to: ${env}`, DebugLevel.INFO);
    
    if (env === 'production') {
      TestRunner.verificationEnabled = false;
    }
  }
  
  static enableVerification(enable: boolean): void {
    TestRunner.verificationEnabled = enable;
    testingLog('TestRunner', `Verification ${enable ? 'enabled' : 'disabled'}`, DebugLevel.INFO);
  }
  
  static isVerificationEnabled(): boolean {
    return TestRunner.verificationEnabled;
  }
  
  static getEnvironment(): string {
    return TestRunner.environment;
  }
  
  static async runAllTests(): Promise<TestSummary> {
    return await unifiedTestingSystem.runAllTests();
  }
  
  static async verifyChange(changeId: string, description: string): Promise<VerificationResult> {
    if (!TestRunner.verificationEnabled) {
      testingLog('TestRunner', 'Verification disabled, skipping', DebugLevel.INFO);
      return {
        status: 'SKIPPED',
        message: 'Verification is disabled',
        changeId,
        description
      };
    }
    
    return await unifiedTestingSystem.verifyChange(changeId, description);
  }

  static async runTestSuite(suiteId: string): Promise<TestSummary> {
    return await unifiedTestingSystem.runTestSuite(suiteId);
  }
}

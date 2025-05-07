
import { TestManager } from '../managers/TestManager';
import { projectTracker } from '@/utils/ProjectTracker';
import { toast } from '@/hooks/use-toast';
import { VerificationResult } from './types/testTypes';
import { DatabaseTestRunner } from './runners/DatabaseTestRunner';
import { ComponentTestRunner } from './runners/ComponentTestRunner';
import { ProgressTestRunner } from './runners/ProgressTestRunner';
import { SecurityTestRunner } from '../security/testHelpers';
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Test Runner
 * 
 * Central testing utility for running various types of tests including security tests
 * Supports different environments and can be configured to run specific test suites
 */
export class TestRunner {
  private static verificationEnabled = true;
  private static testManager = new TestManager();
  private static environment = process.env.NODE_ENV || 'development';
  private static securityTestRunner = new SecurityTestRunner();
  
  /**
   * Set the environment for the test runner
   * @param env - The environment to set
   */
  static setEnvironment(env: 'development' | 'test' | 'production'): void {
    TestRunner.environment = env;
    debugLog('TestRunner', `Test environment set to: ${env}`, DebugLevel.INFO);
    
    // In production, disable verification unless explicitly enabled
    if (env === 'production') {
      TestRunner.verificationEnabled = false;
    }
  }
  
  /**
   * Enable or disable verification
   * @param enable - Whether verification should be enabled
   */
  static enableVerification(enable: boolean): void {
    TestRunner.verificationEnabled = enable;
    debugLog('TestRunner', `Verification ${enable ? 'enabled' : 'disabled'}`, DebugLevel.INFO);
  }
  
  /**
   * Check if verification is enabled
   * @returns Boolean indicating if verification is enabled
   */
  static isVerificationEnabled(): boolean {
    return TestRunner.verificationEnabled;
  }
  
  /**
   * Get the current environment
   * @returns The current environment string
   */
  static getEnvironment(): string {
    return TestRunner.environment;
  }
  
  /**
   * Run all tests for a specific task
   * @param taskId - The task ID to run tests for
   * @returns Promise resolving to boolean indicating test success
   */
  static async runAllTaskTests(taskId: string): Promise<boolean> {
    debugLog('TestRunner', `Running all tests for task: ${taskId}`, DebugLevel.INFO);
    const result = await projectTracker.runTaskTests(taskId);
    
    if (result) {
      toast({
        title: "Tests passed",
        description: `All tests for this task have passed successfully.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Tests failed",
        description: `Some tests for this task have failed. Check the console for details.`,
      });
    }
    
    return result;
  }
  
  /**
   * Run all security tests
   * @returns Promise resolving to test results
   */
  static async runSecurityTests(): Promise<VerificationResult[]> {
    debugLog('TestRunner', 'Running security tests', DebugLevel.INFO);
    return TestRunner.securityTestRunner.runAllTests();
  }
  
  /**
   * Verify a specific change
   * @param changeId - ID of the change to verify
   * @param description - Description of the change
   * @returns Promise resolving to verification result
   */
  static async verifyChange(changeId: string, description: string): Promise<VerificationResult> {
    debugLog('TestRunner', `Verifying change: ${changeId} (${description})`, DebugLevel.INFO);
    
    if (!TestRunner.verificationEnabled) {
      debugLog('TestRunner', 'Verification disabled, skipping tests', DebugLevel.INFO);
      return {
        status: 'SKIPPED',
        message: 'Verification is disabled',
        changeId,
        description
      };
    }
    
    const dbConnected = await DatabaseTestRunner.testDatabaseConnection();
    if (!dbConnected) {
      return {
        status: 'FAILED',
        message: 'Database connection failed',
        changeId,
        description,
        details: {
          dbConnectionError: true
        }
      };
    }
    
    const summary = await TestRunner.testManager.runAllTests();
    
    let status: 'VERIFIED' | 'PARTIAL' | 'FAILED';
    let message: string;
    
    if (summary.status === TestManager.RESULT_VERIFIED) {
      status = 'VERIFIED';
      message = `All ${summary.totalTests} tests passed`;
    } else if (summary.status === TestManager.RESULT_PARTIAL) {
      status = 'PARTIAL';
      message = `${summary.passedTests} of ${summary.totalTests} tests passed`;
    } else {
      status = 'FAILED';
      message = `All ${summary.totalTests} tests failed`;
    }
    
    return {
      status,
      message,
      changeId,
      description,
      details: {
        summary,
        reports: TestRunner.testManager.getAllTestReports()
      }
    };
  }

  // Re-export static methods from other test runners for convenience
  static readonly testDatabaseConnection = DatabaseTestRunner.testDatabaseConnection;
  static readonly testAuthStatus = DatabaseTestRunner.testAuthStatus;
  static readonly testComponentRender = ComponentTestRunner.testComponentRender;
  static readonly testProgressItemOrder = ProgressTestRunner.testProgressItemOrder;
  static readonly validateSecurityImplementation = SecurityTestRunner.validateSecurityImplementation;
}

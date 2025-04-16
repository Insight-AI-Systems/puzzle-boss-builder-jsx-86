
import { projectTracker } from './ProjectTracker';
import { toast } from '@/hooks/use-toast';
import { TestManager } from './managers/TestManager';
import { VerificationResult } from './testing/types/testTypes';
import { DatabaseTestRunner } from './testing/runners/DatabaseTestRunner';
import { ComponentTestRunner } from './testing/runners/ComponentTestRunner';
import { ProgressTestRunner } from './testing/runners/ProgressTestRunner';

export class TestRunner {
  private static verificationEnabled = true;
  private static testManager = new TestManager();
  
  static enableVerification(enable: boolean): void {
    TestRunner.verificationEnabled = enable;
  }
  
  static isVerificationEnabled(): boolean {
    return TestRunner.verificationEnabled;
  }
  
  static async runAllTaskTests(taskId: string): Promise<boolean> {
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
  
  static async verifyChange(changeId: string, description: string): Promise<VerificationResult> {
    console.log(`Verifying change: ${changeId} (${description})`);
    
    if (!TestRunner.verificationEnabled) {
      console.log('Verification disabled, skipping tests');
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
}

export const runInitialTests = async () => {
  if (typeof window !== 'undefined') {
    console.log('Running initial environment tests...');
    
    const dbConnectionOk = await DatabaseTestRunner.testDatabaseConnection();
    console.log('Database connection:', dbConnectionOk ? 'OK' : 'Failed');
    
    const authStatusOk = await DatabaseTestRunner.testAuthStatus();
    console.log('Auth system:', authStatusOk ? 'OK' : 'Failed');
  }
};

export type { VerificationResult } from './testing/types/testTypes';

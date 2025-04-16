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
  console.info('Running initial environment tests...');
  
  // Test database connection
  const dbConnected = await DatabaseTestRunner.testDatabaseConnection();
  console.info(`Database connection: ${dbConnected ? 'OK' : 'FAILED'}`);
  
  // Test auth status
  const authOk = await DatabaseTestRunner.testAuthStatus();
  console.info(`Auth system: ${authOk ? 'OK' : 'FAILED'}`);
  
  // Create a demo admin account if it doesn't exist
  await createDemoAdminAccount();
}

const createDemoAdminAccount = async () => {
  try {
    // First check if the demo admin account exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', 'admin')
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking for demo admin account:', checkError);
      return;
    }
    
    // If the account already exists, do nothing
    if (existingUser) {
      console.info('Demo admin account already exists');
      return;
    }
    
    // Create the admin user
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@puzzleboss.com',
      password: 'Puzzle123!',
      options: {
        data: {
          username: 'admin',
          role: 'super_admin'
        }
      }
    });
    
    if (signUpError) {
      console.error('Error creating demo admin account:', signUpError);
      return;
    }
    
    console.info('Demo admin account created successfully');
    
    // Update the profile if needed
    if (userData?.user?.id) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'super_admin' })
        .eq('id', userData.user.id);
      
      if (updateError) {
        console.error('Error updating demo admin profile:', updateError);
      }
    }
  } catch (err) {
    console.error('Unexpected error creating demo admin:', err);
  }
}

export type { VerificationResult } from './testing/types/testTypes';

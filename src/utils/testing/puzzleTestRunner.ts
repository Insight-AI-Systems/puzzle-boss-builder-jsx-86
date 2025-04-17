
import { TestManager } from '../managers/TestManager';
import { testPieceInteractions } from './puzzleTests/pieceInteractionTests';
import { testPuzzleComponents } from './puzzleTests/componentTests';
import { testSavedPuzzles } from './puzzleTests/savedPuzzlesTests';
import { testSimplePuzzle } from './puzzleTests/simplePuzzleTests';
import { testPuzzleIntegration } from './puzzleTests/integrationTests';
import { projectTracker } from '@/utils/ProjectTracker';
import { toast } from '@/hooks/use-toast';
import { VerificationResult } from './types/testTypes';
import { runComponentTests } from './puzzleTests/componentTests';
import { runIntegrationTests } from './puzzleTests/integrationTests';
import { DatabaseTestRunner } from './runners/DatabaseTestRunner';
import { ComponentTestRunner } from './runners/ComponentTestRunner';
import { ProgressTestRunner } from './runners/ProgressTestRunner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Runs all puzzle-related tests
 * @returns A promise that resolves when all tests are complete
 */
export const runPuzzleTestSuite = async (): Promise<void> => {
  console.log('🧩 Running puzzle test suite...');
  
  const testManager = new TestManager();
  
  // Run component tests
  await testPuzzleComponents(testManager);
  
  // Run piece interaction tests
  await testPieceInteractions(testManager);
  
  // Run saved puzzle tests
  await testSavedPuzzles(testManager);
  
  // Run simple puzzle tests
  await testSimplePuzzle(testManager);
  
  // Run integration tests
  await testPuzzleIntegration(testManager);
  
  // Summarize test results
  const summary = testManager.summarizeResults();
  
  console.log('🧩 Puzzle test suite complete.');
  console.log(`✅ Passed: ${summary.passedTests} / ${summary.totalTests}`);
  
  if (summary.failedTests > 0) {
    console.warn(`❌ Failed: ${summary.failedTests} / ${summary.totalTests}`);
  }
  
  return Promise.resolve();
};

/**
 * Runs component test suite in development mode
 */
export const runComponentTestSuite = async (): Promise<void> => {
  console.log('🧪 Running component test suite...');
  
  // Mock for browser display only
  const componentTestResults = runComponentTests();
  const integrationTestResults = runIntegrationTests();
  
  console.log('Component tests complete:', componentTestResults);
  console.log('Integration tests complete:', integrationTestResults);
  
  return Promise.resolve();
};

export class TestRunner {
  private static verificationEnabled = true;
  private static testManager = new TestManager();
  private static environment = process.env.NODE_ENV || 'development';
  
  // Set the environment for the test runner
  static setEnvironment(env: 'development' | 'test' | 'production'): void {
    TestRunner.environment = env;
    console.info(`Test environment set to: ${env}`);
    
    // In production, disable verification unless explicitly enabled
    if (env === 'production') {
      TestRunner.verificationEnabled = false;
    }
  }
  
  static enableVerification(enable: boolean): void {
    TestRunner.verificationEnabled = enable;
  }
  
  static isVerificationEnabled(): boolean {
    return TestRunner.verificationEnabled;
  }
  
  static getEnvironment(): string {
    return TestRunner.environment;
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
  
  // Log current environment
  console.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Skip some tests in production
  if (process.env.NODE_ENV === 'production') {
    console.info('Running in production mode - skipping development tests');
    return;
  }
  
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

export type { VerificationResult } from './types/testTypes';

export default runPuzzleTestSuite;

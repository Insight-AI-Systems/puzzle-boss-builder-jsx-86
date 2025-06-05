
/**
 * Main entry point for the Comprehensive Bug-Fixing System
 */

import { ContinuousTestingLoop, ComprehensiveTestResult } from './ContinuousTestingLoop';
import { SuccessVerificationGate } from './SuccessVerificationGate';

export class ComprehensiveBugFixRunner {
  private testingLoop: ContinuousTestingLoop;

  constructor() {
    this.testingLoop = new ContinuousTestingLoop();
  }

  /**
   * Main entry point - runs until ALL issues are resolved
   */
  async runUntilPerfect(): Promise<ComprehensiveTestResult> {
    console.log('🚀 STARTING COMPREHENSIVE AUTOMATED BUG-FIXING SYSTEM');
    console.log('='.repeat(70));
    console.log('🎯 Goal: Fix ALL errors until codebase is perfect');
    console.log('🔄 Method: Continuous scan, fix, verify, repeat');
    console.log('✅ Success Criteria: Zero errors + full verification passed');
    console.log('');

    // Enable the success verification gate
    SuccessVerificationGate.enableGate();

    let attempt = 1;
    const maxAttempts = 5;
    let finalResult: ComprehensiveTestResult;

    while (attempt <= maxAttempts) {
      console.log(`\n🔄 BUG-FIXING ATTEMPT ${attempt}/${maxAttempts}`);
      console.log('─'.repeat(50));

      // Run the comprehensive bug-fixing loop
      finalResult = await this.testingLoop.runComprehensiveBugFix();

      if (finalResult.success) {
        console.log('\n🎉 PERFECT! All issues resolved!');
        
        // Final verification through the success gate
        const gateVerification = await SuccessVerificationGate.verifyBeforeSuccess(
          `Comprehensive bug-fixing completed - ${finalResult.totalIssuesFixed} issues fixed`
        );

        if (gateVerification) {
          console.log('\n✅ SUCCESS VERIFICATION GATE PASSED');
          console.log('🏆 CODEBASE IS NOW PERFECT - ALL ISSUES RESOLVED');
          return finalResult;
        } else {
          console.log('\n❌ Success verification gate blocked - continuing...');
        }
      } else {
        console.log(`\n⚠️  Attempt ${attempt} completed with ${finalResult.remainingIssues} issues remaining`);
        
        if (finalResult.remainingIssues === 0) {
          console.log('🔄 No remaining issues detected, but verification failed');
          console.log('🔍 Running additional diagnostic scans...');
        }
      }

      attempt++;
      
      if (attempt <= maxAttempts) {
        console.log(`\n⏳ Preparing for attempt ${attempt}...`);
        // Brief pause before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // If we get here, we've exhausted all attempts
    console.log('\n⚠️  MAXIMUM ATTEMPTS REACHED');
    console.log(`🎯 Final Status: ${finalResult!.totalIssuesFixed} issues fixed, ${finalResult!.remainingIssues} remaining`);
    
    if (finalResult!.remainingIssues === 0) {
      console.log('✅ All detected issues have been fixed');
      console.log('🔍 Some verification checks may still be failing');
    } else {
      console.log('❌ Some issues could not be automatically resolved');
      console.log('🛠️  Manual intervention may be required');
    }

    return finalResult!;
  }

  /**
   * Quick health check without fixing
   */
  async healthCheck(): Promise<boolean> {
    console.log('🏥 Running quick health check...');
    
    const result = await this.testingLoop.runComprehensiveBugFix();
    
    if (result.success) {
      console.log('✅ Codebase is healthy - no issues found');
    } else {
      console.log(`⚠️  Health check found ${result.remainingIssues} issues`);
    }
    
    return result.success;
  }
}

// Export a convenience function to run the system
export async function runComprehensiveBugFix(): Promise<ComprehensiveTestResult> {
  const runner = new ComprehensiveBugFixRunner();
  return await runner.runUntilPerfect();
}

// Export a convenience function for health checks
export async function checkCodebaseHealth(): Promise<boolean> {
  const runner = new ComprehensiveBugFixRunner();
  return await runner.healthCheck();
}

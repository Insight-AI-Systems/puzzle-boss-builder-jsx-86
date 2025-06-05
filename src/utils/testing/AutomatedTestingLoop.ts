
/**
 * Automated Testing Loop - Keeps testing until all errors resolved
 */

import { BuildVerificationSystem, VerificationResult } from './BuildVerificationSystem';

export interface TestingLoopResult {
  success: boolean;
  attempts: number;
  finalErrors: string[];
  totalTime: number;
}

export class AutomatedTestingLoop {
  private static readonly MAX_ATTEMPTS = 10;
  private static readonly RETRY_DELAY_MS = 1000;

  static async runUntilSuccess(changeDescription: string): Promise<TestingLoopResult> {
    console.log(`🔄 Starting automated testing loop for: ${changeDescription}`);
    
    const startTime = Date.now();
    let attempts = 0;
    let lastErrors: string[] = [];
    
    while (attempts < this.MAX_ATTEMPTS) {
      attempts++;
      console.log(`\n🧪 Attempt ${attempts}/${this.MAX_ATTEMPTS}`);
      
      const verificationResults = await BuildVerificationSystem.runComprehensiveVerification();
      const hasErrors = verificationResults.some(result => !result.success);
      
      if (!hasErrors) {
        const totalTime = Date.now() - startTime;
        console.log(`✅ Success! All tests passed after ${attempts} attempts in ${totalTime}ms`);
        
        return {
          success: true,
          attempts,
          finalErrors: [],
          totalTime
        };
      }
      
      // Collect errors for analysis
      lastErrors = [];
      verificationResults.forEach(result => {
        if (!result.success) {
          result.errors.forEach(error => {
            lastErrors.push(`${error.file}:${error.line} - ${error.message}`);
          });
        }
      });
      
      console.log(`❌ Attempt ${attempts} failed with ${lastErrors.length} errors:`);
      lastErrors.forEach(error => console.log(`  - ${error}`));
      
      // Wait before retry
      if (attempts < this.MAX_ATTEMPTS) {
        console.log(`⏳ Waiting ${this.RETRY_DELAY_MS}ms before retry...`);
        await this.delay(this.RETRY_DELAY_MS);
      }
    }
    
    const totalTime = Date.now() - startTime;
    console.error(`❌ Testing loop failed after ${attempts} attempts in ${totalTime}ms`);
    
    return {
      success: false,
      attempts,
      finalErrors: lastErrors,
      totalTime
    };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async verifyAndReport(changeDescription: string): Promise<boolean> {
    const result = await this.runUntilSuccess(changeDescription);
    
    if (result.success) {
      console.log(`\n🎉 VERIFIED: ${changeDescription}`);
      console.log(`✅ All tests passed after ${result.attempts} attempts`);
      console.log(`⏱️ Total time: ${result.totalTime}ms`);
      return true;
    } else {
      console.error(`\n❌ FAILED: ${changeDescription}`);
      console.error(`🚫 Could not resolve errors after ${result.attempts} attempts`);
      console.error(`⏱️ Total time: ${result.totalTime}ms`);
      console.error('Final errors:');
      result.finalErrors.forEach(error => console.error(`  - ${error}`));
      return false;
    }
  }
}

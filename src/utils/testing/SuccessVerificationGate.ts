
/**
 * Success Verification Gate - MUST pass before claiming success
 */

import { BuildVerificationSystem } from './BuildVerificationSystem';
import { AutomatedTestingLoop } from './AutomatedTestingLoop';

export class SuccessVerificationGate {
  private static isGateEnabled = true;
  
  /**
   * MUST be called before claiming any fix is successful
   * Returns true only if ALL verification passes
   */
  static async verifyBeforeSuccess(description: string): Promise<boolean> {
    if (!this.isGateEnabled) {
      console.warn('⚠️ Success verification gate is disabled - this should only happen in emergencies');
      return true;
    }
    
    console.log('🚪 Entering Success Verification Gate...');
    console.log(`📝 Change: ${description}`);
    
    // Step 1: Run immediate build verification
    const immediateResult = await BuildVerificationSystem.verifyFixBeforeReporting(description);
    
    if (!immediateResult) {
      console.error('❌ GATE BLOCKED: Immediate verification failed');
      console.error('🔧 Running automated testing loop to attempt resolution...');
      
      // Step 2: Try automated testing loop
      const loopResult = await AutomatedTestingLoop.verifyAndReport(description);
      
      if (!loopResult) {
        console.error('❌ GATE BLOCKED: Automated testing loop failed');
        console.error('🚫 CANNOT CLAIM SUCCESS - BUILD ERRORS REMAIN');
        return false;
      }
    }
    
    // Step 3: Final comprehensive verification
    console.log('🔍 Running final comprehensive verification...');
    const finalResults = await BuildVerificationSystem.runComprehensiveVerification();
    const finalSuccess = finalResults.every(result => result.success);
    
    if (finalSuccess) {
      console.log('✅ SUCCESS VERIFICATION GATE PASSED');
      console.log('🎉 All verifications successful - safe to claim success');
      return true;
    } else {
      console.error('❌ GATE BLOCKED: Final verification failed');
      console.error('🚫 CANNOT CLAIM SUCCESS - VERIFICATION INCOMPLETE');
      return false;
    }
  }
  
  static enableGate(): void {
    this.isGateEnabled = true;
    console.log('🚪 Success Verification Gate ENABLED');
  }
  
  static disableGate(): void {
    this.isGateEnabled = false;
    console.warn('⚠️ Success Verification Gate DISABLED');
  }
  
  static isEnabled(): boolean {
    return this.isGateEnabled;
  }
}

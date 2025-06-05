
/**
 * Test the comprehensive bug-fixing system
 */

import { runComprehensiveBugFix, checkCodebaseHealth } from './ComprehensiveBugFixRunner';

export class TestCurrentFixWithComprehensiveSystem {
  static async runFullSystemTest(): Promise<boolean> {
    console.log('🧪 TESTING COMPREHENSIVE BUG-FIXING SYSTEM');
    console.log('='.repeat(60));
    
    try {
      // First, run a quick health check
      console.log('\n🏥 Phase 1: Initial Health Check');
      const initialHealth = await checkCodebaseHealth();
      
      if (initialHealth) {
        console.log('✅ Initial health check passed - no issues detected');
        console.log('🎉 Codebase appears to be already clean!');
        return true;
      }
      
      console.log('⚠️  Initial health check found issues - running comprehensive fix...');
      
      // Run the full comprehensive bug-fixing system
      console.log('\n🔧 Phase 2: Comprehensive Bug Fixing');
      const result = await runComprehensiveBugFix();
      
      if (result.success) {
        console.log('\n🎉 COMPREHENSIVE BUG-FIXING SUCCESSFUL!');
        console.log(`✅ Fixed ${result.totalIssuesFixed} issues`);
        console.log(`🏆 Codebase is now perfect`);
        return true;
      } else {
        console.log('\n⚠️  COMPREHENSIVE BUG-FIXING PARTIALLY SUCCESSFUL');
        console.log(`✅ Fixed ${result.totalIssuesFixed} issues`);
        console.log(`❌ ${result.remainingIssues} issues remain`);
        return false;
      }
      
    } catch (error) {
      console.error('💥 Comprehensive bug-fixing system crashed:', error);
      return false;
    }
  }
}

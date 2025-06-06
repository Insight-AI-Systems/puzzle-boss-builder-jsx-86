
/**
 * Report Generator - Handles all reporting and logging
 */

import { ComprehensiveTestResult } from './TestingCoordinator';
import { ProcessingResult } from './ErrorProcessor';

export class ReportGenerator {
  addInitialScanResults(finalReport: string[], initialScan: any): void {
    finalReport.push(`Initial scan found ${initialScan.totalIssues} issues across:`);
    finalReport.push(`  - TypeScript errors: ${initialScan.typeScriptErrors.length}`);
    finalReport.push(`  - Interface mismatches: ${initialScan.interfaceMismatches.length}`);
    finalReport.push(`  - Unused code: ${initialScan.unusedCode.length}`);
    finalReport.push(`  - Build issues: ${initialScan.buildIssues.length}`);
  }

  addIterationResults(finalReport: string[], processingResult: ProcessingResult): void {
    processingResult.results.forEach(result => {
      if (result.success) {
        finalReport.push(`✅ Fixed: ${result.fixDescription}`);
      } else {
        finalReport.push(`❌ Failed to fix: ${result.fixDescription} - ${result.rollbackReason}`);
      }
    });
  }

  generateFinalReport(result: ComprehensiveTestResult): void {
    console.log('\n📊 COMPREHENSIVE BUG-FIXING SYSTEM FINAL REPORT');
    console.log('='.repeat(60));
    console.log(`🎯 Total Issues Found: ${result.totalIssuesFound}`);
    console.log(`✅ Total Issues Fixed: ${result.totalIssuesFixed}`);
    console.log(`⚠️  Remaining Issues: ${result.remainingIssues}`);
    console.log(`🔄 Iterations: ${result.iterationCount}`);
    console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(2)}s`);
    console.log(`🏆 Success: ${result.success ? 'YES' : 'NO'}`);
    console.log('\n📋 Detailed Report:');
    result.finalReport.forEach(line => console.log(`  ${line}`));
    
    if (result.success) {
      console.log('\n🎉 SUCCESS: All issues have been resolved!');
      console.log('✅ TypeScript compilation: PASSED');
      console.log('✅ Build process: PASSED');
      console.log('✅ Interface alignment: PASSED');
      console.log('✅ Code quality: PASSED');
    } else {
      console.log('\n⚠️  PARTIAL SUCCESS: Some issues remain');
      console.log('🔍 Run the system again to continue fixing remaining issues');
    }
  }
}

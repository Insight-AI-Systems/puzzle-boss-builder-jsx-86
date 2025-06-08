
/**
 * Report Generator - Creates comprehensive test reports
 */

import { ComprehensiveTestResult } from './TestingCoordinator';
import { ProcessingResult } from './ErrorProcessor';
import { HealthCheckResult } from './BuildHealthMonitor';

export class ReportGenerator {
  addInitialScanResults(report: string[], scanResult: HealthCheckResult): void {
    report.push('📋 INITIAL COMPREHENSIVE SCAN RESULTS');
    report.push('═'.repeat(50));
    report.push(`Total Issues Found: ${scanResult.totalIssues}`);
    report.push(`Scan Duration: ${scanResult.duration}ms`);
    report.push('');
    
    if (scanResult.totalIssues > 0) {
      report.push('Issue Breakdown:');
      report.push(`  🔴 TypeScript Errors: ${scanResult.typeScriptErrors.length}`);
      report.push(`  🟡 Interface Mismatches: ${scanResult.interfaceMismatches.length}`);
      report.push(`  🔵 Unused Code: ${scanResult.unusedCode.length}`);
      report.push(`  🟠 Build Issues: ${scanResult.buildIssues.length}`);
      report.push(`  🟣 Performance Issues: ${scanResult.performanceIssues.length}`);
    } else {
      report.push('🎉 No issues found - codebase is healthy!');
    }
    
    report.push('');
  }

  addIterationResults(report: string[], fixResults: ProcessingResult): void {
    report.push(`🔧 Fix Results: ${fixResults.successCount} fixed, ${fixResults.failureCount} failed`);
    
    if (fixResults.fixes.length > 0) {
      report.push('Successful Fixes:');
      fixResults.fixes
        .filter(fix => fix.success)
        .slice(0, 5)
        .forEach(fix => {
          report.push(`  ✅ ${fix.fixDescription}`);
        });
      
      const failedFixes = fixResults.fixes.filter(fix => !fix.success);
      if (failedFixes.length > 0) {
        report.push('Failed Fixes:');
        failedFixes.slice(0, 3).forEach(fix => {
          report.push(`  ❌ ${fix.fixDescription} (${fix.rollbackReason})`);
        });
      }
    }
    
    report.push('');
  }

  generateFinalReport(result: ComprehensiveTestResult): void {
    console.log('\n' + '═'.repeat(60));
    console.log('🎯 COMPREHENSIVE AUTOMATED BUG-FIXING SYSTEM REPORT');
    console.log('═'.repeat(60));
    
    console.log(`\n📊 SUMMARY STATISTICS`);
    console.log('─'.repeat(30));
    console.log(`Total Issues Found: ${result.totalIssuesFound}`);
    console.log(`Total Issues Fixed: ${result.totalIssuesFixed}`);
    console.log(`Remaining Issues: ${result.remainingIssues}`);
    console.log(`Iterations Required: ${result.iterationCount}`);
    console.log(`Total Duration: ${(result.duration / 1000).toFixed(2)}s`);
    console.log(`Success Rate: ${((result.totalIssuesFixed / Math.max(result.totalIssuesFound, 1)) * 100).toFixed(1)}%`);
    
    console.log(`\n🎯 FINAL STATUS`);
    console.log('─'.repeat(20));
    if (result.success) {
      console.log('✅ BUILD SYSTEM IS HEALTHY');
      console.log('🎉 All critical issues have been resolved!');
      console.log('🚀 Application is ready for production use.');
    } else {
      console.log('⚠️  BUILD SYSTEM NEEDS ATTENTION');
      console.log(`📊 ${result.remainingIssues} issues still require manual intervention.`);
      console.log('🔧 Review the remaining issues in the detailed report.');
    }
    
    if (result.finalReport.length > 0) {
      console.log(`\n📋 DETAILED REPORT`);
      console.log('─'.repeat(25));
      result.finalReport.forEach(line => console.log(line));
    }
    
    console.log('\n' + '═'.repeat(60));
  }
}

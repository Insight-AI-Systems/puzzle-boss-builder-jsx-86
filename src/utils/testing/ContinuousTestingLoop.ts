
/**
 * Continuous Testing Loop - Runs until ALL errors are resolved
 */

import { TypeScriptCompiler } from './TypeScriptCompiler';
import { AutoFixEngine } from './AutoFixEngine';
import { ErrorTracker } from './ErrorTracker';
import { BuildHealthMonitor } from './BuildHealthMonitor';
import { QualityAssuranceVerifier } from './QualityAssuranceVerifier';

export interface FixResult {
  success: boolean;
  errorId: string;
  fixDescription: string;
  rollbackReason?: string;
  compilationStatus: 'passed' | 'failed';
}

export interface ComprehensiveTestResult {
  totalIssuesFound: number;
  totalIssuesFixed: number;
  remainingIssues: number;
  iterationCount: number;
  success: boolean;
  finalReport: string[];
  duration: number;
}

export class ContinuousTestingLoop {
  private static readonly MAX_ITERATIONS = 50;
  private static readonly MAX_FIX_ATTEMPTS_PER_ERROR = 3;
  
  private compiler: TypeScriptCompiler;
  private autoFixer: AutoFixEngine;
  private errorTracker: ErrorTracker;
  private healthMonitor: BuildHealthMonitor;
  private qaVerifier: QualityAssuranceVerifier;
  
  constructor() {
    this.compiler = new TypeScriptCompiler();
    this.autoFixer = new AutoFixEngine();
    this.errorTracker = new ErrorTracker();
    this.healthMonitor = new BuildHealthMonitor();
    this.qaVerifier = new QualityAssuranceVerifier();
  }

  async runComprehensiveBugFix(): Promise<ComprehensiveTestResult> {
    console.log('🚀 Starting Comprehensive Automated Bug-Fixing System...');
    
    const startTime = Date.now();
    let iteration = 0;
    let totalIssuesFound = 0;
    let totalIssuesFixed = 0;
    const finalReport: string[] = [];
    
    // Phase 1: Initial comprehensive scan
    console.log('\n📋 Phase 1: Initial Comprehensive Code Scan');
    const initialScan = await this.healthMonitor.runFullHealthCheck();
    totalIssuesFound = initialScan.totalIssues;
    
    finalReport.push(`Initial scan found ${totalIssuesFound} issues across:`);
    finalReport.push(`  - TypeScript errors: ${initialScan.typeScriptErrors.length}`);
    finalReport.push(`  - Interface mismatches: ${initialScan.interfaceMismatches.length}`);
    finalReport.push(`  - Unused code: ${initialScan.unusedCode.length}`);
    finalReport.push(`  - Build issues: ${initialScan.buildIssues.length}`);
    
    // Phase 2: Continuous fix-and-verify loop
    console.log('\n🔄 Phase 2: Continuous Fix-and-Verify Loop');
    
    while (iteration < ContinuousTestingLoop.MAX_ITERATIONS) {
      iteration++;
      console.log(`\n🧪 Iteration ${iteration}/${ContinuousTestingLoop.MAX_ITERATIONS}`);
      
      // Get current error state
      const currentErrors = await this.errorTracker.getAllActiveErrors();
      
      if (currentErrors.length === 0) {
        console.log('✅ No more errors found - running final verification...');
        break;
      }
      
      console.log(`📊 Found ${currentErrors.length} active errors to fix`);
      
      // Process errors one by one
      for (const error of currentErrors) {
        console.log(`🎯 Attempting to fix: ${error.description}`);
        
        const fixResult = await this.attemptErrorFix(error);
        
        if (fixResult.success) {
          totalIssuesFixed++;
          finalReport.push(`✅ Fixed: ${fixResult.fixDescription}`);
          console.log(`✅ Successfully fixed: ${error.description}`);
        } else {
          finalReport.push(`❌ Failed to fix: ${error.description} - ${fixResult.rollbackReason}`);
          console.log(`❌ Failed to fix: ${error.description}`);
        }
        
        // Immediate compilation check after each fix
        const compilationResult = await this.compiler.runFullCompilation();
        if (!compilationResult.success) {
          console.log(`🚨 Compilation failed after fix attempt - investigating...`);
          // The fix broke something else, let the AutoFixEngine handle rollback
        }
      }
      
      // Check if we've resolved all issues
      const remainingErrors = await this.errorTracker.getAllActiveErrors();
      if (remainingErrors.length === 0) {
        console.log('🎉 All errors resolved - proceeding to final verification');
        break;
      }
    }
    
    // Phase 3: Final comprehensive verification
    console.log('\n🔍 Phase 3: Final Comprehensive Verification');
    const finalVerification = await this.qaVerifier.runCompleteVerification();
    
    const duration = Date.now() - startTime;
    const remainingIssues = await this.errorTracker.getAllActiveErrors();
    
    const result: ComprehensiveTestResult = {
      totalIssuesFound,
      totalIssuesFixed,
      remainingIssues: remainingIssues.length,
      iterationCount: iteration,
      success: remainingIssues.length === 0 && finalVerification.success,
      finalReport,
      duration
    };
    
    this.generateFinalReport(result);
    return result;
  }

  private async attemptErrorFix(error: any): Promise<FixResult> {
    let attempts = 0;
    
    while (attempts < ContinuousTestingLoop.MAX_FIX_ATTEMPTS_PER_ERROR) {
      attempts++;
      console.log(`  🔧 Fix attempt ${attempts}/${ContinuousTestingLoop.MAX_FIX_ATTEMPTS_PER_ERROR} for: ${error.description}`);
      
      // Take snapshot before attempting fix
      const snapshot = await this.autoFixer.createSnapshot();
      
      try {
        // Attempt the fix
        const fixApplied = await this.autoFixer.applyFix(error);
        
        if (!fixApplied) {
          return {
            success: false,
            errorId: error.id,
            fixDescription: error.description,
            rollbackReason: 'No fix strategy available',
            compilationStatus: 'failed'
          };
        }
        
        // Immediate compilation verification
        const compilationResult = await this.compiler.runFullCompilation();
        
        if (compilationResult.success) {
          // Fix worked and compilation passed
          return {
            success: true,
            errorId: error.id,
            fixDescription: error.description,
            compilationStatus: 'passed'
          };
        } else {
          // Fix broke compilation - rollback
          console.log(`  ⏪ Compilation failed, rolling back fix attempt ${attempts}`);
          await this.autoFixer.restoreSnapshot(snapshot);
        }
        
      } catch (fixError) {
        console.log(`  ⏪ Fix attempt ${attempts} threw error, rolling back:`, fixError);
        await this.autoFixer.restoreSnapshot(snapshot);
      }
    }
    
    return {
      success: false,
      errorId: error.id,
      fixDescription: error.description,
      rollbackReason: `All ${ContinuousTestingLoop.MAX_FIX_ATTEMPTS_PER_ERROR} fix attempts failed`,
      compilationStatus: 'failed'
    };
  }

  private generateFinalReport(result: ComprehensiveTestResult): void {
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

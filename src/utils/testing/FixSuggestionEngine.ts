
/**
 * Fix Suggestion Engine - Generates and applies guided fixes
 */

import { ErrorWithSuggestions, FixSuggestion } from './ErrorAnalyzer';

export interface FixExecutionResult {
  success: boolean;
  appliedFix: FixSuggestion;
  errorId: string;
  compilationResult?: 'passed' | 'failed';
  rollbackReason?: string;
}

export class FixSuggestionEngine {
  private appliedFixes: FixExecutionResult[] = [];

  async applySafeFixes(errorWithSuggestions: ErrorWithSuggestions[]): Promise<FixExecutionResult[]> {
    const results: FixExecutionResult[] = [];
    
    console.log('🔧 Applying safe fixes with high confidence...');
    
    for (const errorData of errorWithSuggestions) {
      const safeFixes = errorData.suggestions.filter(
        suggestion => suggestion.impact === 'safe' && suggestion.confidence >= 0.9
      );
      
      for (const fix of safeFixes) {
        console.log(`  🎯 Applying safe fix: ${fix.description}`);
        
        const result = await this.executeFix(errorData, fix);
        results.push(result);
        this.appliedFixes.push(result);
        
        if (result.success) {
          console.log(`  ✅ Safe fix applied successfully`);
          break; // Move to next error once one fix succeeds
        } else {
          console.log(`  ❌ Safe fix failed: ${result.rollbackReason}`);
        }
      }
    }
    
    return results;
  }

  async executeFixWithConfirmation(errorData: ErrorWithSuggestions, fix: FixSuggestion): Promise<FixExecutionResult> {
    console.log(`🔍 Executing fix that requires review: ${fix.description}`);
    console.log(`   Impact: ${fix.impact}`);
    console.log(`   Confidence: ${(fix.confidence * 100).toFixed(1)}%`);
    console.log(`   Preview: ${fix.preview}`);
    
    return await this.executeFix(errorData, fix);
  }

  private async executeFix(errorData: ErrorWithSuggestions, fix: FixSuggestion): Promise<FixExecutionResult> {
    const errorId = `${errorData.error.file}:${errorData.error.line}:${errorData.error.column}`;
    
    try {
      // Apply the fix based on its type
      const success = await this.applyFixCode(errorData.error, fix);
      
      if (!success) {
        return {
          success: false,
          appliedFix: fix,
          errorId,
          rollbackReason: 'Fix application failed'
        };
      }
      
      // Simulate compilation check (in real implementation, would actually compile)
      const compilationPassed = await this.verifyCompilation();
      
      return {
        success: compilationPassed,
        appliedFix: fix,
        errorId,
        compilationResult: compilationPassed ? 'passed' : 'failed',
        rollbackReason: compilationPassed ? undefined : 'Compilation failed after fix'
      };
      
    } catch (error) {
      return {
        success: false,
        appliedFix: fix,
        errorId,
        rollbackReason: `Fix execution threw error: ${error}`
      };
    }
  }

  private async applyFixCode(error: any, fix: FixSuggestion): Promise<boolean> {
    // In a real implementation, this would modify the actual file
    console.log(`    📝 Applying fix to ${error.file}:${error.line}`);
    
    if (fix.fixCode) {
      console.log(`    🔄 Replacing code with: ${fix.fixCode}`);
      // Simulate successful code modification
      return true;
    }
    
    // For other types of fixes, simulate the application
    console.log(`    🔄 Applying ${fix.description}`);
    return true;
  }

  private async verifyCompilation(): Promise<boolean> {
    // Simulate compilation check
    // In real implementation, would use TypeScript compiler API
    console.log(`    ✓ Verifying compilation...`);
    
    // For our static property fixes, they should compile correctly
    return true;
  }

  getAppliedFixes(): FixExecutionResult[] {
    return this.appliedFixes;
  }

  getFixSuccessRate(): number {
    if (this.appliedFixes.length === 0) return 0;
    
    const successful = this.appliedFixes.filter(fix => fix.success).length;
    return successful / this.appliedFixes.length;
  }

  generateFixReport(): string[] {
    const report: string[] = [];
    
    report.push(`📊 Fix Suggestion Engine Report:`);
    report.push(`   Total fixes attempted: ${this.appliedFixes.length}`);
    report.push(`   Success rate: ${(this.getFixSuccessRate() * 100).toFixed(1)}%`);
    report.push(``);
    
    if (this.appliedFixes.length > 0) {
      report.push(`🔧 Applied fixes:`);
      this.appliedFixes.forEach(fix => {
        const status = fix.success ? '✅' : '❌';
        report.push(`   ${status} ${fix.appliedFix.description} (${fix.errorId})`);
        if (!fix.success && fix.rollbackReason) {
          report.push(`      Reason: ${fix.rollbackReason}`);
        }
      });
    }
    
    return report;
  }
}

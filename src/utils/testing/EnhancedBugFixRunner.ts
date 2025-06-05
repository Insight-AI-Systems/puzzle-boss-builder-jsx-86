
/**
 * Enhanced Bug-Fix Runner - Combines error analysis with guided fixing
 */

import { TypeScriptCompiler } from './TypeScriptCompiler';
import { ErrorAnalyzer, ErrorWithSuggestions } from './ErrorAnalyzer';
import { FixSuggestionEngine } from './FixSuggestionEngine';
import { BuildHealthMonitor } from './BuildHealthMonitor';

export interface EnhancedFixResult {
  totalErrorsFound: number;
  errorsSafelyFixed: number;
  errorsRequiringReview: number;
  remainingErrors: number;
  suggestions: ErrorWithSuggestions[];
  success: boolean;
  duration: number;
}

export class EnhancedBugFixRunner {
  private compiler: TypeScriptCompiler;
  private analyzer: ErrorAnalyzer;
  private suggestionEngine: FixSuggestionEngine;
  private healthMonitor: BuildHealthMonitor;

  constructor() {
    this.compiler = new TypeScriptCompiler();
    this.analyzer = new ErrorAnalyzer();
    this.suggestionEngine = new FixSuggestionEngine();
    this.healthMonitor = new BuildHealthMonitor();
  }

  async runEnhancedBugFix(): Promise<EnhancedFixResult> {
    console.log('🚀 Starting Enhanced Bug-Fixing System with Guided Suggestions...');
    const startTime = Date.now();

    // Phase 1: Comprehensive error detection
    console.log('\n🔍 Phase 1: Comprehensive Error Detection');
    const compilation = await this.compiler.runFullCompilation();
    
    if (compilation.success) {
      console.log('✅ No TypeScript errors found - codebase is clean!');
      return {
        totalErrorsFound: 0,
        errorsSafelyFixed: 0,
        errorsRequiringReview: 0,
        remainingErrors: 0,
        suggestions: [],
        success: true,
        duration: Date.now() - startTime
      };
    }

    // Phase 2: Error analysis and suggestion generation
    console.log('\n🧠 Phase 2: Error Analysis and Suggestion Generation');
    const analyzedErrors = this.analyzer.analyzeErrors(compilation.errors);
    
    console.log(`📊 Found ${compilation.errors.length} errors, grouped into ${analyzedErrors.length} fixable groups`);
    
    // Phase 3: Apply safe fixes automatically
    console.log('\n🔧 Phase 3: Applying Safe Fixes Automatically');
    const safeFixResults = await this.suggestionEngine.applySafeFixes(analyzedErrors);
    const successfulSafeFixes = safeFixResults.filter(result => result.success).length;
    
    // Phase 4: Present remaining errors that require review
    console.log('\n👁️  Phase 4: Identifying Errors Requiring Review');
    const remainingErrors = analyzedErrors.filter(errorData => {
      const wasSafelyFixed = safeFixResults.some(result => 
        result.success && result.errorId.includes(errorData.error.file)
      );
      return !wasSafelyFixed;
    });

    const errorsRequiringReview = remainingErrors.filter(errorData =>
      errorData.suggestions.some(suggestion => suggestion.impact === 'requires-review')
    ).length;

    // Final verification
    const finalCompilation = await this.compiler.runFullCompilation();
    const finalErrorCount = finalCompilation.errors.length;

    const result: EnhancedFixResult = {
      totalErrorsFound: compilation.errors.length,
      errorsSafelyFixed: successfulSafeFixes,
      errorsRequiringReview,
      remainingErrors: finalErrorCount,
      suggestions: remainingErrors,
      success: finalErrorCount === 0,
      duration: Date.now() - startTime
    };

    this.generateFinalReport(result);
    return result;
  }

  private generateFinalReport(result: EnhancedFixResult): void {
    console.log('\n📊 ENHANCED BUG-FIXING SYSTEM REPORT');
    console.log('='.repeat(50));
    console.log(`🎯 Total errors found: ${result.totalErrorsFound}`);
    console.log(`✅ Safely fixed automatically: ${result.errorsSafelyFixed}`);
    console.log(`👁️  Require manual review: ${result.errorsRequiringReview}`);
    console.log(`⚠️  Remaining errors: ${result.remainingErrors}`);
    console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(2)}s`);
    console.log(`🏆 Status: ${result.success ? 'COMPLETE' : 'PARTIAL'}`);
    
    if (result.suggestions.length > 0) {
      console.log('\n💡 Errors requiring review:');
      result.suggestions.forEach((errorData, index) => {
        console.log(`\n${index + 1}. ${errorData.error.file}:${errorData.error.line}`);
        console.log(`   Priority: ${errorData.priority}`);
        console.log(`   Issue: ${errorData.error.message}`);
        if (errorData.rootCause) {
          console.log(`   Root cause: ${errorData.rootCause}`);
        }
        console.log(`   Suggestions:`);
        errorData.suggestions.forEach(suggestion => {
          console.log(`     • ${suggestion.description} (${suggestion.impact}, ${(suggestion.confidence * 100).toFixed(0)}% confidence)`);
        });
      });
    }

    // Include suggestion engine report
    const suggestionReport = this.suggestionEngine.generateFixReport();
    console.log('\n' + suggestionReport.join('\n'));
  }
}

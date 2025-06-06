
/**
 * Error Processor - Handles error detection and fixing
 */

import { TypeScriptCompiler } from './TypeScriptCompiler';
import { AutoFixEngine } from './AutoFixEngine';
import { ErrorTracker } from './ErrorTracker';

export interface FixResult {
  success: boolean;
  errorId: string;
  fixDescription: string;
  rollbackReason?: string;
  compilationStatus: 'passed' | 'failed';
}

export interface ProcessingResult {
  successCount: number;
  failureCount: number;
  results: FixResult[];
}

export class ErrorProcessor {
  private static readonly MAX_FIX_ATTEMPTS_PER_ERROR = 3;
  
  private compiler: TypeScriptCompiler;
  private autoFixer: AutoFixEngine;
  private errorTracker: ErrorTracker;
  
  constructor(compiler: TypeScriptCompiler) {
    this.compiler = compiler;
    this.autoFixer = new AutoFixEngine();
    this.errorTracker = new ErrorTracker();
  }

  async getCurrentErrors(): Promise<any[]> {
    return await this.errorTracker.getAllActiveErrors();
  }

  async getRemainingErrors(): Promise<any[]> {
    return await this.errorTracker.getAllActiveErrors();
  }

  async processErrors(errors: any[]): Promise<ProcessingResult> {
    const results: FixResult[] = [];
    let successCount = 0;
    let failureCount = 0;
    
    for (const error of errors) {
      console.log(`🎯 Attempting to fix: ${error.description}`);
      
      const fixResult = await this.attemptErrorFix(error);
      results.push(fixResult);
      
      if (fixResult.success) {
        successCount++;
        console.log(`✅ Successfully fixed: ${error.description}`);
      } else {
        failureCount++;
        console.log(`❌ Failed to fix: ${error.description}`);
      }
      
      // Immediate compilation check after each fix
      const compilationResult = await this.compiler.runFullCompilation();
      if (!compilationResult.success) {
        console.log(`🚨 Compilation failed after fix attempt - investigating...`);
      }
    }
    
    return { successCount, failureCount, results };
  }

  private async attemptErrorFix(error: any): Promise<FixResult> {
    let attempts = 0;
    
    while (attempts < ErrorProcessor.MAX_FIX_ATTEMPTS_PER_ERROR) {
      attempts++;
      console.log(`  🔧 Fix attempt ${attempts}/${ErrorProcessor.MAX_FIX_ATTEMPTS_PER_ERROR} for: ${error.description}`);
      
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
          return {
            success: true,
            errorId: error.id,
            fixDescription: error.description,
            compilationStatus: 'passed'
          };
        } else {
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
      rollbackReason: `All ${ErrorProcessor.MAX_FIX_ATTEMPTS_PER_ERROR} fix attempts failed`,
      compilationStatus: 'failed'
    };
  }
}

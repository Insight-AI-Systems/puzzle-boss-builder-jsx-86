
/**
 * Build Health Monitor - Comprehensive codebase health checking
 */

import { TypeScriptCompiler, CompilationResult } from './TypeScriptCompiler';
import { ErrorTracker, CodeError } from './ErrorTracker';

export interface HealthCheckResult {
  success: boolean;
  totalIssues: number;
  typeScriptErrors: CodeError[];
  interfaceMismatches: CodeError[];
  unusedCode: CodeError[];
  buildIssues: CodeError[];
  performanceIssues: CodeError[];
  timestamp: string;
  duration: number;
}

export class BuildHealthMonitor {
  private compiler: TypeScriptCompiler;
  private errorTracker: ErrorTracker;

  constructor() {
    this.compiler = new TypeScriptCompiler();
    this.errorTracker = new ErrorTracker();
  }

  async runFullHealthCheck(): Promise<HealthCheckResult> {
    console.log('🏥 Running comprehensive build health check...');
    const startTime = Date.now();
    
    // Run comprehensive error scan
    const allErrors = await this.errorTracker.scanForAllErrors();
    
    // Categorize errors
    const typeScriptErrors = allErrors.filter(e => e.category === 'typescript');
    const interfaceMismatches = allErrors.filter(e => e.category === 'interface');
    const unusedCode = allErrors.filter(e => e.category === 'unused-code');
    const buildIssues = allErrors.filter(e => e.category === 'build');
    const performanceIssues = allErrors.filter(e => e.category === 'performance');
    
    const duration = Date.now() - startTime;
    const totalIssues = allErrors.length;
    
    const result: HealthCheckResult = {
      success: totalIssues === 0,
      totalIssues,
      typeScriptErrors,
      interfaceMismatches,
      unusedCode,
      buildIssues,
      performanceIssues,
      timestamp: new Date().toISOString(),
      duration
    };
    
    this.logHealthCheckResults(result);
    return result;
  }

  private logHealthCheckResults(result: HealthCheckResult): void {
    console.log(`\n📊 Build Health Check Results (${result.duration}ms)`);
    console.log('─'.repeat(50));
    
    if (result.success) {
      console.log('✅ Build Health: EXCELLENT');
      console.log('🎉 No issues found - codebase is clean!');
    } else {
      console.log(`⚠️  Build Health: NEEDS ATTENTION`);
      console.log(`📊 Total Issues: ${result.totalIssues}`);
      console.log('');
      console.log('Issue Breakdown:');
      console.log(`  🔴 TypeScript Errors: ${result.typeScriptErrors.length}`);
      console.log(`  🟡 Interface Mismatches: ${result.interfaceMismatches.length}`);
      console.log(`  🔵 Unused Code: ${result.unusedCode.length}`);
      console.log(`  🟠 Build Issues: ${result.buildIssues.length}`);
      console.log(`  🟣 Performance Issues: ${result.performanceIssues.length}`);
    }
  }

  async isHealthy(): Promise<boolean> {
    const healthCheck = await this.runFullHealthCheck();
    return healthCheck.success;
  }

  async waitForHealthyState(maxWaitMs: number = 30000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitMs) {
      if (await this.isHealthy()) {
        return true;
      }
      
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return false;
  }
}

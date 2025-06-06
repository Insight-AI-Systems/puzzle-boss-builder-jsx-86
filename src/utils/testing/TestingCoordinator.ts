
/**
 * Testing Coordinator - Orchestrates the comprehensive testing process
 */

import { TypeScriptCompiler } from './TypeScriptCompiler';
import { BuildHealthMonitor } from './BuildHealthMonitor';
import { QualityAssuranceVerifier } from './QualityAssuranceVerifier';
import { ErrorProcessor } from './ErrorProcessor';
import { ReportGenerator } from './ReportGenerator';

export interface ComprehensiveTestResult {
  totalIssuesFound: number;
  totalIssuesFixed: number;
  remainingIssues: number;
  iterationCount: number;
  success: boolean;
  finalReport: string[];
  duration: number;
}

export class TestingCoordinator {
  private static readonly MAX_ITERATIONS = 50;
  
  private compiler: TypeScriptCompiler;
  private healthMonitor: BuildHealthMonitor;
  private qaVerifier: QualityAssuranceVerifier;
  private errorProcessor: ErrorProcessor;
  private reportGenerator: ReportGenerator;
  
  constructor() {
    this.compiler = new TypeScriptCompiler();
    this.healthMonitor = new BuildHealthMonitor();
    this.qaVerifier = new QualityAssuranceVerifier();
    this.errorProcessor = new ErrorProcessor(this.compiler);
    this.reportGenerator = new ReportGenerator();
  }

  async runComprehensiveTest(): Promise<ComprehensiveTestResult> {
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
    
    this.reportGenerator.addInitialScanResults(finalReport, initialScan);
    
    // Phase 2: Continuous fix-and-verify loop
    console.log('\n🔄 Phase 2: Continuous Fix-and-Verify Loop');
    
    const processingResult = await this.runFixingLoop(iteration, totalIssuesFixed, finalReport);
    iteration = processingResult.iteration;
    totalIssuesFixed = processingResult.totalIssuesFixed;
    
    // Phase 3: Final comprehensive verification
    console.log('\n🔍 Phase 3: Final Comprehensive Verification');
    const finalVerification = await this.qaVerifier.runCompleteVerification();
    
    const duration = Date.now() - startTime;
    const remainingErrors = await this.errorProcessor.getRemainingErrors();
    
    const result: ComprehensiveTestResult = {
      totalIssuesFound,
      totalIssuesFixed,
      remainingIssues: remainingErrors.length,
      iterationCount: iteration,
      success: remainingErrors.length === 0 && finalVerification.success,
      finalReport,
      duration
    };
    
    this.reportGenerator.generateFinalReport(result);
    return result;
  }

  private async runFixingLoop(initialIteration: number, initialFixed: number, finalReport: string[]): Promise<{iteration: number, totalIssuesFixed: number}> {
    let iteration = initialIteration;
    let totalIssuesFixed = initialFixed;
    
    while (iteration < TestingCoordinator.MAX_ITERATIONS) {
      iteration++;
      console.log(`\n🧪 Iteration ${iteration}/${TestingCoordinator.MAX_ITERATIONS}`);
      
      const currentErrors = await this.errorProcessor.getCurrentErrors();
      
      if (currentErrors.length === 0) {
        console.log('✅ No more errors found - running final verification...');
        break;
      }
      
      console.log(`📊 Found ${currentErrors.length} active errors to fix`);
      
      const fixResults = await this.errorProcessor.processErrors(currentErrors);
      totalIssuesFixed += fixResults.successCount;
      
      this.reportGenerator.addIterationResults(finalReport, fixResults);
      
      // Check if we've resolved all issues
      const remainingErrors = await this.errorProcessor.getCurrentErrors();
      if (remainingErrors.length === 0) {
        console.log('🎉 All errors resolved - proceeding to final verification');
        break;
      }
    }
    
    return { iteration, totalIssuesFixed };
  }
}

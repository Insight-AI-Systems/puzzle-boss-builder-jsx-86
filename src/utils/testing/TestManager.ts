
import { TestSuite, VerificationResult, TestReport } from './types/testTypes';

/**
 * Verify a requested change has been implemented correctly
 * @param changeDescription The description of the change that was requested
 * @param checkFn A function that returns true if the change was implemented correctly
 * @returns A verification result indicating success or failure
 */
export function verifyChange(
  changeDescription: string, 
  checkFn: () => boolean
): VerificationResult {
  try {
    const result = checkFn();
    return {
      description: changeDescription,
      success: result,
      error: result ? null : "Implementation failed verification check"
    };
  } catch (error) {
    return {
      description: changeDescription,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Run all tasks in the provided test suite
 * @param tasks A list of test tasks to verify
 * @returns A report containing results of all test runs
 */
export function runAllTaskTests(tasks: TestSuite[]): TestReport {
  const results: Record<string, VerificationResult[]> = {};
  let totalTests = 0;
  let passedTests = 0;
  
  for (const task of tasks) {
    if (!task.tests || !Array.isArray(task.tests)) continue;
    
    const taskResults: VerificationResult[] = [];
    
    for (const test of task.tests) {
      totalTests++;
      const result = verifyChange(test.description, test.verify);
      taskResults.push(result);
      
      if (result.success) {
        passedTests++;
      }
    }
    
    results[task.name] = taskResults;
  }
  
  return {
    success: passedTests === totalTests,
    totalTests,
    passedTests,
    taskResults: results
  };
}

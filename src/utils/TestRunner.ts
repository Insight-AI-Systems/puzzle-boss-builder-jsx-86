
// Central export file for all test utilities
export type { VerificationResult, TestReport, TestSummary, TestCategory, TestSuite, SecurityEventType } from './testing/types/testTypes';
export { TestRunner } from './testing/TestRunner';
export { runInitialTests } from './testing/InitialTests';
export { default as runPuzzleTestSuite, runComponentTestSuite } from './testing/runners/PuzzleTestRunner';
export { verifyChange, runAllTaskTests } from './testing/TestManager';

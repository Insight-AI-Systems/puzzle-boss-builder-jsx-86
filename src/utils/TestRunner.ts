
// Central export file for all test utilities - now using unified system
export type { VerificationResult } from './testing/types/testTypes';
export { TestRunner } from './testing/TestRunner';
export { runInitialTests } from './testing/InitialTests';
export { unifiedTestingSystem } from './testing/UnifiedTestingSystem';
export { default as runPuzzleTestSuite, runComponentTestSuite } from './testing/runners/PuzzleTestRunner';

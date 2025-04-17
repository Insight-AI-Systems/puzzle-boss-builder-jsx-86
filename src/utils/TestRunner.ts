
// Import directly from the refactored modules
export type { VerificationResult } from './testing/types/testTypes';
export { TestRunner } from './testing/TestRunner';
export { runInitialTests } from './testing/InitialTests';
export { default as runPuzzleTestSuite, runComponentTestSuite } from './testing/runners/PuzzleTestRunner';

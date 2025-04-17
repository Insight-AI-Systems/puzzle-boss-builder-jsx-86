
// Central export file for all test utilities
// We're using the proper casing and type exports
export type { VerificationResult } from './testing/types/testTypes';
export { TestRunner } from './testing/TestRunner';
export { runInitialTests } from './testing/InitialTests';
export { default as runPuzzleTestSuite, runComponentTestSuite } from './testing/runners/PuzzleTestRunner';


import { TestManager } from '../../managers/TestManager';
import { projectTracker } from '@/utils/ProjectTracker';
import { toast } from '@/hooks/use-toast';
import { VerificationResult } from '../types/testTypes';
import { testPieceInteractions } from '../puzzleTests/pieceInteractionTests';
import { testPuzzleComponents } from '../puzzleTests/componentTests';
import { testSavedPuzzles } from '../puzzleTests/savedPuzzlesTests';
import { testSimplePuzzle } from '../puzzleTests/simplePuzzleTests';
import { testPuzzleIntegration } from '../puzzleTests/integrationTests';
import { runComponentTests } from '../puzzleTests/componentTests';
import { runIntegrationTests } from '../puzzleTests/integrationTests';

/**
 * Runs all puzzle-related tests
 * @returns A promise that resolves when all tests are complete
 */
export const runPuzzleTestSuite = async (): Promise<void> => {
  console.log('🧩 Running puzzle test suite...');
  
  // Use TestManager.getInstance() instead of new TestManager()
  const testManager = TestManager.getInstance();
  
  // Run component tests
  await testPuzzleComponents(testManager);
  
  // Run piece interaction tests
  await testPieceInteractions(testManager);
  
  // Run saved puzzle tests
  await testSavedPuzzles(testManager);
  
  // Run simple puzzle tests
  await testSimplePuzzle(testManager);
  
  // Run integration tests
  await testPuzzleIntegration(testManager);
  
  // Summarize test results
  const summary = testManager.summarizeResults();
  
  console.log('🧩 Puzzle test suite complete.');
  console.log(`✅ Passed: ${summary.passedTests} / ${summary.totalTests}`);
  
  if (summary.failedTests > 0) {
    console.warn(`❌ Failed: ${summary.failedTests} / ${summary.totalTests}`);
  }
  
  return Promise.resolve();
};

/**
 * Runs component test suite in development mode
 */
export const runComponentTestSuite = async (): Promise<void> => {
  console.log('🧪 Running component test suite...');
  
  // Mock for browser display only
  const componentTestResults = runComponentTests();
  const integrationTestResults = runIntegrationTests();
  
  console.log('Component tests complete:', componentTestResults);
  console.log('Integration tests complete:', integrationTestResults);
  
  return Promise.resolve();
};

export default runPuzzleTestSuite;

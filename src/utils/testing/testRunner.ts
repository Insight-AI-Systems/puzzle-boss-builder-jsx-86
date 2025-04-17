
// This file is redundant and causing casing conflicts
// All imports and exports are now handled by TestRunner.ts (with capital T)
// This file is kept for compatibility but should eventually be removed
// when all imports are updated

import { TestRunner } from './TestRunner';
export { TestRunner };

// Export type for backward compatibility
export type { VerificationResult } from './types/testTypes';

// Re-export other test utilities
export { runComponentTests, componentRenderTest } from './testUtils';

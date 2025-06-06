
/**
 * Test Result Constants - Centralized test result definitions
 */

export const TEST_RESULTS = {
  VERIFIED: 'VERIFIED' as const,
  PARTIAL: 'PARTIAL' as const,
  FAILED: 'FAILED' as const,
  SKIPPED: 'SKIPPED' as const
} as const;

export type TestResult = typeof TEST_RESULTS[keyof typeof TEST_RESULTS];

export const TEST_CATEGORIES = {
  UNIT: 'unit' as const,
  INTEGRATION: 'integration' as const,
  PERFORMANCE: 'performance' as const,
  SECURITY: 'security' as const,
  BUILD: 'build' as const
} as const;

export type TestCategory = typeof TEST_CATEGORIES[keyof typeof TEST_CATEGORIES];

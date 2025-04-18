
export const TEST_RESULTS = {
  VERIFIED: 'VERIFIED',
  PARTIAL: 'PARTIAL',
  FAILED: 'FAILED'
} as const;

export type TestResult = typeof TEST_RESULTS[keyof typeof TEST_RESULTS];

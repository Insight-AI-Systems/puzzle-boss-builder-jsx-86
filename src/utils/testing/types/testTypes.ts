
/**
 * Verification result for test operations
 */
export interface VerificationResult {
  status: 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  message: string;
  changeId: string;
  description: string;
  details?: Record<string, any>;
  success?: boolean;
}

/**
 * Test report containing results and metadata
 */
export interface TestReport {
  id: string;
  name: string;
  status: string;
  results: any[];
  timestamp: number;
  duration: number;
  metadata?: Record<string, any>;
}

/**
 * Test summary with aggregated statistics
 */
export interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  status: string;
  duration: number;
}

/**
 * Test category for grouping related tests
 */
export interface TestCategory {
  id: string;
  name: string;
  description: string;
  priority: number;
}

/**
 * Test suite containing multiple related tests
 */
export interface TestSuite {
  id: string;
  name: string;
  category: TestCategory;
  tests: any[];
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
  metadata?: Record<string, any>;
}

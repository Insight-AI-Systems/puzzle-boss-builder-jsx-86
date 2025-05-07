
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
  testId?: string; // Added for backward compatibility
  name: string;
  testName?: string; // Added for backward compatibility
  status: string;
  results: any[];
  result?: boolean; // Added for backward compatibility
  timestamp: number;
  duration: number;
  error?: string; // Added for error information
  metadata?: Record<string, any>;
  details?: Record<string, any>;
  // Additional backward compatibility fields
  success?: boolean;
  failureReason?: string;
  browser?: {
    name?: string;
    version?: string;
  };
  tests?: any[];
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
  timestamp?: number; // Added timestamp to match implementation
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
  tests: any[]; // Primary tests array
  testIds?: string[]; // Added for backward compatibility
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
  metadata?: Record<string, any>;
}

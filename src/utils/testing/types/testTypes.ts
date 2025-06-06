
/**
 * Unified Testing Types - Single source of truth for all test types
 */

export type TestResult = 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
export type TestCategory = 'unit' | 'integration' | 'performance' | 'security' | 'build';
export type TestStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface TestReport {
  testId: string;
  testName: string;
  result: boolean;
  duration: number;
  timestamp: Date;
  error?: string;
  details: Record<string, any>;
}

export interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  timestamp: Date;
  status: TestResult;
}

export interface TestSuite {
  id: string;
  name: string;
  category: TestCategory;
  testIds: string[];
  description?: string;
}

export interface VerificationResult {
  status: TestResult;
  message: string;
  changeId: string;
  description: string;
  details?: {
    summary?: TestSummary;
    reports?: TestReport[];
    dbConnectionError?: boolean;
  };
}

export interface ComprehensiveTestResult {
  totalIssuesFound: number;
  totalIssuesFixed: number;
  remainingIssues: number;
  iterationCount: number;
  success: boolean;
  finalReport: string[];
  duration: number;
}

export interface ProjectTest {
  id: string;
  name: string;
  description?: string;
  category: TestCategory;
  run: () => Promise<boolean>;
  lastRun?: Date;
  lastResult?: boolean;
  details?: Record<string, any>;
}

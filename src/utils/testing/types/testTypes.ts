
export type TestCategory = 'unit' | 'integration' | 'e2e' | 'performance' | 'browser';

export interface TestReport {
  testId: string;
  testName: string;
  result: boolean;
  duration: number;
  timestamp: Date;
  error?: string;
  details: Record<string, any>;
}

export interface TestSuite {
  id: string;
  name: string;
  category: TestCategory;
  testIds: string[];
  description?: string;
}

export interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  timestamp: Date;
  status: string;
}

export interface VerificationResult {
  status: 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  message: string;
  changeId: string;
  description: string;
  details?: Record<string, any>;
}

export interface BrowserInfo {
  name: string;
  version: string;
  os: string;
  mobile: boolean;
  touchEnabled: boolean;
  screenWidth: number;
  screenHeight: number;
}

export interface CompatibilityTest {
  testName: string;
  result: boolean;
  details?: string;
}

export interface CompatibilityTestResult {
  success: boolean;
  browser: BrowserInfo;
  tests: CompatibilityTest[];
  failureReason?: string;
}

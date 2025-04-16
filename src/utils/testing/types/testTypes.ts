
export interface VerificationResult {
  status: 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  message: string;
  changeId: string;
  description: string;
  details?: Record<string, any>;
}

export interface TestReport {
  testId: string;
  testName: string;
  result: boolean;
  duration: number;
  timestamp: Date;
  error?: string;
  details?: Record<string, any>;
}

export interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  timestamp: Date;
  status: string;
}

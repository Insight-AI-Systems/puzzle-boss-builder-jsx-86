
/**
 * Verification result for test operations
 */
export interface VerificationResult {
  description: string;
  success: boolean;
  error?: string | null;
  status?: 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  message?: string;
  changeId?: string;
  details?: Record<string, any>;
}

/**
 * Test report containing results and metadata
 */
export interface TestReport {
  success: boolean;
  passedTests: number;
  totalTests: number;
  taskResults: Record<string, VerificationResult[]>;
  id?: string;
  testId?: string; // Added for backward compatibility
  name?: string;
  testName?: string; // Added for backward compatibility
  status?: string;
  results?: any[];
  result?: boolean; // Added for backward compatibility
  timestamp?: number;
  duration?: number;
  error?: string; // Added for error information
  metadata?: Record<string, any>;
  details?: Record<string, any>;
  // Additional backward compatibility fields
  failureReason?: string;
  browser?: {
    name?: string;
    version?: string;
    os?: string;
    mobile?: boolean;
    touchEnabled?: boolean;
    screenWidth?: number;
    screenHeight?: number;
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
  timestamp: number; // Added timestamp to match implementation
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
  category?: TestCategory;
  tests: any[]; // Primary tests array
  testIds?: string[]; // Added for backward compatibility
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
  metadata?: Record<string, any>;
}

/**
 * Security event type enumeration
 * Note: Define as a string type to ensure compatibility
 */
export type SecurityEventType = 
  'LOGIN' | 
  'LOGOUT' | 
  'PASSWORD_CHANGE' | 
  'ROLE_CHANGE' | 
  'ACCESS_DENIED' | 
  'SUSPICIOUS_ACTIVITY' | 
  'PERMISSION_DENIED' | 
  'PERMISSION_GRANTED' | 
  'LOGIN_ATTEMPT' | 
  'LOGIN_SUCCESS' | 
  'LOGIN_FAILURE' | 
  'PASSWORD_RESET' | 
  'PROFILE_UPDATE' | 
  'ADMIN_ACTION' | 
  'SECURITY_TEST' | 
  'ACCESS_GRANTED';

/**
 * For backward compatibility
 */
export const SecurityEventType = {
  LOGIN: 'LOGIN' as SecurityEventType,
  LOGOUT: 'LOGOUT' as SecurityEventType,
  PASSWORD_CHANGE: 'PASSWORD_CHANGE' as SecurityEventType,
  ROLE_CHANGE: 'ROLE_CHANGE' as SecurityEventType,
  ACCESS_DENIED: 'ACCESS_DENIED' as SecurityEventType,
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY' as SecurityEventType,
  PERMISSION_DENIED: 'PERMISSION_DENIED' as SecurityEventType,
  PERMISSION_GRANTED: 'PERMISSION_GRANTED' as SecurityEventType,
  LOGIN_ATTEMPT: 'LOGIN_ATTEMPT' as SecurityEventType,
  LOGIN_SUCCESS: 'LOGIN_SUCCESS' as SecurityEventType,
  LOGIN_FAILURE: 'LOGIN_FAILURE' as SecurityEventType,
  PASSWORD_RESET: 'PASSWORD_RESET' as SecurityEventType,
  PROFILE_UPDATE: 'PROFILE_UPDATE' as SecurityEventType,
  ADMIN_ACTION: 'ADMIN_ACTION' as SecurityEventType,
  SECURITY_TEST: 'SECURITY_TEST' as SecurityEventType,
  ACCESS_GRANTED: 'ACCESS_GRANTED' as SecurityEventType
};

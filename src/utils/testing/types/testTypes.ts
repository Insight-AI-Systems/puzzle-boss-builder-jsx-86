
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


export interface ProjectTask {
  id: string;
  phase: number;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  dependsOn?: string[];
  testIds?: string[];
}

export interface ProjectTest {
  id: string;
  name: string;
  description: string;
  run: () => Promise<boolean>;
  lastRun?: Date;
  lastResult?: boolean;
  details?: Record<string, any>;
}

// Verification status for code changes
export type VerificationStatus = 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'SKIPPED';

// Interface for code changes that need verification
export interface CodeChange {
  id: string;
  description: string;
  files: string[];
  testIds?: string[];
  verificationStatus?: VerificationStatus;
  verificationMessage?: string;
}

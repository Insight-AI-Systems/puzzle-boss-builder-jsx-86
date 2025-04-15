
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
}

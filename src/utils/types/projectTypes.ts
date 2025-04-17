
export interface ProjectTest {
  id: string;
  name: string;
  description?: string;
  run: () => Promise<boolean>;
  lastRun?: Date;
  lastResult?: boolean;
  details?: Record<string, any>;
}

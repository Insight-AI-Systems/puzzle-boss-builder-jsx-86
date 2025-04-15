
/**
 * Project Tracker - Keeps track of development progress
 */

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

class ProjectTracker {
  private tasks: Record<string, ProjectTask> = {};
  private tests: Record<string, ProjectTest> = {};
  
  constructor() {
    this.initializeProjectPlan();
  }

  private initializeProjectPlan() {
    // Phase 1: Foundation
    this.addTask({
      id: 'setup-project',
      phase: 1,
      name: 'Project Setup',
      description: 'Initialize the project with React, Tailwind CSS, and Supabase',
      status: 'completed'
    });
    
    this.addTask({
      id: 'landing-page',
      phase: 1,
      name: 'Landing Page Components',
      description: 'Set up basic landing page structure',
      status: 'completed'
    });
    
    this.addTask({
      id: 'supabase-connection',
      phase: 1,
      name: 'Supabase Connection',
      description: 'Connect the project to Supabase backend',
      status: 'completed'
    });
    
    // Phase 2: Core Infrastructure
    this.addTask({
      id: 'auth-signup',
      phase: 2,
      name: 'Signup Flow',
      description: 'Implement user registration with email verification',
      status: 'pending',
      testIds: ['test-signup-flow']
    });
    
    this.addTask({
      id: 'auth-login',
      phase: 2,
      name: 'Login Flow',
      description: 'Implement user login and session management',
      status: 'pending',
      dependsOn: ['auth-signup'],
      testIds: ['test-login-flow']
    });
    
    this.addTask({
      id: 'user-profiles',
      phase: 2,
      name: 'User Profiles',
      description: 'Implement user profiles with roles',
      status: 'pending',
      dependsOn: ['auth-signup'],
      testIds: ['test-user-profile']
    });
    
    this.addTask({
      id: 'puzzle-schema',
      phase: 2,
      name: 'Puzzle Database Schema',
      description: 'Set up database tables for puzzles and categories',
      status: 'pending',
      testIds: ['test-puzzle-schema']
    });
    
    this.addTask({
      id: 'game-engine',
      phase: 2,
      name: 'Puzzle Game Engine',
      description: 'Create basic puzzle gameplay mechanics',
      status: 'pending',
      testIds: ['test-puzzle-rendering', 'test-puzzle-interaction']
    });
    
    // Phase 3: Platform Features
    this.addTask({
      id: 'prize-management',
      phase: 3,
      name: 'Prize Management',
      description: 'Set up prize categories and inventory',
      status: 'pending',
      testIds: ['test-prize-management']
    });
    
    this.addTask({
      id: 'credit-system',
      phase: 3,
      name: 'Credit System',
      description: 'Implement credit purchase and management',
      status: 'pending',
      testIds: ['test-credit-transactions']
    });
    
    this.addTask({
      id: 'leaderboards',
      phase: 3,
      name: 'Leaderboards',
      description: 'Build real-time leaderboards',
      status: 'pending',
      dependsOn: ['game-engine'],
      testIds: ['test-leaderboard']
    });
    
    // Phase 4: Admin & Management
    this.addTask({
      id: 'admin-dashboard',
      phase: 4,
      name: 'Admin Dashboard',
      description: 'Create interfaces for each admin role type',
      status: 'pending',
      dependsOn: ['user-profiles'],
      testIds: ['test-admin-access']
    });
    
    this.addTask({
      id: 'analytics',
      phase: 4,
      name: 'Analytics & Reporting',
      description: 'Build tracking for key metrics',
      status: 'pending',
      testIds: ['test-analytics']
    });

    // Initialize tests
    this.addTest({
      id: 'test-signup-flow',
      name: 'Signup Flow Test',
      description: 'Verify user registration process',
      run: async () => {
        console.log('Running signup flow test...');
        // Actual test implementation will be added when developing this feature
        return true;
      }
    });
    
    this.addTest({
      id: 'test-login-flow',
      name: 'Login Flow Test',
      description: 'Verify user login process',
      run: async () => {
        console.log('Running login flow test...');
        // Actual test implementation will be added when developing this feature
        return true;
      }
    });
    
    // Add more test stubs here...
  }

  addTask(task: ProjectTask) {
    this.tasks[task.id] = task;
  }

  updateTaskStatus(taskId: string, status: ProjectTask['status']) {
    if (this.tasks[taskId]) {
      this.tasks[taskId].status = status;
    }
  }

  addTest(test: ProjectTest) {
    this.tests[test.id] = test;
  }

  async runTest(testId: string): Promise<boolean> {
    if (!this.tests[testId]) {
      console.error(`Test ${testId} not found`);
      return false;
    }
    
    const test = this.tests[testId];
    console.log(`Running test: ${test.name}`);
    
    try {
      const result = await test.run();
      test.lastRun = new Date();
      test.lastResult = result;
      return result;
    } catch (error) {
      console.error(`Test ${testId} failed with error:`, error);
      test.lastRun = new Date();
      test.lastResult = false;
      return false;
    }
  }

  async runTaskTests(taskId: string): Promise<boolean> {
    const task = this.tasks[taskId];
    if (!task || !task.testIds || task.testIds.length === 0) {
      return true;
    }
    
    console.log(`Running tests for task: ${task.name}`);
    
    const results = await Promise.all(
      task.testIds.map(testId => this.runTest(testId))
    );
    
    return results.every(result => result === true);
  }

  getNextTasks(): ProjectTask[] {
    const pending = Object.values(this.tasks).filter(task => task.status === 'pending');
    
    return pending.filter(task => {
      if (!task.dependsOn || task.dependsOn.length === 0) {
        return true;
      }
      
      return task.dependsOn.every(dependencyId => 
        this.tasks[dependencyId]?.status === 'completed'
      );
    });
  }

  getTasksByPhase(phase: number): ProjectTask[] {
    return Object.values(this.tasks).filter(task => task.phase === phase);
  }

  getAllTasks(): ProjectTask[] {
    return Object.values(this.tasks).sort((a, b) => a.phase - b.phase);
  }

  getAllTests(): ProjectTest[] {
    return Object.values(this.tests);
  }
}

// Export a singleton instance
export const projectTracker = new ProjectTracker();

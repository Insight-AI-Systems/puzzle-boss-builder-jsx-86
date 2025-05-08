
import { TestManager } from './managers/TestManager';
import { TaskManager } from './managers/TaskManager';
import { getInitialTasks, getInitialTests } from './data/initialTasks';

class ProjectTracker {
  private taskManager: TaskManager;
  private testManager: TestManager;
  
  constructor() {
    this.testManager = TestManager.getInstance();
    this.taskManager = new TaskManager(this.testManager);
    this.initializeProjectPlan();
  }

  private initializeProjectPlan() {
    // Initialize tests
    getInitialTests().forEach(test => {
      this.testManager.addTest(test);
    });

    // Initialize tasks
    getInitialTasks().forEach(task => {
      this.taskManager.addTask(task);
    });
  }

  // Public API methods - delegating to specific managers
  updateTaskStatus(taskId: string, status: 'pending' | 'in-progress' | 'completed' | 'failed') {
    this.taskManager.updateTaskStatus(taskId, status);
  }

  async runTaskTests(taskId: string): Promise<boolean> {
    return this.taskManager.runTaskTests(taskId);
  }

  getNextTasks() {
    return this.taskManager.getNextTasks();
  }

  getTasksByPhase(phase: number) {
    return this.taskManager.getTasksByPhase(phase);
  }

  getAllTasks() {
    return this.taskManager.getAllTasks();
  }

  getAllTests() {
    return this.testManager.getAllTests();
  }
}

// Export a singleton instance
export const projectTracker = new ProjectTracker();

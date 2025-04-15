
import { ProjectTask } from '../types/projectTypes';
import { TestManager } from './TestManager';

export class TaskManager {
  private tasks: Record<string, ProjectTask> = {};
  private testManager: TestManager;

  constructor(testManager: TestManager) {
    this.testManager = testManager;
  }

  addTask(task: ProjectTask) {
    this.tasks[task.id] = task;
  }

  updateTaskStatus(taskId: string, status: ProjectTask['status']) {
    if (this.tasks[taskId]) {
      this.tasks[taskId].status = status;
    }
  }

  async runTaskTests(taskId: string): Promise<boolean> {
    const task = this.tasks[taskId];
    if (!task || !task.testIds) {
      return true;
    }
    
    console.log(`Running tests for task: ${task.name}`);
    return await this.testManager.runTests(task.testIds);
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
}

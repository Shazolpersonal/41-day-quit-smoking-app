// Daily Content model

import {DailyContent, DailyTask} from '../types';

export class DailyContentModel {
  static createTask(data: {
    title: string;
    description: string;
  }): DailyTask {
    return {
      id: this.generateTaskId(),
      title: data.title,
      description: data.description,
      completed: false,
    };
  }

  static completeTask(task: DailyTask): DailyTask {
    return {
      ...task,
      completed: true,
      completedAt: new Date().toISOString(),
    };
  }

  static uncompleteTask(task: DailyTask): DailyTask {
    return {
      ...task,
      completed: false,
      completedAt: undefined,
    };
  }

  static getTaskCompletionPercentage(content: DailyContent): number {
    if (content.tasks.length === 0) return 0;
    const completedCount = content.tasks.filter(task => task.completed).length;
    return (completedCount / content.tasks.length) * 100;
  }

  static isAllTasksCompleted(content: DailyContent): boolean {
    return content.tasks.every(task => task.completed);
  }

  private static generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

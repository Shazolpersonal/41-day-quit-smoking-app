// Craving Log model for tracking cravings

import {CravingLog, TriggerType, CopingStrategyType} from '../types';

export class CravingLogModel {
  static create(data: {
    intensity: number;
    triggers: TriggerType[];
    copingStrategy?: CopingStrategyType;
    notes?: string;
    duration?: number;
    overcome?: boolean;
  }): CravingLog {
    return {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      intensity: data.intensity,
      triggers: data.triggers,
      copingStrategy: data.copingStrategy,
      notes: data.notes,
      duration: data.duration,
      overcome: data.overcome ?? false,
    };
  }

  static update(
    log: CravingLog,
    updates: Partial<Omit<CravingLog, 'id' | 'timestamp'>>,
  ): CravingLog {
    return {
      ...log,
      ...updates,
    };
  }

  static validate(data: Partial<CravingLog>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (
      data.intensity !== undefined &&
      (data.intensity < 1 || data.intensity > 10)
    ) {
      errors.push('ক্রেভিং তীব্রতা ১ থেকে ১০ এর মধ্যে হতে হবে');
    }

    if (data.triggers !== undefined && data.triggers.length === 0) {
      errors.push('অন্তত একটি ট্রিগার নির্বাচন করুন');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static sortByTimestamp(
    logs: CravingLog[],
    ascending = false,
  ): CravingLog[] {
    return [...logs].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return ascending ? timeA - timeB : timeB - timeA;
    });
  }

  static filterByDateRange(
    logs: CravingLog[],
    startDate: string,
    endDate: string,
  ): CravingLog[] {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= start && logTime <= end;
    });
  }

  static getAverageIntensity(logs: CravingLog[]): number {
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, log) => acc + log.intensity, 0);
    return sum / logs.length;
  }

  static getMostCommonTriggers(logs: CravingLog[]): TriggerType[] {
    const triggerCounts = new Map<TriggerType, number>();

    logs.forEach(log => {
      log.triggers.forEach(trigger => {
        triggerCounts.set(trigger, (triggerCounts.get(trigger) || 0) + 1);
      });
    });

    return Array.from(triggerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([trigger]) => trigger);
  }

  private static generateId(): string {
    return `craving_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

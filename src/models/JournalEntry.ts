// Journal Entry model with CRUD operations

import {JournalEntry, MoodType, TriggerType} from '../types';

export class JournalEntryModel {
  static create(data: {
    content: string;
    mood: MoodType;
    triggers: TriggerType[];
    cravingIntensity?: number;
    date?: string;
  }): JournalEntry {
    const now = new Date().toISOString();
    return {
      id: this.generateId(),
      date: data.date || now,
      content: data.content,
      mood: data.mood,
      triggers: data.triggers,
      cravingIntensity: data.cravingIntensity,
      createdAt: now,
      updatedAt: now,
    };
  }

  static update(
    entry: JournalEntry,
    updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>,
  ): JournalEntry {
    return {
      ...entry,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  static validate(data: Partial<JournalEntry>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (data.content !== undefined && data.content.trim().length === 0) {
      errors.push('জার্নাল এন্ট্রি খালি হতে পারে না');
    }

    if (
      data.cravingIntensity !== undefined &&
      (data.cravingIntensity < 1 || data.cravingIntensity > 10)
    ) {
      errors.push('ক্রেভিং তীব্রতা ১ থেকে ১০ এর মধ্যে হতে হবে');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static sortByDate(entries: JournalEntry[], ascending = false): JournalEntry[] {
    return [...entries].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  static filterByDateRange(
    entries: JournalEntry[],
    startDate: string,
    endDate: string,
  ): JournalEntry[] {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return entries.filter(entry => {
      const entryDate = new Date(entry.date).getTime();
      return entryDate >= start && entryDate <= end;
    });
  }

  private static generateId(): string {
    return `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

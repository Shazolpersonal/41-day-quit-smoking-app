// User model with validation and helper methods

import {User} from '../types';

export class UserModel {
  static create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const now = new Date().toISOString();
    return {
      id: this.generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
  }

  static update(user: User, updates: Partial<User>): User {
    return {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  static validate(data: Partial<User>): {valid: boolean; errors: string[]} {
    const errors: string[] = [];

    if (data.cigarettesPerDay !== undefined && data.cigarettesPerDay < 0) {
      errors.push('প্রতিদিন সিগারেটের সংখ্যা ০ এর কম হতে পারে না');
    }

    if (data.pricePerPack !== undefined && data.pricePerPack < 0) {
      errors.push('প্যাকেটের দাম ০ এর কম হতে পারে না');
    }

    if (data.cigarettesPerPack !== undefined && data.cigarettesPerPack < 1) {
      errors.push('প্যাকেটে সিগারেটের সংখ্যা কমপক্ষে ১ হতে হবে');
    }

    if (data.quitDate) {
      const quitDate = new Date(data.quitDate);
      const now = new Date();
      if (quitDate > now) {
        errors.push('ধূমপান ত্যাগের তারিখ ভবিষ্যতে হতে পারে না');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static getDailyCost(user: User): number {
    const packsPerDay = user.cigarettesPerDay / user.cigarettesPerPack;
    return packsPerDay * user.pricePerPack;
  }

  private static generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

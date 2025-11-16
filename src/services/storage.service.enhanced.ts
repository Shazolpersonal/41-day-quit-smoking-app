/**
 * Enhanced Storage Service with Error Handling
 * Wrapper around the original storage service with retry logic and better error handling
 */

import {StorageService} from './storage.service';
import {errorHandler, retryOperation} from '../utils/errorHandler';
import {User, Progress, JournalEntry, Settings, CravingLog} from '../types';

class EnhancedStorageService {
  private storage = new StorageService();

  /**
   * Save user with retry logic
   */
  async saveUser(user: User): Promise<boolean> {
    try {
      return await retryOperation(
        () => this.storage.saveUser(user),
        3,
        500,
        'saveUser'
      );
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('ব্যবহারকারীর তথ্য সংরক্ষণ করতে ব্যর্থ', 'saveUser'),
      );
      return false;
    }
  }

  /**
   * Get user with error handling
   */
  async getUser(): Promise<User | null> {
    try {
      return await this.storage.getUser();
    } catch (error) {
      errorHandler.handleSilent(error as Error, 'getUser');
      return null;
    }
  }

  /**
   * Update user with retry logic
   */
  async updateUser(updates: Partial<User>): Promise<boolean> {
    try {
      return await retryOperation(
        () => this.storage.updateUser(updates),
        3,
        500,
        'updateUser'
      );
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('ব্যবহারকারীর তথ্য আপডেট করতে ব্যর্থ', 'updateUser'),
      );
      return false;
    }
  }

  /**
   * Save progress with retry logic
   */
  async saveProgress(progress: Progress): Promise<boolean> {
    try {
      return await retryOperation(
        () => this.storage.saveProgress(progress),
        3,
        500,
        'saveProgress'
      );
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('অগ্রগতি সংরক্ষণ করতে ব্যর্থ', 'saveProgress'),
      );
      return false;
    }
  }

  /**
   * Get progress with error handling
   */
  async getProgress(): Promise<Progress | null> {
    try {
      return await this.storage.getProgress();
    } catch (error) {
      errorHandler.handleSilent(error as Error, 'getProgress');
      return null;
    }
  }

  /**
   * Save journal entry with retry logic
   */
  async saveJournalEntry(entry: JournalEntry): Promise<boolean> {
    try {
      return await retryOperation(
        () => this.storage.saveJournalEntry(entry),
        3,
        500,
        'saveJournalEntry'
      );
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('জার্নাল এন্ট্রি সংরক্ষণ করতে ব্যর্থ', 'saveJournalEntry'),
      );
      return false;
    }
  }

  /**
   * Get journal entries with error handling
   */
  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      return await this.storage.getJournalEntries();
    } catch (error) {
      errorHandler.handleSilent(error as Error, 'getJournalEntries');
      return [];
    }
  }

  /**
   * Update journal entry with retry logic
   */
  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<boolean> {
    try {
      return await retryOperation(
        () => this.storage.updateJournalEntry(id, updates),
        3,
        500,
        'updateJournalEntry'
      );
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('জার্নাল এন্ট্রি আপডেট করতে ব্যর্থ', 'updateJournalEntry'),
      );
      return false;
    }
  }

  /**
   * Delete journal entry with retry logic
   */
  async deleteJournalEntry(id: string): Promise<boolean> {
    try {
      return await retryOperation(
        () => this.storage.deleteJournalEntry(id),
        3,
        500,
        'deleteJournalEntry'
      );
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('জার্নাল এন্ট্রি মুছে ফেলতে ব্যর্থ', 'deleteJournalEntry'),
      );
      return false;
    }
  }

  /**
   * Save settings with retry logic
   */
  async saveSettings(settings: Settings): Promise<boolean> {
    try {
      return await retryOperation(
        () => this.storage.saveSettings(settings),
        3,
        500,
        'saveSettings'
      );
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('সেটিংস সংরক্ষণ করতে ব্যর্থ', 'saveSettings'),
      );
      return false;
    }
  }

  /**
   * Get settings with error handling
   */
  async getSettings(): Promise<Settings | null> {
    try {
      return await this.storage.getSettings();
    } catch (error) {
      errorHandler.handleSilent(error as Error, 'getSettings');
      return null;
    }
  }

  /**
   * Save craving log with retry logic
   */
  async saveCravingLog(log: CravingLog): Promise<boolean> {
    try {
      return await retryOperation(
        () => this.storage.saveCravingLog(log),
        3,
        500,
        'saveCravingLog'
      );
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('ক্রেভিং লগ সংরক্ষণ করতে ব্যর্থ', 'saveCravingLog'),
      );
      return false;
    }
  }

  /**
   * Get craving logs with error handling
   */
  async getCravingLogs(): Promise<CravingLog[]> {
    try {
      return await this.storage.getCravingLogs();
    } catch (error) {
      errorHandler.handleSilent(error as Error, 'getCravingLogs');
      return [];
    }
  }

  /**
   * Export all data with error handling
   */
  async exportAllData(): Promise<string | null> {
    try {
      return await this.storage.exportAllData();
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('ডেটা এক্সপোর্ট করতে ব্যর্থ', 'exportAllData'),
      );
      return null;
    }
  }

  /**
   * Clear all data with confirmation
   */
  async clearAllData(): Promise<boolean> {
    try {
      return await retryOperation(
        () => this.storage.clearAllData(),
        2,
        500,
        'clearAllData'
      );
    } catch (error) {
      errorHandler.handle(
        errorHandler.createStorageError('ডেটা মুছে ফেলতে ব্যর্থ', 'clearAllData'),
      );
      return false;
    }
  }
}

// Export singleton instance
export const enhancedStorage = new EnhancedStorageService();

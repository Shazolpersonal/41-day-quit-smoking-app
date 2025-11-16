import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Progress, JournalEntry, TaskCompletion, Settings, CravingLog } from '../types';

/* eslint-disable no-console */

// Storage keys
const STORAGE_KEYS = {
  USER: '@quit_smoking_user',
  PROGRESS: '@quit_smoking_progress',
  JOURNAL_ENTRIES: '@quit_smoking_journal_entries',
  TASK_COMPLETIONS: '@quit_smoking_task_completions',
  SETTINGS: '@quit_smoking_settings',
  CRAVING_LOGS: '@quit_smoking_craving_logs',
} as const;

/**
 * Storage Service
 * Provides AsyncStorage wrapper with error handling and data validation
 */
class StorageService {
  // ============================================
  // User Methods
  // ============================================

  /**
   * Save user data to storage
   * @param user User object to save
   * @returns Promise<boolean> Success status
   */
  async saveUser(user: User): Promise<boolean> {
    try {
      // Validate user data
      if (!this.validateUser(user)) {
        throw new Error('Invalid user data');
      }

      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  }

  /**
   * Get user data from storage
   * @returns Promise<User | null> User object or null if not found
   */
  async getUser(): Promise<User | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (jsonValue === null) {
        return null;
      }

      const user = JSON.parse(jsonValue) as User;
      
      // Validate retrieved data
      if (!this.validateUser(user)) {
        throw new Error('Invalid user data in storage');
      }

      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Update user data in storage
   * @param updates Partial user object with fields to update
   * @returns Promise<boolean> Success status
   */
  async updateUser(updates: Partial<User>): Promise<boolean> {
    try {
      const existingUser = await this.getUser();
      
      if (!existingUser) {
        throw new Error('No existing user found');
      }

      const updatedUser: User = {
        ...existingUser,
        ...updates,
      };

      return await this.saveUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  // ============================================
  // Progress Methods
  // ============================================

  /**
   * Save progress data to storage
   * @param progress Progress object to save
   * @returns Promise<boolean> Success status
   */
  async saveProgress(progress: Progress): Promise<boolean> {
    try {
      // Validate progress data
      if (!this.validateProgress(progress)) {
        throw new Error('Invalid progress data');
      }

      const jsonValue = JSON.stringify(progress);
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  /**
   * Get progress data from storage
   * @returns Promise<Progress | null> Progress object or null if not found
   */
  async getProgress(): Promise<Progress | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (jsonValue === null) {
        return null;
      }

      const progress = JSON.parse(jsonValue) as Progress;
      
      // Validate retrieved data
      if (!this.validateProgress(progress)) {
        throw new Error('Invalid progress data in storage');
      }

      return progress;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  /**
   * Update progress data in storage
   * @param updates Partial progress object with fields to update
   * @returns Promise<boolean> Success status
   */
  async updateProgress(updates: Partial<Progress>): Promise<boolean> {
    try {
      const existingProgress = await this.getProgress();
      
      if (!existingProgress) {
        throw new Error('No existing progress found');
      }

      const updatedProgress: Progress = {
        ...existingProgress,
        ...updates,
      };

      return await this.saveProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  }

  // ============================================
  // Journal Entry Methods
  // ============================================

  /**
   * Save a journal entry to storage
   * @param entry JournalEntry object to save
   * @returns Promise<boolean> Success status
   */
  async saveJournalEntry(entry: JournalEntry): Promise<boolean> {
    try {
      // Validate journal entry
      if (!this.validateJournalEntry(entry)) {
        throw new Error('Invalid journal entry data');
      }

      // Get existing entries
      const entries = await this.getJournalEntries();
      
      // Check if entry already exists (update scenario)
      const existingIndex = entries.findIndex(e => e.id === entry.id);
      
      if (existingIndex >= 0) {
        // Update existing entry
        entries[existingIndex] = entry;
      } else {
        // Add new entry
        entries.push(entry);
      }

      // Save updated entries array
      const jsonValue = JSON.stringify(entries);
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      return false;
    }
  }

  /**
   * Get all journal entries from storage
   * @param startDate Optional start date for filtering (ISO string)
   * @param endDate Optional end date for filtering (ISO string)
   * @returns Promise<JournalEntry[]> Array of journal entries
   */
  async getJournalEntries(
    startDate?: string,
    endDate?: string,
  ): Promise<JournalEntry[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
      
      if (jsonValue === null) {
        return [];
      }

      let entries = JSON.parse(jsonValue) as JournalEntry[];

      // Validate all entries
      entries = entries.filter(entry => this.validateJournalEntry(entry));

      // Apply date filtering if provided
      if (startDate || endDate) {
        entries = this.filterJournalEntriesByDate(entries, startDate, endDate);
      }

      // Sort by date (newest first)
      entries.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      return entries;
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  }

  /**
   * Get a single journal entry by ID
   * @param id Journal entry ID
   * @returns Promise<JournalEntry | null> Journal entry or null if not found
   */
  async getJournalEntryById(id: string): Promise<JournalEntry | null> {
    try {
      const entries = await this.getJournalEntries();
      return entries.find(entry => entry.id === id) || null;
    } catch (error) {
      console.error('Error getting journal entry by ID:', error);
      return null;
    }
  }

  /**
   * Delete a journal entry by ID
   * @param id Journal entry ID
   * @returns Promise<boolean> Success status
   */
  async deleteJournalEntry(id: string): Promise<boolean> {
    try {
      const entries = await this.getJournalEntries();
      const filteredEntries = entries.filter(entry => entry.id !== id);
      
      const jsonValue = JSON.stringify(filteredEntries);
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, jsonValue);
      return true;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      return false;
    }
  }

  /**
   * Filter journal entries by date range
   * @param entries Array of journal entries
   * @param startDate Optional start date (ISO string)
   * @param endDate Optional end date (ISO string)
   * @returns JournalEntry[] Filtered entries
   */
  private filterJournalEntriesByDate(
    entries: JournalEntry[],
    startDate?: string,
    endDate?: string,
  ): JournalEntry[] {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date).getTime();
      
      if (startDate) {
        const start = new Date(startDate).getTime();
        if (entryDate < start) {
          return false;
        }
      }
      
      if (endDate) {
        const end = new Date(endDate).getTime();
        if (entryDate > end) {
          return false;
        }
      }
      
      return true;
    });
  }

  // ============================================
  // Task Completion Methods
  // ============================================

  /**
   * Save a task completion to storage
   * @param completion TaskCompletion object to save
   * @returns Promise<boolean> Success status
   */
  async saveTaskCompletion(completion: TaskCompletion): Promise<boolean> {
    try {
      // Validate task completion
      if (!this.validateTaskCompletion(completion)) {
        throw new Error('Invalid task completion data');
      }

      // Get existing completions
      const completions = await this.getTaskCompletions();
      
      // Check if completion already exists (update scenario)
      const existingIndex = completions.findIndex(
        c => c.taskId === completion.taskId && c.day === completion.day,
      );
      
      if (existingIndex >= 0) {
        // Update existing completion
        completions[existingIndex] = completion;
      } else {
        // Add new completion
        completions.push(completion);
      }

      // Save updated completions array
      const jsonValue = JSON.stringify(completions);
      await AsyncStorage.setItem(STORAGE_KEYS.TASK_COMPLETIONS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving task completion:', error);
      return false;
    }
  }

  /**
   * Get all task completions from storage
   * @param day Optional day number for filtering
   * @returns Promise<TaskCompletion[]> Array of task completions
   */
  async getTaskCompletions(day?: number): Promise<TaskCompletion[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TASK_COMPLETIONS);
      
      if (jsonValue === null) {
        return [];
      }

      let completions = JSON.parse(jsonValue) as TaskCompletion[];

      // Validate all completions
      completions = completions.filter(completion => 
        this.validateTaskCompletion(completion),
      );

      // Apply day filtering if provided
      if (day !== undefined) {
        completions = completions.filter(c => c.day === day);
      }

      return completions;
    } catch (error) {
      console.error('Error getting task completions:', error);
      return [];
    }
  }

  /**
   * Get task completion status for a specific task and day
   * @param taskId Task ID
   * @param day Day number
   * @returns Promise<TaskCompletion | null> Task completion or null if not found
   */
  async getTaskCompletion(
    taskId: string,
    day: number,
  ): Promise<TaskCompletion | null> {
    try {
      const completions = await this.getTaskCompletions(day);
      return completions.find(c => c.taskId === taskId) || null;
    } catch (error) {
      console.error('Error getting task completion:', error);
      return null;
    }
  }

  /**
   * Get all completed tasks for a specific day
   * @param day Day number
   * @returns Promise<TaskCompletion[]> Array of completed tasks
   */
  async getCompletedTasksForDay(day: number): Promise<TaskCompletion[]> {
    try {
      const completions = await this.getTaskCompletions(day);
      return completions.filter(c => c.completed);
    } catch (error) {
      console.error('Error getting completed tasks for day:', error);
      return [];
    }
  }

  // ============================================
  // Settings Methods
  // ============================================

  /**
   * Save settings data to storage
   * @param settings Settings object to save
   * @returns Promise<boolean> Success status
   */
  async saveSettings(settings: Settings): Promise<boolean> {
    try {
      // Validate settings data
      if (!this.validateSettings(settings)) {
        throw new Error('Invalid settings data');
      }

      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  /**
   * Get settings data from storage
   * @returns Promise<Settings | null> Settings object or null if not found
   */
  async getSettings(): Promise<Settings | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (jsonValue === null) {
        return null;
      }

      const settings = JSON.parse(jsonValue) as Settings;
      
      // Validate retrieved data
      if (!this.validateSettings(settings)) {
        throw new Error('Invalid settings data in storage');
      }

      return settings;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  /**
   * Update settings data in storage
   * @param updates Partial settings object with fields to update
   * @returns Promise<boolean> Success status
   */
  async updateSettings(updates: Partial<Settings>): Promise<boolean> {
    try {
      const existingSettings = await this.getSettings();
      
      if (!existingSettings) {
        throw new Error('No existing settings found');
      }

      const updatedSettings: Settings = {
        ...existingSettings,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return await this.saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }

  // ============================================
  // Craving Log Methods
  // ============================================

  /**
   * Save a craving log to storage
   * @param log CravingLog object to save
   * @returns Promise<boolean> Success status
   */
  async saveCravingLog(log: CravingLog): Promise<boolean> {
    try {
      // Validate craving log
      if (!this.validateCravingLog(log)) {
        throw new Error('Invalid craving log data');
      }

      // Get existing logs
      const logs = await this.getCravingLogs();
      
      // Check if log already exists (update scenario)
      const existingIndex = logs.findIndex(l => l.id === log.id);
      
      if (existingIndex >= 0) {
        // Update existing log
        logs[existingIndex] = log;
      } else {
        // Add new log
        logs.push(log);
      }

      // Save updated logs array
      const jsonValue = JSON.stringify(logs);
      await AsyncStorage.setItem(STORAGE_KEYS.CRAVING_LOGS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving craving log:', error);
      return false;
    }
  }

  /**
   * Get all craving logs from storage
   * @param startDate Optional start date for filtering (ISO string)
   * @param endDate Optional end date for filtering (ISO string)
   * @returns Promise<CravingLog[]> Array of craving logs
   */
  async getCravingLogs(
    startDate?: string,
    endDate?: string,
  ): Promise<CravingLog[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CRAVING_LOGS);
      
      if (jsonValue === null) {
        return [];
      }

      let logs = JSON.parse(jsonValue) as CravingLog[];

      // Validate all logs
      logs = logs.filter(log => this.validateCravingLog(log));

      // Apply date filtering if provided
      if (startDate || endDate) {
        logs = this.filterCravingLogsByDate(logs, startDate, endDate);
      }

      // Sort by timestamp (newest first)
      logs.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      return logs;
    } catch (error) {
      console.error('Error getting craving logs:', error);
      return [];
    }
  }

  /**
   * Filter craving logs by date range
   * @param logs Array of craving logs
   * @param startDate Optional start date (ISO string)
   * @param endDate Optional end date (ISO string)
   * @returns CravingLog[] Filtered logs
   */
  private filterCravingLogsByDate(
    logs: CravingLog[],
    startDate?: string,
    endDate?: string,
  ): CravingLog[] {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp).getTime();
      
      if (startDate) {
        const start = new Date(startDate).getTime();
        if (logDate < start) {
          return false;
        }
      }
      
      if (endDate) {
        const end = new Date(endDate).getTime();
        if (logDate > end) {
          return false;
        }
      }
      
      return true;
    });
  }

  // ============================================
  // Data Management Methods
  // ============================================

  /**
   * Export all app data for backup
   * @returns Promise<string | null> JSON string of all data or null on error
   */
  async exportAllData(): Promise<string | null> {
    try {
      const [user, progress, journalEntries, taskCompletions, settings, cravingLogs] = 
        await Promise.all([
          this.getUser(),
          this.getProgress(),
          this.getJournalEntries(),
          this.getTaskCompletions(),
          this.getSettings(),
          this.getCravingLogs(),
        ]);

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {
          user,
          progress,
          journalEntries,
          taskCompletions,
          settings,
          cravingLogs,
        },
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  /**
   * Clear all app data from storage
   * @returns Promise<boolean> Success status
   */
  async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.PROGRESS,
        STORAGE_KEYS.JOURNAL_ENTRIES,
        STORAGE_KEYS.TASK_COMPLETIONS,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.CRAVING_LOGS,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  // ============================================
  // Validation Methods
  // ============================================

  /**
   * Validate user data structure
   * @param user User object to validate
   * @returns boolean Validation result
   */
  private validateUser(user: User): boolean {
    if (!user || typeof user !== 'object') {
      return false;
    }

    // Check required fields
    if (typeof user.id !== 'string' || user.id.trim() === '') {
      return false;
    }

    if (typeof user.quitDate !== 'string' || user.quitDate.trim() === '') {
      return false;
    }

    if (typeof user.cigarettesPerDay !== 'number' || user.cigarettesPerDay < 0) {
      return false;
    }

    if (typeof user.pricePerPack !== 'number' || user.pricePerPack < 0) {
      return false;
    }

    if (typeof user.cigarettesPerPack !== 'number' || user.cigarettesPerPack <= 0) {
      return false;
    }

    if (typeof user.createdAt !== 'string' || user.createdAt.trim() === '') {
      return false;
    }

    if (typeof user.updatedAt !== 'string' || user.updatedAt.trim() === '') {
      return false;
    }

    return true;
  }

  /**
   * Validate progress data structure
   * @param progress Progress object to validate
   * @returns boolean Validation result
   */
  private validateProgress(progress: Progress): boolean {
    if (!progress || typeof progress !== 'object') {
      return false;
    }

    // Check required fields
    if (typeof progress.currentDay !== 'number' || progress.currentDay < 0) {
      return false;
    }

    if (typeof progress.moneySaved !== 'number' || progress.moneySaved < 0) {
      return false;
    }

    if (typeof progress.cigarettesNotSmoked !== 'number' || progress.cigarettesNotSmoked < 0) {
      return false;
    }

    if (!progress.smokeFreeTime || typeof progress.smokeFreeTime !== 'object') {
      return false;
    }

    if (!Array.isArray(progress.milestones)) {
      return false;
    }

    if (!Array.isArray(progress.healthBenefits)) {
      return false;
    }

    if (typeof progress.lastUpdated !== 'string' || progress.lastUpdated.trim() === '') {
      return false;
    }

    return true;
  }

  /**
   * Validate journal entry data structure
   * @param entry JournalEntry object to validate
   * @returns boolean Validation result
   */
  private validateJournalEntry(entry: JournalEntry): boolean {
    if (!entry || typeof entry !== 'object') {
      return false;
    }

    // Check required fields
    if (typeof entry.id !== 'string' || entry.id.trim() === '') {
      return false;
    }

    if (typeof entry.date !== 'string' || entry.date.trim() === '') {
      return false;
    }

    if (typeof entry.content !== 'string') {
      return false;
    }

    if (typeof entry.mood !== 'string' || entry.mood.trim() === '') {
      return false;
    }

    if (!Array.isArray(entry.triggers)) {
      return false;
    }

    if (entry.cravingIntensity !== undefined) {
      if (
        typeof entry.cravingIntensity !== 'number' ||
        entry.cravingIntensity < 1 ||
        entry.cravingIntensity > 10
      ) {
        return false;
      }
    }

    if (typeof entry.createdAt !== 'string' || entry.createdAt.trim() === '') {
      return false;
    }

    if (typeof entry.updatedAt !== 'string' || entry.updatedAt.trim() === '') {
      return false;
    }

    return true;
  }

  /**
   * Validate task completion data structure
   * @param completion TaskCompletion object to validate
   * @returns boolean Validation result
   */
  private validateTaskCompletion(completion: TaskCompletion): boolean {
    if (!completion || typeof completion !== 'object') {
      return false;
    }

    // Check required fields
    if (typeof completion.taskId !== 'string' || completion.taskId.trim() === '') {
      return false;
    }

    if (typeof completion.day !== 'number' || completion.day < 1 || completion.day > 41) {
      return false;
    }

    if (typeof completion.completed !== 'boolean') {
      return false;
    }

    if (completion.completedAt !== undefined) {
      if (typeof completion.completedAt !== 'string' || completion.completedAt.trim() === '') {
        return false;
      }
    }

    return true;
  }

  /**
   * Validate settings data structure
   * @param settings Settings object to validate
   * @returns boolean Validation result
   */
  private validateSettings(settings: Settings): boolean {
    if (!settings || typeof settings !== 'object') {
      return false;
    }

    // Check notifications settings
    if (!settings.notifications || typeof settings.notifications !== 'object') {
      return false;
    }

    if (typeof settings.notifications.enabled !== 'boolean') {
      return false;
    }

    if (typeof settings.notifications.dailyReminder !== 'boolean') {
      return false;
    }

    if (typeof settings.notifications.dailyReminderTime !== 'string') {
      return false;
    }

    // Check appearance settings
    if (!settings.appearance || typeof settings.appearance !== 'object') {
      return false;
    }

    if (!['small', 'medium', 'large'].includes(settings.appearance.fontSize)) {
      return false;
    }

    if (!['light', 'dark'].includes(settings.appearance.theme)) {
      return false;
    }

    // Check privacy settings
    if (!settings.privacy || typeof settings.privacy !== 'object') {
      return false;
    }

    if (typeof settings.privacy.pinLock !== 'boolean') {
      return false;
    }

    // Check emergency contacts
    if (!Array.isArray(settings.emergencyContacts)) {
      return false;
    }

    // Check updatedAt
    if (typeof settings.updatedAt !== 'string' || settings.updatedAt.trim() === '') {
      return false;
    }

    return true;
  }

  /**
   * Validate craving log data structure
   * @param log CravingLog object to validate
   * @returns boolean Validation result
   */
  private validateCravingLog(log: CravingLog): boolean {
    if (!log || typeof log !== 'object') {
      return false;
    }

    // Check required fields
    if (typeof log.id !== 'string' || log.id.trim() === '') {
      return false;
    }

    if (typeof log.timestamp !== 'string' || log.timestamp.trim() === '') {
      return false;
    }

    if (typeof log.intensity !== 'number' || log.intensity < 1 || log.intensity > 10) {
      return false;
    }

    if (!Array.isArray(log.triggers)) {
      return false;
    }

    if (typeof log.overcome !== 'boolean') {
      return false;
    }

    return true;
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Check if user data exists in storage
   * @returns Promise<boolean> True if user exists
   */
  async hasUser(): Promise<boolean> {
    try {
      const user = await this.getUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if progress data exists in storage
   * @returns Promise<boolean> True if progress exists
   */
  async hasProgress(): Promise<boolean> {
    try {
      const progress = await this.getProgress();
      return progress !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if settings data exists in storage
   * @returns Promise<boolean> True if settings exists
   */
  async hasSettings(): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      return settings !== null;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;

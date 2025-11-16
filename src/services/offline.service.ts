/**
 * Offline Service
 * Manages offline functionality and data synchronization
 * Ensures app works without internet connection
 */

import {storageService} from './storage.service';

/* eslint-disable no-console */

class OfflineService {
  /**
   * Check if all required data is available offline
   * @returns Promise<boolean> True if app can work offline
   */
  async isOfflineReady(): Promise<boolean> {
    try {
      // Check if user data exists
      const hasUser = await storageService.hasUser();
      
      // Check if progress data exists
      const hasProgress = await storageService.hasProgress();
      
      // Check if settings data exists
      const hasSettings = await storageService.hasSettings();
      
      // App is offline-ready if user data exists
      // Progress and settings can be created on-the-fly
      return hasUser;
    } catch (error) {
      console.error('Error checking offline readiness:', error);
      return false;
    }
  }

  /**
   * Verify all static content is bundled with app
   * @returns boolean True if all content is available
   */
  verifyStaticContent(): boolean {
    try {
      // Import all static data to verify it's bundled
      const dailyContent = require('../data/dailyContent');
      const islamicContent = require('../data/islamicContent');
      const healthTimeline = require('../data/healthTimeline');
      const milestones = require('../data/milestones');
      
      // Verify data is not empty
      const hasDaily = dailyContent.dailyContent && dailyContent.dailyContent.length > 0;
      const hasIslamic = islamicContent.duas && islamicContent.duas.length > 0;
      const hasHealth = healthTimeline.healthTimeline && healthTimeline.healthTimeline.length > 0;
      const hasMilestones = milestones.milestones && milestones.milestones.length > 0;
      
      return hasDaily && hasIslamic && hasHealth && hasMilestones;
    } catch (error) {
      console.error('Error verifying static content:', error);
      return false;
    }
  }

  /**
   * Get offline status information
   * @returns Promise<OfflineStatus> Offline status details
   */
  async getOfflineStatus(): Promise<OfflineStatus> {
    const isReady = await this.isOfflineReady();
    const hasStaticContent = this.verifyStaticContent();
    
    return {
      isOfflineReady: isReady,
      hasStaticContent,
      hasUserData: await storageService.hasUser(),
      hasProgressData: await storageService.hasProgress(),
      hasSettingsData: await storageService.hasSettings(),
    };
  }

  /**
   * Prepare app for offline use
   * Ensures all necessary data is cached
   * @returns Promise<boolean> Success status
   */
  async prepareForOffline(): Promise<boolean> {
    try {
      // Verify static content is available
      if (!this.verifyStaticContent()) {
        console.error('Static content not available');
        return false;
      }

      // Check if user data exists
      const hasUser = await storageService.hasUser();
      if (!hasUser) {
        console.log('No user data - app needs onboarding first');
        return false;
      }

      // Ensure progress data exists
      const hasProgress = await storageService.hasProgress();
      if (!hasProgress) {
        console.log('Creating initial progress data');
        const {ProgressModel} = require('../models/Progress');
        const initialProgress = ProgressModel.create();
        await storageService.saveProgress(initialProgress);
      }

      // Ensure settings data exists
      const hasSettings = await storageService.hasSettings();
      if (!hasSettings) {
        console.log('Creating initial settings data');
        const {SettingsModel} = require('../models/Settings');
        const initialSettings = SettingsModel.create();
        await storageService.saveSettings(initialSettings);
      }

      console.log('App prepared for offline use');
      return true;
    } catch (error) {
      console.error('Error preparing for offline:', error);
      return false;
    }
  }

  /**
   * Export all data for backup
   * @returns Promise<string | null> JSON string of all data
   */
  async exportData(): Promise<string | null> {
    try {
      return await storageService.exportAllData();
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  /**
   * Get storage usage information
   * @returns Promise<StorageInfo> Storage usage details
   */
  async getStorageInfo(): Promise<StorageInfo> {
    try {
      const [user, progress, journalEntries, taskCompletions, settings, cravingLogs] = 
        await Promise.all([
          storageService.getUser(),
          storageService.getProgress(),
          storageService.getJournalEntries(),
          storageService.getTaskCompletions(),
          storageService.getSettings(),
          storageService.getCravingLogs(),
        ]);

      // Calculate approximate sizes (rough estimate)
      const userSize = user ? JSON.stringify(user).length : 0;
      const progressSize = progress ? JSON.stringify(progress).length : 0;
      const journalSize = JSON.stringify(journalEntries).length;
      const taskSize = JSON.stringify(taskCompletions).length;
      const settingsSize = settings ? JSON.stringify(settings).length : 0;
      const cravingSize = JSON.stringify(cravingLogs).length;

      const totalSize = userSize + progressSize + journalSize + taskSize + settingsSize + cravingSize;

      return {
        totalSize,
        userSize,
        progressSize,
        journalSize,
        taskSize,
        settingsSize,
        cravingSize,
        journalEntryCount: journalEntries.length,
        taskCompletionCount: taskCompletions.length,
        cravingLogCount: cravingLogs.length,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        totalSize: 0,
        userSize: 0,
        progressSize: 0,
        journalSize: 0,
        taskSize: 0,
        settingsSize: 0,
        cravingSize: 0,
        journalEntryCount: 0,
        taskCompletionCount: 0,
        cravingLogCount: 0,
      };
    }
  }
}

/**
 * Offline status interface
 */
export interface OfflineStatus {
  isOfflineReady: boolean;
  hasStaticContent: boolean;
  hasUserData: boolean;
  hasProgressData: boolean;
  hasSettingsData: boolean;
}

/**
 * Storage information interface
 */
export interface StorageInfo {
  totalSize: number;
  userSize: number;
  progressSize: number;
  journalSize: number;
  taskSize: number;
  settingsSize: number;
  cravingSize: number;
  journalEntryCount: number;
  taskCompletionCount: number;
  cravingLogCount: number;
}

// Export singleton instance
export const offlineService = new OfflineService();
export default offlineService;

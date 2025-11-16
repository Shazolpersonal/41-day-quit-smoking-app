/**
 * Tests for Offline Service
 */

import {offlineService, OfflineStatus, StorageInfo} from '../offline.service';
import {storageService} from '../storage.service';

// Mock storage service
jest.mock('../storage.service');

describe('OfflineService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isOfflineReady', () => {
    it('should return true when user data exists', async () => {
      (storageService.hasUser as jest.Mock).mockResolvedValue(true);
      (storageService.hasProgress as jest.Mock).mockResolvedValue(true);
      (storageService.hasSettings as jest.Mock).mockResolvedValue(true);

      const result = await offlineService.isOfflineReady();

      expect(result).toBe(true);
      expect(storageService.hasUser).toHaveBeenCalled();
    });

    it('should return false when user data does not exist', async () => {
      (storageService.hasUser as jest.Mock).mockResolvedValue(false);

      const result = await offlineService.isOfflineReady();

      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      (storageService.hasUser as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await offlineService.isOfflineReady();

      expect(result).toBe(false);
    });
  });

  describe('verifyStaticContent', () => {
    it('should return true when all static content is available', () => {
      const result = offlineService.verifyStaticContent();

      expect(result).toBe(true);
    });
  });

  describe('getOfflineStatus', () => {
    it('should return complete offline status', async () => {
      (storageService.hasUser as jest.Mock).mockResolvedValue(true);
      (storageService.hasProgress as jest.Mock).mockResolvedValue(true);
      (storageService.hasSettings as jest.Mock).mockResolvedValue(true);

      const status: OfflineStatus = await offlineService.getOfflineStatus();

      expect(status).toHaveProperty('isOfflineReady');
      expect(status).toHaveProperty('hasStaticContent');
      expect(status).toHaveProperty('hasUserData');
      expect(status).toHaveProperty('hasProgressData');
      expect(status).toHaveProperty('hasSettingsData');
      expect(status.hasUserData).toBe(true);
    });
  });

  describe('prepareForOffline', () => {
    it('should prepare app for offline use when user exists', async () => {
      (storageService.hasUser as jest.Mock).mockResolvedValue(true);
      (storageService.hasProgress as jest.Mock).mockResolvedValue(true);
      (storageService.hasSettings as jest.Mock).mockResolvedValue(true);

      const result = await offlineService.prepareForOffline();

      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      (storageService.hasUser as jest.Mock).mockResolvedValue(false);

      const result = await offlineService.prepareForOffline();

      expect(result).toBe(false);
    });

    it('should create progress data if missing', async () => {
      (storageService.hasUser as jest.Mock).mockResolvedValue(true);
      (storageService.hasProgress as jest.Mock).mockResolvedValue(false);
      (storageService.hasSettings as jest.Mock).mockResolvedValue(true);
      (storageService.saveProgress as jest.Mock).mockResolvedValue(true);

      const result = await offlineService.prepareForOffline();

      expect(result).toBe(true);
      expect(storageService.saveProgress).toHaveBeenCalled();
    });

    it('should create settings data if missing', async () => {
      (storageService.hasUser as jest.Mock).mockResolvedValue(true);
      (storageService.hasProgress as jest.Mock).mockResolvedValue(true);
      (storageService.hasSettings as jest.Mock).mockResolvedValue(false);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

      const result = await offlineService.prepareForOffline();

      expect(result).toBe(true);
      expect(storageService.saveSettings).toHaveBeenCalled();
    });
  });

  describe('exportData', () => {
    it('should export all data successfully', async () => {
      const mockData = JSON.stringify({user: {}, progress: {}});
      (storageService.exportAllData as jest.Mock).mockResolvedValue(mockData);

      const result = await offlineService.exportData();

      expect(result).toBe(mockData);
      expect(storageService.exportAllData).toHaveBeenCalled();
    });

    it('should return null on error', async () => {
      (storageService.exportAllData as jest.Mock).mockRejectedValue(new Error('Export error'));

      const result = await offlineService.exportData();

      expect(result).toBeNull();
    });
  });

  describe('getStorageInfo', () => {
    it('should return storage information', async () => {
      const mockUser = {id: '1', quitDate: '2024-01-01'};
      const mockProgress = {currentDay: 1};
      const mockJournalEntries = [{id: '1'}, {id: '2'}];
      const mockTaskCompletions = [{taskId: '1'}];
      const mockSettings = {notifications: {enabled: true}};
      const mockCravingLogs = [{id: '1'}];

      (storageService.getUser as jest.Mock).mockResolvedValue(mockUser);
      (storageService.getProgress as jest.Mock).mockResolvedValue(mockProgress);
      (storageService.getJournalEntries as jest.Mock).mockResolvedValue(mockJournalEntries);
      (storageService.getTaskCompletions as jest.Mock).mockResolvedValue(mockTaskCompletions);
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (storageService.getCravingLogs as jest.Mock).mockResolvedValue(mockCravingLogs);

      const info: StorageInfo = await offlineService.getStorageInfo();

      expect(info).toHaveProperty('totalSize');
      expect(info).toHaveProperty('journalEntryCount');
      expect(info.journalEntryCount).toBe(2);
      expect(info.taskCompletionCount).toBe(1);
      expect(info.cravingLogCount).toBe(1);
    });

    it('should handle errors and return zero values', async () => {
      (storageService.getUser as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const info: StorageInfo = await offlineService.getStorageInfo();

      expect(info.totalSize).toBe(0);
      expect(info.journalEntryCount).toBe(0);
    });
  });
});

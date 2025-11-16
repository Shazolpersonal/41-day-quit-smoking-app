// Storage Service Tests
// Note: These are example tests. Actual implementation would require jest setup with AsyncStorage mock

import { storageService } from '../storage.service';
import { User, Progress, JournalEntry, TaskCompletion, Settings, CravingLog } from '../../types';

// Mock AsyncStorage would be set up here in a real test environment

describe('StorageService', () => {
  describe('User Methods', () => {
    const mockUser: User = {
      id: 'user_123',
      quitDate: '2024-01-01T00:00:00.000Z',
      cigarettesPerDay: 20,
      pricePerPack: 350,
      cigarettesPerPack: 20,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should save user data', async () => {
      const result = await storageService.saveUser(mockUser);
      expect(result).toBe(true);
    });

    it('should retrieve user data', async () => {
      await storageService.saveUser(mockUser);
      const user = await storageService.getUser();
      expect(user).toEqual(mockUser);
    });

    it('should update user data', async () => {
      await storageService.saveUser(mockUser);
      const result = await storageService.updateUser({
        cigarettesPerDay: 15,
      });
      expect(result).toBe(true);
    });

    it('should validate user data before saving', async () => {
      const invalidUser = { ...mockUser, cigarettesPerDay: -5 };
      const result = await storageService.saveUser(invalidUser);
      expect(result).toBe(false);
    });
  });

  describe('Progress Methods', () => {
    const mockProgress: Progress = {
      smokeFreeTime: {
        days: 5,
        hours: 12,
        minutes: 30,
        seconds: 45,
        totalSeconds: 476445,
      },
      moneySaved: 875,
      cigarettesNotSmoked: 100,
      currentDay: 6,
      milestones: [],
      healthBenefits: [],
      lastUpdated: '2024-01-06T12:30:45.000Z',
    };

    it('should save progress data', async () => {
      const result = await storageService.saveProgress(mockProgress);
      expect(result).toBe(true);
    });

    it('should retrieve progress data', async () => {
      await storageService.saveProgress(mockProgress);
      const progress = await storageService.getProgress();
      expect(progress).toEqual(mockProgress);
    });

    it('should update progress data', async () => {
      await storageService.saveProgress(mockProgress);
      const result = await storageService.updateProgress({
        currentDay: 7,
        moneySaved: 1050,
      });
      expect(result).toBe(true);
    });

    it('should validate progress data before saving', async () => {
      const invalidProgress = { ...mockProgress, currentDay: -1 };
      const result = await storageService.saveProgress(invalidProgress);
      expect(result).toBe(false);
    });
  });

  describe('Journal Entry Methods', () => {
    const mockJournalEntry: JournalEntry = {
      id: 'journal_123',
      date: '2024-01-05T10:30:00.000Z',
      content: 'আজ খুব ভালো লাগছে। ধূমপান ছাড়ার ৫ দিন হয়ে গেছে।',
      mood: 'happy',
      triggers: ['stress', 'work'],
      cravingIntensity: 3,
      createdAt: '2024-01-05T10:30:00.000Z',
      updatedAt: '2024-01-05T10:30:00.000Z',
    };

    it('should save journal entry', async () => {
      const result = await storageService.saveJournalEntry(mockJournalEntry);
      expect(result).toBe(true);
    });

    it('should retrieve all journal entries', async () => {
      await storageService.saveJournalEntry(mockJournalEntry);
      const entries = await storageService.getJournalEntries();
      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBeGreaterThan(0);
    });

    it('should retrieve journal entries with date filtering', async () => {
      await storageService.saveJournalEntry(mockJournalEntry);
      const entries = await storageService.getJournalEntries(
        '2024-01-01T00:00:00.000Z',
        '2024-01-10T00:00:00.000Z',
      );
      expect(Array.isArray(entries)).toBe(true);
    });

    it('should retrieve journal entry by ID', async () => {
      await storageService.saveJournalEntry(mockJournalEntry);
      const entry = await storageService.getJournalEntryById('journal_123');
      expect(entry).toBeTruthy();
      expect(entry?.id).toBe('journal_123');
    });

    it('should delete journal entry', async () => {
      await storageService.saveJournalEntry(mockJournalEntry);
      const result = await storageService.deleteJournalEntry('journal_123');
      expect(result).toBe(true);
    });

    it('should validate journal entry before saving', async () => {
      const invalidEntry = { ...mockJournalEntry, cravingIntensity: 15 };
      const result = await storageService.saveJournalEntry(invalidEntry);
      expect(result).toBe(false);
    });

    it('should update existing journal entry', async () => {
      await storageService.saveJournalEntry(mockJournalEntry);
      const updatedEntry = {
        ...mockJournalEntry,
        content: 'আপডেট করা হয়েছে',
        updatedAt: '2024-01-05T11:00:00.000Z',
      };
      const result = await storageService.saveJournalEntry(updatedEntry);
      expect(result).toBe(true);
    });
  });

  describe('Task Completion Methods', () => {
    const mockTaskCompletion: TaskCompletion = {
      taskId: 'task_day1_1',
      day: 1,
      completed: true,
      completedAt: '2024-01-01T14:30:00.000Z',
    };

    it('should save task completion', async () => {
      const result = await storageService.saveTaskCompletion(mockTaskCompletion);
      expect(result).toBe(true);
    });

    it('should retrieve all task completions', async () => {
      await storageService.saveTaskCompletion(mockTaskCompletion);
      const completions = await storageService.getTaskCompletions();
      expect(Array.isArray(completions)).toBe(true);
      expect(completions.length).toBeGreaterThan(0);
    });

    it('should retrieve task completions for specific day', async () => {
      await storageService.saveTaskCompletion(mockTaskCompletion);
      const completions = await storageService.getTaskCompletions(1);
      expect(Array.isArray(completions)).toBe(true);
      expect(completions.every(c => c.day === 1)).toBe(true);
    });

    it('should retrieve specific task completion', async () => {
      await storageService.saveTaskCompletion(mockTaskCompletion);
      const completion = await storageService.getTaskCompletion('task_day1_1', 1);
      expect(completion).toBeTruthy();
      expect(completion?.taskId).toBe('task_day1_1');
    });

    it('should retrieve completed tasks for a day', async () => {
      await storageService.saveTaskCompletion(mockTaskCompletion);
      const completions = await storageService.getCompletedTasksForDay(1);
      expect(Array.isArray(completions)).toBe(true);
      expect(completions.every(c => c.completed)).toBe(true);
    });

    it('should validate task completion before saving', async () => {
      const invalidCompletion = { ...mockTaskCompletion, day: 50 };
      const result = await storageService.saveTaskCompletion(invalidCompletion);
      expect(result).toBe(false);
    });

    it('should update existing task completion', async () => {
      await storageService.saveTaskCompletion(mockTaskCompletion);
      const updatedCompletion = {
        ...mockTaskCompletion,
        completed: false,
        completedAt: undefined,
      };
      const result = await storageService.saveTaskCompletion(updatedCompletion);
      expect(result).toBe(true);
    });
  });

  describe('Settings Methods', () => {
    const mockSettings: Settings = {
      notifications: {
        enabled: true,
        dailyReminder: true,
        dailyReminderTime: '08:00',
        prayerTimes: true,
        milestones: true,
        encouragement: true,
      },
      appearance: {
        fontSize: 'medium',
        theme: 'light',
        soundEffects: true,
        hapticFeedback: true,
      },
      privacy: {
        pinLock: false,
        biometric: false,
        dataEncryption: false,
      },
      emergencyContacts: [
        {
          id: 'contact_1',
          name: 'জন ডো',
          phone: '+8801712345678',
          relationship: 'বন্ধু',
        },
      ],
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should save settings data', async () => {
      const result = await storageService.saveSettings(mockSettings);
      expect(result).toBe(true);
    });

    it('should retrieve settings data', async () => {
      await storageService.saveSettings(mockSettings);
      const settings = await storageService.getSettings();
      expect(settings).toEqual(mockSettings);
    });

    it('should update settings data', async () => {
      await storageService.saveSettings(mockSettings);
      const result = await storageService.updateSettings({
        appearance: {
          ...mockSettings.appearance,
          fontSize: 'large',
        },
      });
      expect(result).toBe(true);
    });

    it('should validate settings data before saving', async () => {
      const invalidSettings = { 
        ...mockSettings, 
        appearance: { ...mockSettings.appearance, fontSize: 'invalid' as any },
      };
      const result = await storageService.saveSettings(invalidSettings);
      expect(result).toBe(false);
    });

    it('should check if settings exists', async () => {
      const exists = await storageService.hasSettings();
      expect(typeof exists).toBe('boolean');
    });
  });

  describe('Craving Log Methods', () => {
    const mockCravingLog: CravingLog = {
      id: 'craving_123',
      timestamp: '2024-01-05T15:30:00.000Z',
      intensity: 7,
      duration: 180,
      triggers: ['stress', 'work'],
      copingStrategy: 'breathing',
      notes: 'কাজের চাপে ক্রেভিং হয়েছিল',
      overcome: true,
    };

    it('should save craving log', async () => {
      const result = await storageService.saveCravingLog(mockCravingLog);
      expect(result).toBe(true);
    });

    it('should retrieve all craving logs', async () => {
      await storageService.saveCravingLog(mockCravingLog);
      const logs = await storageService.getCravingLogs();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should retrieve craving logs with date filtering', async () => {
      await storageService.saveCravingLog(mockCravingLog);
      const logs = await storageService.getCravingLogs(
        '2024-01-01T00:00:00.000Z',
        '2024-01-10T00:00:00.000Z',
      );
      expect(Array.isArray(logs)).toBe(true);
    });

    it('should validate craving log before saving', async () => {
      const invalidLog = { ...mockCravingLog, intensity: 15 };
      const result = await storageService.saveCravingLog(invalidLog);
      expect(result).toBe(false);
    });

    it('should update existing craving log', async () => {
      await storageService.saveCravingLog(mockCravingLog);
      const updatedLog = {
        ...mockCravingLog,
        overcome: false,
        notes: 'আপডেট করা হয়েছে',
      };
      const result = await storageService.saveCravingLog(updatedLog);
      expect(result).toBe(true);
    });
  });

  describe('Data Management Methods', () => {
    it('should export all data', async () => {
      const exportData = await storageService.exportAllData();
      expect(exportData).toBeTruthy();
      expect(typeof exportData).toBe('string');
      
      // Verify it's valid JSON
      if (exportData) {
        const parsed = JSON.parse(exportData);
        expect(parsed.version).toBe('1.0');
        expect(parsed.exportDate).toBeTruthy();
        expect(parsed.data).toBeTruthy();
      }
    });

    it('should clear all data', async () => {
      const result = await storageService.clearAllData();
      expect(result).toBe(true);
    });
  });

  describe('Utility Methods', () => {
    it('should check if user exists', async () => {
      const exists = await storageService.hasUser();
      expect(typeof exists).toBe('boolean');
    });

    it('should check if progress exists', async () => {
      const exists = await storageService.hasProgress();
      expect(typeof exists).toBe('boolean');
    });

    it('should check if settings exists', async () => {
      const exists = await storageService.hasSettings();
      expect(typeof exists).toBe('boolean');
    });
  });
});

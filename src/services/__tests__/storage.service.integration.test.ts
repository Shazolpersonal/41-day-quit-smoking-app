/**
 * Storage Service Integration Tests
 * Tests complex workflows and data interactions
 */

import { storageService } from '../storage.service';
import { User, Progress, JournalEntry, TaskCompletion, Settings, CravingLog } from '../../types';

describe('StorageService Integration Tests', () => {
  // Mock user for testing
  const mockUser: User = {
    id: 'user_integration_test',
    quitDate: '2024-01-01T00:00:00.000Z',
    cigarettesPerDay: 20,
    pricePerPack: 350,
    cigarettesPerPack: 20,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    // Clear all data before each test
    await storageService.clearAllData();
  });

  describe('Complete User Onboarding Flow', () => {
    it('should handle complete onboarding workflow', async () => {
      // Step 1: Save user data
      const userSaved = await storageService.saveUser(mockUser);
      expect(userSaved).toBe(true);

      // Step 2: Verify user exists
      const userExists = await storageService.hasUser();
      expect(userExists).toBe(true);

      // Step 3: Retrieve user data
      const retrievedUser = await storageService.getUser();
      expect(retrievedUser).toEqual(mockUser);

      // Step 4: Initialize default settings
      const defaultSettings: Settings = {
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
        emergencyContacts: [],
        updatedAt: new Date().toISOString(),
      };

      const settingsSaved = await storageService.saveSettings(defaultSettings);
      expect(settingsSaved).toBe(true);

      // Step 5: Verify settings exist
      const settingsExist = await storageService.hasSettings();
      expect(settingsExist).toBe(true);

      // Step 6: Initialize progress
      const initialProgress: Progress = {
        smokeFreeTime: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
        },
        moneySaved: 0,
        cigarettesNotSmoked: 0,
        currentDay: 1,
        milestones: [],
        healthBenefits: [],
        lastUpdated: new Date().toISOString(),
      };

      const progressSaved = await storageService.saveProgress(initialProgress);
      expect(progressSaved).toBe(true);

      // Verify complete onboarding
      expect(await storageService.hasUser()).toBe(true);
      expect(await storageService.hasSettings()).toBe(true);
      expect(await storageService.hasProgress()).toBe(true);
    });

    it('should handle user profile updates during onboarding', async () => {
      // Initial save
      await storageService.saveUser(mockUser);

      // User updates cigarettes per day
      const updated = await storageService.updateUser({
        cigarettesPerDay: 15,
        updatedAt: new Date().toISOString(),
      });
      expect(updated).toBe(true);

      // Verify update
      const user = await storageService.getUser();
      expect(user?.cigarettesPerDay).toBe(15);
      expect(user?.pricePerPack).toBe(350); // Other fields unchanged
    });
  });

  describe('Daily Progress Tracking Workflow', () => {
    beforeEach(async () => {
      await storageService.saveUser(mockUser);
    });

    it('should track complete daily workflow', async () => {
      const day = 5;

      // Step 1: Save task completions for the day
      const tasks: TaskCompletion[] = [
        {
          taskId: `task_day${day}_1`,
          day,
          completed: true,
          completedAt: new Date().toISOString(),
        },
        {
          taskId: `task_day${day}_2`,
          day,
          completed: true,
          completedAt: new Date().toISOString(),
        },
        {
          taskId: `task_day${day}_3`,
          day,
          completed: false,
        },
      ];

      for (const task of tasks) {
        const saved = await storageService.saveTaskCompletion(task);
        expect(saved).toBe(true);
      }

      // Step 2: Retrieve completed tasks
      const completedTasks = await storageService.getCompletedTasksForDay(day);
      expect(completedTasks.length).toBe(2);
      expect(completedTasks.every(t => t.completed)).toBe(true);

      // Step 3: Add journal entry
      const journalEntry: JournalEntry = {
        id: `journal_day${day}`,
        date: new Date().toISOString(),
        content: `দিন ${day} এর জার্নাল এন্ট্রি`,
        mood: 'happy',
        triggers: [],
        cravingIntensity: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const journalSaved = await storageService.saveJournalEntry(journalEntry);
      expect(journalSaved).toBe(true);

      // Step 4: Update progress
      const progress: Progress = {
        smokeFreeTime: {
          days: day,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: day * 86400,
        },
        moneySaved: day * 350,
        cigarettesNotSmoked: day * 20,
        currentDay: day + 1,
        milestones: [],
        healthBenefits: [],
        lastUpdated: new Date().toISOString(),
      };

      const progressSaved = await storageService.saveProgress(progress);
      expect(progressSaved).toBe(true);

      // Verify all data saved correctly
      const retrievedProgress = await storageService.getProgress();
      expect(retrievedProgress?.currentDay).toBe(day + 1);
      expect(retrievedProgress?.moneySaved).toBe(day * 350);

      const retrievedJournal = await storageService.getJournalEntryById(`journal_day${day}`);
      expect(retrievedJournal).toBeTruthy();
    });

    it('should handle multiple task updates in a day', async () => {
      const day = 3;
      const taskId = `task_day${day}_1`;

      // Initially incomplete
      await storageService.saveTaskCompletion({
        taskId,
        day,
        completed: false,
      });

      let task = await storageService.getTaskCompletion(taskId, day);
      expect(task?.completed).toBe(false);

      // Mark as complete
      await storageService.saveTaskCompletion({
        taskId,
        day,
        completed: true,
        completedAt: new Date().toISOString(),
      });

      task = await storageService.getTaskCompletion(taskId, day);
      expect(task?.completed).toBe(true);
      expect(task?.completedAt).toBeDefined();

      // Undo completion
      await storageService.saveTaskCompletion({
        taskId,
        day,
        completed: false,
        completedAt: undefined,
      });

      task = await storageService.getTaskCompletion(taskId, day);
      expect(task?.completed).toBe(false);
      expect(task?.completedAt).toBeUndefined();
    });
  });

  describe('Craving Management Workflow', () => {
    beforeEach(async () => {
      await storageService.saveUser(mockUser);
    });

    it('should track craving episodes over time', async () => {
      const cravings: CravingLog[] = [
        {
          id: 'craving_1',
          timestamp: '2024-01-05T10:00:00.000Z',
          intensity: 8,
          duration: 300,
          triggers: ['stress', 'work'],
          copingStrategy: 'breathing',
          notes: 'কাজের চাপ',
          overcome: true,
        },
        {
          id: 'craving_2',
          timestamp: '2024-01-05T15:30:00.000Z',
          intensity: 6,
          duration: 180,
          triggers: ['social'],
          copingStrategy: 'distraction',
          notes: 'বন্ধুদের সাথে',
          overcome: true,
        },
        {
          id: 'craving_3',
          timestamp: '2024-01-06T09:00:00.000Z',
          intensity: 9,
          duration: 420,
          triggers: ['stress', 'anxiety'],
          copingStrategy: 'call_support',
          notes: 'খুব কঠিন ছিল',
          overcome: false,
        },
      ];

      // Save all cravings
      for (const craving of cravings) {
        const saved = await storageService.saveCravingLog(craving);
        expect(saved).toBe(true);
      }

      // Retrieve all cravings
      const allCravings = await storageService.getCravingLogs();
      expect(allCravings.length).toBe(3);

      // Filter by date range
      const day5Cravings = await storageService.getCravingLogs(
        '2024-01-05T00:00:00.000Z',
        '2024-01-05T23:59:59.000Z'
      );
      expect(day5Cravings.length).toBe(2);

      // Verify overcome status
      const overcomeCravings = allCravings.filter(c => c.overcome);
      expect(overcomeCravings.length).toBe(2);
    });

    it('should link craving logs with journal entries', async () => {
      // Save craving log
      const craving: CravingLog = {
        id: 'craving_with_journal',
        timestamp: '2024-01-05T14:00:00.000Z',
        intensity: 7,
        duration: 240,
        triggers: ['stress'],
        copingStrategy: 'breathing',
        notes: 'ব্রিদিং এক্সারসাইজ সাহায্য করেছে',
        overcome: true,
      };

      await storageService.saveCravingLog(craving);

      // Save related journal entry
      const journal: JournalEntry = {
        id: 'journal_craving_reflection',
        date: '2024-01-05T14:30:00.000Z',
        content: 'আজ একটি শক্তিশালী ক্রেভিং অতিক্রম করেছি। ব্রিদিং এক্সারসাইজ খুব কাজে লেগেছে।',
        mood: 'proud',
        triggers: ['stress'],
        cravingIntensity: 7,
        createdAt: '2024-01-05T14:30:00.000Z',
        updatedAt: '2024-01-05T14:30:00.000Z',
      };

      await storageService.saveJournalEntry(journal);

      // Retrieve both
      const cravingLogs = await storageService.getCravingLogs(
        '2024-01-05T00:00:00.000Z',
        '2024-01-05T23:59:59.000Z'
      );
      const journalEntries = await storageService.getJournalEntries(
        '2024-01-05T00:00:00.000Z',
        '2024-01-05T23:59:59.000Z'
      );

      expect(cravingLogs.length).toBeGreaterThan(0);
      expect(journalEntries.length).toBeGreaterThan(0);

      // Verify they share the same trigger
      expect(cravingLogs[0].triggers).toContain('stress');
      expect(journalEntries[0].triggers).toContain('stress');
    });
  });

  describe('Settings Management Workflow', () => {
    beforeEach(async () => {
      await storageService.saveUser(mockUser);
    });

    it('should handle progressive settings updates', async () => {
      // Initial settings
      const initialSettings: Settings = {
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
        emergencyContacts: [],
        updatedAt: new Date().toISOString(),
      };

      await storageService.saveSettings(initialSettings);

      // Update notification time
      await storageService.updateSettings({
        notifications: {
          ...initialSettings.notifications,
          dailyReminderTime: '09:00',
        },
      });

      let settings = await storageService.getSettings();
      expect(settings?.notifications.dailyReminderTime).toBe('09:00');

      // Add emergency contact
      await storageService.updateSettings({
        emergencyContacts: [
          {
            id: 'contact_1',
            name: 'জন ডো',
            phone: '+8801712345678',
            relationship: 'বন্ধু',
          },
        ],
      });

      settings = await storageService.getSettings();
      expect(settings?.emergencyContacts.length).toBe(1);

      // Enable PIN lock
      await storageService.updateSettings({
        privacy: {
          ...initialSettings.privacy,
          pinLock: true,
        },
      });

      settings = await storageService.getSettings();
      expect(settings?.privacy.pinLock).toBe(true);
    });

    it('should manage multiple emergency contacts', async () => {
      const settings: Settings = {
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
        emergencyContacts: [],
        updatedAt: new Date().toISOString(),
      };

      await storageService.saveSettings(settings);

      // Add first contact
      const contact1 = {
        id: 'contact_1',
        name: 'আহমেদ',
        phone: '+8801712345678',
        relationship: 'বন্ধু',
      };

      await storageService.updateSettings({
        emergencyContacts: [contact1],
      });

      // Add second contact
      const contact2 = {
        id: 'contact_2',
        name: 'ফাতিমা',
        phone: '+8801812345678',
        relationship: 'পরিবার',
      };

      let currentSettings = await storageService.getSettings();
      await storageService.updateSettings({
        emergencyContacts: [...(currentSettings?.emergencyContacts || []), contact2],
      });

      // Verify both contacts
      currentSettings = await storageService.getSettings();
      expect(currentSettings?.emergencyContacts.length).toBe(2);
      expect(currentSettings?.emergencyContacts[0].name).toBe('আহমেদ');
      expect(currentSettings?.emergencyContacts[1].name).toBe('ফাতিমা');

      // Remove first contact
      await storageService.updateSettings({
        emergencyContacts: [contact2],
      });

      currentSettings = await storageService.getSettings();
      expect(currentSettings?.emergencyContacts.length).toBe(1);
      expect(currentSettings?.emergencyContacts[0].name).toBe('ফাতিমা');
    });
  });

  describe('Data Export and Backup Workflow', () => {
    beforeEach(async () => {
      await storageService.saveUser(mockUser);
    });

    it('should export complete user data', async () => {
      // Create comprehensive data
      const progress: Progress = {
        smokeFreeTime: {
          days: 10,
          hours: 5,
          minutes: 30,
          seconds: 45,
          totalSeconds: 883845,
        },
        moneySaved: 3500,
        cigarettesNotSmoked: 200,
        currentDay: 11,
        milestones: [],
        healthBenefits: [],
        lastUpdated: new Date().toISOString(),
      };

      const journal: JournalEntry = {
        id: 'journal_export_test',
        date: new Date().toISOString(),
        content: 'এক্সপোর্ট টেস্ট জার্নাল',
        mood: 'happy',
        triggers: [],
        cravingIntensity: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const craving: CravingLog = {
        id: 'craving_export_test',
        timestamp: new Date().toISOString(),
        intensity: 5,
        duration: 120,
        triggers: ['stress'],
        copingStrategy: 'breathing',
        notes: 'এক্সপোর্ট টেস্ট',
        overcome: true,
      };

      await storageService.saveProgress(progress);
      await storageService.saveJournalEntry(journal);
      await storageService.saveCravingLog(craving);

      // Export data
      const exportData = await storageService.exportAllData();
      expect(exportData).toBeTruthy();

      if (exportData) {
        const parsed = JSON.parse(exportData);
        expect(parsed.version).toBe('1.0');
        expect(parsed.data.user).toBeDefined();
        expect(parsed.data.progress).toBeDefined();
        expect(parsed.data.journalEntries).toBeDefined();
        expect(parsed.data.cravingLogs).toBeDefined();
      }
    });
  });

  describe('Data Validation and Error Handling', () => {
    it('should prevent saving invalid user data', async () => {
      const invalidUsers = [
        { ...mockUser, cigarettesPerDay: -5 },
        { ...mockUser, pricePerPack: 0 },
        { ...mockUser, cigarettesPerPack: 0 },
        { ...mockUser, quitDate: 'invalid-date' },
      ];

      for (const invalidUser of invalidUsers) {
        const result = await storageService.saveUser(invalidUser);
        expect(result).toBe(false);
      }
    });

    it('should prevent saving invalid journal entries', async () => {
      const invalidEntries = [
        {
          id: 'invalid_1',
          date: new Date().toISOString(),
          content: '', // Empty content
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'invalid_2',
          date: new Date().toISOString(),
          content: 'Valid content',
          cravingIntensity: 15, // Out of range
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      for (const invalidEntry of invalidEntries) {
        const result = await storageService.saveJournalEntry(invalidEntry as any);
        expect(result).toBe(false);
      }
    });

    it('should prevent saving invalid craving logs', async () => {
      const invalidLogs = [
        {
          id: 'invalid_craving_1',
          timestamp: new Date().toISOString(),
          intensity: 0, // Below minimum
          duration: 60,
          triggers: [],
          copingStrategy: 'breathing',
          overcome: true,
        },
        {
          id: 'invalid_craving_2',
          timestamp: new Date().toISOString(),
          intensity: 11, // Above maximum
          duration: 60,
          triggers: [],
          copingStrategy: 'breathing',
          overcome: true,
        },
      ];

      for (const invalidLog of invalidLogs) {
        const result = await storageService.saveCravingLog(invalidLog as any);
        expect(result).toBe(false);
      }
    });
  });

  describe('Concurrent Operations', () => {
    beforeEach(async () => {
      await storageService.saveUser(mockUser);
    });

    it('should handle multiple simultaneous saves', async () => {
      const promises = [];

      // Save multiple journal entries simultaneously
      for (let i = 0; i < 5; i++) {
        const journal: JournalEntry = {
          id: `journal_concurrent_${i}`,
          date: new Date().toISOString(),
          content: `Concurrent entry ${i}`,
          mood: 'neutral',
          triggers: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        promises.push(storageService.saveJournalEntry(journal));
      }

      const results = await Promise.all(promises);
      expect(results.every(r => r === true)).toBe(true);

      // Verify all entries saved
      const entries = await storageService.getJournalEntries();
      expect(entries.length).toBe(5);
    });

    it('should handle rapid progress updates', async () => {
      const updates = [];

      for (let day = 1; day <= 10; day++) {
        const progress: Progress = {
          smokeFreeTime: {
            days: day,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: day * 86400,
          },
          moneySaved: day * 350,
          cigarettesNotSmoked: day * 20,
          currentDay: day + 1,
          milestones: [],
          healthBenefits: [],
          lastUpdated: new Date().toISOString(),
        };

        updates.push(storageService.saveProgress(progress));
      }

      await Promise.all(updates);

      // Verify final state
      const finalProgress = await storageService.getProgress();
      expect(finalProgress?.currentDay).toBe(11);
      expect(finalProgress?.moneySaved).toBe(3500);
    });
  });
});

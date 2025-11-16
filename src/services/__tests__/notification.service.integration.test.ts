/**
 * Notification Service Integration Tests
 * Tests notification scheduling workflows and interactions
 */

import notifee, { AuthorizationStatus } from 'notifee';
import { notificationService } from '../notification.service';

// Mock notifee
jest.mock('notifee', () => ({
  createChannel: jest.fn(),
  requestPermission: jest.fn(),
  getNotificationSettings: jest.fn(),
  createTriggerNotification: jest.fn(),
  displayNotification: jest.fn(),
  cancelNotification: jest.fn(),
  cancelAllNotifications: jest.fn(),
  cancelDisplayedNotifications: jest.fn(),
  getTriggerNotifications: jest.fn(),
  AuthorizationStatus: {
    AUTHORIZED: 1,
    DENIED: 2,
    NOT_DETERMINED: 0,
  },
  AndroidImportance: {
    HIGH: 4,
    DEFAULT: 3,
  },
  TriggerType: {
    TIMESTAMP: 0,
  },
  RepeatFrequency: {
    DAILY: 1,
  },
}));

describe('NotificationService Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to authorized
    (notifee.getNotificationSettings as jest.Mock).mockResolvedValue({
      authorizationStatus: AuthorizationStatus.AUTHORIZED,
    });
  });

  describe('Complete Notification Setup Workflow', () => {
    it('should handle complete notification initialization', async () => {
      // Step 1: Initialize service
      await notificationService.initialize();
      expect(notifee.createChannel).toHaveBeenCalled();

      // Step 2: Request permissions
      (notifee.requestPermission as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });

      const permissionGranted = await notificationService.requestPermissions();
      expect(permissionGranted).toBe(true);

      // Step 3: Check permissions
      const hasPermissions = await notificationService.checkPermissions();
      expect(hasPermissions).toBe(true);

      // Step 4: Schedule daily reminder
      (notifee.createTriggerNotification as jest.Mock).mockResolvedValueOnce('daily-reminder-id');

      const reminderScheduled = await notificationService.scheduleDailyReminder('08:00');
      expect(reminderScheduled).toBe(true);
    });

    it('should handle permission denial gracefully', async () => {
      // Initialize
      await notificationService.initialize();

      // Request permission - denied
      (notifee.requestPermission as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      });

      const permissionGranted = await notificationService.requestPermissions();
      expect(permissionGranted).toBe(false);

      // Update mock for subsequent calls
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValue({
        authorizationStatus: AuthorizationStatus.DENIED,
      });

      // Try to schedule - should fail
      const reminderScheduled = await notificationService.scheduleDailyReminder('08:00');
      expect(reminderScheduled).toBe(false);

      // Try to send notification - should fail
      const notificationSent = await notificationService.sendMilestoneNotification(7);
      expect(notificationSent).toBe(false);
    });
  });

  describe('Daily Reminder Management Workflow', () => {
    it('should update daily reminder time', async () => {
      // Schedule initial reminder
      (notifee.createTriggerNotification as jest.Mock).mockResolvedValue('reminder-id');

      await notificationService.scheduleDailyReminder('08:00');
      expect(notifee.cancelNotification).toHaveBeenCalledWith('daily-reminder');
      expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(1);

      // Update reminder time
      await notificationService.scheduleDailyReminder('09:30');
      expect(notifee.cancelNotification).toHaveBeenCalledWith('daily-reminder');
      expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(2);

      // Verify new time is used
      const lastCall = (notifee.createTriggerNotification as jest.Mock).mock.calls[1];
      expect(lastCall[1].timestamp).toBeDefined();
    });

    it('should disable and re-enable daily reminders', async () => {
      // Schedule reminder
      (notifee.createTriggerNotification as jest.Mock).mockResolvedValue('reminder-id');
      await notificationService.scheduleDailyReminder('08:00');

      // Disable reminder
      await notificationService.cancelDailyReminder();
      expect(notifee.cancelNotification).toHaveBeenCalledWith('daily-reminder');

      // Re-enable reminder
      await notificationService.scheduleDailyReminder('08:00');
      expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(2);
    });

    it('should handle custom reminder messages', async () => {
      const customMessages = [
        'আজকের দিন শুরু করুন!',
        'আপনার লক্ষ্য মনে রাখুন',
        'আজ একটি নতুন দিন',
      ];

      for (const message of customMessages) {
        await notificationService.scheduleDailyReminder('08:00', message);

        const lastCall = (notifee.createTriggerNotification as jest.Mock).mock.calls.slice(-1)[0];
        expect(lastCall[0].body).toBe(message);
      }
    });
  });

  describe('Milestone Notification Workflow', () => {
    it('should send notifications for key milestones', async () => {
      const milestones = [1, 3, 7, 14, 21, 30, 41];

      for (const day of milestones) {
        const result = await notificationService.sendMilestoneNotification(day);
        expect(result).toBe(true);
      }

      expect(notifee.displayNotification).toHaveBeenCalledTimes(milestones.length);
    });

    it('should send custom milestone notifications', async () => {
      const customMilestones = [
        { day: 7, title: '১ সপ্তাহ!', message: 'অসাধারণ অগ্রগতি!' },
        { day: 30, title: '১ মাস!', message: 'আপনি দুর্দান্ত!' },
        { day: 41, title: 'সম্পূর্ণ!', message: 'প্রোগ্রাম সম্পন্ন!' },
      ];

      for (const milestone of customMilestones) {
        await notificationService.sendMilestoneNotification(
          milestone.day,
          milestone.title,
          milestone.message
        );

        const lastCall = (notifee.displayNotification as jest.Mock).mock.calls.slice(-1)[0];
        expect(lastCall[0].title).toBe(milestone.title);
        expect(lastCall[0].body).toBe(milestone.message);
      }
    });
  });

  describe('Motivational Notification Workflow', () => {
    it('should send motivational notifications throughout the day', async () => {
      const motivationalMessages = [
        { title: '💪 শক্তি', message: 'আপনি শক্তিশালী!' },
        { title: '🌟 অনুপ্রেরণা', message: 'চালিয়ে যান!' },
        { title: '🎯 লক্ষ্য', message: 'আপনার লক্ষ্যে মনোনিবেশ করুন' },
      ];

      for (const msg of motivationalMessages) {
        const result = await notificationService.sendMotivationalNotification(
          msg.title,
          msg.message
        );
        expect(result).toBe(true);
      }

      expect(notifee.displayNotification).toHaveBeenCalledTimes(motivationalMessages.length);
    });
  });

  describe('Scheduled Notification Workflow', () => {
    it('should schedule multiple notifications for different times', async () => {
      const now = Date.now();
      const notifications = [
        { title: 'সকাল', message: 'সুপ্রভাত', time: now + 3600000 }, // 1 hour
        { title: 'দুপুর', message: 'দুপুরের খাবার', time: now + 7200000 }, // 2 hours
        { title: 'সন্ধ্যা', message: 'সন্ধ্যার নামাজ', time: now + 10800000 }, // 3 hours
      ];

      (notifee.createTriggerNotification as jest.Mock).mockImplementation(
        () => Promise.resolve(`notification-${Date.now()}`)
      );

      const notificationIds = [];
      for (const notif of notifications) {
        const id = await notificationService.scheduleNotification(
          notif.title,
          notif.message,
          notif.time
        );
        expect(id).toBeTruthy();
        notificationIds.push(id);
      }

      expect(notificationIds.length).toBe(3);
      expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(3);
    });

    it('should cancel specific scheduled notifications', async () => {
      const now = Date.now();
      (notifee.createTriggerNotification as jest.Mock).mockResolvedValue('test-notification-id');

      // Schedule notification
      const notificationId = await notificationService.scheduleNotification(
        'Test',
        'Message',
        now + 3600000,
        'custom-id'
      );

      expect(notificationId).toBe('test-notification-id');

      // Cancel it
      const cancelled = await notificationService.cancelNotification('custom-id');
      expect(cancelled).toBe(true);
      expect(notifee.cancelNotification).toHaveBeenCalledWith('custom-id');
    });

    it('should retrieve all scheduled notifications', async () => {
      const mockScheduledNotifications = [
        { id: 'notif-1', title: 'Test 1', trigger: { timestamp: Date.now() + 3600000 } },
        { id: 'notif-2', title: 'Test 2', trigger: { timestamp: Date.now() + 7200000 } },
      ];

      (notifee.getTriggerNotifications as jest.Mock).mockResolvedValue(
        mockScheduledNotifications
      );

      const scheduled = await notificationService.getScheduledNotifications();
      expect(scheduled.length).toBe(2);
      expect(scheduled[0].id).toBe('notif-1');
      expect(scheduled[1].id).toBe('notif-2');
    });
  });

  describe('Notification Cleanup Workflow', () => {
    it('should clear all notifications when user resets', async () => {
      // Schedule some notifications
      (notifee.createTriggerNotification as jest.Mock).mockResolvedValue('test-id');

      await notificationService.scheduleDailyReminder('08:00');
      await notificationService.scheduleNotification('Test', 'Message', Date.now() + 3600000);

      // Clear all
      const cleared = await notificationService.cancelAllNotifications();
      expect(cleared).toBe(true);
      expect(notifee.cancelAllNotifications).toHaveBeenCalled();
      expect(notifee.cancelDisplayedNotifications).toHaveBeenCalled();
    });

    it('should handle selective notification cancellation', async () => {
      const notificationIds = ['notif-1', 'notif-2', 'notif-3'];

      for (const id of notificationIds) {
        await notificationService.cancelNotification(id);
      }

      expect(notifee.cancelNotification).toHaveBeenCalledTimes(3);
      expect(notifee.cancelNotification).toHaveBeenCalledWith('notif-1');
      expect(notifee.cancelNotification).toHaveBeenCalledWith('notif-2');
      expect(notifee.cancelNotification).toHaveBeenCalledWith('notif-3');
    });
  });

  describe('Error Recovery Workflow', () => {
    it('should recover from notification scheduling failures', async () => {
      // First attempt fails
      (notifee.createTriggerNotification as jest.Mock)
        .mockRejectedValueOnce(new Error('Scheduling failed'))
        .mockResolvedValueOnce('success-id');

      // First attempt
      const result1 = await notificationService.scheduleDailyReminder('08:00');
      expect(result1).toBe(false);

      // Retry
      const result2 = await notificationService.scheduleDailyReminder('08:00');
      expect(result2).toBe(true);
    });

    it('should handle permission changes during runtime', async () => {
      // Initially authorized
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });

      let result = await notificationService.sendMilestoneNotification(7);
      expect(result).toBe(true);

      // Permission revoked
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      });

      result = await notificationService.sendMilestoneNotification(14);
      expect(result).toBe(false);

      // Permission re-granted
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });

      result = await notificationService.sendMilestoneNotification(21);
      expect(result).toBe(true);
    });
  });

  describe('Complex Notification Scenarios', () => {
    it('should handle overlapping notification schedules', async () => {
      const now = Date.now();
      (notifee.createTriggerNotification as jest.Mock).mockImplementation(
        (notification) => Promise.resolve(notification.id)
      );

      // Schedule multiple notifications for similar times
      const notifications = [
        { id: 'morning-1', time: now + 3600000 },
        { id: 'morning-2', time: now + 3660000 }, // 1 minute later
        { id: 'morning-3', time: now + 3720000 }, // 2 minutes later
      ];

      for (const notif of notifications) {
        const id = await notificationService.scheduleNotification(
          'Morning',
          'Message',
          notif.time,
          notif.id
        );
        expect(id).toBe(notif.id);
      }

      expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(3);
    });

    it('should manage notification priority and importance', async () => {
      // High priority milestone
      await notificationService.sendMilestoneNotification(41, '🎉 সম্পূর্ণ!', 'আপনি সফল!');

      const milestoneCall = (notifee.displayNotification as jest.Mock).mock.calls[0];
      expect(milestoneCall[0].android?.importance).toBeDefined();

      // Regular motivational notification
      await notificationService.sendMotivationalNotification('অনুপ্রেরণা', 'চালিয়ে যান');

      expect(notifee.displayNotification).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid notification requests', async () => {
      const promises = [];

      // Send 10 notifications rapidly
      for (let i = 0; i < 10; i++) {
        promises.push(
          notificationService.sendMotivationalNotification(
            `Message ${i}`,
            `Content ${i}`
          )
        );
      }

      const results = await Promise.all(promises);
      expect(results.every(r => r === true)).toBe(true);
      expect(notifee.displayNotification).toHaveBeenCalledTimes(10);
    });
  });

  describe('Notification State Management', () => {
    it('should track scheduled notifications', async () => {
      const mockNotifications = [
        { id: 'daily-reminder', title: 'Daily', trigger: { timestamp: Date.now() + 86400000 } },
        { id: 'milestone-7', title: 'Week 1', trigger: { timestamp: Date.now() + 604800000 } },
      ];

      (notifee.getTriggerNotifications as jest.Mock).mockResolvedValue(mockNotifications);

      const scheduled = await notificationService.getScheduledNotifications();
      expect(scheduled.length).toBe(2);
      expect(scheduled.find(n => n.id === 'daily-reminder')).toBeDefined();
      expect(scheduled.find(n => n.id === 'milestone-7')).toBeDefined();
    });

    it('should verify notification cancellation', async () => {
      // Schedule notification
      (notifee.createTriggerNotification as jest.Mock).mockResolvedValue('test-id');
      await notificationService.scheduleNotification('Test', 'Message', Date.now() + 3600000, 'test-id');

      // Mock scheduled notifications before cancellation
      (notifee.getTriggerNotifications as jest.Mock).mockResolvedValueOnce([
        { id: 'test-id', title: 'Test' },
      ]);

      let scheduled = await notificationService.getScheduledNotifications();
      expect(scheduled.length).toBe(1);

      // Cancel
      await notificationService.cancelNotification('test-id');

      // Mock scheduled notifications after cancellation
      (notifee.getTriggerNotifications as jest.Mock).mockResolvedValueOnce([]);

      scheduled = await notificationService.getScheduledNotifications();
      expect(scheduled.length).toBe(0);
    });
  });
});

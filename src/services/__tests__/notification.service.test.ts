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

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should create notification channel on Android', async () => {
      await notificationService.initialize();
      
      expect(notifee.createChannel).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'quit-smoking-channel',
          name: 'ধূমপান ত্যাগ রিমাইন্ডার',
        }),
      );
    });

    it('should handle initialization errors gracefully', async () => {
      (notifee.createChannel as jest.Mock).mockRejectedValueOnce(
        new Error('Channel creation failed'),
      );

      await expect(notificationService.initialize()).resolves.not.toThrow();
    });
  });

  describe('requestPermissions', () => {
    it('should return true when permission is granted', async () => {
      (notifee.requestPermission as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });

      const result = await notificationService.requestPermissions();
      
      expect(result).toBe(true);
      expect(notifee.requestPermission).toHaveBeenCalled();
    });

    it('should return false when permission is denied', async () => {
      (notifee.requestPermission as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      });

      const result = await notificationService.requestPermissions();
      
      expect(result).toBe(false);
    });

    it('should handle permission request errors', async () => {
      (notifee.requestPermission as jest.Mock).mockRejectedValueOnce(
        new Error('Permission request failed'),
      );

      const result = await notificationService.requestPermissions();
      
      expect(result).toBe(false);
    });
  });

  describe('checkPermissions', () => {
    it('should return true when permissions are granted', async () => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });

      const result = await notificationService.checkPermissions();
      
      expect(result).toBe(true);
    });

    it('should return false when permissions are not granted', async () => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      });

      const result = await notificationService.checkPermissions();
      
      expect(result).toBe(false);
    });

    it('should handle check permission errors', async () => {
      (notifee.getNotificationSettings as jest.Mock).mockRejectedValueOnce(
        new Error('Check failed'),
      );

      const result = await notificationService.checkPermissions();
      
      expect(result).toBe(false);
    });
  });

  describe('scheduleDailyReminder', () => {
    beforeEach(() => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValue({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });
    });

    it('should schedule daily reminder with valid time', async () => {
      (notifee.createTriggerNotification as jest.Mock).mockResolvedValueOnce('reminder-id');

      const result = await notificationService.scheduleDailyReminder('09:00');
      
      expect(result).toBe(true);
      expect(notifee.cancelNotification).toHaveBeenCalledWith('daily-reminder');
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'daily-reminder',
          title: '🌅 আজকের দিন শুরু করুন',
        }),
        expect.objectContaining({
          type: 0, // TriggerType.TIMESTAMP
          repeatFrequency: 1, // RepeatFrequency.DAILY
        }),
      );
    });

    it('should use custom message when provided', async () => {
      const customMessage = 'কাস্টম বার্তা';
      
      await notificationService.scheduleDailyReminder('10:30', customMessage);
      
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          body: customMessage,
        }),
        expect.any(Object),
      );
    });

    it('should return false when permissions are not granted', async () => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      });

      const result = await notificationService.scheduleDailyReminder('09:00');
      
      expect(result).toBe(false);
      expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
    });

    it('should handle invalid time format', async () => {
      const result = await notificationService.scheduleDailyReminder('25:00');
      
      expect(result).toBe(false);
    });

    it('should handle scheduling errors', async () => {
      (notifee.createTriggerNotification as jest.Mock).mockRejectedValueOnce(
        new Error('Scheduling failed'),
      );

      const result = await notificationService.scheduleDailyReminder('09:00');
      
      expect(result).toBe(false);
    });
  });

  describe('cancelDailyReminder', () => {
    it('should cancel daily reminder successfully', async () => {
      const result = await notificationService.cancelDailyReminder();
      
      expect(result).toBe(true);
      expect(notifee.cancelNotification).toHaveBeenCalledWith('daily-reminder');
    });

    it('should handle cancellation errors', async () => {
      (notifee.cancelNotification as jest.Mock).mockRejectedValueOnce(
        new Error('Cancellation failed'),
      );

      const result = await notificationService.cancelDailyReminder();
      
      expect(result).toBe(false);
    });
  });

  describe('sendMilestoneNotification', () => {
    beforeEach(() => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValue({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });
    });

    it('should send milestone notification with default message', async () => {
      const result = await notificationService.sendMilestoneNotification(7);
      
      expect(result).toBe(true);
      expect(notifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '🎉 7 দিন সম্পূর্ণ!',
          body: expect.stringContaining('সপ্তাহ'),
        }),
      );
    });

    it('should send milestone notification with custom title and message', async () => {
      const customTitle = 'কাস্টম শিরোনাম';
      const customMessage = 'কাস্টম বার্তা';
      
      const result = await notificationService.sendMilestoneNotification(
        14,
        customTitle,
        customMessage,
      );
      
      expect(result).toBe(true);
      expect(notifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: customTitle,
          body: customMessage,
        }),
      );
    });

    it('should return false when permissions are not granted', async () => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      });

      const result = await notificationService.sendMilestoneNotification(7);
      
      expect(result).toBe(false);
      expect(notifee.displayNotification).not.toHaveBeenCalled();
    });

    it('should handle notification errors', async () => {
      (notifee.displayNotification as jest.Mock).mockRejectedValueOnce(
        new Error('Display failed'),
      );

      const result = await notificationService.sendMilestoneNotification(7);
      
      expect(result).toBe(false);
    });
  });

  describe('sendMotivationalNotification', () => {
    beforeEach(() => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValue({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });
    });

    it('should send motivational notification', async () => {
      const title = 'অনুপ্রেরণা';
      const message = 'আপনি দুর্দান্ত কাজ করছেন!';
      
      const result = await notificationService.sendMotivationalNotification(title, message);
      
      expect(result).toBe(true);
      expect(notifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title,
          body: message,
        }),
      );
    });

    it('should return false when permissions are not granted', async () => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      });

      const result = await notificationService.sendMotivationalNotification('Title', 'Message');
      
      expect(result).toBe(false);
    });
  });

  describe('scheduleNotification', () => {
    beforeEach(() => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValue({
        authorizationStatus: AuthorizationStatus.AUTHORIZED,
      });
    });

    it('should schedule notification for specific timestamp', async () => {
      const timestamp = Date.now() + 3600000; // 1 hour from now
      (notifee.createTriggerNotification as jest.Mock).mockResolvedValueOnce('notification-id');

      const result = await notificationService.scheduleNotification(
        'শিরোনাম',
        'বার্তা',
        timestamp,
      );
      
      expect(result).toBe('notification-id');
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'শিরোনাম',
          body: 'বার্তা',
        }),
        expect.objectContaining({
          type: 0, // TriggerType.TIMESTAMP
          timestamp,
        }),
      );
    });

    it('should use custom notification ID when provided', async () => {
      const timestamp = Date.now() + 3600000;
      const customId = 'custom-notification-id';
      
      await notificationService.scheduleNotification(
        'Title',
        'Message',
        timestamp,
        customId,
      );
      
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          id: customId,
        }),
        expect.any(Object),
      );
    });

    it('should return null when permissions are not granted', async () => {
      (notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      });

      const result = await notificationService.scheduleNotification(
        'Title',
        'Message',
        Date.now(),
      );
      
      expect(result).toBeNull();
    });
  });

  describe('cancelAllNotifications', () => {
    it('should cancel all notifications successfully', async () => {
      const result = await notificationService.cancelAllNotifications();
      
      expect(result).toBe(true);
      expect(notifee.cancelAllNotifications).toHaveBeenCalled();
      expect(notifee.cancelDisplayedNotifications).toHaveBeenCalled();
    });

    it('should handle cancellation errors', async () => {
      (notifee.cancelAllNotifications as jest.Mock).mockRejectedValueOnce(
        new Error('Cancellation failed'),
      );

      const result = await notificationService.cancelAllNotifications();
      
      expect(result).toBe(false);
    });
  });

  describe('cancelNotification', () => {
    it('should cancel specific notification by ID', async () => {
      const notificationId = 'test-notification-id';
      
      const result = await notificationService.cancelNotification(notificationId);
      
      expect(result).toBe(true);
      expect(notifee.cancelNotification).toHaveBeenCalledWith(notificationId);
    });

    it('should handle cancellation errors', async () => {
      (notifee.cancelNotification as jest.Mock).mockRejectedValueOnce(
        new Error('Cancellation failed'),
      );

      const result = await notificationService.cancelNotification('test-id');
      
      expect(result).toBe(false);
    });
  });

  describe('getScheduledNotifications', () => {
    it('should return scheduled notifications', async () => {
      const mockNotifications = [
        { id: 'notification-1', title: 'Test 1' },
        { id: 'notification-2', title: 'Test 2' },
      ];
      
      (notifee.getTriggerNotifications as jest.Mock).mockResolvedValueOnce(
        mockNotifications,
      );

      const result = await notificationService.getScheduledNotifications();
      
      expect(result).toEqual(mockNotifications);
      expect(notifee.getTriggerNotifications).toHaveBeenCalled();
    });

    it('should return empty array on error', async () => {
      (notifee.getTriggerNotifications as jest.Mock).mockRejectedValueOnce(
        new Error('Get failed'),
      );

      const result = await notificationService.getScheduledNotifications();
      
      expect(result).toEqual([]);
    });
  });
});

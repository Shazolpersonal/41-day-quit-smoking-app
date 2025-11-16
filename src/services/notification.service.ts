import notifee, { 
  AndroidImportance, 
  TriggerType, 
  RepeatFrequency,
  TimestampTrigger,
  AuthorizationStatus,
} from 'notifee';
import { Platform } from 'react-native';

/* eslint-disable no-console */

/**
 * Notification Service
 * Handles all notification-related functionality including permissions,
 * scheduling daily reminders, milestone notifications, and cancellations
 */
class NotificationService {
  private channelId = 'quit-smoking-channel';
  private dailyReminderId = 'daily-reminder';

  /**
   * Initialize notification channels (Android)
   * Should be called when app starts
   */
  async initialize(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: this.channelId,
          name: 'ধূমপান ত্যাগ রিমাইন্ডার',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        });
      }
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  /**
   * Request notification permissions from the user
   * @returns Promise<boolean> True if permission granted, false otherwise
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const settings = await notifee.requestPermission();
      
      if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        console.log('Notification permissions granted');
        return true;
      } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        console.log('Notification permissions denied');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Check if notification permissions are granted
   * @returns Promise<boolean> True if permissions granted
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const settings = await notifee.getNotificationSettings();
      return settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedule a daily reminder notification
   * @param time Time in HH:MM format (24-hour)
   * @param message Optional custom message
   * @returns Promise<boolean> Success status
   */
  async scheduleDailyReminder(
    time: string,
    message?: string,
  ): Promise<boolean> {
    try {
      // Check permissions first
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log('No notification permission, cannot schedule reminder');
        return false;
      }

      // Parse time (HH:MM format)
      const [hours, minutes] = time.split(':').map(Number);
      
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error('Invalid time format. Use HH:MM (24-hour format)');
      }

      // Cancel existing daily reminder
      await this.cancelDailyReminder();

      // Create trigger for daily notification
      const now = new Date();
      const triggerDate = new Date();
      triggerDate.setHours(hours, minutes, 0, 0);
      
      // If time has passed today, schedule for tomorrow
      if (triggerDate <= now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      };

      // Create notification
      await notifee.createTriggerNotification(
        {
          id: this.dailyReminderId,
          title: '🌅 আজকের দিন শুরু করুন',
          body: message || 'আজকের কাজ এবং নিশ্চিতকরণ দেখুন। আল্লাহ আপনার সাথে আছেন!',
          android: {
            channelId: this.channelId,
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            smallIcon: 'ic_notification',
          },
          ios: {
            sound: 'default',
            categoryId: 'daily-reminder',
          },
        },
        trigger,
      );

      console.log(`Daily reminder scheduled for ${time}`);
      return true;
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      return false;
    }
  }

  /**
   * Cancel the daily reminder notification
   * @returns Promise<boolean> Success status
   */
  async cancelDailyReminder(): Promise<boolean> {
    try {
      await notifee.cancelNotification(this.dailyReminderId);
      console.log('Daily reminder cancelled');
      return true;
    } catch (error) {
      console.error('Error cancelling daily reminder:', error);
      return false;
    }
  }

  /**
   * Send a milestone achievement notification
   * @param day Milestone day number
   * @param title Notification title
   * @param message Notification message
   * @returns Promise<boolean> Success status
   */
  async sendMilestoneNotification(
    day: number,
    title?: string,
    message?: string,
  ): Promise<boolean> {
    try {
      // Check permissions first
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log('No notification permission, cannot send milestone notification');
        return false;
      }

      // Default messages based on milestone
      const defaultTitle = title || `🎉 ${day} দিন সম্পূর্ণ!`;
      const defaultMessage = message || this.getMilestoneMessage(day);

      await notifee.displayNotification({
        title: defaultTitle,
        body: defaultMessage,
        android: {
          channelId: this.channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          smallIcon: 'ic_notification',
          largeIcon: 'ic_launcher',
          sound: 'default',
        },
        ios: {
          sound: 'default',
          categoryId: 'milestone',
        },
      });

      console.log(`Milestone notification sent for day ${day}`);
      return true;
    } catch (error) {
      console.error('Error sending milestone notification:', error);
      return false;
    }
  }

  /**
   * Send a motivational notification
   * @param title Notification title
   * @param message Notification message
   * @returns Promise<boolean> Success status
   */
  async sendMotivationalNotification(
    title: string,
    message: string,
  ): Promise<boolean> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        return false;
      }

      await notifee.displayNotification({
        title,
        body: message,
        android: {
          channelId: this.channelId,
          importance: AndroidImportance.DEFAULT,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          smallIcon: 'ic_notification',
        },
        ios: {
          sound: 'default',
        },
      });

      return true;
    } catch (error) {
      console.error('Error sending motivational notification:', error);
      return false;
    }
  }

  /**
   * Schedule a notification for a specific time
   * @param title Notification title
   * @param message Notification message
   * @param timestamp Unix timestamp in milliseconds
   * @param notificationId Optional custom notification ID
   * @returns Promise<string | null> Notification ID or null on error
   */
  async scheduleNotification(
    title: string,
    message: string,
    timestamp: number,
    notificationId?: string,
  ): Promise<string | null> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        return null;
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp,
      };

      const id = await notifee.createTriggerNotification(
        {
          id: notificationId,
          title,
          body: message,
          android: {
            channelId: this.channelId,
            importance: AndroidImportance.DEFAULT,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            smallIcon: 'ic_notification',
          },
          ios: {
            sound: 'default',
          },
        },
        trigger,
      );

      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  /**
   * Cancel all scheduled and displayed notifications
   * @returns Promise<boolean> Success status
   */
  async cancelAllNotifications(): Promise<boolean> {
    try {
      // Cancel all trigger notifications
      await notifee.cancelAllNotifications();
      
      // Cancel all displayed notifications
      await notifee.cancelDisplayedNotifications();
      
      console.log('All notifications cancelled');
      return true;
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
      return false;
    }
  }

  /**
   * Cancel a specific notification by ID
   * @param notificationId Notification ID to cancel
   * @returns Promise<boolean> Success status
   */
  async cancelNotification(notificationId: string): Promise<boolean> {
    try {
      await notifee.cancelNotification(notificationId);
      console.log(`Notification ${notificationId} cancelled`);
      return true;
    } catch (error) {
      console.error('Error cancelling notification:', error);
      return false;
    }
  }

  /**
   * Get all scheduled trigger notifications
   * @returns Promise<Array> Array of trigger notifications
   */
  async getScheduledNotifications(): Promise<any[]> {
    try {
      const notifications = await notifee.getTriggerNotifications();
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Get milestone-specific message
   * @param day Milestone day
   * @returns string Milestone message
   */
  private getMilestoneMessage(day: number): string {
    const messages: { [key: number]: string } = {
      1: 'মাশাআল্লাহ! আপনি প্রথম দিন সফলভাবে সম্পূর্ণ করেছেন। আল্লাহ আপনাকে শক্তি দিন!',
      3: 'সুবহানাল্লাহ! ৩ দিন সম্পূর্ণ। আপনার শরীর পরিবর্তন হতে শুরু করেছে!',
      7: 'আলহামদুলিল্লাহ! ১ সপ্তাহ সম্পূর্ণ। আপনার ফুসফুস পরিষ্কার হচ্ছে!',
      14: 'মাশাআল্লাহ! ২ সপ্তাহ সম্পূর্ণ। আপনার রক্ত সঞ্চালন উন্নত হয়েছে!',
      21: 'সুবহানাল্লাহ! ৩ সপ্তাহ সম্পূর্ণ। নতুন অভ্যাস তৈরি হয়েছে!',
      28: 'আলহামদুলিল্লাহ! ৪ সপ্তাহ সম্পূর্ণ। আপনি অসাধারণ কাজ করছেন!',
      35: 'মাশাআল্লাহ! ৫ সপ্তাহ সম্পূর্ণ। আপনি প্রায় লক্ষ্যে পৌঁছেছেন!',
      41: 'আলহামদুলিল্লাহ! ৪১ দিন সম্পূর্ণ! আপনি সফল হয়েছেন! আল্লাহ আপনাকে পুরস্কৃত করুন!',
    };

    return messages[day] || `মাশাআল্লাহ! ${day} দিন সম্পূর্ণ। আল্লাহ আপনার সাথে আছেন!`;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;

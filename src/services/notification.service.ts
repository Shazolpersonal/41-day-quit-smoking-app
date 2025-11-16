import notifee, { 
  AndroidImportance, 
  TriggerType, 
  RepeatFrequency,
  TimestampTrigger,
  AuthorizationStatus,
  EventType,
} from 'notifee';
import { Platform } from 'react-native';
import {navigate} from '../navigation/navigationService';

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
   * Initialize notification channels (Android) and listeners
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

      // Initialize notification event listeners
      this.initializeListeners();
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  /**
   * Initialize notification event listeners for deep linking
   */
  private initializeListeners(): void {
    // Handle foreground notification press
    notifee.onForegroundEvent(({type, detail}: {type: any; detail: any}) => {
      if (type === EventType.PRESS && detail.notification) {
        this.handleNotificationPress(detail.notification.data);
      }
    });

    // Handle background notification press
    notifee.onBackgroundEvent(
      async ({type, detail}: {type: any; detail: any}) => {
        if (type === EventType.PRESS && detail.notification) {
          this.handleNotificationPress(detail.notification.data);
        }
      },
    );
  }

  /**
   * Handle notification press and navigate to appropriate screen
   */
  private handleNotificationPress(data?: Record<string, unknown>): void {
    if (!data) {
      return;
    }

    const {screen, params} = data;

    switch (screen) {
      case 'CravingSOS':
        navigate('CravingSOS');
        break;
      case 'Daily':
        navigate('MainTabs', {
          screen: 'Daily',
          params: params ? (params as any) : undefined,
        });
        break;
      case 'Progress':
        navigate('MainTabs', {screen: 'Progress'});
        break;
      case 'Journal':
        navigate('MainTabs', {screen: 'Journal'});
        break;
      case 'Home':
        navigate('MainTabs', {screen: 'Home'});
        break;
      default:
        // Default to home screen
        navigate('MainTabs', {screen: 'Home'});
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
   * @param currentDay Optional current day number for personalized message
   * @returns Promise<boolean> Success status
   */
  async scheduleDailyReminder(
    time: string,
    message?: string,
    currentDay?: number,
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

      // Generate motivational message based on current day
      const motivationalMessage = message || this.getDailyMotivationalMessage(currentDay);

      // Create notification with deep link data
      await notifee.createTriggerNotification(
        {
          id: this.dailyReminderId,
          title: '🌅 আজকের দিন শুরু করুন',
          body: motivationalMessage,
          data: {
            screen: 'Daily',
          },
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
   * Get daily motivational message based on current day
   * @param currentDay Current day number
   * @returns string Motivational message
   */
  private getDailyMotivationalMessage(currentDay?: number): string {
    const messages = [
      'আজকের কাজ এবং নিশ্চিতকরণ দেখুন। আল্লাহ আপনার সাথে আছেন! 💪',
      'নতুন দিন, নতুন সুযোগ! আজকের লক্ষ্য অর্জন করুন। 🌟',
      'আলহামদুলিল্লাহ! আরেকটি ধূমপানমুক্ত দিন শুরু করুন। 🙏',
      'আপনি শক্তিশালী! আজকের চ্যালেঞ্জ মোকাবেলা করুন। 💚',
      'প্রতিটি দিন একটি বিজয়! আজকের কাজ সম্পূর্ণ করুন। ✨',
      'আল্লাহ আপনার প্রচেষ্টা দেখছেন। চালিয়ে যান! 🌙',
      'আপনি অসাধারণ কাজ করছেন! আজও সফল হবেন। 🎯',
      'সবর করুন, আল্লাহ সবরকারীদের সাথে আছেন। 🤲',
    ];

    if (currentDay) {
      return `দিন ${currentDay}: ${messages[currentDay % messages.length]}`;
    }

    return messages[Math.floor(Math.random() * messages.length)];
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
        data: {
          screen: 'Progress',
        },
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

  /**
   * Schedule prayer time notifications for the day
   * @param prayerTimes Prayer times object with all prayer times
   * @returns Promise<boolean> Success status
   */
  async schedulePrayerTimeNotifications(prayerTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  }): Promise<boolean> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log('No notification permission, cannot schedule prayer notifications');
        return false;
      }

      // Cancel existing prayer notifications
      await this.cancelPrayerTimeNotifications();

      const prayers = [
        { name: 'fajr', nameBangla: 'ফজর', time: prayerTimes.fajr, emoji: '🌅' },
        { name: 'dhuhr', nameBangla: 'যোহর', time: prayerTimes.dhuhr, emoji: '☀️' },
        { name: 'asr', nameBangla: 'আসর', time: prayerTimes.asr, emoji: '🌤️' },
        { name: 'maghrib', nameBangla: 'মাগরিব', time: prayerTimes.maghrib, emoji: '🌆' },
        { name: 'isha', nameBangla: 'এশা', time: prayerTimes.isha, emoji: '🌙' },
      ];

      const now = new Date();
      let scheduledCount = 0;

      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);

        // Only schedule if prayer time hasn't passed today
        if (prayerDate > now) {
          const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: prayerDate.getTime(),
          };

          await notifee.createTriggerNotification(
            {
              id: `prayer-${prayer.name}`,
              title: `${prayer.emoji} ${prayer.nameBangla} নামাজের সময়`,
              body: 'নামাজ পড়ার সময় হয়েছে। আল্লাহ আপনার নামাজ কবুল করুন।',
              data: {
                screen: 'Home',
                type: 'prayer',
                prayer: prayer.name,
              },
              android: {
                channelId: this.channelId,
                importance: AndroidImportance.HIGH,
                pressAction: {
                  id: 'default',
                  launchActivity: 'default',
                },
                smallIcon: 'ic_notification',
                sound: 'default',
              },
              ios: {
                sound: 'default',
                categoryId: 'prayer-time',
              },
            },
            trigger,
          );
          scheduledCount++;
        }
      }

      console.log(`Scheduled ${scheduledCount} prayer time notifications`);
      return true;
    } catch (error) {
      console.error('Error scheduling prayer time notifications:', error);
      return false;
    }
  }

  /**
   * Cancel all prayer time notifications
   * @returns Promise<boolean> Success status
   */
  async cancelPrayerTimeNotifications(): Promise<boolean> {
    try {
      const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      for (const prayer of prayers) {
        await notifee.cancelNotification(`prayer-${prayer}`);
      }
      console.log('Prayer time notifications cancelled');
      return true;
    } catch (error) {
      console.error('Error cancelling prayer time notifications:', error);
      return false;
    }
  }

  /**
   * Send encouragement notification
   * @param message Custom encouragement message
   * @returns Promise<boolean> Success status
   */
  async sendEncouragementNotification(message?: string): Promise<boolean> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        return false;
      }

      const encouragementMessages = [
        'আপনি দুর্দান্ত কাজ করছেন! চালিয়ে যান! 💪',
        'আল্লাহ আপনার প্রচেষ্টা দেখছেন। হাল ছাড়বেন না! 🌟',
        'প্রতিটি মুহূর্ত একটি নতুন সুযোগ। আপনি পারবেন! ✨',
        'সবর করুন, আল্লাহ সবরকারীদের সাথে আছেন। 🤲',
        'আপনার স্বাস্থ্য উন্নত হচ্ছে। চালিয়ে যান! 💚',
        'আপনি শক্তিশালী এবং সক্ষম! বিশ্বাস রাখুন! 🎯',
      ];

      const randomMessage = message || encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

      await notifee.displayNotification({
        title: '💚 উৎসাহ বার্তা',
        body: randomMessage,
        data: {
          screen: 'Home',
          type: 'encouragement',
        },
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
          categoryId: 'encouragement',
        },
      });

      console.log('Encouragement notification sent');
      return true;
    } catch (error) {
      console.error('Error sending encouragement notification:', error);
      return false;
    }
  }

  /**
   * Schedule app inactivity reminder (if app not opened for 24 hours)
   * @returns Promise<boolean> Success status
   */
  async scheduleInactivityReminder(): Promise<boolean> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        return false;
      }

      // Cancel existing inactivity reminder
      await notifee.cancelNotification('inactivity-reminder');

      // Schedule for 24 hours from now
      const reminderTime = Date.now() + (24 * 60 * 60 * 1000);

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: reminderTime,
      };

      await notifee.createTriggerNotification(
        {
          id: 'inactivity-reminder',
          title: '🌟 আমরা আপনাকে মিস করছি!',
          body: 'আপনার অগ্রগতি দেখুন এবং আজকের কাজ সম্পূর্ণ করুন। আল্লাহ আপনার সাথে আছেন!',
          data: {
            screen: 'Home',
            type: 'inactivity',
          },
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
            categoryId: 'inactivity',
          },
        },
        trigger,
      );

      console.log('Inactivity reminder scheduled for 24 hours');
      return true;
    } catch (error) {
      console.error('Error scheduling inactivity reminder:', error);
      return false;
    }
  }

  /**
   * Cancel inactivity reminder (call when app is opened)
   * @returns Promise<boolean> Success status
   */
  async cancelInactivityReminder(): Promise<boolean> {
    try {
      await notifee.cancelNotification('inactivity-reminder');
      console.log('Inactivity reminder cancelled');
      return true;
    } catch (error) {
      console.error('Error cancelling inactivity reminder:', error);
      return false;
    }
  }

  /**
   * Reset inactivity timer (cancel and reschedule)
   * @returns Promise<boolean> Success status
   */
  async resetInactivityTimer(): Promise<boolean> {
    await this.cancelInactivityReminder();
    return await this.scheduleInactivityReminder();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;

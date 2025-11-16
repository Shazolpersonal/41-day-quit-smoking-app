import {useEffect} from 'react';
import {useSettings} from '../context/SettingsContext';
import {useProgress} from '../context/ProgressContext';
import {notificationService} from '../services/notification.service';

/* eslint-disable no-console */

/**
 * Custom hook to sync notification settings with the notification service
 * Automatically schedules/cancels daily reminders based on settings
 */
export const useNotificationSync = () => {
  const {settings} = useSettings();
  const {progress} = useProgress();

  useEffect(() => {
    if (!settings) {
      return;
    }

    syncNotifications();
  }, [settings?.notifications.dailyReminder, settings?.notifications.dailyReminderTime]);

  const syncNotifications = async () => {
    if (!settings) {
      return;
    }

    const {dailyReminder, dailyReminderTime, enabled} = settings.notifications;

    // Check if notifications are enabled globally
    if (!enabled) {
      console.log('Notifications disabled globally');
      await notificationService.cancelDailyReminder();
      return;
    }

    // Check if daily reminders are enabled
    if (dailyReminder && dailyReminderTime) {
      try {
        // Check if we have permission
        const hasPermission = await notificationService.checkPermissions();
        
        if (!hasPermission) {
          console.log('No notification permission, skipping daily reminder setup');
          return;
        }

        // Schedule daily reminder with current day for personalized message
        const currentDay = progress?.currentDay || 1;
        const scheduled = await notificationService.scheduleDailyReminder(
          dailyReminderTime,
          undefined,
          currentDay,
        );

        if (scheduled) {
          console.log(`Daily reminder synced for ${dailyReminderTime}`);
        } else {
          console.log('Failed to schedule daily reminder');
        }
      } catch (error) {
        console.error('Error syncing daily reminder:', error);
      }
    } else {
      // Cancel daily reminder if disabled
      await notificationService.cancelDailyReminder();
      console.log('Daily reminder cancelled');
    }
  };
};

import {useEffect} from 'react';
import {useSettings} from '../context/SettingsContext';
import {notificationService} from '../services/notification.service';
import {prayerTimeService} from '../services/prayerTime.service';

/* eslint-disable no-console */

/**
 * Custom hook to manage prayer time notifications
 * Automatically schedules prayer notifications based on location and settings
 */
export const usePrayerNotifications = () => {
  const {settings} = useSettings();

  useEffect(() => {
    if (!settings) {
      return;
    }

    syncPrayerNotifications();

    // Reschedule prayer notifications daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 1, 0, 0); // 00:01 AM

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      syncPrayerNotifications();
      
      // Set up daily interval
      const dailyInterval = setInterval(() => {
        syncPrayerNotifications();
      }, 24 * 60 * 60 * 1000); // Every 24 hours

      return () => clearInterval(dailyInterval);
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, [settings?.notifications.prayerTimes, settings?.notifications.enabled]);

  const syncPrayerNotifications = async () => {
    if (!settings) {
      return;
    }

    const {prayerTimes, enabled} = settings.notifications;

    // Check if notifications and prayer times are enabled
    if (!enabled || !prayerTimes) {
      console.log('Prayer time notifications disabled');
      await notificationService.cancelPrayerTimeNotifications();
      return;
    }

    try {
      // Check if we have permission
      const hasPermission = await notificationService.checkPermissions();
      
      if (!hasPermission) {
        console.log('No notification permission, skipping prayer time setup');
        return;
      }

      // Get prayer times for today
      const todayPrayerTimes = await prayerTimeService.getPrayerTimesWithLocation();

      // Schedule notifications
      const scheduled = await notificationService.schedulePrayerTimeNotifications({
        fajr: todayPrayerTimes.fajr,
        dhuhr: todayPrayerTimes.dhuhr,
        asr: todayPrayerTimes.asr,
        maghrib: todayPrayerTimes.maghrib,
        isha: todayPrayerTimes.isha,
      });

      if (scheduled) {
        console.log('Prayer time notifications synced');
      } else {
        console.log('Failed to schedule prayer time notifications');
      }
    } catch (error) {
      console.error('Error syncing prayer time notifications:', error);
    }
  };
};

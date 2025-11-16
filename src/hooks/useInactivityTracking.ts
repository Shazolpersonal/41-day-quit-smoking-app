import {useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useSettings} from '../context/SettingsContext';
import {notificationService} from '../services/notification.service';
import {storageService} from '../services/storage.service';

/* eslint-disable no-console */

const LAST_ACTIVE_KEY = 'lastActiveTimestamp';

/**
 * Custom hook to track app inactivity and send reminders
 * Sends notification if app hasn't been opened for 24 hours
 */
export const useInactivityTracking = () => {
  const {settings} = useSettings();

  useEffect(() => {
    // Update last active timestamp when app becomes active
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initialize on mount
    handleAppActive();

    return () => {
      subscription.remove();
    };
  }, [settings?.notifications.enabled, settings?.notifications.encouragement]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      handleAppActive();
    }
  };

  const handleAppActive = async () => {
    if (!settings) {
      return;
    }

    const {enabled, encouragement} = settings.notifications;

    if (!enabled || !encouragement) {
      return;
    }

    try {
      // Cancel any existing inactivity reminder
      await notificationService.cancelInactivityReminder();

      // Update last active timestamp
      await storageService.saveData(LAST_ACTIVE_KEY, Date.now().toString());

      // Schedule new inactivity reminder for 24 hours from now
      await notificationService.scheduleInactivityReminder();

      console.log('Inactivity timer reset');
    } catch (error) {
      console.error('Error handling app active:', error);
    }
  };
};

/**
 * Get last active timestamp
 * @returns Promise<number | null> Last active timestamp or null
 */
export const getLastActiveTimestamp = async (): Promise<number | null> => {
  try {
    const timestamp = await storageService.getData(LAST_ACTIVE_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error getting last active timestamp:', error);
    return null;
  }
};

/**
 * Check if app has been inactive for more than 24 hours
 * @returns Promise<boolean> True if inactive for 24+ hours
 */
export const isInactiveFor24Hours = async (): Promise<boolean> => {
  const lastActive = await getLastActiveTimestamp();
  
  if (!lastActive) {
    return false;
  }

  const hoursSinceActive = (Date.now() - lastActive) / (1000 * 60 * 60);
  return hoursSinceActive >= 24;
};

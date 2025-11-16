import {useEffect, useRef} from 'react';
import {useProgress} from '../context/ProgressContext';
import {useSettings} from '../context/SettingsContext';
import {notificationService} from '../services/notification.service';

/* eslint-disable no-console */

/**
 * Custom hook to manage milestone and encouragement notifications
 * Automatically sends notifications when milestones are achieved
 */
export const useMilestoneNotifications = () => {
  const {progress} = useProgress();
  const {settings} = useSettings();
  const previousDayRef = useRef<number>(0);

  useEffect(() => {
    if (!progress || !settings) {
      return;
    }

    checkMilestoneAchievement();
  }, [progress?.currentDay, settings?.notifications.milestones]);

  const checkMilestoneAchievement = async () => {
    if (!progress || !settings) {
      return;
    }

    const {currentDay} = progress;
    const {milestones, enabled} = settings.notifications;

    // Check if notifications and milestones are enabled
    if (!enabled || !milestones) {
      return;
    }

    // Check if day has changed and is a milestone
    if (currentDay !== previousDayRef.current && isMilestoneDay(currentDay)) {
      // Send milestone notification
      const sent = await notificationService.sendMilestoneNotification(currentDay);
      
      if (sent) {
        console.log(`Milestone notification sent for day ${currentDay}`);
      }
    }

    // Update previous day reference
    previousDayRef.current = currentDay;
  };

  /**
   * Check if a day is a milestone
   * @param day Day number
   * @returns boolean True if milestone day
   */
  const isMilestoneDay = (day: number): boolean => {
    const milestoneDays = [1, 3, 7, 14, 21, 28, 35, 41];
    return milestoneDays.includes(day);
  };
};

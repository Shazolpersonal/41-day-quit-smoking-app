/**
 * Accessibility Utilities
 * Provides helper functions for accessibility features
 */

import {AccessibilityInfo, Platform} from 'react-native';

/**
 * Check if screen reader is enabled
 */
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.error('Error checking screen reader status:', error);
    return false;
  }
};

/**
 * Announce message to screen reader
 */
export const announceForAccessibility = (message: string): void => {
  AccessibilityInfo.announceForAccessibility(message);
};

/**
 * Get accessible label for progress percentage
 */
export const getProgressLabel = (progress: number, total: number): string => {
  const percentage = Math.round((progress / total) * 100);
  return `${progress} এর মধ্যে ${total} সম্পূর্ণ, ${percentage} শতাংশ`;
};

/**
 * Get accessible label for day counter
 */
export const getDayCounterLabel = (currentDay: number, totalDays: number): string => {
  return `${totalDays} দিনের মধ্যে ${currentDay} দিন সম্পূর্ণ`;
};

/**
 * Get accessible label for money saved
 */
export const getMoneySavedLabel = (amount: number): string => {
  return `${amount.toFixed(2)} টাকা সাশ্রয় হয়েছে`;
};

/**
 * Get accessible label for time duration
 */
export const getTimeDurationLabel = (
  days: number,
  hours: number,
  minutes: number
): string => {
  const parts: string[] = [];
  
  if (days > 0) {
    parts.push(`${days} দিন`);
  }
  if (hours > 0) {
    parts.push(`${hours} ঘন্টা`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} মিনিট`);
  }
  
  return parts.join(', ') + ' ধূমপান মুক্ত';
};

/**
 * Get accessible label for task completion
 */
export const getTaskCompletionLabel = (
  completed: number,
  total: number,
  isCompleted: boolean
): string => {
  if (isCompleted) {
    return `কাজ সম্পূর্ণ হয়েছে। ${completed} এর মধ্যে ${total}`;
  }
  return `কাজ সম্পূর্ণ হয়নি। ${completed} এর মধ্যে ${total}`;
};

/**
 * Get accessible label for milestone badge
 */
export const getMilestoneBadgeLabel = (
  day: number,
  title: string,
  isAchieved: boolean
): string => {
  if (isAchieved) {
    return `${day} দিনের মাইলস্টোন অর্জিত: ${title}`;
  }
  return `${day} দিনের মাইলস্টোন: ${title}, এখনও অর্জিত হয়নি`;
};

/**
 * Get accessible label for craving intensity
 */
export const getCravingIntensityLabel = (intensity: number): string => {
  const levels = [
    'খুব দুর্বল',
    'দুর্বল',
    'মাঝারি দুর্বল',
    'মাঝারি',
    'মাঝারি শক্তিশালী',
    'শক্তিশালী',
    'খুব শক্তিশালী',
    'অত্যন্ত শক্তিশালী',
    'তীব্র',
    'অসহনীয়',
  ];
  
  const level = levels[Math.min(intensity - 1, 9)] || 'অজানা';
  return `ক্রেভিং তীব্রতা: ${intensity} এর মধ্যে ১০, ${level}`;
};

/**
 * Get accessible hint for interactive elements
 */
export const getAccessibilityHint = (action: string): string => {
  const hints: Record<string, string> = {
    press: 'চাপুন',
    double_tap: 'দুইবার ট্যাপ করুন',
    swipe: 'সোয়াইপ করুন',
    edit: 'সম্পাদনা করতে ট্যাপ করুন',
    delete: 'মুছে ফেলতে ট্যাপ করুন',
    navigate: 'খুলতে ট্যাপ করুন',
    toggle: 'টগল করতে ট্যাপ করুন',
    play: 'চালাতে ট্যাপ করুন',
    pause: 'থামাতে ট্যাপ করুন',
    call: 'কল করতে ট্যাপ করুন',
  };
  
  return hints[action] || 'ট্যাপ করুন';
};

/**
 * Minimum touch target size (44x44 points as per WCAG guidelines)
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Check if touch target meets minimum size requirements
 */
export const isTouchTargetAccessible = (width: number, height: number): boolean => {
  return width >= MIN_TOUCH_TARGET_SIZE && height >= MIN_TOUCH_TARGET_SIZE;
};

/**
 * Get accessible role for component type
 */
export const getAccessibilityRole = (
  type: 'button' | 'link' | 'header' | 'text' | 'image' | 'checkbox' | 'radio' | 'switch'
): string => {
  return type;
};

/**
 * Format number for accessibility
 */
export const formatNumberForAccessibility = (num: number): string => {
  return num.toLocaleString('bn-BD');
};

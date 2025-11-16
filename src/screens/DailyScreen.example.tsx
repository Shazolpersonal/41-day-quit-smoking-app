/**
 * DailyScreen Component Examples
 * 
 * This file demonstrates various usage examples of the DailyScreen component
 * for the 41-Day Quit Smoking App.
 */

import React from 'react';
import {DailyScreen} from './DailyScreen';

/**
 * Example 1: Basic Usage
 * 
 * The DailyScreen displays day-specific content from the dailyContent data.
 * It automatically loads the current day based on the user's progress.
 */
export const BasicDailyScreenExample = () => {
  const navigation = {} as any;
  const route = {params: undefined} as any;
  
  return <DailyScreen navigation={navigation} route={route} />;
};

/**
 * Example 2: Specific Day
 * 
 * You can navigate to a specific day by passing the day number in route params.
 * This is useful for reviewing previous days' content.
 */
export const SpecificDayExample = () => {
  const navigation = {} as any;
  const route = {params: {day: 5}} as any;
  
  return <DailyScreen navigation={navigation} route={route} />;
};

/**
 * Example 3: Navigation Integration
 * 
 * The DailyScreen integrates with React Navigation and can be navigated to
 * from other screens like HomeScreen.
 */
export const NavigationExample = () => {
  // From HomeScreen or other screens:
  // navigation.navigate('Daily', {day: 5});
  
  return null;
};

/**
 * Features Demonstrated:
 * 
 * 1. Day-Specific Content Display
 *    - Day title with emoji
 *    - Introduction text
 *    - Task checklist
 *    - Daily affirmations
 *    - Islamic reminders
 *    - Craving tips
 * 
 * 2. Task Management
 *    - Toggle task completion
 *    - Save completion status to AsyncStorage
 *    - Load saved status on mount
 *    - Progress bar showing completion
 * 
 * 3. Day Navigation
 *    - Previous/Next day buttons
 *    - Current day indicator
 *    - Prevent access to future days
 *    - Allow review of previous days
 * 
 * 4. Data Persistence
 *    - Task completion saved per day
 *    - Loads saved data on screen mount
 *    - AsyncStorage for offline support
 */

/**
 * HomeScreen Example Usage
 * 
 * This file demonstrates how to use the HomeScreen component
 * in the 41-Day Quit Smoking App.
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './HomeScreen';
import {UserProvider} from '../context/UserContext';
import {ProgressProvider} from '../context/ProgressContext';
import {SettingsProvider} from '../context/SettingsContext';

const Stack = createNativeStackNavigator();

/**
 * Example 1: Basic HomeScreen Usage
 * 
 * The HomeScreen is the main screen of the app that displays:
 * - Day counter with smoke-free time
 * - Money saved calculation
 * - Today's task summary
 * - Progress bar for 41-day journey
 * - Daily affirmation
 * - Quick action buttons
 */
export const BasicHomeScreenExample = () => {
  return (
    <UserProvider>
      <ProgressProvider>
        <SettingsProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SettingsProvider>
      </ProgressProvider>
    </UserProvider>
  );
};

/**
 * Example 2: HomeScreen with Navigation
 * 
 * The HomeScreen provides navigation to:
 * - CravingSOS: Emergency help for cravings
 * - Journal: User's journal entries
 * - Progress: Detailed progress view
 * - Daily: Today's tasks and content
 */
export const HomeScreenWithNavigationExample = () => {
  return (
    <UserProvider>
      <ProgressProvider>
        <SettingsProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen}
                options={{headerShown: false}}
              />
              {/* Add other screens here */}
            </Stack.Navigator>
          </NavigationContainer>
        </SettingsProvider>
      </ProgressProvider>
    </UserProvider>
  );
};

/**
 * Example 3: HomeScreen Features
 * 
 * Key Features:
 * 
 * 1. Day Counter:
 *    - Shows current day in the 41-day journey
 *    - Displays smoke-free time (days, hours, minutes)
 *    - Animated counter with celebration effects
 * 
 * 2. Money Saved:
 *    - Calculates money saved based on cigarette consumption
 *    - Shows cigarettes not smoked
 *    - Motivational messages
 * 
 * 3. Progress Bar:
 *    - Visual representation of 41-day journey
 *    - Shows percentage complete
 *    - Days remaining counter
 * 
 * 4. Task Summary:
 *    - Today's task list preview
 *    - Completion progress
 *    - Quick link to full task list
 * 
 * 5. Daily Affirmation:
 *    - Islamic motivational quotes
 *    - Day-specific affirmations
 *    - Beautiful card design
 * 
 * 6. Quick Actions:
 *    - SOS button for emergency help
 *    - Journal entry shortcut
 *    - Progress view shortcut
 *    - Tips and guidance shortcut
 * 
 * 7. Pull to Refresh:
 *    - Refresh progress data
 *    - Update calculations
 *    - Sync with storage
 */

/**
 * Example 4: HomeScreen Data Flow
 * 
 * Data Sources:
 * - UserContext: User profile and quit date
 * - ProgressContext: Progress calculations and milestones
 * - dailyContent: Day-specific content and tasks
 * 
 * Calculations:
 * - Smoke-free time: Based on quit date
 * - Money saved: cigarettesPerDay * days * (pricePerPack / cigarettesPerPack)
 * - Cigarettes not smoked: cigarettesPerDay * days
 * - Current day: Days since quit date (1-41)
 * - Task completion: Completed tasks / total tasks
 */

/**
 * Example 5: HomeScreen Interactions
 * 
 * User Actions:
 * 1. Pull down to refresh data
 * 2. Tap SOS button for emergency help
 * 3. Tap Journal to add entry
 * 4. Tap Progress to view detailed stats
 * 5. Tap Tips to view today's content
 * 6. View animations on day changes
 * 
 * Navigation Flow:
 * Home -> CravingSOS (Emergency help)
 * Home -> Journal (Journal entries)
 * Home -> Progress (Detailed progress)
 * Home -> Daily (Today's tasks)
 */

/**
 * Example 6: HomeScreen Customization
 * 
 * The HomeScreen can be customized by:
 * - Modifying dailyContent for different affirmations
 * - Adjusting theme colors in constants/theme.ts
 * - Changing animation timings in components
 * - Adding new quick action buttons
 * - Customizing progress bar appearance
 */

export default BasicHomeScreenExample;

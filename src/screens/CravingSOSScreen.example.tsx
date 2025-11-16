/**
 * CravingSOSScreen Example
 * 
 * This file demonstrates the usage of the CravingSOSScreen component
 * for the 41-Day Quit Smoking App.
 * 
 * Features:
 * - Encouragement message with pulsing animation
 * - Timer showing craving duration
 * - Intensity slider (1-10)
 * - Quick coping strategies
 * - Breathing exercise
 * - Islamic duas and dhikr
 * - Emergency contacts
 * - Craving log saving
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CravingSOSScreen} from './CravingSOSScreen';
import {UserProvider} from '../context/UserContext';
import {ProgressProvider} from '../context/ProgressContext';
import {SettingsProvider} from '../context/SettingsContext';

const Stack = createNativeStackNavigator();

/**
 * Example 1: Basic CravingSOS Screen
 * Shows the main SOS screen with all features
 */
export const BasicCravingSOSExample = () => {
  return (
    <NavigationContainer>
      <UserProvider>
        <ProgressProvider>
          <SettingsProvider>
            <Stack.Navigator>
              <Stack.Screen
                name="CravingSOS"
                component={CravingSOSScreen}
                options={{
                  title: 'জরুরি সাহায্য',
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </SettingsProvider>
        </ProgressProvider>
      </UserProvider>
    </NavigationContainer>
  );
};

/**
 * Example 2: CravingSOS Screen with Navigation
 * Shows how the screen integrates with app navigation
 */
export const CravingSOSWithNavigationExample = () => {
  return (
    <NavigationContainer>
      <UserProvider>
        <ProgressProvider>
          <SettingsProvider>
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={() => null}
                options={{title: 'হোম'}}
              />
              <Stack.Screen
                name="CravingSOS"
                component={CravingSOSScreen}
                options={{
                  title: 'জরুরি সাহায্য',
                  headerShown: false,
                  presentation: 'modal',
                }}
              />
            </Stack.Navigator>
          </SettingsProvider>
        </ProgressProvider>
      </UserProvider>
    </NavigationContainer>
  );
};

/**
 * Usage Notes:
 * 
 * 1. Main Features:
 *    - Encouragement message with animation
 *    - Real-time craving duration timer
 *    - Intensity slider for logging
 *    - Quick access to coping strategies
 * 
 * 2. Coping Strategies:
 *    - Breathing exercise (4-4-4 technique)
 *    - Islamic duas for strength
 *    - Dhikr for peace of mind
 *    - Water drinking reminder
 *    - Walking suggestion
 *    - Emergency contacts
 *    - Distraction techniques
 * 
 * 3. Islamic Content:
 *    - Random dua from islamicContent
 *    - Random dhikr with count and benefits
 *    - Quranic verse reminder
 * 
 * 4. Craving Log:
 *    - Automatically tracks craving start time
 *    - Records intensity level
 *    - Saves duration
 *    - Marks as overcome or not
 * 
 * 5. Navigation:
 *    - Back button to return to previous screen
 *    - Navigate to Home after overcoming craving
 *    - Modal presentation for urgent access
 * 
 * 6. Accessibility:
 *    - Large, readable text
 *    - Clear visual hierarchy
 *    - Touch-friendly buttons
 *    - Bangla language support
 * 
 * 7. User Experience:
 *    - Pulsing animation for encouragement
 *    - Real-time timer feedback
 *    - Easy strategy selection
 *    - Quick access to help
 *    - Positive reinforcement
 */

export default BasicCravingSOSExample;

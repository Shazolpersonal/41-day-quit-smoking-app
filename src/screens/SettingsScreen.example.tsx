/**
 * SettingsScreen Example Usage
 * 
 * This file demonstrates how to use the SettingsScreen component
 * in your React Native application.
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UserProvider} from '../context/UserContext';
import {SettingsProvider} from '../context/SettingsContext';
import SettingsScreen from './SettingsScreen';

const Stack = createNativeStackNavigator();

/**
 * Example 1: Basic Usage
 * 
 * The SettingsScreen is typically used within a navigation stack
 * and requires UserProvider and SettingsProvider to be available.
 */
export const BasicSettingsExample = () => {
  return (
    <UserProvider>
      <SettingsProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: 'সেটিংস',
                headerStyle: {
                  backgroundColor: '#2E7D32',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SettingsProvider>
    </UserProvider>
  );
};

/**
 * Example 2: Settings Screen Features
 * 
 * The SettingsScreen provides two main sections:
 * 
 * 1. Profile Settings:
 *    - Edit quit date
 *    - Update cigarettes per day
 *    - Modify price per pack
 *    - Change cigarettes per pack
 * 
 * 2. Notification Settings:
 *    - Toggle prayer time notifications
 *    - Enable/disable daily reminders
 *    - Set daily reminder time
 *    - Toggle milestone notifications
 * 
 * 3. Appearance Settings:
 *    - Adjust font size (small, medium, large)
 *    - Toggle sound effects
 *    - Toggle haptic feedback
 * 
 * 4. Emergency Contacts:
 *    - Add up to 5 emergency contacts
 *    - Edit existing contacts
 *    - Delete contacts
 */

/**
 * Example 3: Profile Settings Usage
 * 
 * Users can update their quit date and cigarette consumption data:
 * 
 * 1. Tap on the quit date to open date picker
 * 2. Select a new date (must be in the past)
 * 3. Press "সংরক্ষণ করুন" to save
 * 
 * 4. Enter cigarettes per day (e.g., 20)
 * 5. Enter price per pack (e.g., 150)
 * 6. Enter cigarettes per pack (e.g., 20)
 * 7. Press "সিগারেটের তথ্য সংরক্ষণ করুন" to save
 */

/**
 * Example 4: Notification Settings Usage
 * 
 * Users can configure notification preferences:
 * 
 * Prayer Time Notifications:
 * - Toggle switch to enable/disable prayer time reminders
 * - When enabled, user receives notifications at prayer times
 * 
 * Daily Reminders:
 * - Toggle switch to enable/disable daily reminders
 * - When enabled, user can set a specific time for daily reminder
 * - Tap on time to open time picker
 * - Select desired time
 * - Press "সময় সংরক্ষণ করুন" to save
 * 
 * Milestone Notifications:
 * - Toggle switch to enable/disable milestone achievement notifications
 * - When enabled, user receives notifications on milestone days (1, 3, 7, 14, 21, 28, 35, 41)
 */

/**
 * Example 5: Appearance Settings Usage
 * 
 * Users can customize the app appearance:
 * 
 * Font Size:
 * - Choose between small, medium, or large font sizes
 * - Tap on desired size button (ছোট, মাঝারি, বড়)
 * - Changes apply immediately
 * 
 * Sound Effects:
 * - Toggle switch to enable/disable sound effects
 * - When enabled, app plays sounds for actions and achievements
 * 
 * Haptic Feedback:
 * - Toggle switch to enable/disable haptic feedback
 * - When enabled, device vibrates on touch interactions
 */

/**
 * Example 6: Emergency Contacts Management
 * 
 * Users can manage emergency contacts for crisis support:
 * 
 * Add Contact:
 * 1. Press "+ নতুন যোগাযোগ যোগ করুন" button
 * 2. Enter contact name
 * 3. Enter phone number (Bangladesh format: 01712345678)
 * 4. Enter relationship (e.g., বন্ধু, পরিবার)
 * 5. Press "সংরক্ষণ করুন" to save
 * 
 * Edit Contact:
 * 1. Press "সম্পাদনা" button on contact card
 * 2. Modify contact details
 * 3. Press "সংরক্ষণ করুন" to save changes
 * 
 * Delete Contact:
 * 1. Press "মুছুন" button on contact card
 * 2. Confirm deletion in alert dialog
 * 
 * Limitations:
 * - Maximum 5 emergency contacts allowed
 * - Phone number must be valid Bangladesh format
 */

/**
 * Example 7: Integration with Navigation
 * 
 * The SettingsScreen is typically accessed from a tab navigator:
 */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export const TabNavigatorExample = () => {
  return (
    <UserProvider>
      <SettingsProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={() => null} // Your home screen
              options={{title: 'হোম'}}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{title: 'সেটিংস'}}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SettingsProvider>
    </UserProvider>
  );
};

/**
 * Example 8: Programmatic Updates
 * 
 * You can also update settings programmatically using the context:
 */
import {useUser} from '../context/UserContext';
import {useSettings} from '../context/SettingsContext';

export const ProgrammaticUpdateExample = () => {
  const {updateQuitDate, updateCigaretteData} = useUser();
  const {updateNotifications, updateAppearance, addEmergencyContact} = useSettings();

  const updateUserSettings = async () => {
    // Update quit date
    await updateQuitDate('2024-01-01T00:00:00.000Z');

    // Update cigarette data
    await updateCigaretteData(15, 120, 20);

    // Update notification settings
    await updateNotifications({
      dailyReminder: true,
      dailyReminderTime: '09:00',
      prayerTimes: true,
      milestones: true,
    });

    // Update appearance settings
    await updateAppearance({
      fontSize: 'large',
      soundEffects: true,
      hapticFeedback: false,
    });

    // Add emergency contact
    await addEmergencyContact({
      name: 'জন ডো',
      phone: '01712345678',
      relationship: 'বন্ধু',
    });
  };

  return null;
};

/**
 * Example 9: Validation
 * 
 * The SettingsScreen includes built-in validation:
 * 
 * Quit Date:
 * - Must be in the past (not future)
 * 
 * Cigarette Data:
 * - Cigarettes per day: Must be >= 0
 * - Price per pack: Must be >= 0
 * - Cigarettes per pack: Must be >= 1
 * 
 * Reminder Time:
 * - Must be in HH:MM format (24-hour)
 * - Automatically validated by DateTimePicker
 * 
 * Emergency Contacts:
 * - Name: Required, cannot be empty
 * - Phone: Required, must match Bangladesh format (01XXXXXXXXX)
 * - Relationship: Required, cannot be empty
 * - Maximum 5 contacts allowed
 */

/**
 * Example 10: Error Handling
 * 
 * The SettingsScreen handles errors gracefully:
 * 
 * - Shows alert on save failure
 * - Reverts toggle switches on update failure
 * - Validates input before saving
 * - Handles notification permission denial
 * - Validates emergency contact data
 * - Shows confirmation dialog before deleting contacts
 */

/**
 * Example 11: Notification Permissions
 * 
 * When enabling daily reminders, the app requests notification permissions:
 * 
 * 1. User toggles daily reminders ON
 * 2. App requests notification permission
 * 3. If granted: Schedule daily reminder
 * 4. If denied: Show alert and keep toggle OFF
 */

/**
 * Example 12: Accessibility
 * 
 * The SettingsScreen is designed with accessibility in mind:
 * 
 * - Clear labels for all inputs
 * - Descriptive text for toggle switches
 * - Proper contrast ratios
 * - Touch targets meet minimum size requirements
 * - Screen reader compatible
 * - Font size adjustment for better readability
 */

export default {
  BasicSettingsExample,
  TabNavigatorExample,
  ProgrammaticUpdateExample,
};

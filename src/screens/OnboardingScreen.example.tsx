/**
 * OnboardingScreen Example Usage
 * 
 * This file demonstrates how to use the OnboardingScreen component
 * and shows the expected behavior and data flow.
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingScreen} from './OnboardingScreen';
import {RootStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Example 1: Basic Navigation Setup
 * 
 * This shows how to integrate OnboardingScreen into your navigation stack.
 */
export const OnboardingNavigationExample = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: false, // Hide header for cleaner onboarding experience
          }}
        />
        {/* Other screens would be defined here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/**
 * Example 2: Expected User Data After Onboarding
 * 
 * After successful onboarding, the following data is saved to AsyncStorage:
 */
export const expectedUserData = {
  // User data saved with key '@quit_smoking_user'
  user: {
    id: 'user_1234567890_abc123def',
    quitDate: '2024-01-15T00:00:00.000Z',
    cigarettesPerDay: 10,
    pricePerPack: 150,
    cigarettesPerPack: 20,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  
  // Settings data saved with key '@quit_smoking_settings'
  settings: {
    notifications: {
      enabled: true,
      dailyReminder: true,
      dailyReminderTime: '08:00',
      prayerTimes: true, // Based on user selection
      milestones: true,
      encouragement: true,
    },
    appearance: {
      fontSize: 'medium',
      theme: 'light',
      soundEffects: true,
      hapticFeedback: true,
    },
    privacy: {
      pinLock: false,
      biometric: false,
      dataEncryption: false,
    },
    emergencyContacts: [],
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
};

/**
 * Example 3: Form Validation Scenarios
 */
export const validationExamples = {
  // Valid input
  valid: {
    quitDate: new Date('2024-01-15'),
    cigarettesPerDay: '10',
    pricePerPack: '150',
    prayerNotifications: true,
  },
  
  // Invalid: Future quit date
  invalidFutureDate: {
    quitDate: new Date('2025-12-31'),
    cigarettesPerDay: '10',
    pricePerPack: '150',
    error: 'ধূমপান ত্যাগের তারিখ ভবিষ্যতে হতে পারে না',
  },
  
  // Invalid: Too few cigarettes
  invalidCigarettes: {
    quitDate: new Date('2024-01-15'),
    cigarettesPerDay: '0',
    pricePerPack: '150',
    error: 'দয়া করে সঠিক সংখ্যা লিখুন (কমপক্ষে ১)',
  },
  
  // Invalid: Too many cigarettes
  invalidTooMany: {
    quitDate: new Date('2024-01-15'),
    cigarettesPerDay: '150',
    pricePerPack: '150',
    error: 'সংখ্যা খুব বেশি মনে হচ্ছে',
  },
  
  // Invalid: Price too low
  invalidPrice: {
    quitDate: new Date('2024-01-15'),
    cigarettesPerDay: '10',
    pricePerPack: '0',
    error: 'দয়া করে সঠিক দাম লিখুন (কমপক্ষে ১ টাকা)',
  },
};

/**
 * Example 4: Testing Onboarding Flow
 * 
 * This demonstrates how to test the onboarding flow programmatically.
 */
export const testOnboardingFlow = async () => {
  // 1. User opens app for first time
  // 2. OnboardingScreen is displayed
  // 3. User fills in the form:
  const formData = {
    quitDate: new Date('2024-01-15'),
    cigarettesPerDay: '10',
    pricePerPack: '150',
    prayerNotifications: true,
  };
  
  // 4. User submits the form
  // 5. Validation passes
  // 6. Data is saved to AsyncStorage
  // 7. User is navigated to MainTabs -> Home
  
  console.log('Onboarding completed successfully');
};

/**
 * Example 5: Handling Errors
 * 
 * Shows how errors are handled during onboarding.
 */
export const errorHandlingExample = {
  // Storage error
  storageError: {
    scenario: 'AsyncStorage fails to save data',
    userMessage: 'ডেটা সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
    action: 'User stays on onboarding screen, can retry',
  },
  
  // Validation error
  validationError: {
    scenario: 'User submits invalid data',
    userMessage: 'দয়া করে সব তথ্য সঠিকভাবে পূরণ করুন।',
    action: 'Error messages shown below each invalid field',
  },
};

/**
 * Example 6: Accessibility Features
 */
export const accessibilityFeatures = {
  // All inputs have proper labels
  labels: [
    'আপনি কবে ধূমপান ছেড়েছেন?',
    'প্রতিদিন কতটি সিগারেট খেতেন?',
    'এক প্যাকেটের দাম কত? (টাকা)',
    'নামাজের সময় রিমাইন্ডার চান?',
  ],
  
  // Keyboard handling
  keyboard: {
    cigarettesPerDay: 'number-pad',
    pricePerPack: 'decimal-pad',
    dismissOnScroll: true,
  },
  
  // Error feedback
  errorFeedback: {
    visual: 'Red border on invalid inputs',
    text: 'Error message in Bengali below input',
  },
};

/**
 * Example 7: Platform-Specific Behavior
 */
export const platformBehavior = {
  ios: {
    datePicker: 'Spinner style picker',
    datePickerDisplay: 'Always visible when active',
  },
  android: {
    datePicker: 'Calendar dialog',
    datePickerDisplay: 'Modal dialog',
  },
};

/**
 * Example 8: State Management
 */
export const stateManagementExample = {
  // Local state
  formState: {
    quitDate: 'Date object',
    showDatePicker: 'boolean',
    cigarettesPerDay: 'string',
    pricePerPack: 'string',
    prayerNotifications: 'boolean',
    isSubmitting: 'boolean',
  },
  
  // Validation state
  errors: {
    quitDate: 'string | undefined',
    cigarettesPerDay: 'string | undefined',
    pricePerPack: 'string | undefined',
  },
  
  // No global state needed - all data saved to AsyncStorage
};

/**
 * Example 9: Integration with Other Services
 */
export const serviceIntegration = {
  // Storage Service
  storage: {
    saveUser: 'Saves user data to @quit_smoking_user',
    saveSettings: 'Saves settings to @quit_smoking_settings',
  },
  
  // User Model
  userModel: {
    create: 'Creates user object with validation',
    validate: 'Validates user data structure',
  },
  
  // Settings Model
  settingsModel: {
    createDefault: 'Creates default settings',
    update: 'Updates prayer notification preference',
  },
};

/**
 * Example 10: Next Steps After Onboarding
 */
export const nextSteps = {
  navigation: 'User is navigated to MainTabs -> Home',
  homeScreen: {
    displays: [
      'Days smoke-free counter',
      'Money saved calculation',
      'Today\'s tasks',
      'Daily affirmation',
    ],
  },
  dataAvailable: [
    'User profile data',
    'Settings with prayer preferences',
    'Ready to track progress',
  ],
};

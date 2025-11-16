import React, {useEffect} from 'react';
import {StatusBar, Alert, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {colors} from './src/constants/colors';
import RootNavigator from './src/navigation/RootNavigator';
import linking from './src/navigation/linking';
import {navigationRef} from './src/navigation/navigationService';
import {notificationService} from './src/services/notification.service';

// Context Providers
import {UserProvider} from './src/context/UserContext';
import {ProgressProvider} from './src/context/ProgressContext';
import {SettingsProvider} from './src/context/SettingsContext';
import {JournalProvider} from './src/context/JournalContext';

/* eslint-disable no-console */

function App(): JSX.Element {
  useEffect(() => {
    // Initialize notification infrastructure on app start
    initializeNotifications();
  }, []);

  /**
   * Initialize notification service and request permissions
   */
  const initializeNotifications = async () => {
    try {
      // Initialize notification channels and listeners
      await notificationService.initialize();
      console.log('Notification service initialized');

      // Request notification permissions
      const hasPermission = await notificationService.requestPermissions();
      
      if (hasPermission) {
        console.log('Notification permissions granted');
      } else {
        // Handle permission denial gracefully
        handlePermissionDenied();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
      // Continue app execution even if notifications fail
    }
  };

  /**
   * Handle notification permission denial gracefully
   */
  const handlePermissionDenied = () => {
    // Show a friendly message to the user
    setTimeout(() => {
      Alert.alert(
        'নোটিফিকেশন বন্ধ আছে',
        'আপনি নোটিফিকেশন পাবেন না। আপনি যেকোনো সময় সেটিংস থেকে নোটিফিকেশন চালু করতে পারবেন।',
        [
          {
            text: 'ঠিক আছে',
            style: 'default',
          },
        ],
        {cancelable: true},
      );
    }, 2000); // Delay to avoid showing immediately on app start
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <UserProvider>
          <ProgressProvider>
            <SettingsProvider>
              <JournalProvider>
                <NavigationContainer ref={navigationRef} linking={linking}>
                  <RootNavigator />
                </NavigationContainer>
              </JournalProvider>
            </SettingsProvider>
          </ProgressProvider>
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

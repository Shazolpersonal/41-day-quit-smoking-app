import React, {useEffect} from 'react';
import {StatusBar, Alert, Platform, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {colors} from './src/constants/colors';
import RootNavigator from './src/navigation/RootNavigator';
import linking from './src/navigation/linking';
import {navigationRef} from './src/navigation/navigationService';
import {notificationService} from './src/services/notification.service';
import {offlineService} from './src/services/offline.service';
import OfflineIndicator from './src/components/common/OfflineIndicator';

// Context Providers
import {UserProvider} from './src/context/UserContext';
import {ProgressProvider} from './src/context/ProgressContext';
import {SettingsProvider} from './src/context/SettingsContext';
import {JournalProvider} from './src/context/JournalContext';

/* eslint-disable no-console */

function App(): JSX.Element {
  useEffect(() => {
    // Initialize app services on start
    initializeApp();
  }, []);

  /**
   * Initialize app services (notifications and offline functionality)
   */
  const initializeApp = async () => {
    try {
      // Initialize offline functionality first
      await initializeOffline();
      
      // Then initialize notifications
      await initializeNotifications();
    } catch (error) {
      console.error('Error initializing app:', error);
      // Continue app execution even if initialization fails
    }
  };

  /**
   * Initialize offline functionality
   */
  const initializeOffline = async () => {
    try {
      // Verify static content is bundled
      const hasStaticContent = offlineService.verifyStaticContent();
      if (hasStaticContent) {
        console.log('✓ All static content is bundled with app');
      } else {
        console.warn('⚠ Some static content may be missing');
      }

      // Prepare app for offline use
      const isReady = await offlineService.prepareForOffline();
      if (isReady) {
        console.log('✓ App is ready for offline use');
      } else {
        console.log('ℹ App needs user onboarding before offline use');
      }

      // Log offline status
      const status = await offlineService.getOfflineStatus();
      console.log('Offline Status:', status);
    } catch (error) {
      console.error('Error initializing offline:', error);
    }
  };

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
                <View style={{flex: 1}}>
                  <OfflineIndicator />
                  <NavigationContainer ref={navigationRef} linking={linking}>
                    <RootNavigator />
                  </NavigationContainer>
                </View>
              </JournalProvider>
            </SettingsProvider>
          </ProgressProvider>
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

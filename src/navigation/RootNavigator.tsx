import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {colors} from '../constants/colors';
import {useNotificationSync} from '../hooks/useNotificationSync';
import {usePrayerNotifications} from '../hooks/usePrayerNotifications';
import {useMilestoneNotifications} from '../hooks/useMilestoneNotifications';
import {useInactivityTracking} from '../hooks/useInactivityTracking';

// Screens
import {OnboardingScreen} from '../screens/OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import {CravingSOSScreen} from '../screens/CravingSOSScreen';
import {JournalDetailScreen} from '../screens/JournalDetailScreen';
import {JournalEditScreen} from '../screens/JournalEditScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  // Sync all notification settings automatically
  useNotificationSync(); // Daily reminders
  usePrayerNotifications(); // Prayer time notifications
  useMilestoneNotifications(); // Milestone achievements
  useInactivityTracking(); // App inactivity tracking

  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="CravingSOS"
        component={CravingSOSScreen}
        options={{
          title: 'Craving SOS',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="JournalDetail"
        component={JournalDetailScreen}
        options={{
          title: 'Journal Entry',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="JournalEdit"
        component={JournalEditScreen}
        options={({route}: {route: any}) => ({
          title: route.params?.entryId ? 'Edit Entry' : 'New Entry',
          animation: 'slide_from_right',
        })}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

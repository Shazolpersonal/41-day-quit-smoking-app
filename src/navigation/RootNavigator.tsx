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
import DuaListScreen from '../screens/DuaListScreen';
import DuaDetailScreen from '../screens/DuaDetailScreen';
import QuranVersesScreen from '../screens/QuranVersesScreen';
import QuranVerseDetailScreen from '../screens/QuranVerseDetailScreen';
import HadithListScreen from '../screens/HadithListScreen';
import HadithDetailScreen from '../screens/HadithDetailScreen';
import PrayerTimesScreen from '../screens/PrayerTimesScreen';

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
      <Stack.Screen
        name="DuaList"
        component={DuaListScreen}
        options={{
          title: 'দোয়া সমূহ',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="DuaDetail"
        component={DuaDetailScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="QuranVerses"
        component={QuranVersesScreen}
        options={{
          title: 'কুরআনের আয়াত',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="QuranVerseDetail"
        component={QuranVerseDetailScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="HadithList"
        component={HadithListScreen}
        options={{
          title: 'হাদীস সমূহ',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="HadithDetail"
        component={HadithDetailScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="PrayerTimes"
        component={PrayerTimesScreen}
        options={{
          title: 'নামাজের সময়',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

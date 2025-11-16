import {LinkingOptions} from '@react-navigation/native';
import {Linking} from 'react-native';
import {RootStackParamList} from '../types/navigation';
import notifee from '@notifee/react-native';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['quitsmokingapp://', 'https://quitsmokingapp.com'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      MainTabs: {
        screens: {
          Home: 'home',
          Daily: {
            path: 'daily/:day?',
            parse: {
              day: (day: string) => (day ? parseInt(day, 10) : undefined),
            },
          },
          Progress: 'progress',
          Journal: 'journal',
          Settings: 'settings',
        },
      },
      CravingSOS: 'craving-sos',
      JournalDetail: {
        path: 'journal/:entryId',
      },
      JournalEdit: {
        path: 'journal/edit/:entryId?',
      },
    },
  },
  async getInitialURL() {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();
    if (url != null) {
      return url;
    }

    // Check if there is a notification that triggered the app opening
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      const {screen} = initialNotification.notification.data || {};
      if (screen) {
        return `quitsmokingapp://${screen.toString().toLowerCase()}`;
      }
    }

    return null;
  },
  subscribe(listener: (url: string) => void) {
    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener(
      'url',
      ({url}: {url: string}) => {
        listener(url);
      },
    );

    return () => {
      linkingSubscription.remove();
    };
  },
};

export default linking;

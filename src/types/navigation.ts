// Navigation types for React Navigation

import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

// ==================== Root Stack Navigator ====================
export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  CravingSOS: undefined;
  JournalDetail: {entryId: string};
  JournalEdit: {entryId?: string};
  DuaList: undefined;
  DuaDetail: {duaId: string};
  QuranVerses: undefined;
  QuranVerseDetail: {verseId: string};
  HadithList: undefined;
  HadithDetail: {hadithId: string};
  PrayerTimes: undefined;
  EmergencyContactEdit: {contactId?: string};
  PinSetup: undefined;
  PinVerify: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// ==================== Main Tab Navigator ====================
export type MainTabParamList = {
  Home: undefined;
  Daily: {day?: number};
  Progress: undefined;
  Journal: undefined;
  Settings: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// ==================== Screen Props Helpers ====================
export type HomeScreenProps = MainTabScreenProps<'Home'>;
export type DailyScreenProps = MainTabScreenProps<'Daily'>;
export type ProgressScreenProps = MainTabScreenProps<'Progress'>;
export type JournalScreenProps = MainTabScreenProps<'Journal'>;
export type SettingsScreenProps = MainTabScreenProps<'Settings'>;

export type OnboardingScreenProps = RootStackScreenProps<'Onboarding'>;
export type CravingSOSScreenProps = RootStackScreenProps<'CravingSOS'>;
export type JournalDetailScreenProps = RootStackScreenProps<'JournalDetail'>;
export type JournalEditScreenProps = RootStackScreenProps<'JournalEdit'>;
export type DuaListScreenProps = RootStackScreenProps<'DuaList'>;
export type DuaDetailScreenProps = RootStackScreenProps<'DuaDetail'>;
export type EmergencyContactEditScreenProps =
  RootStackScreenProps<'EmergencyContactEdit'>;
export type PinSetupScreenProps = RootStackScreenProps<'PinSetup'>;
export type PinVerifyScreenProps = RootStackScreenProps<'PinVerify'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/**
 * Journal Screen Example
 * 
 * This example demonstrates the Journal Screen functionality
 * with sample data and interactions.
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {JournalScreen} from './JournalScreen';
import {JournalProvider} from '../context/JournalContext';

// Mock navigation for example
const mockNavigation = {
  navigate: (screen: string, params?: any) => {
    console.log(`Navigate to ${screen}`, params);
  },
  goBack: () => {
    console.log('Go back');
  },
  addListener: () => () => {},
  removeListener: () => {},
  canGoBack: () => true,
  dispatch: () => {},
  getId: () => 'journal-screen',
  getParent: () => undefined,
  getState: () => ({} as any),
  isFocused: () => true,
  reset: () => {},
  setOptions: () => {},
  setParams: () => {},
};

const mockRoute = {
  key: 'Journal',
  name: 'Journal' as const,
  params: undefined,
};

/**
 * Example 1: Journal Screen with Entries
 * 
 * Shows the journal screen with multiple entries,
 * demonstrating list and calendar views.
 */
export const JournalScreenWithEntries = () => {
  return (
    <JournalProvider>
      <View style={styles.container}>
        <JournalScreen
          navigation={mockNavigation as any}
          route={mockRoute}
        />
      </View>
    </JournalProvider>
  );
};

/**
 * Example 2: Empty Journal Screen
 * 
 * Shows the journal screen with no entries,
 * demonstrating the empty state.
 */
export const EmptyJournalScreen = () => {
  // In a real app, you would mock the storage service
  // to return an empty array
  return (
    <JournalProvider>
      <View style={styles.container}>
        <JournalScreen
          navigation={mockNavigation as any}
          route={mockRoute}
        />
      </View>
    </JournalProvider>
  );
};

/**
 * Example 3: Journal Screen in Calendar View
 * 
 * Shows the journal screen with calendar view active.
 */
export const JournalScreenCalendarView = () => {
  return (
    <JournalProvider>
      <View style={styles.container}>
        <JournalScreen
          navigation={mockNavigation as any}
          route={mockRoute}
        />
      </View>
    </JournalProvider>
  );
};

/**
 * Usage Examples:
 * 
 * 1. Basic Usage:
 * ```tsx
 * <JournalProvider>
 *   <JournalScreen navigation={navigation} route={route} />
 * </JournalProvider>
 * ```
 * 
 * 2. With Navigation:
 * ```tsx
 * // In your navigator
 * <Stack.Screen 
 *   name="Journal" 
 *   component={JournalScreen}
 *   options={{headerShown: false}}
 * />
 * ```
 * 
 * 3. Accessing Journal Context:
 * ```tsx
 * const {entries, addEntry, updateEntry} = useJournal();
 * ```
 * 
 * Features Demonstrated:
 * - List view of journal entries
 * - Calendar view with mood indicators
 * - Add new entry button
 * - Statistics summary
 * - Empty state handling
 * - View mode toggle
 * - Entry navigation
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default JournalScreenWithEntries;

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {JournalScreenProps} from '../types/navigation';
import {useJournal} from '../context/JournalContext';
import {JournalCalendar} from '../components/journal/JournalCalendar';
import {JournalEntryList} from '../components/journal/JournalEntryList';
import {colors, spacing, borderRadius, typography} from '../constants/theme';
import {Header} from '../components/common/Header';

type ViewMode = 'calendar' | 'list';

export const JournalScreen: React.FC<JournalScreenProps> = ({navigation}) => {
  const {entries, loading} = useJournal();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddEntry = () => {
    navigation.navigate('JournalEdit', {});
  };

  const handleEntryPress = (entryId: string) => {
    navigation.navigate('JournalDetail', {entryId});
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const entry = entries.find(e => {
      const entryDate = new Date(e.date);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });

    if (entry) {
      handleEntryPress(entry.id);
    }
  };

  const getEntriesForSelectedDate = () => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === selectedDate.getDate() &&
        entryDate.getMonth() === selectedDate.getMonth() &&
        entryDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="জার্নাল" showBackButton={false} />

      {/* View Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'list' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('list')}>
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === 'list' && styles.toggleButtonTextActive,
            ]}>
            📝 তালিকা
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'calendar' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('calendar')}>
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === 'calendar' && styles.toggleButtonTextActive,
            ]}>
            📅 ক্যালেন্ডার
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {viewMode === 'calendar' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.calendarContainer}>
              <JournalCalendar
                entries={entries}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </View>

            {/* Entries for selected date */}
            <View style={styles.selectedDateEntries}>
              <Text style={styles.selectedDateTitle}>
                {selectedDate.toLocaleDateString('bn-BD', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <JournalEntryList
                entries={getEntriesForSelectedDate()}
                onEntryPress={entry => handleEntryPress(entry.id)}
                emptyMessage="এই তারিখে কোন এন্ট্রি নেই"
              />
            </View>
          </ScrollView>
        ) : (
          <JournalEntryList
            entries={entries}
            onEntryPress={entry => handleEntryPress(entry.id)}
            emptyMessage="এখনও কোন জার্নাল এন্ট্রি নেই। আপনার প্রথম এন্ট্রি যোগ করুন!"
          />
        )}
      </View>

      {/* Add Entry Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
        <Text style={styles.addButtonText}>+ নতুন এন্ট্রি</Text>
      </TouchableOpacity>

      {/* Stats Summary */}
      {entries.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.length}</Text>
            <Text style={styles.statLabel}>মোট এন্ট্রি</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {entries.filter(e => e.cravingIntensity).length}
            </Text>
            <Text style={styles.statLabel}>ক্রেভিং রেকর্ড</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {new Set(entries.reduce((acc: string[], e) => [...acc, ...e.triggers], [])).size}
            </Text>
            <Text style={styles.statLabel}>ট্রিগার ধরন</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  toggleButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  toggleButtonTextActive: {
    color: colors.neutral.white,
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    padding: spacing.md,
  },
  selectedDateEntries: {
    flex: 1,
  },
  selectedDateTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.xl + 60,
    right: spacing.md,
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.round,
    ...{
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  addButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.light,
  },
});

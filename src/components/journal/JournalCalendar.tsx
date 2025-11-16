import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {JournalEntry} from '../../types';
import {colors, spacing, borderRadius, typography} from '../../constants/theme';

interface JournalCalendarProps {
  entries: JournalEntry[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const WEEKDAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];
const MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const getMoodEmoji = (mood: string): string => {
  const moodMap: {[key: string]: string} = {
    very_happy: '😄',
    happy: '😊',
    neutral: '😐',
    sad: '😔',
    very_sad: '😢',
    anxious: '😰',
    stressed: '😫',
    confident: '😎',
  };
  return moodMap[mood] || '😐';
};

export const JournalCalendar: React.FC<JournalCalendarProps> = ({
  entries,
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Add empty days for alignment
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(new Date(0));
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEntryForDate = (date: Date): JournalEntry | undefined => {
    if (date.getTime() === 0) return undefined;

    return entries.find(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date): boolean => {
    if (date.getTime() === 0) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date): boolean => {
    if (date.getTime() === 0) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map(day => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {days.map((date, index) => {
          const entry = getEntryForDate(date);
          const isEmpty = date.getTime() === 0;
          const today = isToday(date);
          const selected = isSelected(date);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isEmpty && styles.dayCellEmpty,
                today && styles.dayCellToday,
                selected && styles.dayCellSelected,
              ]}
              onPress={() => !isEmpty && onDateSelect(date)}
              disabled={isEmpty}>
              {!isEmpty && (
                <>
                  <Text
                    style={[
                      styles.dayText,
                      today && styles.dayTextToday,
                      selected && styles.dayTextSelected,
                    ]}>
                    {date.getDate()}
                  </Text>
                  {entry && (
                    <Text style={styles.moodIndicator}>
                      {getMoodEmoji(entry.mood)}
                    </Text>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
  },
  navButtonText: {
    fontSize: typography.fontSize.xxl,
    color: colors.primary.main,
  },
  monthTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  dayCellEmpty: {
    opacity: 0,
  },
  dayCellToday: {
    backgroundColor: colors.primary.light + '30',
  },
  dayCellSelected: {
    backgroundColor: colors.primary.main,
  },
  dayText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  dayTextToday: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.bold,
  },
  dayTextSelected: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.bold,
  },
  moodIndicator: {
    fontSize: 16,
    marginTop: 2,
  },
});

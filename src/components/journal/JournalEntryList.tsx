import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {JournalEntry} from '../../types';
import {colors, spacing, borderRadius, typography} from '../../constants/theme';

interface JournalEntryListProps {
  entries: JournalEntry[];
  onEntryPress: (entry: JournalEntry) => void;
  emptyMessage?: string;
}

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return 'আজ';
  }

  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'গতকাল';
  }

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const JournalEntryList: React.FC<JournalEntryListProps> = ({
  entries,
  onEntryPress,
  emptyMessage = 'কোন জার্নাল এন্ট্রি নেই',
}) => {
  const renderEntry = ({item}: {item: JournalEntry}) => (
    <TouchableOpacity
      style={styles.entryCard}
      onPress={() => onEntryPress(item)}>
      <View style={styles.entryHeader}>
        <View style={styles.entryHeaderLeft}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
          <View>
            <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
            <Text style={styles.entryTime}>{formatTime(item.date)}</Text>
          </View>
        </View>
        {item.cravingIntensity && (
          <View style={styles.intensityBadge}>
            <Text style={styles.intensityText}>
              তীব্রতা: {item.cravingIntensity}/10
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.entryContent} numberOfLines={3}>
        {item.content}
      </Text>

      {item.triggers.length > 0 && (
        <View style={styles.triggersContainer}>
          {item.triggers.slice(0, 3).map((trigger, index) => (
            <View key={index} style={styles.triggerBadge}>
              <Text style={styles.triggerText}>{getTriggerLabel(trigger)}</Text>
            </View>
          ))}
          {item.triggers.length > 3 && (
            <Text style={styles.moreTriggers}>
              +{item.triggers.length - 3} আরও
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  if (entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📔</Text>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={entries}
      renderItem={renderEntry}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const getTriggerLabel = (trigger: string): string => {
  const triggerMap: {[key: string]: string} = {
    stress: 'মানসিক চাপ',
    social: 'সামাজিক',
    boredom: 'একঘেয়েমি',
    after_meal: 'খাবারের পরে',
    coffee: 'কফি',
    alcohol: 'অ্যালকোহল',
    work: 'কাজ',
    home: 'বাড়ি',
    other: 'অন্যান্য',
  };
  return triggerMap[trigger] || trigger;
};

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.md,
  },
  entryCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  entryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  moodEmoji: {
    fontSize: 32,
  },
  entryDate: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  entryTime: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  intensityBadge: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  intensityText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    fontWeight: typography.fontWeight.semibold,
  },
  entryContent: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
    marginBottom: spacing.sm,
  },
  triggersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
  triggerBadge: {
    backgroundColor: colors.primary.light + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  triggerText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary.dark,
  },
  moreTriggers: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

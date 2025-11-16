import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {JournalDetailScreenProps} from '../types/navigation';
import {useJournal} from '../context/JournalContext';
import {TriggerAnalysis} from '../components/journal/TriggerAnalysis';
import {colors, spacing, borderRadius, typography} from '../constants/theme';
import {Header} from '../components/common/Header';

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

const getMoodLabel = (mood: string): string => {
  const moodMap: {[key: string]: string} = {
    very_happy: 'খুব খুশি',
    happy: 'খুশি',
    neutral: 'স্বাভাবিক',
    sad: 'দুঃখিত',
    very_sad: 'খুব দুঃখিত',
    anxious: 'উদ্বিগ্ন',
    stressed: 'চাপে',
    confident: 'আত্মবিশ্বাসী',
  };
  return moodMap[mood] || mood;
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const JournalDetailScreen: React.FC<JournalDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const {entryId} = route.params;
  const {getEntry, deleteEntry, entries} = useJournal();

  const entry = getEntry(entryId);

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="জার্নাল এন্ট্রি" onBackPress={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>এন্ট্রি পাওয়া যায়নি</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    navigation.navigate('JournalEdit', {entryId});
  };

  const handleDelete = () => {
    Alert.alert(
      'এন্ট্রি মুছে ফেলুন',
      'আপনি কি নিশ্চিত যে আপনি এই এন্ট্রি মুছে ফেলতে চান?',
      [
        {text: 'বাতিল', style: 'cancel'},
        {
          text: 'মুছে ফেলুন',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteEntry(entryId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('ত্রুটি', 'এন্ট্রি মুছে ফেলতে ব্যর্থ');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="জার্নাল এন্ট্রি"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date and Time */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
          <Text style={styles.timeText}>{formatTime(entry.date)}</Text>
        </View>

        {/* Mood */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>মেজাজ</Text>
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
            <Text style={styles.moodLabel}>{getMoodLabel(entry.mood)}</Text>
          </View>
        </View>

        {/* Craving Intensity */}
        {entry.cravingIntensity && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ধূমপানের ইচ্ছার তীব্রতা</Text>
            <View style={styles.intensityContainer}>
              <View style={styles.intensityBar}>
                <View
                  style={[
                    styles.intensityFill,
                    {width: `${(entry.cravingIntensity / 10) * 100}%`},
                  ]}
                />
              </View>
              <Text style={styles.intensityText}>
                {entry.cravingIntensity}/10
              </Text>
            </View>
          </View>
        )}

        {/* Triggers */}
        {entry.triggers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ট্রিগার</Text>
            <View style={styles.triggersContainer}>
              {entry.triggers.map((trigger, index) => (
                <View key={index} style={styles.triggerBadge}>
                  <Text style={styles.triggerText}>
                    {getTriggerLabel(trigger)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>নোট</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{entry.content}</Text>
          </View>
        </View>

        {/* Trigger Analysis */}
        <View style={styles.section}>
          <TriggerAnalysis entries={entries} />
        </View>

        {/* Metadata */}
        <View style={styles.metadataContainer}>
          <Text style={styles.metadataText}>
            তৈরি: {formatDate(entry.createdAt)} {formatTime(entry.createdAt)}
          </Text>
          {entry.updatedAt !== entry.createdAt && (
            <Text style={styles.metadataText}>
              আপডেট: {formatDate(entry.updatedAt)} {formatTime(entry.updatedAt)}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    padding: spacing.xs,
  },
  headerButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  dateContainer: {
    backgroundColor: colors.primary.main,
    padding: spacing.lg,
    alignItems: 'center',
  },
  dateText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  timeText: {
    fontSize: typography.fontSize.md,
    color: colors.neutral.white,
    marginTop: spacing.xs,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  moodEmoji: {
    fontSize: 48,
  },
  moodLabel: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  intensityContainer: {
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  intensityBar: {
    height: 24,
    backgroundColor: colors.neutral.gray[200],
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  intensityFill: {
    height: '100%',
    backgroundColor: colors.error,
  },
  intensityText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    textAlign: 'center',
  },
  triggersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  triggerBadge: {
    backgroundColor: colors.primary.light + '30',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  triggerText: {
    fontSize: typography.fontSize.md,
    color: colors.primary.dark,
    fontWeight: typography.fontWeight.medium,
  },
  contentContainer: {
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  contentText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },
  metadataContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  metadataText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.disabled,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
  },
});

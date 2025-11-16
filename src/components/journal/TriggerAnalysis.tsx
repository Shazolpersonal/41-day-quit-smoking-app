import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {JournalEntry, TriggerType} from '../../types';
import {colors, spacing, borderRadius, typography} from '../../constants/theme';

interface TriggerAnalysisProps {
  entries: JournalEntry[];
}

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

export const TriggerAnalysis: React.FC<TriggerAnalysisProps> = ({entries}) => {
  const analyzeTriggers = () => {
    const triggerCounts: {[key: string]: number} = {};
    let totalTriggers = 0;

    entries.forEach(entry => {
      entry.triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        totalTriggers++;
      });
    });

    const sortedTriggers = Object.entries(triggerCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([trigger, count]) => ({
        trigger: trigger as TriggerType,
        count,
        percentage: totalTriggers > 0 ? (count / totalTriggers) * 100 : 0,
      }));

    return sortedTriggers;
  };

  const triggerData = analyzeTriggers();

  if (triggerData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ট্রিগার বিশ্লেষণ 📊</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            এখনও কোন ট্রিগার ডেটা নেই
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ট্রিগার বিশ্লেষণ 📊</Text>
      <Text style={styles.subtitle}>
        আপনার সবচেয়ে সাধারণ ট্রিগারগুলি
      </Text>

      <View style={styles.triggerList}>
        {triggerData.map((item, index) => (
          <View key={item.trigger} style={styles.triggerItem}>
            <View style={styles.triggerHeader}>
              <View style={styles.triggerRank}>
                <Text style={styles.triggerRankText}>{index + 1}</Text>
              </View>
              <Text style={styles.triggerName}>
                {getTriggerLabel(item.trigger)}
              </Text>
              <Text style={styles.triggerCount}>{item.count}x</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {width: `${item.percentage}%`},
                ]}
              />
            </View>
            <Text style={styles.triggerPercentage}>
              {item.percentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>💡 পরামর্শ</Text>
        <Text style={styles.insightText}>
          আপনার সবচেয়ে সাধারণ ট্রিগার হল "{getTriggerLabel(triggerData[0].trigger)}"।
          এই পরিস্থিতিগুলি এড়িয়ে চলার বা মোকাবেলা করার কৌশল তৈরি করুন।
        </Text>
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
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  triggerList: {
    gap: spacing.md,
  },
  triggerItem: {
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  triggerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  triggerRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  triggerRankText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  triggerName: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  triggerCount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.neutral.gray[200],
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary.main,
  },
  triggerPercentage: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  insightBox: {
    marginTop: spacing.md,
    backgroundColor: colors.accent.teal + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.teal,
  },
  insightTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  insightText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

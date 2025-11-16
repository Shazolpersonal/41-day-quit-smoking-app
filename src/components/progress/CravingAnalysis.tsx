/**
 * Craving Analysis Component
 * Displays craving frequency, common triggers, and insights
 */

import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Card} from '../common/Card';
import {theme} from '../../constants/theme';
import {JournalEntry, TriggerType} from '../../types';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface CravingAnalysisProps {
  journalEntries: JournalEntry[];
}

interface TriggerCount {
  trigger: TriggerType;
  count: number;
  percentage: number;
}

interface CravingStats {
  totalCravings: number;
  averageIntensity: number;
  mostCommonTriggers: TriggerCount[];
  cravingsByDay: {[key: string]: number};
  highIntensityCravings: number;
}

const triggerLabels: Record<TriggerType, string> = {
  stress: 'মানসিক চাপ',
  social: 'সামাজিক পরিবেশ',
  boredom: 'একঘেয়েমি',
  after_meal: 'খাবারের পর',
  coffee: 'কফি/চা',
  alcohol: 'অ্যালকোহল',
  work: 'কর্মক্ষেত্র',
  home: 'বাড়িতে',
  other: 'অন্যান্য',
};

const triggerIcons: Record<TriggerType, string> = {
  stress: '😰',
  social: '👥',
  boredom: '😴',
  after_meal: '🍽️',
  coffee: '☕',
  alcohol: '🍺',
  work: '💼',
  home: '🏠',
  other: '❓',
};

export const CravingAnalysis: React.FC<CravingAnalysisProps> = ({journalEntries}) => {
  const stats = calculateCravingStats(journalEntries);

  if (stats.totalCravings === 0) {
    return (
      <Card style={styles.card}>
        <Text style={styles.title}>📊 ক্রেভিং বিশ্লেষণ</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>
            এখনও কোনো ক্রেভিং রেকর্ড করা হয়নি। জার্নালে আপনার অনুভূতি এবং ট্রিগার লিখুন।
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>📊 ক্রেভিং বিশ্লেষণ</Text>

      {/* Summary Stats */}
      <View style={styles.statsGrid}>
        <StatBox
          icon="📈"
          label="মোট ক্রেভিং"
          value={stats.totalCravings.toString()}
          color={theme.colors.info}
        />
        <StatBox
          icon="⚡"
          label="গড় তীব্রতা"
          value={stats.averageIntensity.toFixed(1)}
          color={theme.colors.warning}
        />
        <StatBox
          icon="🔥"
          label="উচ্চ তীব্রতা"
          value={stats.highIntensityCravings.toString()}
          color={theme.colors.error}
        />
      </View>

      {/* Craving Frequency Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 সাপ্তাহিক ক্রেভিং ফ্রিকোয়েন্সি</Text>
        <CravingFrequencyChart cravingsByDay={stats.cravingsByDay} />
      </View>

      {/* Most Common Triggers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 সবচেয়ে সাধারণ ট্রিগার</Text>
        {stats.mostCommonTriggers.length > 0 ? (
          <View style={styles.triggersContainer}>
            {stats.mostCommonTriggers.slice(0, 5).map((item, index) => (
              <TriggerItem
                key={item.trigger}
                trigger={item.trigger}
                count={item.count}
                percentage={item.percentage}
                rank={index + 1}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>কোনো ট্রিগার রেকর্ড করা হয়নি</Text>
        )}
      </View>

      {/* Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>💡 অন্তর্দৃষ্টি ও পরামর্শ</Text>
        {generateInsights(stats).map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <Text style={styles.insightBullet}>•</Text>
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

interface StatBoxProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

const StatBox: React.FC<StatBoxProps> = ({icon, label, value, color}) => {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, {color}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

interface CravingFrequencyChartProps {
  cravingsByDay: {[key: string]: number};
}

const CravingFrequencyChart: React.FC<CravingFrequencyChartProps> = ({cravingsByDay}) => {
  const days = Object.keys(cravingsByDay).slice(-7); // Last 7 days
  const maxCount = Math.max(...Object.values(cravingsByDay), 1);

  return (
    <View style={styles.chartContainer}>
      {days.map(day => {
        const count = cravingsByDay[day] || 0;
        const height = (count / maxCount) * 100;
        const date = new Date(day);
        const dayName = date.toLocaleDateString('bn-BD', {weekday: 'short'});

        return (
          <View key={day} style={styles.chartBar}>
            <View style={styles.chartBarWrapper}>
              <View style={[styles.chartBarFill, {height: `${height}%`}]}>
                {count > 0 && <Text style={styles.chartBarValue}>{count}</Text>}
              </View>
            </View>
            <Text style={styles.chartBarLabel}>{dayName}</Text>
          </View>
        );
      })}
    </View>
  );
};

interface TriggerItemProps {
  trigger: TriggerType;
  count: number;
  percentage: number;
  rank: number;
}

const TriggerItem: React.FC<TriggerItemProps> = ({trigger, count, percentage, rank}) => {
  const getRankColor = (rank: number): string => {
    if (rank === 1) return theme.colors.progress.gold;
    if (rank === 2) return theme.colors.progress.silver;
    if (rank === 3) return theme.colors.progress.bronze;
    return theme.colors.neutral.gray[400];
  };

  return (
    <View style={styles.triggerItem}>
      <View style={styles.triggerLeft}>
        <View style={[styles.triggerRank, {backgroundColor: getRankColor(rank)}]}>
          <Text style={styles.triggerRankText}>{rank}</Text>
        </View>
        <Text style={styles.triggerIcon}>{triggerIcons[trigger]}</Text>
        <Text style={styles.triggerLabel}>{triggerLabels[trigger]}</Text>
      </View>
      <View style={styles.triggerRight}>
        <Text style={styles.triggerCount}>{count}x</Text>
        <Text style={styles.triggerPercentage}>({percentage.toFixed(0)}%)</Text>
      </View>
    </View>
  );
};

// Helper Functions

function calculateCravingStats(entries: JournalEntry[]): CravingStats {
  const cravingEntries = entries.filter(e => e.cravingIntensity && e.cravingIntensity > 0);

  const totalCravings = cravingEntries.length;
  const averageIntensity =
    totalCravings > 0
      ? cravingEntries.reduce((sum, e) => sum + (e.cravingIntensity || 0), 0) / totalCravings
      : 0;

  const highIntensityCravings = cravingEntries.filter(e => (e.cravingIntensity || 0) >= 7).length;

  // Count triggers
  const triggerCounts: {[key in TriggerType]?: number} = {};
  let totalTriggers = 0;

  cravingEntries.forEach(entry => {
    entry.triggers.forEach(trigger => {
      triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      totalTriggers++;
    });
  });

  const mostCommonTriggers: TriggerCount[] = Object.entries(triggerCounts)
    .map(([trigger, count]) => ({
      trigger: trigger as TriggerType,
      count,
      percentage: (count / totalTriggers) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Group by day
  const cravingsByDay: {[key: string]: number} = {};
  cravingEntries.forEach(entry => {
    const day = entry.date.split('T')[0];
    cravingsByDay[day] = (cravingsByDay[day] || 0) + 1;
  });

  return {
    totalCravings,
    averageIntensity,
    mostCommonTriggers,
    cravingsByDay,
    highIntensityCravings,
  };
}

function generateInsights(stats: CravingStats): string[] {
  const insights: string[] = [];

  if (stats.totalCravings > 0) {
    insights.push(
      `আপনি মোট ${stats.totalCravings}টি ক্রেভিং রেকর্ড করেছেন। এটি আপনার অগ্রগতি ট্র্যাক করতে সাহায্য করছে।`
    );
  }

  if (stats.averageIntensity < 5) {
    insights.push(
      'আলহামদুলিল্লাহ! আপনার ক্রেভিংয়ের গড় তীব্রতা কম। এটি একটি ভালো লক্ষণ যে আপনি নিয়ন্ত্রণে আছেন।'
    );
  } else if (stats.averageIntensity >= 7) {
    insights.push(
      'আপনার ক্রেভিংয়ের তীব্রতা বেশি। শ্বাস-প্রশ্বাসের ব্যায়াম এবং দোয়া পড়ুন। প্রয়োজনে জরুরি যোগাযোগে কল করুন।'
    );
  }

  if (stats.mostCommonTriggers.length > 0) {
    const topTrigger = stats.mostCommonTriggers[0];
    insights.push(
      `আপনার সবচেয়ে সাধারণ ট্রিগার হল "${triggerLabels[topTrigger.trigger]}"। এই পরিস্থিতি এড়ানোর চেষ্টা করুন বা বিকল্প কৌশল প্রস্তুত রাখুন।`
    );
  }

  if (stats.highIntensityCravings > 0) {
    insights.push(
      `${stats.highIntensityCravings}টি উচ্চ তীব্রতার ক্রেভিং ছিল। এই মুহূর্তগুলোতে SOS বৈশিষ্ট্য ব্যবহার করুন এবং আল্লাহর কাছে সাহায্য চান।`
    );
  }

  if (insights.length === 0) {
    insights.push('আরও ভালো বিশ্লেষণের জন্য নিয়মিত জার্নাল লিখুন এবং ক্রেভিং রেকর্ড করুন।');
  }

  return insights;
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  chartBarWrapper: {
    width: '80%',
    height: 80,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: theme.colors.primary.main,
    borderTopLeftRadius: theme.borderRadius.sm,
    borderTopRightRadius: theme.borderRadius.sm,
    minHeight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartBarValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.neutral.white,
  },
  chartBarLabel: {
    fontSize: 10,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  triggersContainer: {
    gap: theme.spacing.sm,
  },
  triggerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  triggerRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.neutral.white,
  },
  triggerIcon: {
    fontSize: 20,
  },
  triggerLabel: {
    fontSize: 14,
    color: theme.colors.text.primary,
    flex: 1,
  },
  triggerRight: {
    alignItems: 'flex-end',
  },
  triggerCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  triggerPercentage: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  noDataText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
  insightsContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.info + '10',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  insightBullet: {
    fontSize: 14,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
});

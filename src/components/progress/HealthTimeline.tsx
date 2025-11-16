/**
 * Health Timeline Component
 * Displays health improvements timeline with achieved and upcoming benefits
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card} from '../common/Card';
import {theme} from '../../constants/theme';
import {HealthMilestone, categoryDescriptions} from '../../data/healthTimeline';

interface HealthTimelineProps {
  achievedMilestones: HealthMilestone[];
  upcomingMilestones: HealthMilestone[];
  minutesSinceQuit: number;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  achievedMilestones,
  upcomingMilestones,
  minutesSinceQuit,
}) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>🏥 স্বাস্থ্য উন্নতির সময়রেখা</Text>
      
      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{achievedMilestones.length}</Text>
          <Text style={styles.summaryLabel}>অর্জিত সুবিধা</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{upcomingMilestones.length}</Text>
          <Text style={styles.summaryLabel}>আসন্ন সুবিধা</Text>
        </View>
      </View>

      {/* Achieved Milestones */}
      {achievedMilestones.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ অর্জিত স্বাস্থ্য সুবিধা</Text>
          <View style={styles.timelineContainer}>
            {achievedMilestones.map((milestone, index) => (
              <TimelineItem
                key={`achieved-${index}`}
                milestone={milestone}
                achieved={true}
                isLast={index === achievedMilestones.length - 1}
              />
            ))}
          </View>
        </View>
      )}

      {/* Upcoming Milestones */}
      {upcomingMilestones.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏳ আসন্ন স্বাস্থ্য সুবিধা</Text>
          <View style={styles.timelineContainer}>
            {upcomingMilestones.slice(0, 5).map((milestone, index) => (
              <TimelineItem
                key={`upcoming-${index}`}
                milestone={milestone}
                achieved={false}
                isLast={index === Math.min(4, upcomingMilestones.length - 1)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Encouragement Message */}
      <View style={styles.encouragementContainer}>
        <Text style={styles.encouragementText}>
          আলহামদুলিল্লাহ! আপনার শরীর প্রতিদিন সুস্থ হচ্ছে। আল্লাহর রহমতে আরও অনেক স্বাস্থ্য সুবিধা আপনার জন্য অপেক্ষা করছে।
        </Text>
      </View>
    </Card>
  );
};

interface TimelineItemProps {
  milestone: HealthMilestone;
  achieved: boolean;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({milestone, achieved, isLast}) => {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, achieved && styles.timelineDotAchieved]}>
          <Text style={styles.timelineIcon}>{milestone.icon}</Text>
        </View>
        {!isLast && (
          <View style={[styles.timelineLine, achieved && styles.timelineLineAchieved]} />
        )}
      </View>
      
      <View style={[styles.timelineContent, achieved && styles.timelineContentAchieved]}>
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineTimeframe}>{milestone.timeframe}</Text>
          {achieved && <Text style={styles.achievedBadge}>✓ অর্জিত</Text>}
        </View>
        <Text style={styles.timelineTitle}>{milestone.title}</Text>
        <Text style={styles.timelineDescription}>{milestone.description}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {categoryDescriptions[milestone.category].emoji}{' '}
            {categoryDescriptions[milestone.category].title}
          </Text>
        </View>
      </View>
    </View>
  );
};

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
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.border.main,
    marginHorizontal: theme.spacing.md,
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
  timelineContainer: {
    paddingLeft: theme.spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.paper,
    borderWidth: 2,
    borderColor: theme.colors.border.main,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineDotAchieved: {
    backgroundColor: theme.colors.primary.main + '20',
    borderColor: theme.colors.primary.main,
  },
  timelineIcon: {
    fontSize: 20,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border.main,
    marginTop: theme.spacing.xs,
  },
  timelineLineAchieved: {
    backgroundColor: theme.colors.primary.main,
  },
  timelineContent: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  timelineContentAchieved: {
    backgroundColor: theme.colors.primary.main + '10',
    borderColor: theme.colors.primary.main + '30',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  timelineTimeframe: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  achievedBadge: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '600',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  timelineDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  encouragementContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.success + '10',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  encouragementText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

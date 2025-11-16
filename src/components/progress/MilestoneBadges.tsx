/**
 * Milestone Badges Component
 * Displays all milestone badges with achievement status and animations
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Animated, TouchableOpacity} from 'react-native';
import {Card} from '../common/Card';
import {theme} from '../../constants/theme';
import {Milestone} from '../../types';

interface MilestoneBadgesProps {
  milestones: Milestone[];
  currentDay: number;
}

export const MilestoneBadges: React.FC<MilestoneBadgesProps> = ({
  milestones,
  currentDay,
}) => {
  const achievedMilestones = milestones.filter(m => m.achieved);
  const upcomingMilestones = milestones.filter(m => !m.achieved);

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>🏆 মাইলস্টোন ব্যাজ</Text>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{achievedMilestones.length}</Text>
          <Text style={styles.summaryLabel}>অর্জিত</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{upcomingMilestones.length}</Text>
          <Text style={styles.summaryLabel}>আসন্ন</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{milestones.length}</Text>
          <Text style={styles.summaryLabel}>মোট</Text>
        </View>
      </View>

      {/* Achieved Badges */}
      {achievedMilestones.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ অর্জিত ব্যাজ</Text>
          <View style={styles.badgesGrid}>
            {achievedMilestones.map((milestone, index) => (
              <BadgeItem
                key={milestone.id}
                milestone={milestone}
                achieved={true}
                index={index}
              />
            ))}
          </View>
        </View>
      )}

      {/* Upcoming Badges */}
      {upcomingMilestones.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏳ আসন্ন ব্যাজ</Text>
          <View style={styles.badgesGrid}>
            {upcomingMilestones.map((milestone, index) => (
              <BadgeItem
                key={milestone.id}
                milestone={milestone}
                achieved={false}
                index={index}
              />
            ))}
          </View>
        </View>
      )}

      {/* Encouragement Message */}
      <View style={styles.encouragementContainer}>
        <Text style={styles.encouragementText}>
          মাশাআল্লাহ! আপনি দিন {currentDay} এ আছেন। প্রতিটি মাইলস্টোন আপনার সাফল্যের প্রমাণ। আল্লাহর রহমতে চালিয়ে যান!
        </Text>
      </View>
    </Card>
  );
};

interface BadgeItemProps {
  milestone: Milestone;
  achieved: boolean;
  index: number;
}

const BadgeItem: React.FC<BadgeItemProps> = ({milestone, achieved, index}) => {
  const [expanded, setExpanded] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Stagger animation for badges
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const getBadgeColor = (badge: string): string => {
    switch (badge) {
      case 'bronze':
        return theme.colors.progress.bronze;
      case 'silver':
        return theme.colors.progress.silver;
      case 'gold':
        return theme.colors.progress.gold;
      case 'diamond':
        return theme.colors.progress.diamond;
      default:
        return theme.colors.neutral.gray[400];
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Animated.View
      style={[
        styles.badgeItemContainer,
        {transform: [{scale: scaleAnim}]},
      ]}>
      <TouchableOpacity
        style={[
          styles.badgeItem,
          achieved && styles.badgeItemAchieved,
          !achieved && styles.badgeItemLocked,
        ]}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}>
        <View
          style={[
            styles.badgeCircle,
            {backgroundColor: achieved ? getBadgeColor(milestone.badge) : theme.colors.neutral.gray[300]},
          ]}>
          <Text style={styles.badgeDay}>দিন</Text>
          <Text style={styles.badgeDayNumber}>{milestone.day}</Text>
        </View>

        <View style={styles.badgeContent}>
          <Text style={[styles.badgeTitle, !achieved && styles.badgeTitleLocked]}>
            {milestone.title}
          </Text>
          {achieved && milestone.achievedDate && (
            <Text style={styles.badgeDate}>
              {formatDate(milestone.achievedDate)}
            </Text>
          )}
          {!achieved && (
            <Text style={styles.badgeDaysLeft}>
              আর {milestone.day - (milestone.day - 1)} দিন
            </Text>
          )}
        </View>

        {achieved && (
          <View style={styles.achievedBadge}>
            <Text style={styles.achievedIcon}>✓</Text>
          </View>
        )}
        {!achieved && (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedIcon}>🔒</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Expanded Details */}
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedDescription}>{milestone.description}</Text>
          {achieved && milestone.achievedDate && (
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementLabel}>অর্জনের তারিখ:</Text>
              <Text style={styles.achievementValue}>
                {formatDate(milestone.achievedDate)}
              </Text>
            </View>
          )}
        </View>
      )}
    </Animated.View>
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
  badgesGrid: {
    gap: theme.spacing.md,
  },
  badgeItemContainer: {
    marginBottom: theme.spacing.sm,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
  },
  badgeItemAchieved: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.main + '10',
  },
  badgeItemLocked: {
    opacity: 0.6,
  },
  badgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  badgeDay: {
    fontSize: 10,
    color: theme.colors.neutral.white,
    fontWeight: '600',
  },
  badgeDayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.neutral.white,
  },
  badgeContent: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  badgeTitleLocked: {
    color: theme.colors.text.secondary,
  },
  badgeDate: {
    fontSize: 12,
    color: theme.colors.success,
  },
  badgeDaysLeft: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  achievedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievedIcon: {
    fontSize: 18,
    color: theme.colors.neutral.white,
  },
  lockedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.neutral.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedIcon: {
    fontSize: 16,
  },
  expandedContent: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.md,
  },
  expandedDescription: {
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  achievementInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  achievementLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  achievementValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  encouragementContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondary.main + '10',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary.main,
  },
  encouragementText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

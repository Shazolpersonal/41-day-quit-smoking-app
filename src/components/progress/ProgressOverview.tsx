/**
 * Progress Overview Component
 * Displays detailed smoke-free time breakdown, money saved, and cigarettes not smoked
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from '../common/Card';
import {theme} from '../../constants/theme';
import {SmokeFreeTime} from '../../types';

interface ProgressOverviewProps {
  smokeFreeTime: SmokeFreeTime;
  moneySaved: number;
  cigarettesNotSmoked: number;
}

const formatBengaliNumber = (num: number): string => {
  return num.toLocaleString('bn-BD');
};

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  smokeFreeTime,
  moneySaved,
  cigarettesNotSmoked,
}) => {
  return (
    <View style={styles.container}>
      {/* Smoke-Free Time Breakdown */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>🕐 ধূমপানমুক্ত সময়</Text>
        <View style={styles.timeGrid}>
          <View style={styles.timeItem}>
            <Text style={styles.timeValue}>{smokeFreeTime.days}</Text>
            <Text style={styles.timeLabel}>দিন</Text>
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeValue}>{smokeFreeTime.hours}</Text>
            <Text style={styles.timeLabel}>ঘণ্টা</Text>
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeValue}>{smokeFreeTime.minutes}</Text>
            <Text style={styles.timeLabel}>মিনিট</Text>
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeValue}>{smokeFreeTime.seconds}</Text>
            <Text style={styles.timeLabel}>সেকেন্ড</Text>
          </View>
        </View>
      </Card>

      {/* Money Saved */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>💰 সঞ্চিত অর্থ</Text>
        <View style={styles.moneyContainer}>
          <Text style={styles.moneyAmount}>৳{formatBengaliNumber(moneySaved)}</Text>
          <Text style={styles.moneySubtext}>
            আলহামদুলিল্লাহ! আপনি এই টাকা সঞ্চয় করেছেন
          </Text>
        </View>
      </Card>

      {/* Cigarettes Not Smoked */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>🚭 সিগারেট এড়ানো হয়েছে</Text>
        <View style={styles.cigarettesContainer}>
          <Text style={styles.cigarettesAmount}>
            {formatBengaliNumber(cigarettesNotSmoked)}
          </Text>
          <Text style={styles.cigarettesSubtext}>
            মাশাআল্লাহ! এতগুলো সিগারেট থেকে বিরত থাকতে পেরেছেন
          </Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  card: {
    padding: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  timeItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  timeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  timeLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  moneyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  moneyAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
  },
  moneySubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  cigarettesContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  cigarettesAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  },
  cigarettesSubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

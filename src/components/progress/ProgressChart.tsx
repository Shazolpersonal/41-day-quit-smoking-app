/**
 * Progress Chart Component
 * Visual representation of progress over time
 */

import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Card} from '../common/Card';
import {theme} from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - theme.spacing.lg * 4;

interface ProgressChartProps {
  currentDay: number;
  totalDays?: number;
  moneySaved: number;
  cigarettesNotSmoked: number;
}

const formatBengaliNumber = (num: number): string => {
  return num.toLocaleString('bn-BD');
};

export const ProgressChart: React.FC<ProgressChartProps> = ({
  currentDay,
  totalDays = 41,
  moneySaved,
  cigarettesNotSmoked,
}) => {
  const progress = Math.min((currentDay / totalDays) * 100, 100);

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>📈 অগ্রগতির চার্ট</Text>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>৪১ দিনের যাত্রা</Text>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, {width: `${progress}%`}]} />
        </View>
        <View style={styles.progressFooter}>
          <Text style={styles.progressDay}>দিন {currentDay}</Text>
          <Text style={styles.progressTotal}>/ {totalDays}</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatItem
          icon="💰"
          label="সঞ্চিত অর্থ"
          value={`৳${formatBengaliNumber(moneySaved)}`}
          color={theme.colors.success}
        />
        <StatItem
          icon="🚭"
          label="সিগারেট এড়ানো"
          value={formatBengaliNumber(cigarettesNotSmoked)}
          color={theme.colors.error}
        />
      </View>

      {/* Visual Bar Chart */}
      <View style={styles.barChartContainer}>
        <Text style={styles.barChartTitle}>সাপ্তাহিক অগ্রগতি</Text>
        <View style={styles.barChart}>
          {Array.from({length: Math.min(6, Math.ceil(currentDay / 7))}).map((_, index) => {
            const weekNumber = index + 1;
            const daysInWeek = Math.min(7, Math.max(0, currentDay - index * 7));
            const weekProgress = (daysInWeek / 7) * 100;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View style={[styles.bar, {height: `${weekProgress}%`}]} />
                </View>
                <Text style={styles.barLabel}>সপ্তাহ {weekNumber}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );
};

interface StatItemProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({icon, label, value, color}) => {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, {color}]}>{value}</Text>
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
  progressSection: {
    marginBottom: theme.spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressLabel: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.round,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  progressDay: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  progressTotal: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  barChartContainer: {
    marginTop: theme.spacing.md,
  },
  barChartTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: theme.spacing.sm,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  barWrapper: {
    width: '80%',
    height: 100,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: theme.colors.primary.main,
    borderTopLeftRadius: theme.borderRadius.sm,
    borderTopRightRadius: theme.borderRadius.sm,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

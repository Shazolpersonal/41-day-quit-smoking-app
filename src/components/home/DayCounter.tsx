import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {colors, spacing, typography, borderRadius} from '../../constants/theme';
import {Card} from '../common/Card';

export interface DayCounterProps {
  currentDay: number;
  totalDays?: number;
  smokeFreeTime: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export const DayCounter: React.FC<DayCounterProps> = ({
  currentDay,
  totalDays = 41,
  smokeFreeTime,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate on mount
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animate when day changes
  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentDay]);

  const progress = (currentDay / totalDays) * 100;

  return (
    <Card variant="elevated" padding="lg" style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {/* Main Day Counter */}
        <View style={styles.dayCounterContainer}>
          <Text style={styles.dayNumber}>{currentDay}</Text>
          <Text style={styles.dayLabel}>দিন</Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: `${progress}%`}]} />
          </View>
          <Text style={styles.progressText}>
            {currentDay} / {totalDays} দিন সম্পূর্ণ
          </Text>
        </View>

        {/* Time Breakdown */}
        <View style={styles.timeBreakdown}>
          <View style={styles.timeItem}>
            <Text style={styles.timeValue}>{smokeFreeTime.days}</Text>
            <Text style={styles.timeLabel}>দিন</Text>
          </View>
          <View style={styles.timeSeparator} />
          <View style={styles.timeItem}>
            <Text style={styles.timeValue}>{smokeFreeTime.hours}</Text>
            <Text style={styles.timeLabel}>ঘণ্টা</Text>
          </View>
          <View style={styles.timeSeparator} />
          <View style={styles.timeItem}>
            <Text style={styles.timeValue}>{smokeFreeTime.minutes}</Text>
            <Text style={styles.timeLabel}>মিনিট</Text>
          </View>
        </View>

        {/* Motivational Text */}
        <Text style={styles.motivationalText}>
          ধূমপানমুক্ত জীবন 🌟
        </Text>
      </Animated.View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  content: {
    alignItems: 'center',
  },
  dayCounterContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dayNumber: {
    fontSize: 72,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    lineHeight: 80,
  },
  dayLabel: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  progressContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.neutral.gray[200],
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  timeBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.neutral.gray[50],
    borderRadius: borderRadius.md,
  },
  timeItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  timeValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.dark,
  },
  timeLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  timeSeparator: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.md,
  },
  motivationalText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

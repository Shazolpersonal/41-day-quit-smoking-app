import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {colors, spacing, typography, borderRadius} from '../../constants/theme';
import {Card} from '../common/Card';

export interface MoneySavedProps {
  amount: number;
  cigarettesNotSmoked: number;
  currency?: string;
}

export const MoneySaved: React.FC<MoneySavedProps> = ({
  amount,
  cigarettesNotSmoked,
  currency = '৳',
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate on mount
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animate when amount changes
  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.05,
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
  }, [amount]);

  /**
   * Format currency with Bengali number system
   */
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('bn-BD');
  };

  /**
   * Format number with Bengali digits
   */
  const formatNumber = (value: number): string => {
    return value.toLocaleString('bn-BD');
  };

  return (
    <Card variant="elevated" padding="lg" style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [
              {scale: scaleAnim},
              {translateY: slideAnim},
            ],
          },
        ]}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💰</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>সঞ্চিত অর্থ</Text>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={styles.currency}>{currency}</Text>
          <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Cigarettes Not Smoked */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🚭</Text>
            <View style={styles.statTextContainer}>
              <Text style={styles.statValue}>
                {formatNumber(cigarettesNotSmoked)}
              </Text>
              <Text style={styles.statLabel}>সিগারেট এড়ানো হয়েছে</Text>
            </View>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            মাশাআল্লাহ! আপনি অর্থ সাশ্রয় করছেন এবং স্বাস্থ্য রক্ষা করছেন
          </Text>
        </View>
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.round,
    backgroundColor: colors.secondary.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  currency: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary.main,
    marginTop: spacing.xs,
    marginRight: spacing.xs,
  },
  amount: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary.main,
    lineHeight: 56,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border.light,
    marginBottom: spacing.lg,
  },
  statsContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  statIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  messageContainer: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.primary.light + '10',
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
});

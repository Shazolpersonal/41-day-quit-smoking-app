import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Vibration} from 'react-native';
import {colors, spacing, typography, borderRadius, shadows} from '../../constants/theme';
import {Card} from '../common/Card';

export interface QuickActionsProps {
  onSOSPress: () => void;
  onJournalPress?: () => void;
  onProgressPress?: () => void;
  onTipsPress?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSOSPress,
  onJournalPress,
  onProgressPress,
  onTipsPress,
}) => {
  const handleSOSPress = () => {
    // Haptic feedback - vibrate for 100ms
    Vibration.vibrate(100);
    
    Alert.alert(
      'জরুরি সাহায্য',
      'আপনি কি সত্যিই SOS সাহায্য চান? এটি আপনাকে জরুরি টিপস এবং দোয়া দেখাবে।',
      [
        {
          text: 'বাতিল',
          style: 'cancel',
        },
        {
          text: 'হ্যাঁ, সাহায্য চাই',
          onPress: () => {
            Vibration.vibrate(50);
            onSOSPress();
          },
        },
      ],
    );
  };

  return (
    <Card variant="elevated" padding="lg" style={styles.container}>
      <Text style={styles.title}>দ্রুত কাজ</Text>

      {/* SOS Button - Primary Action */}
      <TouchableOpacity
        style={styles.sosButton}
        onPress={handleSOSPress}
        activeOpacity={0.8}>
        <View style={styles.sosIconContainer}>
          <Text style={styles.sosIcon}>🆘</Text>
        </View>
        <View style={styles.sosTextContainer}>
          <Text style={styles.sosTitle}>SOS সাহায্য</Text>
          <Text style={styles.sosSubtitle}>
            ধূমপানের তীব্র ইচ্ছা হলে এখানে চাপুন
          </Text>
        </View>
      </TouchableOpacity>

      {/* Secondary Actions Grid */}
      <View style={styles.actionsGrid}>
        {/* Journal Action */}
        {onJournalPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onJournalPress}
            activeOpacity={0.7}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📝</Text>
            </View>
            <Text style={styles.actionLabel}>জার্নাল</Text>
          </TouchableOpacity>
        )}

        {/* Progress Action */}
        {onProgressPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onProgressPress}
            activeOpacity={0.7}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📊</Text>
            </View>
            <Text style={styles.actionLabel}>অগ্রগতি</Text>
          </TouchableOpacity>
        )}

        {/* Tips Action */}
        {onTipsPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onTipsPress}
            activeOpacity={0.7}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>💡</Text>
            </View>
            <Text style={styles.actionLabel}>টিপস</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  
  // SOS Button Styles
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  sosIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sosIcon: {
    fontSize: 28,
  },
  sosTextContainer: {
    flex: 1,
  },
  sosTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },
  sosSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.white,
    opacity: 0.9,
  },
  
  // Actions Grid Styles
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.neutral.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
});

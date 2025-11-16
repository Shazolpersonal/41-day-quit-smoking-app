import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {colors, spacing, typography, borderRadius, shadows} from '../../constants/theme';
import {CopingStrategyType} from '../../types';

export interface CopingStrategy {
  id: CopingStrategyType;
  title: string;
  description: string;
  emoji: string;
  action?: () => void;
}

export interface CopingStrategiesProps {
  onStrategySelect: (strategy: CopingStrategyType) => void;
}

const strategies: CopingStrategy[] = [
  {
    id: 'breathing',
    title: 'শ্বাস-প্রশ্বাস',
    description: 'গভীর শ্বাস নিয়ে মন শান্ত করুন',
    emoji: '🫁',
  },
  {
    id: 'dua',
    title: 'দোয়া পড়ুন',
    description: 'আল্লাহর কাছে সাহায্য চান',
    emoji: '🤲',
  },
  {
    id: 'dhikr',
    title: 'যিকির করুন',
    description: 'আল্লাহকে স্মরণ করুন',
    emoji: '📿',
  },
  {
    id: 'water',
    title: 'পানি পান করুন',
    description: 'এক গ্লাস ঠান্ডা পানি পান করুন',
    emoji: '💧',
  },
  {
    id: 'walk',
    title: 'হাঁটুন',
    description: '৫ মিনিট হাঁটাহাঁটি করুন',
    emoji: '🚶',
  },
  {
    id: 'call',
    title: 'কল করুন',
    description: 'বিশ্বস্ত কাউকে ফোন করুন',
    emoji: '📞',
  },
  {
    id: 'distraction',
    title: 'মনোযোগ সরান',
    description: 'অন্য কিছুতে মনোযোগ দিন',
    emoji: '🎯',
  },
  {
    id: 'other',
    title: 'অন্যান্য',
    description: 'আপনার নিজস্ব পদ্ধতি ব্যবহার করুন',
    emoji: '✨',
  },
];

export const CopingStrategies: React.FC<CopingStrategiesProps> = ({
  onStrategySelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>দ্রুত সমাধান</Text>
      <Text style={styles.subtitle}>
        একটি পদ্ধতি বেছে নিন যা আপনাকে সাহায্য করতে পারে
      </Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.strategiesContainer}
        showsVerticalScrollIndicator={false}>
        {strategies.map(strategy => (
          <TouchableOpacity
            key={strategy.id}
            style={styles.strategyCard}
            onPress={() => onStrategySelect(strategy.id)}
            activeOpacity={0.7}>
            <Text style={styles.emoji}>{strategy.emoji}</Text>
            <View style={styles.strategyContent}>
              <Text style={styles.strategyTitle}>{strategy.title}</Text>
              <Text style={styles.strategyDescription}>
                {strategy.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  strategiesContainer: {
    paddingBottom: spacing.lg,
  },
  strategyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  emoji: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  strategyContent: {
    flex: 1,
  },
  strategyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  strategyDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
});

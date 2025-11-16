import React from 'react';
import {View, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import {colors, spacing, borderRadius, shadows} from '../../constants/theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof spacing;
  style?: ViewStyle;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  style,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'none',
}) => {
  const cardStyles = [
    styles.card,
    styles[`card_${variant}`],
    {padding: spacing[padding]},
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        hitSlop={{top: 4, bottom: 4, left: 4, right: 4}}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={cardStyles}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.paper,
  },
  
  card_elevated: {
    ...shadows.md,
  },
  
  card_outlined: {
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  
  card_filled: {
    backgroundColor: colors.neutral.gray[100],
  },
});

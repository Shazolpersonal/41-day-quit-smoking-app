import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors, spacing, borderRadius, shadows} from '../../constants/theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof spacing;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  style,
}) => {
  const cardStyles = [
    styles.card,
    styles[`card_${variant}`],
    {padding: spacing[padding]},
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
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

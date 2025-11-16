/**
 * Error Message Component
 * Displays inline error messages for forms
 */

import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors, spacing, typography} from '../../constants/theme';
import {useAccessibility} from '../../hooks/useAccessibility';

export interface ErrorMessageProps {
  message?: string;
  visible?: boolean;
  style?: ViewStyle;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  visible = true,
  style,
}) => {
  const {scaledFontSize} = useAccessibility();

  if (!visible || !message) {
    return null;
  }

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`ত্রুটি: ${message}`}>
      <Text style={[styles.icon, {fontSize: scaledFontSize(16)}]}>⚠️</Text>
      <Text style={[styles.message, {fontSize: scaledFontSize(typography.fontSize.sm)}]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.error + '15', // 15% opacity
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
    padding: spacing.sm,
    borderRadius: 4,
    marginTop: spacing.xs,
  },
  icon: {
    marginRight: spacing.xs,
  },
  message: {
    flex: 1,
    color: colors.error,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
});

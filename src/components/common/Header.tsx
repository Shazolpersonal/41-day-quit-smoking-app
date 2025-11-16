import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import {colors, spacing, typography} from '../../constants/theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    icon?: React.ReactNode;
    onPress: () => void;
  };
  rightAction?: {
    icon?: React.ReactNode;
    onPress: () => void;
  };
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  style,
  titleStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        {leftAction && (
          <TouchableOpacity
            onPress={leftAction.onPress}
            style={styles.actionButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            {leftAction.icon}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightAction && (
          <TouchableOpacity
            onPress={rightAction.onPress}
            style={styles.actionButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            {rightAction.icon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary.main,
    minHeight: 56,
  },
  
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  
  actionButton: {
    padding: spacing.xs,
  },
  
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.neutral.white,
    opacity: 0.9,
    marginTop: spacing.xs / 2,
    textAlign: 'center',
  },
});

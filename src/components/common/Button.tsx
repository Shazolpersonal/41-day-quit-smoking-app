import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, spacing, borderRadius, typography, shadows} from '../../constants/theme';
import {useHaptic} from '../../hooks/useHaptic';
import {useAccessibility} from '../../hooks/useAccessibility';
import {A11Y_HINTS} from '../../constants/accessibility';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const haptic = useHaptic();
  const {scaledFontSize, minTouchTargetSize} = useAccessibility();

  const handlePress = () => {
    haptic.buttonPress();
    onPress();
  };

  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    {fontSize: scaledFontSize(typography.fontSize[size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'])},
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint || A11Y_HINTS.DOUBLE_TAP_TO_ACTIVATE}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      testID={`button-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.neutral.white : colors.primary.main}
          accessibilityLabel="লোড হচ্ছে"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  
  // Variants
  button_primary: {
    backgroundColor: colors.primary.main,
  },
  button_secondary: {
    backgroundColor: colors.secondary.main,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  button_text: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Sizes - All meet minimum touch target size (44x44)
  button_small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 44, // Minimum touch target
  },
  button_medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 48, // Recommended touch target
  },
  button_large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56, // Large touch target
  },
  
  fullWidth: {
    width: '100%',
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  
  text_primary: {
    color: colors.neutral.white,
  },
  text_secondary: {
    color: colors.neutral.black,
  },
  text_outline: {
    color: colors.primary.main,
  },
  text_text: {
    color: colors.primary.main,
  },
  
  text_small: {
    fontSize: typography.fontSize.sm,
  },
  text_medium: {
    fontSize: typography.fontSize.md,
  },
  text_large: {
    fontSize: typography.fontSize.lg,
  },
  
  textDisabled: {
    opacity: 0.7,
  },
});

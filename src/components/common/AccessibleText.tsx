/**
 * AccessibleText Component
 * Text component with automatic font scaling and accessibility support
 */

import React from 'react';
import {Text, TextProps, StyleSheet} from 'react-native';
import {useAccessibility} from '../../hooks/useAccessibility';
import {typography, colors} from '../../constants/theme';

export interface AccessibleTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  bold?: boolean;
  center?: boolean;
  accessibilityLabel?: string;
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  variant = 'body',
  color = colors.text.primary,
  bold = false,
  center = false,
  style,
  children,
  accessibilityLabel,
  ...props
}) => {
  const {scaledFontSize, isBoldTextEnabled} = useAccessibility();

  // Get base font size for variant
  const getBaseFontSize = (): number => {
    switch (variant) {
      case 'h1':
        return typography.fontSize.xxxl;
      case 'h2':
        return typography.fontSize.xxl;
      case 'h3':
        return typography.fontSize.xl;
      case 'body':
        return typography.fontSize.md;
      case 'caption':
        return typography.fontSize.sm;
      case 'label':
        return typography.fontSize.xs;
      default:
        return typography.fontSize.md;
    }
  };

  // Get font weight
  const getFontWeight = (): string => {
    if (bold || isBoldTextEnabled) {
      return typography.fontWeight.bold;
    }
    if (variant.startsWith('h')) {
      return typography.fontWeight.semibold;
    }
    return typography.fontWeight.regular;
  };

  const textStyles = [
    styles.text,
    {
      fontSize: scaledFontSize(getBaseFontSize()),
      fontWeight: getFontWeight(),
      color,
      textAlign: center ? 'center' : 'left',
      lineHeight: scaledFontSize(getBaseFontSize()) * typography.lineHeight.normal,
    },
    style,
  ];

  return (
    <Text
      style={textStyles}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: typography.fontFamily.regular,
  },
});

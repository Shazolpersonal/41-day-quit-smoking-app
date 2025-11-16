/**
 * AccessibleTouchable Component
 * Touchable component with proper accessibility support and minimum touch target size
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useAccessibility} from '../../hooks/useAccessibility';
import {TOUCH_TARGET} from '../../constants/accessibility';

export interface AccessibleTouchableProps extends TouchableOpacityProps {
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'checkbox' | 'radio' | 'switch';
  minSize?: number;
  children: React.ReactNode;
}

export const AccessibleTouchable: React.FC<AccessibleTouchableProps> = ({
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  minSize = TOUCH_TARGET.MIN_SIZE,
  style,
  children,
  disabled,
  ...props
}) => {
  const {minTouchTargetSize} = useAccessibility();

  const containerStyle: ViewStyle = {
    minWidth: Math.max(minSize, minTouchTargetSize),
    minHeight: Math.max(minSize, minTouchTargetSize),
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled: disabled || false}}
      hitSlop={{
        top: TOUCH_TARGET.SPACING,
        bottom: TOUCH_TARGET.SPACING,
        left: TOUCH_TARGET.SPACING,
        right: TOUCH_TARGET.SPACING,
      }}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}>
      {children}
    </TouchableOpacity>
  );
};

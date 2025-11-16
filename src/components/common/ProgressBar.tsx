import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, ViewStyle, TextStyle} from 'react-native';
import {colors, spacing, borderRadius, typography} from '../../constants/theme';
import {useAccessibility} from '../../hooks/useAccessibility';
import {getProgressLabel} from '../../utils/accessibility';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  label?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  accessibilityLabel?: string;
  total?: number;
  current?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = false,
  color = colors.primary.main,
  backgroundColor = colors.neutral.gray[200],
  animated = true,
  label,
  style,
  labelStyle,
  accessibilityLabel,
  total,
  current,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const {scaledFontSize, isReduceMotionEnabled} = useAccessibility();
  
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(clampedProgress * 100);

  // Use reduced animation if user prefers
  const shouldAnimate = animated && !isReduceMotionEnabled;

  useEffect(() => {
    if (shouldAnimate) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: isReduceMotionEnabled ? 100 : 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, shouldAnimate, animatedWidth, isReduceMotionEnabled]);

  const progressWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Generate accessibility label
  const getA11yLabel = (): string => {
    if (accessibilityLabel) {
      return accessibilityLabel;
    }
    if (total && current !== undefined) {
      return getProgressLabel(current, total);
    }
    return `অগ্রগতি ${percentage} শতাংশ`;
  };

  return (
    <View 
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={getA11yLabel()}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: percentage,
      }}>
      {label && (
        <View style={styles.labelContainer}>
          <Text 
            style={[styles.label, {fontSize: scaledFontSize(typography.fontSize.sm)}, labelStyle]}
            accessible={false}>
            {label}
          </Text>
          {showPercentage && (
            <Text 
              style={[styles.percentage, {fontSize: scaledFontSize(typography.fontSize.sm)}, labelStyle]}
              accessible={false}>
              {percentage}%
            </Text>
          )}
        </View>
      )}
      
      <View
        style={[
          styles.track,
          {height, backgroundColor, borderRadius: height / 2},
        ]}
        accessible={false}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: progressWidth,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
          accessible={false}
        />
      </View>
      
      {!label && showPercentage && (
        <Text 
          style={[styles.percentageOnly, {fontSize: scaledFontSize(typography.fontSize.xs)}, labelStyle]}
          accessible={false}>
          {percentage}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  
  percentage: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
  },
  
  percentageOnly: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  
  fill: {
    height: '100%',
  },
});

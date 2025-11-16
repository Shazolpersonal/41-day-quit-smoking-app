import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, ViewStyle, TextStyle} from 'react-native';
import {colors, spacing, borderRadius, typography} from '../../constants/theme';

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
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(clampedProgress * 100);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animated, animatedWidth]);

  const progressWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          {showPercentage && (
            <Text style={[styles.percentage, labelStyle]}>{percentage}%</Text>
          )}
        </View>
      )}
      
      <View
        style={[
          styles.track,
          {height, backgroundColor, borderRadius: height / 2},
        ]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: progressWidth,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
      
      {!label && showPercentage && (
        <Text style={[styles.percentageOnly, labelStyle]}>{percentage}%</Text>
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

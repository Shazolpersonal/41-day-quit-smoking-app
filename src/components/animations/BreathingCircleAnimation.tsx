/**
 * BreathingCircleAnimation Component
 * Animated breathing circle for breathing exercises
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

interface BreathingCircleAnimationProps {
  isActive: boolean;
  phase: 'inhale' | 'hold' | 'exhale';
  duration?: number;
}

export const BreathingCircleAnimation: React.FC<BreathingCircleAnimationProps> = ({
  isActive,
  phase,
  duration = 4000,
}) => {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (isActive) {
      if (phase === 'inhale') {
        scale.value = withTiming(1, {
          duration,
          easing: Easing.bezier(0.42, 0, 0.58, 1),
        });
        opacity.value = withTiming(0.8, { duration });
      } else if (phase === 'hold') {
        // Keep current scale
      } else if (phase === 'exhale') {
        scale.value = withTiming(0.6, {
          duration,
          easing: Easing.bezier(0.42, 0, 0.58, 1),
        });
        opacity.value = withTiming(0.3, { duration });
      }
    } else {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = withTiming(0.6, { duration: 500 });
      opacity.value = withTiming(0.3, { duration: 500 });
    }
  }, [isActive, phase, duration, scale, opacity]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'শ্বাস নিন';
      case 'hold':
        return 'ধরে রাখুন';
      case 'exhale':
        return 'শ্বাস ছাড়ুন';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, circleStyle]}>
        <View style={styles.innerCircle}>
          <Text style={styles.phaseText}>{getPhaseText()}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    fontFamily: 'NotoSansBengali-Bold',
  },
});

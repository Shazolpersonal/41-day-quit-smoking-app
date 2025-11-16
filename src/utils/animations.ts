/**
 * Animation Utilities
 * Centralized animation configurations and helpers using react-native-reanimated
 */

import {
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  Easing,
  WithTimingConfig,
  WithSpringConfig,
} from 'react-native-reanimated';

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
};

// Easing Functions
export const EASING = {
  EASE_IN_OUT: Easing.bezier(0.42, 0, 0.58, 1),
  EASE_OUT: Easing.bezier(0, 0, 0.58, 1),
  EASE_IN: Easing.bezier(0.42, 0, 1, 1),
  BOUNCE: Easing.bounce,
  ELASTIC: Easing.elastic(1),
};

// Timing Configs
export const timingConfig = (duration: number = ANIMATION_DURATION.NORMAL): WithTimingConfig => ({
  duration,
  easing: EASING.EASE_IN_OUT,
});

export const fastTimingConfig: WithTimingConfig = {
  duration: ANIMATION_DURATION.FAST,
  easing: EASING.EASE_OUT,
};

export const slowTimingConfig: WithTimingConfig = {
  duration: ANIMATION_DURATION.SLOW,
  easing: EASING.EASE_IN_OUT,
};

// Spring Configs
export const springConfig: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const bouncySpringConfig: WithSpringConfig = {
  damping: 10,
  stiffness: 100,
  mass: 1,
};

export const gentleSpringConfig: WithSpringConfig = {
  damping: 20,
  stiffness: 200,
  mass: 1,
};

// Common Animation Patterns
export const fadeIn = (duration: number = ANIMATION_DURATION.NORMAL) => {
  return withTiming(1, timingConfig(duration));
};

export const fadeOut = (duration: number = ANIMATION_DURATION.NORMAL) => {
  return withTiming(0, timingConfig(duration));
};

export const scaleIn = (toValue: number = 1, duration: number = ANIMATION_DURATION.NORMAL) => {
  return withSpring(toValue, springConfig);
};

export const scaleOut = (duration: number = ANIMATION_DURATION.NORMAL) => {
  return withTiming(0, timingConfig(duration));
};

export const slideInFromRight = (duration: number = ANIMATION_DURATION.NORMAL) => {
  return withTiming(0, timingConfig(duration));
};

export const slideInFromLeft = (duration: number = ANIMATION_DURATION.NORMAL) => {
  return withTiming(0, timingConfig(duration));
};

export const pulse = (scale: number = 1.1) => {
  return withRepeat(
    withSequence(
      withTiming(scale, { duration: 500, easing: EASING.EASE_IN_OUT }),
      withTiming(1, { duration: 500, easing: EASING.EASE_IN_OUT })
    ),
    -1,
    true
  );
};

export const shake = () => {
  return withRepeat(
    withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    ),
    1,
    false
  );
};

export const bounce = (toValue: number = 1) => {
  return withSpring(toValue, bouncySpringConfig);
};

// Celebration Animation
export const celebrationScale = () => {
  return withSequence(
    withTiming(0, { duration: 0 }),
    withSpring(1.2, bouncySpringConfig),
    withSpring(1, gentleSpringConfig)
  );
};

// Task Completion Animation
export const taskCompleteScale = () => {
  return withSequence(
    withSpring(1.2, { damping: 8, stiffness: 150 }),
    withSpring(1, gentleSpringConfig)
  );
};

// Breathing Exercise Animation
export const breathingAnimation = (inhale: boolean, duration: number = 4000) => {
  return withTiming(inhale ? 1 : 0.6, {
    duration,
    easing: EASING.EASE_IN_OUT,
  });
};

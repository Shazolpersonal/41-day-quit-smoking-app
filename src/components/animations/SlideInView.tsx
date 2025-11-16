/**
 * SlideInView Component
 * Animated view that slides in from a direction
 */

import React, { useEffect } from 'react';
import { ViewStyle, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { timingConfig } from '../../utils/animations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Direction = 'left' | 'right' | 'top' | 'bottom';

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: Direction;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = 'right',
  duration = 300,
  delay = 0,
  style,
}) => {
  const translateX = useSharedValue(
    direction === 'left' ? -SCREEN_WIDTH : direction === 'right' ? SCREEN_WIDTH : 0
  );
  const translateY = useSharedValue(
    direction === 'top' ? -100 : direction === 'bottom' ? 100 : 0
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      translateX.value = withTiming(0, timingConfig(duration));
      translateY.value = withTiming(0, timingConfig(duration));
    }, delay);

    return () => clearTimeout(timer);
  }, [duration, delay, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

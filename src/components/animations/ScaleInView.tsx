/**
 * ScaleInView Component
 * Animated view that scales in when mounted
 */

import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { springConfig } from '../../utils/animations';

interface ScaleInViewProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
  initialScale?: number;
}

export const ScaleInView: React.FC<ScaleInViewProps> = ({
  children,
  delay = 0,
  style,
  initialScale = 0,
}) => {
  const scale = useSharedValue(initialScale);

  useEffect(() => {
    const timer = setTimeout(() => {
      scale.value = withSpring(1, springConfig);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

/**
 * TaskCompletionAnimation Component
 * Animated checkmark with scale and fade effect for task completion
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../constants/theme';
import { bouncySpringConfig, gentleSpringConfig } from '../../utils/animations';

interface TaskCompletionAnimationProps {
  visible: boolean;
  onAnimationComplete?: () => void;
}

export const TaskCompletionAnimation: React.FC<TaskCompletionAnimationProps> = ({
  visible,
  onAnimationComplete,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Start animation sequence
      scale.value = withSequence(
        withSpring(1.3, bouncySpringConfig),
        withSpring(1, gentleSpringConfig)
      );
      
      opacity.value = withTiming(1, { duration: 200 });
      
      rotation.value = withSequence(
        withTiming(360, { duration: 500 }),
        withTiming(0, { duration: 0 })
      );

      // Call completion callback after animation
      const timer = setTimeout(() => {
        onAnimationComplete?.();
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      scale.value = 0;
      opacity.value = 0;
      rotation.value = 0;
    }
  }, [visible, scale, opacity, rotation, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Icon name="check-circle" size={80} color={theme.colors.success} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  iconContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 50,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

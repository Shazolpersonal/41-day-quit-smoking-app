/**
 * MilestoneCelebrationAnimation Component
 * Full-screen celebration animation for milestone achievements
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../constants/theme';
import { Button } from '../common/Button';

interface MilestoneCelebrationAnimationProps {
  visible: boolean;
  title: string;
  description: string;
  icon?: string;
  onClose: () => void;
}

export const MilestoneCelebrationAnimation: React.FC<MilestoneCelebrationAnimationProps> = ({
  visible,
  title,
  description,
  icon = 'trophy',
  onClose,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Background fade in
      opacity.value = withTiming(1, { duration: 300 });

      // Icon animation
      iconScale.value = withSequence(
        withDelay(200, withSpring(1.3, { damping: 8, stiffness: 100 })),
        withSpring(1, { damping: 15, stiffness: 150 })
      );

      iconRotation.value = withDelay(
        200,
        withTiming(360, { duration: 600, easing: Easing.bezier(0.68, -0.55, 0.265, 1.55) })
      );

      // Content scale in
      scale.value = withDelay(
        400,
        withSpring(1, { damping: 12, stiffness: 120 })
      );

      // Confetti effect
      confettiOpacity.value = withSequence(
        withDelay(300, withTiming(1, { duration: 300 })),
        withDelay(2000, withTiming(0, { duration: 500 }))
      );
    } else {
      scale.value = 0;
      opacity.value = 0;
      iconScale.value = 0;
      iconRotation.value = 0;
      confettiOpacity.value = 0;
    }
  }, [visible, scale, opacity, iconScale, iconRotation, confettiOpacity]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const confettiStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.container, backgroundStyle]}>
        {/* Confetti Effect */}
        <Animated.View style={[styles.confettiContainer, confettiStyle]}>
          {[...Array(20)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.confetti,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: [
                    theme.colors.primary,
                    theme.colors.secondary,
                    theme.colors.success,
                    '#FFD700',
                  ][Math.floor(Math.random() * 4)],
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <Icon name={icon} size={100} color={theme.colors.primary} />
          </Animated.View>

          <Animated.View style={contentStyle}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <Button
              title="চালিয়ে যান"
              onPress={onClose}
              style={styles.button}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 80,
    padding: 30,
    marginBottom: 30,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.background,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'NotoSansBengali-Bold',
  },
  description: {
    fontSize: 18,
    color: theme.colors.background,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
    fontFamily: 'NotoSansBengali-Regular',
  },
  button: {
    minWidth: 200,
  },
});

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {colors, spacing, typography, borderRadius, shadows} from '../../constants/theme';

const {width} = Dimensions.get('window');

export interface Milestone {
  day: number;
  title: string;
  description: string;
  badge: string;
  emoji: string;
}

export interface MilestoneCelebrationProps {
  visible: boolean;
  milestone: Milestone | null;
  onClose: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  visible,
  milestone,
  onClose,
}) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Start animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible, scaleAnim, fadeAnim]);

  if (!milestone) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{scale: scaleAnim}],
              },
            ]}>
            {/* Confetti Effect */}
            <View style={styles.confettiContainer}>
              <Text style={styles.confetti}>🎉</Text>
              <Text style={styles.confetti}>✨</Text>
              <Text style={styles.confetti}>🎊</Text>
              <Text style={styles.confetti}>⭐</Text>
            </View>

            {/* Badge */}
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeEmoji}>{milestone.emoji}</Text>
              <View style={styles.badgeCircle}>
                <Text style={styles.badgeText}>{milestone.badge}</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.congratsText}>আলহামদুলিল্লাহ! 🎉</Text>
            <Text style={styles.title}>{milestone.title}</Text>

            {/* Description */}
            <Text style={styles.description}>{milestone.description}</Text>

            {/* Day Badge */}
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>দিন {milestone.day}</Text>
            </View>

            {/* Islamic Message */}
            <View style={styles.islamicMessage}>
              <Text style={styles.islamicText}>
                "নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন"
              </Text>
              <Text style={styles.islamicReference}>(সূরা বাকারা: ১৫৩)</Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>চালিয়ে যান</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: width - spacing.xl * 2,
    maxWidth: 400,
    alignItems: 'center',
    ...shadows.lg,
  },
  confettiContainer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
  },
  confetti: {
    fontSize: 32,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  badgeEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  badgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.light + '30',
    borderWidth: 3,
    borderColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  congratsText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.md,
    marginBottom: spacing.lg,
  },
  dayBadge: {
    backgroundColor: colors.secondary.light + '30',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginBottom: spacing.lg,
  },
  dayBadgeText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.secondary.main,
  },
  islamicMessage: {
    backgroundColor: colors.primary.light + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
    marginBottom: spacing.lg,
    width: '100%',
  },
  islamicText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  islamicReference: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.round,
    width: '100%',
    ...shadows.sm,
  },
  closeButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    textAlign: 'center',
  },
});

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {colors, spacing, typography, borderRadius} from '../../constants/theme';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'idle';

export interface BreathingExerciseProps {
  onComplete?: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  onComplete,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('idle');
  const [countdown, setCountdown] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            return 4;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 4;
          } else if (phase === 'exhale') {
            setCycleCount(prev => prev + 1);
            setPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  useEffect(() => {
    if (!isActive) return;

    if (phase === 'inhale') {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (phase === 'hold') {
      // Keep the size
    } else if (phase === 'exhale') {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [phase, isActive]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCountdown(4);
    setCycleCount(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase('idle');
    setCountdown(4);
    scaleAnim.setValue(1);
    opacityAnim.setValue(0.3);
    if (cycleCount > 0 && onComplete) {
      onComplete();
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'শ্বাস নিন';
      case 'hold':
        return 'ধরে রাখুন';
      case 'exhale':
        return 'শ্বাস ছাড়ুন';
      default:
        return 'শুরু করতে প্রস্তুত';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>শ্বাস-প্রশ্বাসের ব্যায়াম</Text>
      <Text style={styles.subtitle}>৪-৪-৪ পদ্ধতি</Text>

      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{scale: scaleAnim}],
              opacity: opacityAnim,
            },
          ]}
        />
        <View style={styles.centerContent}>
          <Text style={styles.phaseText}>{getPhaseText()}</Text>
          {isActive && <Text style={styles.countdown}>{countdown}</Text>}
        </View>
      </View>

      {isActive && (
        <Text style={styles.cycleCount}>চক্র: {cycleCount}</Text>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • ৪ সেকেন্ড শ্বাস নিন{'\n'}
          • ৪ সেকেন্ড ধরে রাখুন{'\n'}
          • ৪ সেকেন্ড শ্বাস ছাড়ুন
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isActive && styles.buttonStop]}
        onPress={isActive ? handleStop : handleStart}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>
          {isActive ? 'বন্ধ করুন' : 'শুরু করুন'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  circleContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  circle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primary.main,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  countdown: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  cycleCount: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  instructions: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  instructionText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    minWidth: 200,
  },
  buttonStop: {
    backgroundColor: colors.error,
  },
  buttonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    textAlign: 'center',
  },
});

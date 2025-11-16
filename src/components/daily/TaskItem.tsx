import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {colors, spacing, borderRadius, typography} from '../../constants/theme';
import {DailyTask} from '../../types';
import {useHaptic} from '../../hooks/useHaptic';

export interface TaskItemProps {
  task: DailyTask;
  onToggle: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({task, onToggle}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const haptic = useHaptic();
  const previousCompleted = useRef(task.completed);

  useEffect(() => {
    // Trigger haptic feedback when task is completed (not on initial render)
    if (task.completed && !previousCompleted.current) {
      haptic.taskCompleted();
    }
    previousCompleted.current = task.completed;
  }, [task.completed, haptic]);

  useEffect(() => {
    if (task.completed) {
      // Completion animation
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Reset animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [task.completed, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{scale: scaleAnim}],
          opacity: opacityAnim,
        },
      ]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}>
        <View style={styles.content}>
          {/* Checkbox */}
          <View
            style={[
              styles.checkbox,
              task.completed && styles.checkboxCompleted,
            ]}>
            {task.completed && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>

          {/* Task content */}
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                task.completed && styles.titleCompleted,
              ]}>
              {task.title}
            </Text>
            <Text
              style={[
                styles.description,
                task.completed && styles.descriptionCompleted,
              ]}>
              {task.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  touchable: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  content: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.primary.main,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxCompleted: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkmark: {
    color: colors.neutral.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.normal * typography.fontSize.md,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
  descriptionCompleted: {
    color: colors.text.disabled,
  },
});

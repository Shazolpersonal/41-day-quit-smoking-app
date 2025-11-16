import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {colors, spacing, typography} from '../../constants/theme';
import {DailyTask} from '../../types';
import {TaskItem} from './TaskItem';
import {ProgressBar} from '../common/ProgressBar';

export interface TaskListProps {
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  title?: string;
  showProgress?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  title = 'আজকের কাজ',
  showProgress = true,
}) => {
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.counter}>
          {completedCount}/{totalCount}
        </Text>
      </View>

      {/* Progress bar */}
      {showProgress && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} height={8} />
        </View>
      )}

      {/* Task list */}
      <View style={styles.taskList}>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
          />
        ))}
      </View>

      {/* Completion message */}
      {completedCount === totalCount && totalCount > 0 && (
        <View style={styles.completionMessage}>
          <Text style={styles.completionEmoji}>🎉</Text>
          <Text style={styles.completionText}>
            আলহামদুলিল্লাহ! আজকের সব কাজ সম্পন্ন হয়েছে!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  counter: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  taskList: {
    flex: 1,
  },
  completionMessage: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.primary.light,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  completionEmoji: {
    fontSize: typography.fontSize.xxxl,
    marginBottom: spacing.xs,
  },
  completionText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    textAlign: 'center',
  },
});

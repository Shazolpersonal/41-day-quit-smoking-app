/**
 * Example usage of Daily Content Components
 * This file demonstrates how to use TaskList, TaskItem, and Affirmation components
 */

import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {TaskList, Affirmation} from './index';
import {dailyContent} from '../../data/dailyContent';
import {DailyTask} from '../../types';
import {spacing} from '../../constants/theme';

export const DailyContentExample: React.FC = () => {
  // Get day 1 content as example
  const dayContent = dailyContent[0];
  
  // State for tasks
  const [tasks, setTasks] = useState<DailyTask[]>(dayContent.tasks);

  // Handle task toggle
  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Task List Section */}
      <View style={styles.section}>
        <TaskList
          tasks={tasks}
          onToggleTask={handleToggleTask}
          title="আজকের কাজ"
          showProgress={true}
        />
      </View>

      {/* Affirmation Section */}
      <View style={styles.section}>
        <Affirmation
          affirmations={dayContent.affirmations}
          title="আজকের ইতিবাচক বাণী"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
});

// Example with custom data
export const CustomDailyContentExample: React.FC = () => {
  const customTasks: DailyTask[] = [
    {
      id: 'custom_1',
      title: 'ফজরের নামাজ পড়ুন',
      description: 'সময়মত ফজরের নামাজ আদায় করুন এবং আল্লাহর কাছে সাহায্য চান।',
      completed: false,
    },
    {
      id: 'custom_2',
      title: 'কোরআন তেলাওয়াত',
      description: 'কমপক্ষে ১০ মিনিট কোরআন তেলাওয়াত করুন।',
      completed: false,
    },
    {
      id: 'custom_3',
      title: 'ব্যায়াম করুন',
      description: '২০ মিনিট হাঁটুন বা হালকা ব্যায়াম করুন।',
      completed: true,
    },
  ];

  const customAffirmations = [
    'আমি আল্লাহর সাহায্যে শক্তিশালী।',
    'প্রতিটি দিন আমাকে সুস্থতার কাছাকাছি নিয়ে যাচ্ছে।',
    'আমি ধৈর্যশীল এবং দৃঢ়প্রতিজ্ঞ।',
  ];

  const [tasks, setTasks] = useState(customTasks);

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {...task, completed: !task.completed}
          : task
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <TaskList
          tasks={tasks}
          onToggleTask={handleToggleTask}
          title="কাস্টম কাজের তালিকা"
        />
      </View>

      <View style={styles.section}>
        <Affirmation
          affirmations={customAffirmations}
          title="কাস্টম ইতিবাচক বাণী"
        />
      </View>
    </ScrollView>
  );
};

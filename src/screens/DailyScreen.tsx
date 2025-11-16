import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DailyScreenProps} from '../types/navigation';
import {useProgress} from '../context/ProgressContext';
import {colors, spacing, typography, borderRadius} from '../constants/theme';
import {Header} from '../components/common/Header';
import {Card} from '../components/common/Card';
import {TaskList} from '../components/daily/TaskList';
import {Affirmation} from '../components/daily/Affirmation';
import {dailyContent} from '../data/dailyContent';
import {DailyTask} from '../types';

export const DailyScreen: React.FC<DailyScreenProps> = ({navigation, route}) => {
  const {progress} = useProgress();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Get day from route params or use current day
  useEffect(() => {
    const dayParam = route.params?.day;
    const currentDay = progress?.currentDay || 1;
    
    if (dayParam) {
      setSelectedDay(Math.min(dayParam, 41));
    } else {
      setSelectedDay(Math.min(currentDay, 41));
    }
  }, [route.params?.day, progress?.currentDay]);

  // Load tasks for selected day
  useEffect(() => {
    loadTasks();
  }, [selectedDay]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const dayContent = dailyContent.find(content => content.day === selectedDay);
      
      if (dayContent) {
        // Load saved task completion status
        const savedTasksKey = `tasks_day_${selectedDay}`;
        const savedTasksJson = await AsyncStorage.getItem(savedTasksKey);
        
        if (savedTasksJson) {
          const savedTasks = JSON.parse(savedTasksJson);
          setTasks(savedTasks);
        } else {
          setTasks(dayContent.tasks);
        }
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('ত্রুটি', 'কাজ লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? {...task, completed: !task.completed} : task
      );
      
      setTasks(updatedTasks);
      
      // Save to AsyncStorage
      const savedTasksKey = `tasks_day_${selectedDay}`;
      await AsyncStorage.setItem(savedTasksKey, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('ত্রুটি', 'কাজ সংরক্ষণ করতে সমস্যা হয়েছে।');
    }
  };

  const handlePreviousDay = () => {
    if (selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    }
  };

  const handleNextDay = () => {
    const currentDay = progress?.currentDay || 1;
    
    if (selectedDay >= currentDay) {
      Alert.alert(
        'ভবিষ্যতের দিন',
        'আপনি এখনও এই দিনে পৌঁছাননি। প্রথমে বর্তমান দিনের কাজগুলো সম্পন্ন করুন।'
      );
      return;
    }
    
    if (selectedDay < 41) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const getDayContent = () => {
    return dailyContent.find(content => content.day === selectedDay);
  };

  const dayContent = getDayContent();
  const currentDay = progress?.currentDay || 1;
  const canAccessDay = selectedDay <= currentDay;

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="দৈনিক কন্টেন্ট" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!dayContent) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="দৈনিক কন্টেন্ট" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>এই দিনের কন্টেন্ট পাওয়া যায়নি।</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="দৈনিক কন্টেন্ট" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Day Navigation */}
        <Card variant="elevated" padding="md" style={styles.navigationCard}>
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                selectedDay === 1 && styles.navButtonDisabled,
              ]}
              onPress={handlePreviousDay}
              disabled={selectedDay === 1}>
              <Text style={styles.navButtonText}>← পূর্ববর্তী</Text>
            </TouchableOpacity>
            
            <View style={styles.dayIndicator}>
              <Text style={styles.dayNumber}>{selectedDay}</Text>
              <Text style={styles.dayLabel}>দিন</Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.navButton,
                (selectedDay === 41 || selectedDay >= currentDay) &&
                  styles.navButtonDisabled,
              ]}
              onPress={handleNextDay}
              disabled={selectedDay === 41 || selectedDay >= currentDay}>
              <Text style={styles.navButtonText}>পরবর্তী →</Text>
            </TouchableOpacity>
          </View>
          
          {selectedDay === currentDay && (
            <View style={styles.currentDayBadge}>
              <Text style={styles.currentDayText}>আজকের দিন</Text>
            </View>
          )}
        </Card>

        {/* Day Title */}
        <Card variant="elevated" padding="lg" style={styles.titleCard}>
          <View style={styles.titleContainer}>
            <Text style={styles.emoji}>{dayContent.emoji}</Text>
            <Text style={styles.title}>{dayContent.title}</Text>
          </View>
        </Card>

        {/* Introduction */}
        <Card variant="outlined" padding="lg" style={styles.introCard}>
          <Text style={styles.sectionTitle}>ভূমিকা</Text>
          <Text style={styles.introText}>{dayContent.introduction}</Text>
        </Card>

        {/* Tasks */}
        <Card variant="elevated" padding="lg" style={styles.tasksCard}>
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            title="আজকের কাজ"
            showProgress={true}
          />
        </Card>

        {/* Affirmations */}
        <View style={styles.affirmationContainer}>
          <Affirmation
            affirmations={dayContent.affirmations}
            title="আজকের ইতিবাচক বাণী"
          />
        </View>

        {/* Islamic Reminder */}
        {dayContent.islamicReminder && (
          <Card variant="elevated" padding="lg" style={styles.islamicCard}>
            <View style={styles.islamicHeader}>
              <Text style={styles.islamicIcon}>☪️</Text>
              <Text style={styles.islamicTitle}>
                {dayContent.islamicReminder.title}
              </Text>
            </View>
            <Text style={styles.islamicContent}>
              {dayContent.islamicReminder.content}
            </Text>
          </Card>
        )}

        {/* Craving Tips */}
        {dayContent.cravingTips && dayContent.cravingTips.length > 0 && (
          <Card variant="outlined" padding="lg" style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsIcon}>💡</Text>
              <Text style={styles.tipsTitle}>ধূমপানের ইচ্ছা হলে</Text>
            </View>
            <View style={styles.tipsList}>
              {dayContent.cravingTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipBullet}>
                    <Text style={styles.tipBulletText}>•</Text>
                  </View>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Motivational Message */}
        <Card variant="elevated" padding="lg" style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            মাশাআল্লাহ! আপনি দুর্দান্ত কাজ করছেন। আল্লাহর সাহায্যে আপনি এই যাত্রা সফলভাবে সম্পন্ন করবেন। ইনশাআল্লাহ! 💪
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  navigationCard: {
    marginBottom: spacing.md,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.light + '20',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
  },
  dayIndicator: {
    alignItems: 'center',
  },
  dayNumber: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  dayLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  currentDayBadge: {
    marginTop: spacing.sm,
    alignSelf: 'center',
    backgroundColor: colors.secondary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  currentDayText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  titleCard: {
    marginBottom: spacing.md,
  },
  titleContainer: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.xl,
  },
  introCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  introText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.md,
  },
  tasksCard: {
    marginBottom: spacing.md,
  },
  affirmationContainer: {
    marginBottom: spacing.md,
  },
  islamicCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primary.light + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  islamicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  islamicIcon: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  islamicTitle: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  islamicContent: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.md,
    fontStyle: 'italic',
  },
  tipsCard: {
    marginBottom: spacing.md,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tipsIcon: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  tipsTitle: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 20,
    alignItems: 'center',
    marginRight: spacing.xs,
    paddingTop: 2,
  },
  tipBulletText: {
    fontSize: typography.fontSize.lg,
    color: colors.primary.main,
  },
  tipText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.md,
  },
  motivationCard: {
    marginTop: spacing.sm,
  },
  motivationText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.md,
  },
});

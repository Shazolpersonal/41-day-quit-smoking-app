import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Vibration,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HomeScreenProps} from '../types/navigation';
import {useUser} from '../context/UserContext';
import {useProgress} from '../context/ProgressContext';
import {colors, spacing, typography} from '../constants/theme';
import {Header} from '../components/common/Header';
import {DayCounter} from '../components/home/DayCounter';
import {MoneySaved} from '../components/home/MoneySaved';
import {ProgressBar} from '../components/common/ProgressBar';
import {Affirmation} from '../components/daily/Affirmation';
import {QuickActions} from '../components/home/QuickActions';
import {Card} from '../components/common/Card';
import {MilestoneCelebration} from '../components/home/MilestoneCelebration';
import {dailyContent} from '../data/dailyContent';
import {getMilestone, isMilestoneDay} from '../data/milestones';

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {user, loading: userLoading} = useUser();
  const {progress, loading: progressLoading, calculateProgress} = useProgress();
  const [refreshing, setRefreshing] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<any>(null);

  // Calculate progress on mount and when user changes
  useEffect(() => {
    if (user && !progress) {
      calculateProgress();
    }
  }, [user, progress, calculateProgress]);

  // Check for milestone celebration
  useEffect(() => {
    const checkMilestone = async () => {
      if (!progress?.currentDay) return;

      const currentDay = progress.currentDay;
      
      // Check if current day is a milestone
      if (isMilestoneDay(currentDay)) {
        // Check if we've already shown this milestone
        const shownKey = `milestone_shown_${currentDay}`;
        const alreadyShown = await AsyncStorage.getItem(shownKey);
        
        if (!alreadyShown) {
          // Get milestone data
          const milestone = getMilestone(currentDay);
          if (milestone) {
            // Haptic feedback for celebration
            Vibration.vibrate([0, 100, 50, 100]);
            
            // Show milestone modal
            setCurrentMilestone(milestone);
            setShowMilestone(true);
            
            // Mark as shown
            await AsyncStorage.setItem(shownKey, 'true');
          }
        }
      }
    };

    checkMilestone();
  }, [progress?.currentDay]);

  // Handle milestone modal close
  const handleMilestoneClose = () => {
    setShowMilestone(false);
    setCurrentMilestone(null);
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await calculateProgress();
    setRefreshing(false);
  };

  // Handle SOS button press
  const handleSOSPress = () => {
    navigation.navigate('CravingSOS');
  };

  // Handle quick action presses
  const handleJournalPress = () => {
    navigation.navigate('Journal');
  };

  const handleProgressPress = () => {
    navigation.navigate('Progress');
  };

  const handleTipsPress = () => {
    if (progress?.currentDay) {
      navigation.navigate('Daily', {day: progress.currentDay});
    }
  };

  const handleDuaPress = () => {
    navigation.navigate('DuaList');
  };

  // Get today's content
  const getTodayContent = () => {
    if (!progress?.currentDay) return null;
    
    const currentDay = Math.min(progress.currentDay, 41);
    return dailyContent.find(content => content.day === currentDay);
  };

  const todayContent = getTodayContent();

  // Calculate task completion for today
  const getTodayTaskSummary = () => {
    if (!todayContent) return {completed: 0, total: 0};
    
    const completed = todayContent.tasks.filter(task => task.completed).length;
    const total = todayContent.tasks.length;
    
    return {completed, total};
  };

  const taskSummary = getTodayTaskSummary();

  // Loading state
  if (userLoading || progressLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="হোম" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // No user state
  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="হোম" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            কোন ব্যবহারকারী তথ্য পাওয়া যায়নি
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="হোম" />
      
      {/* Milestone Celebration Modal */}
      <MilestoneCelebration
        visible={showMilestone}
        milestone={currentMilestone}
        onClose={handleMilestoneClose}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        }
        showsVerticalScrollIndicator={false}>
        
        {/* Day Counter */}
        {progress && (
          <DayCounter
            currentDay={progress.currentDay}
            totalDays={41}
            smokeFreeTime={progress.smokeFreeTime}
          />
        )}

        {/* 41-Day Journey Progress Bar */}
        {progress && (
          <Card variant="elevated" padding="lg" style={styles.journeyCard}>
            <Text style={styles.journeyTitle}>৪১ দিনের যাত্রা</Text>
            <ProgressBar
              progress={progress.currentDay / 41}
              height={12}
              showPercentage={true}
              animated={true}
              color={colors.primary.main}
            />
            <Text style={styles.journeySubtitle}>
              {progress.currentDay <= 41
                ? `আরও ${41 - progress.currentDay} দিন বাকি`
                : 'সম্পূর্ণ! আলহামদুলিল্লাহ 🎉'}
            </Text>
          </Card>
        )}

        {/* Money Saved */}
        {progress && (
          <MoneySaved
            amount={progress.moneySaved}
            cigarettesNotSmoked={progress.cigarettesNotSmoked}
          />
        )}

        {/* Today's Task Summary */}
        {todayContent && (
          <Card variant="elevated" padding="lg" style={styles.taskSummaryCard}>
            <View style={styles.taskSummaryHeader}>
              <Text style={styles.taskSummaryEmoji}>{todayContent.emoji}</Text>
              <View style={styles.taskSummaryTextContainer}>
                <Text style={styles.taskSummaryTitle}>আজকের কাজ</Text>
                <Text style={styles.taskSummarySubtitle}>
                  {todayContent.title}
                </Text>
              </View>
            </View>
            
            <ProgressBar
              progress={taskSummary.total > 0 ? taskSummary.completed / taskSummary.total : 0}
              height={8}
              showPercentage={false}
              animated={true}
              color={colors.secondary.main}
              style={styles.taskProgressBar}
            />
            
            <Text style={styles.taskSummaryProgress}>
              {taskSummary.completed} / {taskSummary.total} কাজ সম্পূর্ণ
            </Text>
          </Card>
        )}

        {/* Daily Affirmation */}
        {todayContent && (
          <Affirmation
            affirmations={todayContent.affirmations}
            title="আজকের ইতিবাচক বাণী"
          />
        )}

        {/* Quick Actions */}
        <QuickActions
          onSOSPress={handleSOSPress}
          onJournalPress={handleJournalPress}
          onProgressPress={handleProgressPress}
          onTipsPress={handleTipsPress}
          onDuaPress={handleDuaPress}
        />

        {/* Motivational Message */}
        <Card variant="outlined" padding="lg" style={styles.motivationCard}>
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
  journeyCard: {
    marginBottom: spacing.md,
  },
  journeyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  journeySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  taskSummaryCard: {
    marginBottom: spacing.md,
  },
  taskSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  taskSummaryEmoji: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  taskSummaryTextContainer: {
    flex: 1,
  },
  taskSummaryTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  taskSummarySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  taskProgressBar: {
    marginBottom: spacing.sm,
  },
  taskSummaryProgress: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
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

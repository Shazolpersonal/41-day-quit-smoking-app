/**
 * Progress Screen
 * Displays comprehensive progress overview including:
 * - Smoke-free time breakdown
 * - Money saved with detailed breakdown
 * - Cigarettes not smoked count
 * - Visual progress charts
 * - Health improvements timeline
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {ProgressScreenProps} from '../types/navigation';
import {theme} from '../constants/theme';
import {useProgress} from '../context/ProgressContext';
import {useUser} from '../context/UserContext';
import {ProgressOverview} from '../components/progress/ProgressOverview';
import {MoneySavedBreakdown} from '../components/progress/MoneySavedBreakdown';
import {ProgressChart} from '../components/progress/ProgressChart';
import {HealthTimeline} from '../components/progress/HealthTimeline';
import {MilestoneBadges} from '../components/progress/MilestoneBadges';
import {CravingAnalysis} from '../components/progress/CravingAnalysis';
import {progressCalculatorService} from '../services/progressCalculator.service';
import {getAchievedHealthMilestones, getNextHealthMilestone} from '../data/healthTimeline';
import {useJournal} from '../context/JournalContext';

export const ProgressScreen: React.FC<ProgressScreenProps> = () => {
  const {progress, loading, calculateProgress, refreshProgress} = useProgress();
  const {user} = useUser();
  const {entries: journalEntries} = useJournal();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (user && !progress) {
      calculateProgress();
    }
  }, [user, progress]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await calculateProgress();
    await refreshProgress();
    setRefreshing(false);
  };

  if (loading || !progress || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>অগ্রগতি লোড হচ্ছে...</Text>
      </View>
    );
  }

  // Calculate money saved breakdown
  const moneySavedBreakdown = progressCalculatorService.calculateMoneySaved(user);

  // Get health milestones
  const minutesSinceQuit = Math.floor(progress.smokeFreeTime.totalSeconds / 60);
  const achievedHealthMilestones = getAchievedHealthMilestones(minutesSinceQuit);
  const allUpcomingMilestones = [];
  let currentMinutes = minutesSinceQuit;
  
  // Get next 5 upcoming milestones
  for (let i = 0; i < 5; i++) {
    const next = getNextHealthMilestone(currentMinutes);
    if (next) {
      allUpcomingMilestones.push(next);
      currentMinutes = next.timeInMinutes + 1;
    } else {
      break;
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary.main]}
        />
      }>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>আপনার অগ্রগতি</Text>
        <Text style={styles.headerSubtitle}>
          আলহামদুলিল্লাহ! আপনি দিন {progress.currentDay} এ আছেন
        </Text>
      </View>

      {/* Progress Overview */}
      <ProgressOverview
        smokeFreeTime={progress.smokeFreeTime}
        moneySaved={progress.moneySaved}
        cigarettesNotSmoked={progress.cigarettesNotSmoked}
      />

      {/* Money Saved Breakdown */}
      <MoneySavedBreakdown
        total={moneySavedBreakdown.total}
        daily={moneySavedBreakdown.daily}
        weekly={moneySavedBreakdown.weekly}
        monthly={moneySavedBreakdown.monthly}
        yearly={moneySavedBreakdown.yearly}
      />

      {/* Progress Chart */}
      <ProgressChart
        currentDay={progress.currentDay}
        totalDays={41}
        moneySaved={progress.moneySaved}
        cigarettesNotSmoked={progress.cigarettesNotSmoked}
      />

      {/* Health Timeline */}
      <HealthTimeline
        achievedMilestones={achievedHealthMilestones}
        upcomingMilestones={allUpcomingMilestones}
        minutesSinceQuit={minutesSinceQuit}
      />

      {/* Milestone Badges */}
      <MilestoneBadges
        milestones={progress.milestones}
        currentDay={progress.currentDay}
      />

      {/* Craving Analysis */}
      <CravingAnalysis journalEntries={journalEntries} />

      {/* Footer Message */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          মাশাআল্লাহ! আপনার প্রতিটি মুহূর্ত গুরুত্বপূর্ণ। আল্লাহ আপনাকে সুস্থ রাখুন এবং এই পথে অটল রাখুন। আমীন।
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  footer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary.main + '10',
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary.main,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 22,
    textAlign: 'center',
  },
});

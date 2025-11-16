/**
 * ProgressScreen Example
 * Demonstrates the Progress Screen with sample data
 */

import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {ProgressOverview} from '../components/progress/ProgressOverview';
import {MoneySavedBreakdown} from '../components/progress/MoneySavedBreakdown';
import {ProgressChart} from '../components/progress/ProgressChart';
import {HealthTimeline} from '../components/progress/HealthTimeline';
import {MilestoneBadges} from '../components/progress/MilestoneBadges';
import {CravingAnalysis} from '../components/progress/CravingAnalysis';
import {theme} from '../constants/theme';
import {healthTimeline} from '../data/healthTimeline';
import {milestones} from '../data/milestones';

export const ProgressScreenExample: React.FC = () => {
  // Sample data
  const smokeFreeTime = {
    days: 15,
    hours: 8,
    minutes: 32,
    seconds: 45,
    totalSeconds: 1339965,
  };

  const moneySaved = 4500;
  const cigarettesNotSmoked = 300;

  const moneySavedBreakdown = {
    total: 4500,
    daily: 300,
    weekly: 2100,
    monthly: 9000,
    yearly: 109500,
  };

  const currentDay = 15;

  // Get achieved and upcoming milestones
  const minutesSinceQuit = Math.floor(smokeFreeTime.totalSeconds / 60);
  const achievedMilestones = healthTimeline.filter(
    m => m.timeInMinutes <= minutesSinceQuit
  );
  const upcomingMilestones = healthTimeline.filter(
    m => m.timeInMinutes > minutesSinceQuit
  ).slice(0, 5);

  // Sample milestones with achievement status
  const sampleMilestones = milestones.map(m => ({
    id: `milestone_${m.day}`,
    day: m.day,
    title: m.title,
    description: m.description,
    achieved: m.day <= currentDay,
    achievedDate: m.day <= currentDay ? new Date().toISOString() : undefined,
    badge: m.day >= 30 ? 'gold' : m.day >= 14 ? 'silver' : 'bronze',
  })) as any[];

  // Sample journal entries with craving data
  const sampleJournalEntries = [
    {
      id: '1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Had a strong craving after lunch',
      mood: 'anxious' as const,
      triggers: ['after_meal' as const, 'stress' as const],
      cravingIntensity: 7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Felt bored at home',
      mood: 'neutral' as const,
      triggers: ['boredom' as const, 'home' as const],
      cravingIntensity: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Work stress triggered craving',
      mood: 'stressed' as const,
      triggers: ['work' as const, 'stress' as const],
      cravingIntensity: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      
      <ProgressOverview
        smokeFreeTime={smokeFreeTime}
        moneySaved={moneySaved}
        cigarettesNotSmoked={cigarettesNotSmoked}
      />

      <MoneySavedBreakdown
        total={moneySavedBreakdown.total}
        daily={moneySavedBreakdown.daily}
        weekly={moneySavedBreakdown.weekly}
        monthly={moneySavedBreakdown.monthly}
        yearly={moneySavedBreakdown.yearly}
      />

      <ProgressChart
        currentDay={currentDay}
        totalDays={41}
        moneySaved={moneySaved}
        cigarettesNotSmoked={cigarettesNotSmoked}
      />

      <HealthTimeline
        achievedMilestones={achievedMilestones}
        upcomingMilestones={upcomingMilestones}
        minutesSinceQuit={minutesSinceQuit}
      />

      <MilestoneBadges
        milestones={sampleMilestones}
        currentDay={currentDay}
      />

      <CravingAnalysis journalEntries={sampleJournalEntries} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
});

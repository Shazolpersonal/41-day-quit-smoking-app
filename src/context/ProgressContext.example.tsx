/**
 * ProgressContext Usage Examples
 * 
 * This file demonstrates how to use the ProgressContext in your components
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useProgress} from './ProgressContext';

/**
 * Example 1: Display Progress Dashboard
 * Shows smoke-free time, money saved, and cigarettes not smoked
 */
export const ProgressDashboard: React.FC = () => {
  const {progress, loading, error, calculateProgress} = useProgress();

  useEffect(() => {
    // Calculate progress when component mounts
    calculateProgress();
  }, []);

  if (loading) {
    return <Text>লোড হচ্ছে...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!progress) {
    return <Text>কোন অগ্রগতির তথ্য পাওয়া যায়নি</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>আপনার অগ্রগতি</Text>
      
      {/* Smoke-free time */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ধূমপানমুক্ত সময়</Text>
        <Text style={styles.cardValue}>
          {progress.smokeFreeTime.days} দিন {progress.smokeFreeTime.hours} ঘণ্টা
        </Text>
        <Text style={styles.cardSubValue}>
          {progress.smokeFreeTime.minutes} মিনিট {progress.smokeFreeTime.seconds} সেকেন্ড
        </Text>
      </View>

      {/* Money saved */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>সঞ্চিত অর্থ</Text>
        <Text style={styles.cardValue}>৳{progress.moneySaved}</Text>
      </View>

      {/* Cigarettes not smoked */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>সিগারেট খাওয়া হয়নি</Text>
        <Text style={styles.cardValue}>{progress.cigarettesNotSmoked} টি</Text>
      </View>

      {/* Current day */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>বর্তমান দিন</Text>
        <Text style={styles.cardValue}>{progress.currentDay} / 41</Text>
      </View>
    </View>
  );
};

/**
 * Example 2: Display Milestones
 * Shows achieved and upcoming milestones
 */
export const MilestonesList: React.FC = () => {
  const {
    progress,
    getNextMilestone,
    getAchievedMilestones,
  } = useProgress();

  if (!progress) {
    return <Text>কোন মাইলফলক পাওয়া যায়নি</Text>;
  }

  const nextMilestone = getNextMilestone();
  const achievedMilestones = getAchievedMilestones();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>মাইলফলক</Text>

      {/* Next milestone */}
      {nextMilestone && (
        <View style={[styles.card, styles.nextMilestone]}>
          <Text style={styles.cardTitle}>পরবর্তী মাইলফলক</Text>
          <Text style={styles.milestoneDay}>দিন {nextMilestone.day}</Text>
          <Text style={styles.milestoneTitle}>{nextMilestone.title}</Text>
          <Text style={styles.milestoneDescription}>
            {nextMilestone.description}
          </Text>
          <Text style={styles.badge}>🏆 {nextMilestone.badge}</Text>
        </View>
      )}

      {/* Achieved milestones */}
      <Text style={styles.sectionTitle}>
        অর্জিত মাইলফলক ({achievedMilestones.length})
      </Text>
      {achievedMilestones.map(milestone => (
        <View key={milestone.id} style={[styles.card, styles.achievedMilestone]}>
          <Text style={styles.milestoneDay}>দিন {milestone.day}</Text>
          <Text style={styles.milestoneTitle}>{milestone.title}</Text>
          <Text style={styles.milestoneDescription}>
            {milestone.description}
          </Text>
          {milestone.achievedDate && (
            <Text style={styles.achievedDate}>
              অর্জিত: {new Date(milestone.achievedDate).toLocaleDateString('bn-BD')}
            </Text>
          )}
          <Text style={styles.badge}>✅ {milestone.badge}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

/**
 * Example 3: Display Health Benefits
 * Shows achieved and upcoming health benefits
 */
export const HealthBenefitsList: React.FC = () => {
  const {
    progress,
    getNextHealthBenefit,
    getAchievedHealthBenefits,
  } = useProgress();

  if (!progress) {
    return <Text>কোন স্বাস্থ্য উপকার পাওয়া যায়নি</Text>;
  }

  const nextBenefit = getNextHealthBenefit();
  const achievedBenefits = getAchievedHealthBenefits();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>স্বাস্থ্য উপকার</Text>

      {/* Next health benefit */}
      {nextBenefit && (
        <View style={[styles.card, styles.nextBenefit]}>
          <Text style={styles.cardTitle}>পরবর্তী স্বাস্থ্য উপকার</Text>
          <Text style={styles.benefitIcon}>{nextBenefit.icon}</Text>
          <Text style={styles.benefitTimeframe}>{nextBenefit.timeframe}</Text>
          <Text style={styles.benefitTitle}>{nextBenefit.title}</Text>
          <Text style={styles.benefitDescription}>
            {nextBenefit.description}
          </Text>
        </View>
      )}

      {/* Achieved health benefits */}
      <Text style={styles.sectionTitle}>
        অর্জিত স্বাস্থ্য উপকার ({achievedBenefits.length})
      </Text>
      {achievedBenefits.map(benefit => (
        <View key={benefit.id} style={[styles.card, styles.achievedBenefit]}>
          <Text style={styles.benefitIcon}>{benefit.icon}</Text>
          <Text style={styles.benefitTimeframe}>{benefit.timeframe}</Text>
          <Text style={styles.benefitTitle}>{benefit.title}</Text>
          <Text style={styles.benefitDescription}>
            {benefit.description}
          </Text>
          {benefit.achievedDate && (
            <Text style={styles.achievedDate}>
              অর্জিত: {new Date(benefit.achievedDate).toLocaleDateString('bn-BD')}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

/**
 * Example 4: Real-time Progress Counter
 * Updates every second to show live smoke-free time
 */
export const LiveProgressCounter: React.FC = () => {
  const {calculateProgress, progress} = useProgress();

  useEffect(() => {
    // Update progress every second
    const interval = setInterval(() => {
      calculateProgress();
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateProgress]);

  if (!progress) {
    return <Text>লোড হচ্ছে...</Text>;
  }

  return (
    <View style={styles.liveCounter}>
      <Text style={styles.liveTitle}>ধূমপানমুক্ত সময়</Text>
      <View style={styles.timeDisplay}>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{progress.smokeFreeTime.days}</Text>
          <Text style={styles.timeLabel}>দিন</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{progress.smokeFreeTime.hours}</Text>
          <Text style={styles.timeLabel}>ঘণ্টা</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{progress.smokeFreeTime.minutes}</Text>
          <Text style={styles.timeLabel}>মিনিট</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{progress.smokeFreeTime.seconds}</Text>
          <Text style={styles.timeLabel}>সেকেন্ড</Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Example 5: Progress Statistics Summary
 * Shows a summary of all progress metrics
 */
export const ProgressSummary: React.FC = () => {
  const {progress, getAchievedMilestones, getAchievedHealthBenefits} = useProgress();

  if (!progress) {
    return <Text>কোন তথ্য পাওয়া যায়নি</Text>;
  }

  const achievedMilestones = getAchievedMilestones();
  const achievedBenefits = getAchievedHealthBenefits();

  return (
    <View style={styles.summary}>
      <Text style={styles.summaryTitle}>সারসংক্ষেপ</Text>
      
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{progress.currentDay}</Text>
          <Text style={styles.summaryLabel}>দিন সম্পূর্ণ</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>৳{progress.moneySaved}</Text>
          <Text style={styles.summaryLabel}>সঞ্চিত অর্থ</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{progress.cigarettesNotSmoked}</Text>
          <Text style={styles.summaryLabel}>সিগারেট বাঁচানো</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{achievedMilestones.length}</Text>
          <Text style={styles.summaryLabel}>মাইলফলক অর্জিত</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{achievedBenefits.length}</Text>
          <Text style={styles.summaryLabel}>স্বাস্থ্য উপকার</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cardSubValue: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  nextMilestone: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  achievedMilestone: {
    backgroundColor: '#E8F5E9',
  },
  milestoneDay: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  achievedDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  badge: {
    fontSize: 16,
    marginTop: 8,
  },
  nextBenefit: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
    borderWidth: 2,
  },
  achievedBenefit: {
    backgroundColor: '#E8F5E9',
  },
  benefitIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  benefitTimeframe: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  liveCounter: {
    padding: 24,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    alignItems: 'center',
  },
  liveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 60,
  },
  timeValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 8,
  },
  summary: {
    padding: 16,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

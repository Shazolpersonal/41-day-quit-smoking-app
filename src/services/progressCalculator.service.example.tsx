/**
 * Example usage of ProgressCalculator Service
 * This file demonstrates how to use the progressCalculatorService in components
 */

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {progressCalculatorService} from './progressCalculator.service';
import {User} from '../types';

const ProgressCalculatorExample = () => {
  const [smokeFreeTime, setSmokeFreeTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [moneySaved, setMoneySaved] = useState(0);
  const [cigarettesNotSmoked, setCigarettesNotSmoked] = useState(0);
  const [nextMilestone, setNextMilestone] = useState<any>(null);

  // Example user data
  const user: User = {
    id: 'user_123',
    quitDate: '2024-01-01T00:00:00.000Z',
    cigarettesPerDay: 20,
    pricePerPack: 350,
    cigarettesPerPack: 20,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      // Calculate smoke-free time
      const time = progressCalculatorService.calculateSmokeFreeTime(user.quitDate);
      setSmokeFreeTime(time);

      // Calculate money saved
      const money = progressCalculatorService.calculateMoneySaved(user);
      setMoneySaved(money.total);

      // Calculate cigarettes not smoked
      const cigarettes = progressCalculatorService.calculateCigarettesNotSmoked(user);
      setCigarettesNotSmoked(cigarettes);

      // Get next milestone
      const next = progressCalculatorService.getNextMilestone(user.quitDate);
      setNextMilestone(next);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Progress Calculator Example</Text>

      {/* Smoke-Free Time */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ধূমপানমুক্ত সময়</Text>
        <Text style={styles.value}>
          {smokeFreeTime.days} দিন {smokeFreeTime.hours} ঘণ্টা{' '}
          {smokeFreeTime.minutes} মিনিট {smokeFreeTime.seconds} সেকেন্ড
        </Text>
      </View>

      {/* Money Saved */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>সঞ্চিত অর্থ</Text>
        <Text style={styles.value}>৳{moneySaved.toLocaleString('bn-BD')}</Text>
      </View>

      {/* Cigarettes Not Smoked */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>এড়ানো সিগারেট</Text>
        <Text style={styles.value}>{cigarettesNotSmoked} টি</Text>
      </View>

      {/* Next Milestone */}
      {nextMilestone && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>পরবর্তী মাইলফলক</Text>
          <Text style={styles.milestoneTitle}>
            {nextMilestone.milestone.icon} {nextMilestone.milestone.title}
          </Text>
          <Text style={styles.milestoneDescription}>
            {nextMilestone.milestone.description}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${nextMilestone.progress}%`},
              ]}
            />
          </View>
          <Text style={styles.progressText}>{nextMilestone.progress}%</Text>
          <Text style={styles.timeRemaining}>
            বাকি: {nextMilestone.timeRemaining.days} দিন{' '}
            {nextMilestone.timeRemaining.hours} ঘণ্টা{' '}
            {nextMilestone.timeRemaining.minutes} মিনিট
          </Text>
        </View>
      )}

      {/* Example: Get Health Benefits */}
      <ExampleHealthBenefits quitDate={user.quitDate} />

      {/* Example: Get Milestones */}
      <ExampleMilestones quitDate={user.quitDate} />

      {/* Example: Money Saved Breakdown */}
      <ExampleMoneySavedBreakdown user={user} />
    </ScrollView>
  );
};

// Example: Health Benefits Component
const ExampleHealthBenefits = ({quitDate}: {quitDate: string}) => {
  const [benefits, setBenefits] = useState<any>(null);

  useEffect(() => {
    const healthBenefits = progressCalculatorService.getHealthBenefits(quitDate);
    setBenefits(healthBenefits);
  }, [quitDate]);

  if (!benefits) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>স্বাস্থ্য উপকার</Text>
      <Text style={styles.subtitle}>
        অর্জিত: {benefits.achieved.length} / {benefits.total}
      </Text>

      <Text style={styles.subheading}>অর্জিত উপকার:</Text>
      {benefits.achieved.slice(0, 3).map((benefit: any) => (
        <View key={benefit.id} style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>{benefit.icon}</Text>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitTimeframe}>{benefit.timeframe}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.subheading}>আসন্ন উপকার:</Text>
      {benefits.upcoming.slice(0, 3).map((benefit: any) => (
        <View key={benefit.id} style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>{benefit.icon}</Text>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitTimeframe}>{benefit.timeframe}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Example: Milestones Component
const ExampleMilestones = ({quitDate}: {quitDate: string}) => {
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    const allMilestones = progressCalculatorService.getMilestones(quitDate);
    setMilestones(allMilestones);
  }, [quitDate]);

  const achievedCount = milestones.filter(m => m.achieved).length;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>মাইলফলক</Text>
      <Text style={styles.subtitle}>
        অর্জিত: {achievedCount} / {milestones.length}
      </Text>

      {milestones.map(milestone => (
        <View
          key={milestone.id}
          style={[
            styles.milestoneItem,
            milestone.achieved && styles.milestoneAchieved,
          ]}>
          <Text style={styles.milestoneDay}>দিন {milestone.day}</Text>
          <Text style={styles.milestoneItemTitle}>{milestone.title}</Text>
          <Text style={styles.milestoneBadge}>{milestone.badge}</Text>
          {milestone.achieved && milestone.achievedDate && (
            <Text style={styles.achievedDate}>
              অর্জিত: {new Date(milestone.achievedDate).toLocaleDateString('bn-BD')}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

// Example: Money Saved Breakdown Component
const ExampleMoneySavedBreakdown = ({user}: {user: User}) => {
  const [breakdown, setBreakdown] = useState<any>(null);

  useEffect(() => {
    const money = progressCalculatorService.calculateMoneySaved(user);
    setBreakdown(money);
  }, [user]);

  if (!breakdown) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>অর্থ সঞ্চয় বিস্তারিত</Text>

      <View style={styles.breakdownItem}>
        <Text style={styles.breakdownLabel}>মোট সঞ্চয়:</Text>
        <Text style={styles.breakdownValue}>
          ৳{breakdown.total.toLocaleString('bn-BD')}
        </Text>
      </View>

      <View style={styles.breakdownItem}>
        <Text style={styles.breakdownLabel}>দৈনিক খরচ ছিল:</Text>
        <Text style={styles.breakdownValue}>
          ৳{breakdown.daily.toLocaleString('bn-BD')}
        </Text>
      </View>

      <View style={styles.breakdownItem}>
        <Text style={styles.breakdownLabel}>সাপ্তাহিক খরচ ছিল:</Text>
        <Text style={styles.breakdownValue}>
          ৳{breakdown.weekly.toLocaleString('bn-BD')}
        </Text>
      </View>

      <View style={styles.breakdownItem}>
        <Text style={styles.breakdownLabel}>মাসিক খরচ ছিল:</Text>
        <Text style={styles.breakdownValue}>
          ৳{breakdown.monthly.toLocaleString('bn-BD')}
        </Text>
      </View>

      <View style={styles.breakdownItem}>
        <Text style={styles.breakdownLabel}>বার্ষিক খরচ ছিল:</Text>
        <Text style={styles.breakdownValue}>
          ৳{breakdown.yearly.toLocaleString('bn-BD')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#34495e',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 4,
  },
  timeRemaining: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  benefitTimeframe: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  milestoneItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    marginBottom: 8,
  },
  milestoneAchieved: {
    backgroundColor: '#d5f4e6',
  },
  milestoneDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  milestoneItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  milestoneBadge: {
    fontSize: 12,
    color: '#7f8c8d',
    textTransform: 'uppercase',
  },
  achievedDate: {
    fontSize: 11,
    color: '#27ae60',
    marginTop: 4,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
  },
});

export default ProgressCalculatorExample;

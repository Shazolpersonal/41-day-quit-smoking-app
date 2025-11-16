/**
 * Prayer Time Widget Component
 * Displays today's prayer times with next prayer highlighted
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {colors, spacing, typography} from '../../constants/theme';
import {Card} from '../common/Card';
import {prayerTimeService, PrayerTimes, NextPrayer} from '../../services/prayerTime.service';

interface PrayerTimeWidgetProps {
  onPress?: () => void;
  compact?: boolean;
}

export const PrayerTimeWidget: React.FC<PrayerTimeWidgetProps> = ({
  onPress,
  compact = false,
}) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    loadPrayerTimes();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      const times = await prayerTimeService.getPrayerTimesWithLocation();
      setPrayerTimes(times);
      
      const next = prayerTimeService.getNextPrayerTime(times);
      setNextPrayer(next);
    } catch (error) {
      console.error('Error loading prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeRemaining = () => {
    if (!nextPrayer) return;
    
    const {hours, minutes, seconds} = nextPrayer.timeRemaining;
    const totalMinutes = hours * 60 + minutes;
    
    if (totalMinutes < 60) {
      setTimeRemaining(`${minutes}মি ${seconds}সে`);
    } else {
      setTimeRemaining(`${hours}ঘ ${minutes}মি`);
    }
  };

  const getPrayerIcon = (prayerName: string): string => {
    const icons: Record<string, string> = {
      Fajr: '🌅',
      Sunrise: '☀️',
      Dhuhr: '🌞',
      Asr: '🌤️',
      Maghrib: '🌆',
      Isha: '🌙',
    };
    return icons[prayerName] || '🕌';
  };

  if (loading) {
    return (
      <Card style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary.main} />
          <Text style={styles.loadingText}>নামাজের সময় লোড হচ্ছে...</Text>
        </View>
      </Card>
    );
  }

  if (!prayerTimes || !nextPrayer) {
    return null;
  }

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card style={styles.compactContainer}>
          <View style={styles.compactHeader}>
            <Text style={styles.compactIcon}>🕌</Text>
            <View style={styles.compactInfo}>
              <Text style={styles.compactTitle}>পরবর্তী নামাজ</Text>
              <Text style={styles.compactPrayerName}>{nextPrayer.nameBangla}</Text>
            </View>
            <View style={styles.compactTime}>
              <Text style={styles.compactTimeText}>{nextPrayer.time}</Text>
              <Text style={styles.compactRemainingText}>{timeRemaining}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  const prayers = [
    {name: 'Fajr', nameBangla: 'ফজর', time: prayerTimes.fajr},
    {name: 'Dhuhr', nameBangla: 'যোহর', time: prayerTimes.dhuhr},
    {name: 'Asr', nameBangla: 'আসর', time: prayerTimes.asr},
    {name: 'Maghrib', nameBangla: 'মাগরিব', time: prayerTimes.maghrib},
    {name: 'Isha', nameBangla: 'এশা', time: prayerTimes.isha},
  ];

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>🕌</Text>
          <Text style={styles.headerTitle}>আজকের নামাজের সময়</Text>
        </View>
        {onPress && (
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.viewAllText}>সব দেখুন →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Next Prayer Highlight */}
      <View style={styles.nextPrayerCard}>
        <View style={styles.nextPrayerHeader}>
          <Text style={styles.nextPrayerLabel}>পরবর্তী নামাজ</Text>
          <Text style={styles.nextPrayerIcon}>{getPrayerIcon(nextPrayer.name)}</Text>
        </View>
        <Text style={styles.nextPrayerName}>{nextPrayer.nameBangla}</Text>
        <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
        <View style={styles.timeRemainingContainer}>
          <Text style={styles.timeRemainingLabel}>বাকি সময়:</Text>
          <Text style={styles.timeRemainingText}>{timeRemaining}</Text>
        </View>
      </View>

      {/* All Prayer Times */}
      <View style={styles.prayerList}>
        {prayers.map((prayer) => {
          const isNext = prayer.name === nextPrayer.name;
          return (
            <View
              key={prayer.name}
              style={[styles.prayerItem, isNext && styles.prayerItemNext]}>
              <View style={styles.prayerLeft}>
                <Text style={styles.prayerIcon}>{getPrayerIcon(prayer.name)}</Text>
                <Text style={[styles.prayerName, isNext && styles.prayerNameNext]}>
                  {prayer.nameBangla}
                </Text>
              </View>
              <Text style={[styles.prayerTime, isNext && styles.prayerTimeNext]}>
                {prayer.time}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
  },
  nextPrayerCard: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  nextPrayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  nextPrayerLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.white,
    opacity: 0.9,
  },
  nextPrayerIcon: {
    fontSize: 24,
  },
  nextPrayerName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },
  nextPrayerTime: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    marginBottom: spacing.sm,
  },
  timeRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeRemainingLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.white,
    opacity: 0.9,
    marginRight: spacing.xs,
  },
  timeRemainingText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  prayerList: {
    gap: spacing.xs,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.background.default,
  },
  prayerItemNext: {
    backgroundColor: colors.primary.light + '20',
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  prayerName: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  prayerNameNext: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
  },
  prayerTime: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  prayerTimeNext: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  compactContainer: {
    padding: spacing.md,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactIcon: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  compactPrayerName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  compactTime: {
    alignItems: 'flex-end',
  },
  compactTimeText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing.xs / 2,
  },
  compactRemainingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
});

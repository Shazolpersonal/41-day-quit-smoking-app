/**
 * Prayer Times Screen
 * Displays detailed prayer times with additional information
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, spacing, typography} from '../constants/theme';
import {Card} from '../components/common/Card';
import {prayerTimeService, PrayerTimes, NextPrayer} from '../services/prayerTime.service';

const PrayerTimesScreen: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    loadPrayerTimes();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadPrayerTimes = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const times = await prayerTimeService.getPrayerTimesWithLocation();
      setPrayerTimes(times);

      const next = prayerTimeService.getNextPrayerTime(times);
      setNextPrayer(next);
    } catch (error) {
      console.error('Error loading prayer times:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateTimeRemaining = () => {
    if (!nextPrayer) return;

    const {hours, minutes, seconds} = nextPrayer.timeRemaining;
    setTimeRemaining(`${hours}ঘ ${minutes}মি ${seconds}সে`);
  };

  const onRefresh = () => {
    loadPrayerTimes(true);
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

  const getPrayerDescription = (prayerName: string): string => {
    const descriptions: Record<string, string> = {
      Fajr: 'ভোরের নামাজ - সূর্যোদয়ের আগে',
      Sunrise: 'সূর্যোদয় - নামাজের নিষিদ্ধ সময়',
      Dhuhr: 'দুপুরের নামাজ - সূর্য ঢলে যাওয়ার পর',
      Asr: 'বিকেলের নামাজ - ছায়া দ্বিগুণ হলে',
      Maghrib: 'সন্ধ্যার নামাজ - সূর্যাস্তের পর',
      Isha: 'রাতের নামাজ - সন্ধ্যার লালিমা শেষ হলে',
    };
    return descriptions[prayerName] || '';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>নামাজের সময় লোড হচ্ছে...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!prayerTimes || !nextPrayer) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>নামাজের সময় লোড করতে ব্যর্থ</Text>
          <TouchableOpacity onPress={() => loadPrayerTimes()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>পুনরায় চেষ্টা করুন</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const prayers = [
    {name: 'Fajr', nameBangla: 'ফজর', time: prayerTimes.fajr},
    {name: 'Sunrise', nameBangla: 'সূর্যোদয়', time: prayerTimes.sunrise},
    {name: 'Dhuhr', nameBangla: 'যোহর', time: prayerTimes.dhuhr},
    {name: 'Asr', nameBangla: 'আসর', time: prayerTimes.asr},
    {name: 'Maghrib', nameBangla: 'মাগরিব', time: prayerTimes.maghrib},
    {name: 'Isha', nameBangla: 'এশা', time: prayerTimes.isha},
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🕌</Text>
          <Text style={styles.headerTitle}>নামাজের সময়সূচী</Text>
          <Text style={styles.headerSubtitle}>
            {new Date().toLocaleDateString('bn-BD', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Next Prayer Card */}
        <Card style={styles.nextPrayerCard}>
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
        </Card>

        {/* All Prayer Times */}
        <Card style={styles.prayerListCard}>
          <Text style={styles.sectionTitle}>আজকের সকল নামাজ</Text>
          {prayers.map((prayer, index) => {
            const isNext = prayer.name === nextPrayer.name;
            return (
              <View key={prayer.name}>
                <View
                  style={[
                    styles.prayerItem,
                    isNext && styles.prayerItemNext,
                  ]}>
                  <View style={styles.prayerLeft}>
                    <Text style={styles.prayerIcon}>{getPrayerIcon(prayer.name)}</Text>
                    <View style={styles.prayerInfo}>
                      <Text
                        style={[
                          styles.prayerName,
                          isNext && styles.prayerNameNext,
                        ]}>
                        {prayer.nameBangla}
                      </Text>
                      <Text style={styles.prayerDescription}>
                        {getPrayerDescription(prayer.name)}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.prayerTime,
                      isNext && styles.prayerTimeNext,
                    ]}>
                    {prayer.time}
                  </Text>
                </View>
                {index < prayers.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </Card>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>📍 অবস্থান</Text>
          <Text style={styles.infoText}>
            নামাজের সময় আপনার বর্তমান অবস্থানের উপর ভিত্তি করে নির্ধারিত হয়েছে।
            ঢাকা, বাংলাদেশের জন্য ইসলামিক ফাউন্ডেশন পদ্ধতি ব্যবহার করা হয়েছে।
          </Text>
        </Card>

        {/* Reminder Card */}
        <Card style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>💡 মনে রাখুন</Text>
          <Text style={styles.reminderText}>
            নামাজ সময়মতো আদায় করা আপনার ধূমপান ত্যাগের যাত্রায় আধ্যাত্মিক শক্তি
            যোগাবে। প্রতিটি নামাজ আপনাকে আল্লাহর কাছাকাছি নিয়ে যাবে এবং মানসিক
            প্রশান্তি দেবে।
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
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  nextPrayerCard: {
    backgroundColor: colors.primary.main,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  nextPrayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  nextPrayerLabel: {
    fontSize: typography.fontSize.md,
    color: colors.neutral.white,
    opacity: 0.9,
  },
  nextPrayerIcon: {
    fontSize: 32,
  },
  nextPrayerName: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },
  nextPrayerTime: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    marginBottom: spacing.md,
  },
  timeRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeRemainingLabel: {
    fontSize: typography.fontSize.md,
    color: colors.neutral.white,
    opacity: 0.9,
    marginRight: spacing.sm,
  },
  timeRemainingText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  prayerListCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  prayerItemNext: {
    backgroundColor: colors.primary.light + '10',
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prayerIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  prayerNameNext: {
    color: colors.primary.main,
  },
  prayerDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  prayerTime: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  prayerTimeNext: {
    color: colors.primary.main,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
  },
  infoCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.accent.blue + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.blue,
  },
  infoTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.blue,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
  reminderCard: {
    padding: spacing.md,
    backgroundColor: colors.accent.teal + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.teal,
  },
  reminderTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.teal,
    marginBottom: spacing.xs,
  },
  reminderText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
});

export default PrayerTimesScreen;

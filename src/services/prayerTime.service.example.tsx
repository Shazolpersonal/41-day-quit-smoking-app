import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { prayerTimeService, PrayerTimes, NextPrayer } from './prayerTime.service';

/**
 * Example component demonstrating PrayerTimeService usage
 * This shows how to integrate prayer time functionality in your app
 */
const PrayerTimeServiceExample: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load prayer times on component mount
    loadPrayerTimes();

    // Update next prayer every minute
    const interval = setInterval(() => {
      if (prayerTimes) {
        const next = prayerTimeService.getNextPrayerTime(prayerTimes);
        setNextPrayer(next);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayerTimes]);

  /**
   * Load prayer times using default location (Dhaka)
   */
  const loadPrayerTimes = () => {
    const times = prayerTimeService.getPrayerTimes();
    setPrayerTimes(times);

    const next = prayerTimeService.getNextPrayerTime(times);
    setNextPrayer(next);
  };

  /**
   * Request location permission and load prayer times
   */
  const handleRequestLocationPermission = async () => {
    setLoading(true);
    const granted = await prayerTimeService.requestLocationPermission();
    setHasLocationPermission(granted);

    if (granted) {
      Alert.alert('সফল', 'অবস্থান অনুমতি দেওয়া হয়েছে');
      await loadPrayerTimesWithLocation();
    } else {
      Alert.alert('ব্যর্থ', 'অবস্থান অনুমতি প্রত্যাখ্যান করা হয়েছে');
    }
    setLoading(false);
  };

  /**
   * Load prayer times using device location
   */
  const loadPrayerTimesWithLocation = async () => {
    setLoading(true);
    try {
      const times = await prayerTimeService.getPrayerTimesWithLocation();
      setPrayerTimes(times);

      const next = prayerTimeService.getNextPrayerTime(times);
      setNextPrayer(next);

      Alert.alert('সফল', 'আপনার অবস্থানের জন্য নামাজের সময় লোড করা হয়েছে');
    } catch (error) {
      Alert.alert('ত্রুটি', 'নামাজের সময় লোড করতে ব্যর্থ');
    }
    setLoading(false);
  };

  /**
   * Get next prayer using device location
   */
  const handleGetNextPrayerWithLocation = async () => {
    setLoading(true);
    try {
      const next = await prayerTimeService.getNextPrayerWithLocation();
      setNextPrayer(next);

      if (next) {
        Alert.alert(
          'পরবর্তী নামাজ',
          `${next.nameBangla} (${next.name})\nসময়: ${next.time}\nবাকি: ${next.timeRemaining.hours} ঘন্টা ${next.timeRemaining.minutes} মিনিট`,
        );
      }
    } catch (error) {
      Alert.alert('ত্রুটি', 'পরবর্তী নামাজ লোড করতে ব্যর্থ');
    }
    setLoading(false);
  };

  /**
   * Load prayer times for a specific date
   */
  const handleLoadSpecificDate = () => {
    // Example: Load prayer times for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const times = prayerTimeService.getPrayerTimes(tomorrow);
    setPrayerTimes(times);

    Alert.alert('সফল', 'আগামীকালের নামাজের সময় লোড করা হয়েছে');
  };

  /**
   * Format time remaining
   */
  const formatTimeRemaining = (timeRemaining: {
    hours: number;
    minutes: number;
    seconds: number;
  }): string => {
    if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours} ঘন্টা ${timeRemaining.minutes} মিনিট`;
    }
    return `${timeRemaining.minutes} মিনিট ${timeRemaining.seconds} সেকেন্ড`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>PrayerTimeService Example</Text>

      {/* Next Prayer Section */}
      {nextPrayer && (
        <View style={styles.nextPrayerCard}>
          <Text style={styles.nextPrayerLabel}>পরবর্তী নামাজ</Text>
          <Text style={styles.nextPrayerName}>
            {nextPrayer.nameBangla} ({nextPrayer.name})
          </Text>
          <Text style={styles.nextPrayerArabic}>{nextPrayer.nameArabic}</Text>
          <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
          <Text style={styles.nextPrayerRemaining}>
            বাকি: {formatTimeRemaining(nextPrayer.timeRemaining)}
          </Text>
        </View>
      )}

      {/* Prayer Times Section */}
      {prayerTimes && (
        <View style={styles.prayerTimesCard}>
          <Text style={styles.sectionTitle}>আজকের নামাজের সময়</Text>
          <View style={styles.prayerTimeRow}>
            <Text style={styles.prayerName}>ফজর (Fajr)</Text>
            <Text style={styles.prayerTime}>{prayerTimes.fajr}</Text>
          </View>
          <View style={styles.prayerTimeRow}>
            <Text style={styles.prayerName}>সূর্যোদয় (Sunrise)</Text>
            <Text style={styles.prayerTime}>{prayerTimes.sunrise}</Text>
          </View>
          <View style={styles.prayerTimeRow}>
            <Text style={styles.prayerName}>যোহর (Dhuhr)</Text>
            <Text style={styles.prayerTime}>{prayerTimes.dhuhr}</Text>
          </View>
          <View style={styles.prayerTimeRow}>
            <Text style={styles.prayerName}>আসর (Asr)</Text>
            <Text style={styles.prayerTime}>{prayerTimes.asr}</Text>
          </View>
          <View style={styles.prayerTimeRow}>
            <Text style={styles.prayerName}>মাগরিব (Maghrib)</Text>
            <Text style={styles.prayerTime}>{prayerTimes.maghrib}</Text>
          </View>
          <View style={styles.prayerTimeRow}>
            <Text style={styles.prayerName}>এশা (Isha)</Text>
            <Text style={styles.prayerTime}>{prayerTimes.isha}</Text>
          </View>
        </View>
      )}

      {/* Actions Section */}
      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>অ্যাকশন</Text>

        <Button
          title="ডিফল্ট অবস্থানের সময় লোড করুন (ঢাকা)"
          onPress={loadPrayerTimes}
          disabled={loading}
        />

        <View style={styles.buttonSpacing} />

        <Button
          title="অবস্থান অনুমতি চান"
          onPress={handleRequestLocationPermission}
          disabled={loading || hasLocationPermission}
        />

        <View style={styles.buttonSpacing} />

        <Button
          title="আপনার অবস্থানের সময় লোড করুন"
          onPress={loadPrayerTimesWithLocation}
          disabled={loading}
        />

        <View style={styles.buttonSpacing} />

        <Button
          title="পরবর্তী নামাজ দেখুন (অবস্থান সহ)"
          onPress={handleGetNextPrayerWithLocation}
          disabled={loading}
        />

        <View style={styles.buttonSpacing} />

        <Button
          title="আগামীকালের সময় লোড করুন"
          onPress={handleLoadSpecificDate}
          disabled={loading}
        />
      </View>

      {/* Status Section */}
      <View style={styles.statusCard}>
        <Text style={styles.sectionTitle}>স্ট্যাটাস</Text>
        <Text style={styles.statusText}>
          অবস্থান অনুমতি: {hasLocationPermission ? '✅ দেওয়া হয়েছে' : '❌ দেওয়া হয়নি'}
        </Text>
        <Text style={styles.statusText}>
          লোডিং: {loading ? '⏳ হ্যাঁ' : '✅ না'}
        </Text>
        {prayerTimes && (
          <Text style={styles.statusText}>
            তারিখ: {new Date(prayerTimes.date).toLocaleDateString('bn-BD')}
          </Text>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>তথ্য</Text>
        <Text style={styles.infoText}>
          • নামাজের সময় ইসলামিক ফাউন্ডেশন বাংলাদেশের পদ্ধতি অনুযায়ী গণনা করা হয়
        </Text>
        <Text style={styles.infoText}>
          • ফজর কোণ: ১৮° (দিগন্তের নিচে)
        </Text>
        <Text style={styles.infoText}>
          • এশা কোণ: ১৭° (দিগন্তের নিচে)
        </Text>
        <Text style={styles.infoText}>
          • আসর পদ্ধতি: স্ট্যান্ডার্ড (শাফি)
        </Text>
        <Text style={styles.infoText}>
          • ডিফল্ট অবস্থান: ঢাকা (23.8103°N, 90.4125°E)
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2e7d32',
  },
  nextPrayerCard: {
    backgroundColor: '#2e7d32',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  nextPrayerLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  nextPrayerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  nextPrayerArabic: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  nextPrayerTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  nextPrayerRemaining: {
    fontSize: 16,
    color: '#fff',
  },
  prayerTimesCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2e7d32',
  },
  prayerTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  prayerName: {
    fontSize: 16,
    color: '#333',
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  actionsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonSpacing: {
    height: 10,
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    lineHeight: 20,
  },
});

export default PrayerTimeServiceExample;

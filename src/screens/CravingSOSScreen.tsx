import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import {CravingSOSScreenProps} from '../types/navigation';
import {colors, spacing, typography, borderRadius, shadows} from '../constants/theme';
import {CopingStrategies} from '../components/craving/CopingStrategies';
import {BreathingExercise} from '../components/craving/BreathingExercise';
import {EmergencyContacts} from '../components/craving/EmergencyContacts';
import {CopingStrategyType, CravingLog} from '../types';
import {storageService} from '../services/storage.service';
import {getRandomDua, getRandomDhikr} from '../data/islamicContent';

export const CravingSOSScreen: React.FC<CravingSOSScreenProps> = ({navigation}) => {
  const [cravingStartTime] = useState<Date>(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showBreathing, setShowBreathing] = useState<boolean>(false);
  const [showDua, setShowDua] = useState<boolean>(false);
  const [showDhikr, setShowDhikr] = useState<boolean>(false);
  const [showContacts, setShowContacts] = useState<boolean>(false);
  const [intensity, setIntensity] = useState<number>(5);
  const [logSaved, setLogSaved] = useState<boolean>(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Get random dua and dhikr
  const dua = getRandomDua();
  const dhikr = getRandomDhikr();

  // Start timer on mount
  useEffect(() => {
    timerInterval.current = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - cravingStartTime.getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [cravingStartTime]);

  // Pulse animation for encouragement
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  // Format elapsed time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle strategy selection
  const handleStrategySelect = (strategy: CopingStrategyType) => {
    switch (strategy) {
      case 'breathing':
        setShowBreathing(true);
        break;
      case 'dua':
        setShowDua(true);
        break;
      case 'dhikr':
        setShowDhikr(true);
        break;
      case 'call':
        setShowContacts(true);
        break;
      case 'water':
        Alert.alert(
          '💧 পানি পান করুন',
          'এক গ্লাস ঠান্ডা পানি ধীরে ধীরে পান করুন। এটি আপনার মুখ ব্যস্ত রাখবে এবং আকাঙ্ক্ষা কমাতে সাহায্য করবে।',
          [{text: 'ঠিক আছে'}],
        );
        break;
      case 'walk':
        Alert.alert(
          '🚶 হাঁটুন',
          '৫ মিনিটের জন্য হাঁটাহাঁটি করুন। শারীরিক কার্যকলাপ এন্ডোরফিন নিঃসরণ করে এবং আকাঙ্ক্ষা কমায়।',
          [{text: 'ঠিক আছে'}],
        );
        break;
      case 'distraction':
        Alert.alert(
          '🎯 মনোযোগ সরান',
          'অন্য কিছুতে মনোযোগ দিন: কোরআন তেলাওয়াত, বই পড়া, গেম খেলা, বা পরিবারের সাথে কথা বলা।',
          [{text: 'ঠিক আছে'}],
        );
        break;
      default:
        break;
    }
  };

  // Save craving log
  const saveCravingLog = async (overcome: boolean) => {
    try {
      const log: CravingLog = {
        id: `craving_${Date.now()}`,
        timestamp: cravingStartTime.toISOString(),
        intensity,
        duration: elapsedSeconds,
        triggers: [],
        overcome,
        notes: '',
      };

      await storageService.saveCravingLog(log);
      setLogSaved(true);
    } catch (error) {
      console.error('Error saving craving log:', error);
    }
  };

  // Handle overcome craving
  const handleOvercome = async () => {
    await saveCravingLog(true);
    Alert.alert(
      '🎉 মাশাআল্লাহ!',
      'আপনি সফলভাবে আকাঙ্ক্ষা কাটিয়ে উঠেছেন! আল্লাহ আপনাকে শক্তি দিয়েছেন। আলহামদুলিল্লাহ!',
      [
        {
          text: 'হোম পেজে ফিরুন',
          onPress: () => navigation.navigate('MainTabs', {screen: 'Home'}),
        },
      ],
    );
  };

  // Render main SOS view
  if (showBreathing) {
    return (
      <View style={styles.container}>
        <BreathingExercise onClose={() => setShowBreathing(false)} />
      </View>
    );
  }

  if (showDua) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowDua(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← ফিরে যান</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>দোয়া পড়ুন</Text>
        </View>

        <View style={styles.islamicCard}>
          <Text style={styles.islamicTitle}>{dua.title}</Text>
          <Text style={styles.arabicText}>{dua.arabic}</Text>
          <Text style={styles.transliterationText}>{dua.transliteration}</Text>
          <Text style={styles.translationText}>{dua.banglaTranslation}</Text>
          
          <View style={styles.purposeContainer}>
            <Text style={styles.purposeLabel}>উদ্দেশ্য:</Text>
            <Text style={styles.purposeText}>{dua.purpose}</Text>
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsLabel}>উপকারিতা:</Text>
            {dua.benefits.map((benefit, index) => (
              <Text key={index} style={styles.benefitItem}>• {benefit}</Text>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.overcomeButton} onPress={handleOvercome}>
          <Text style={styles.overcomeButtonText}>আকাঙ্ক্ষা কাটিয়ে উঠেছি ✓</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (showDhikr) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowDhikr(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← ফিরে যান</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>যিকির করুন</Text>
        </View>

        <View style={styles.islamicCard}>
          <Text style={styles.islamicTitle}>{dhikr.title}</Text>
          <Text style={styles.arabicText}>{dhikr.arabic}</Text>
          <Text style={styles.transliterationText}>{dhikr.transliteration}</Text>
          <Text style={styles.translationText}>{dhikr.banglaTranslation}</Text>
          
          <View style={styles.countContainer}>
            <Text style={styles.countLabel}>সংখ্যা:</Text>
            <Text style={styles.countText}>{dhikr.count} বার</Text>
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsLabel}>উপকারিতা:</Text>
            {dhikr.benefits.map((benefit, index) => (
              <Text key={index} style={styles.benefitItem}>• {benefit}</Text>
            ))}
          </View>

          {dhikr.timing && (
            <View style={styles.timingContainer}>
              <Text style={styles.timingLabel}>সময়:</Text>
              <Text style={styles.timingText}>{dhikr.timing}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.overcomeButton} onPress={handleOvercome}>
          <Text style={styles.overcomeButtonText}>আকাঙ্ক্ষা কাটিয়ে উঠেছি ✓</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (showContacts) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowContacts(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← ফিরে যান</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>জরুরি যোগাযোগ</Text>
        </View>
        <EmergencyContacts />
      </View>
    );
  }

  // Main SOS screen
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>← ফিরে যান</Text>
        </TouchableOpacity>
      </View>

      {/* Encouragement Message */}
      <Animated.View style={[styles.encouragementCard, {transform: [{scale: pulseAnim}]}]}>
        <Text style={styles.encouragementEmoji}>💪</Text>
        <Text style={styles.encouragementTitle}>আপনি পারবেন!</Text>
        <Text style={styles.encouragementText}>
          এই আকাঙ্ক্ষা সাময়িক। সাধারণত ৩-৫ মিনিটের মধ্যে এটি কমে যাবে।
          আল্লাহর উপর ভরসা রাখুন এবং নিচের পদ্ধতিগুলো চেষ্টা করুন।
        </Text>
      </Animated.View>

      {/* Timer */}
      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>আকাঙ্ক্ষার সময়কাল</Text>
        <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
        <Text style={styles.timerHint}>
          {elapsedSeconds < 180
            ? 'আরও কিছুক্ষণ ধৈর্য ধরুন...'
            : 'চমৎকার! আপনি প্রায় কাটিয়ে উঠেছেন!'}
        </Text>
      </View>

      {/* Intensity Slider */}
      <View style={styles.intensityCard}>
        <Text style={styles.intensityLabel}>আকাঙ্ক্ষার তীব্রতা: {intensity}/10</Text>
        <View style={styles.intensitySlider}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.intensityButton,
                intensity >= level && styles.intensityButtonActive,
              ]}
              onPress={() => setIntensity(level)}>
              <Text
                style={[
                  styles.intensityButtonText,
                  intensity >= level && styles.intensityButtonTextActive,
                ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Coping Strategies */}
      <CopingStrategies onStrategySelect={handleStrategySelect} />

      {/* Overcome Button */}
      {!logSaved && (
        <TouchableOpacity style={styles.overcomeButton} onPress={handleOvercome}>
          <Text style={styles.overcomeButtonText}>আকাঙ্ক্ষা কাটিয়ে উঠেছি ✓</Text>
        </TouchableOpacity>
      )}

      {/* Islamic Reminder */}
      <View style={styles.reminderCard}>
        <Text style={styles.reminderText}>
          "নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।" {'\n'}
          (সূরা ইনশিরাহ: ৫-৬)
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semibold,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  encouragementCard: {
    backgroundColor: colors.primary.light,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  encouragementEmoji: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  encouragementTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.dark,
    marginBottom: spacing.sm,
  },
  encouragementText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },
  timerCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  timerLabel: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  timerText: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
  },
  timerHint: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  intensityCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  intensityLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  intensitySlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  intensityButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  intensityButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.semibold,
  },
  intensityButtonTextActive: {
    color: colors.background.paper,
  },
  islamicCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  islamicTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  arabicText: {
    fontSize: typography.fontSize.xxl,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: typography.fontSize.xxl * 1.8,
  },
  transliterationText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  translationText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: typography.fontSize.lg * typography.lineHeight.relaxed,
  },
  purposeContainer: {
    marginBottom: spacing.md,
  },
  purposeLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  purposeText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  },
  benefitsContainer: {
    marginBottom: spacing.md,
  },
  benefitsLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  benefitItem: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  countLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginRight: spacing.sm,
  },
  countText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  timingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginRight: spacing.sm,
  },
  timingText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  overcomeButton: {
    backgroundColor: colors.success.main,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  overcomeButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.background.paper,
  },
  reminderCard: {
    backgroundColor: colors.primary.light,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  reminderText: {
    fontSize: typography.fontSize.md,
    color: colors.primary.dark,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },
});

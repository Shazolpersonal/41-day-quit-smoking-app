import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {OnboardingScreenProps} from '../types/navigation';
import {colors, spacing, typography, borderRadius} from '../constants/theme';
import {strings} from '../constants/strings';
import {UserModel} from '../models/User';
import {SettingsModel} from '../models/Settings';
import {storageService} from '../services/storage.service';

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
}) => {
  // Form state
  const [quitDate, setQuitDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cigarettesPerDay, setCigarettesPerDay] = useState('');
  const [pricePerPack, setPricePerPack] = useState('');
  const [prayerNotifications, setPrayerNotifications] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validate quit date
    if (quitDate > new Date()) {
      newErrors.quitDate = 'ধূমপান ত্যাগের তারিখ ভবিষ্যতে হতে পারে না';
    }

    // Validate cigarettes per day
    const cigarettesNum = parseInt(cigarettesPerDay, 10);
    if (!cigarettesPerDay || isNaN(cigarettesNum) || cigarettesNum < 1) {
      newErrors.cigarettesPerDay = 'দয়া করে সঠিক সংখ্যা লিখুন (কমপক্ষে ১)';
    } else if (cigarettesNum > 100) {
      newErrors.cigarettesPerDay = 'সংখ্যা খুব বেশি মনে হচ্ছে';
    }

    // Validate price per pack
    const priceNum = parseFloat(pricePerPack);
    if (!pricePerPack || isNaN(priceNum) || priceNum < 1) {
      newErrors.pricePerPack = 'দয়া করে সঠিক দাম লিখুন (কমপক্ষে ১ টাকা)';
    } else if (priceNum > 10000) {
      newErrors.pricePerPack = 'দাম খুব বেশি মনে হচ্ছে';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setQuitDate(selectedDate);
      // Clear date error if exists
      if (errors.quitDate) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.quitDate;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('ত্রুটি', 'দয়া করে সব তথ্য সঠিকভাবে পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create user data
      const userData = UserModel.create({
        quitDate: quitDate.toISOString(),
        cigarettesPerDay: parseInt(cigarettesPerDay, 10),
        pricePerPack: parseFloat(pricePerPack),
        cigarettesPerPack: 20, // Default value
      });

      // Create settings with prayer notification preference
      const settings = SettingsModel.createDefault();
      settings.notifications.prayerTimes = prayerNotifications;

      // Save to storage
      const [userSaved, settingsSaved] = await Promise.all([
        storageService.saveUser(userData),
        storageService.saveSettings(settings),
      ]);

      if (!userSaved || !settingsSaved) {
        throw new Error('Failed to save data');
      }

      // Navigate to main app
      navigation.replace('MainTabs', {screen: 'Home'});
    } catch (error) {
      console.error('Onboarding error:', error);
      Alert.alert(
        'ত্রুটি',
        'ডেটা সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled">
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>{strings.onboarding.welcome}</Text>
        <Text style={styles.welcomeMessage}>
          {strings.onboarding.welcomeMessage}
        </Text>
        <Text style={styles.emoji}>🌙</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        {/* Quit Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{strings.onboarding.quitDate}</Text>
          <TouchableOpacity
            style={[styles.dateButton, errors.quitDate && styles.inputError]}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>{formatDate(quitDate)}</Text>
            <Text style={styles.dateIcon}>📅</Text>
          </TouchableOpacity>
          {errors.quitDate && (
            <Text style={styles.errorText}>{errors.quitDate}</Text>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={quitDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Cigarettes Per Day */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {strings.onboarding.cigarettesPerDay}
          </Text>
          <TextInput
            style={[
              styles.input,
              errors.cigarettesPerDay && styles.inputError,
            ]}
            value={cigarettesPerDay}
            onChangeText={text => {
              setCigarettesPerDay(text.replace(/[^0-9]/g, ''));
              if (errors.cigarettesPerDay) {
                setErrors(prev => {
                  const newErrors = {...prev};
                  delete newErrors.cigarettesPerDay;
                  return newErrors;
                });
              }
            }}
            keyboardType="number-pad"
            placeholder="উদাহরণ: 10"
            placeholderTextColor={colors.text.hint}
            maxLength={3}
          />
          {errors.cigarettesPerDay && (
            <Text style={styles.errorText}>{errors.cigarettesPerDay}</Text>
          )}
        </View>

        {/* Price Per Pack */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{strings.onboarding.pricePerPack}</Text>
          <TextInput
            style={[styles.input, errors.pricePerPack && styles.inputError]}
            value={pricePerPack}
            onChangeText={text => {
              // Allow numbers and decimal point
              const cleaned = text.replace(/[^0-9.]/g, '');
              // Ensure only one decimal point
              const parts = cleaned.split('.');
              const formatted =
                parts.length > 2
                  ? parts[0] + '.' + parts.slice(1).join('')
                  : cleaned;
              setPricePerPack(formatted);
              if (errors.pricePerPack) {
                setErrors(prev => {
                  const newErrors = {...prev};
                  delete newErrors.pricePerPack;
                  return newErrors;
                });
              }
            }}
            keyboardType="decimal-pad"
            placeholder="উদাহরণ: 150"
            placeholderTextColor={colors.text.hint}
            maxLength={6}
          />
          {errors.pricePerPack && (
            <Text style={styles.errorText}>{errors.pricePerPack}</Text>
          )}
        </View>

        {/* Prayer Notifications Toggle */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {strings.onboarding.prayerNotifications}
          </Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                prayerNotifications && styles.toggleButtonActive,
              ]}
              onPress={() => setPrayerNotifications(true)}>
              <Text
                style={[
                  styles.toggleButtonText,
                  prayerNotifications && styles.toggleButtonTextActive,
                ]}>
                {strings.common.yes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !prayerNotifications && styles.toggleButtonActive,
              ]}
              onPress={() => setPrayerNotifications(false)}>
              <Text
                style={[
                  styles.toggleButtonText,
                  !prayerNotifications && styles.toggleButtonTextActive,
                ]}>
                {strings.common.no}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}>
        <Text style={styles.submitButtonText}>
          {isSubmitting ? strings.common.loading : strings.onboarding.letsBegin}
        </Text>
      </TouchableOpacity>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.xl,
  },
  greeting: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 48,
    marginTop: spacing.md,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  dateButton: {
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  dateIcon: {
    fontSize: typography.fontSize.xl,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  toggleButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  toggleButtonTextActive: {
    color: colors.primary.contrast,
  },
  submitButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.contrast,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {MoodType, TriggerType} from '../../types';
import {colors, spacing, borderRadius, typography} from '../../constants/theme';

interface JournalEntryFormProps {
  initialData?: {
    content: string;
    mood: MoodType;
    triggers: TriggerType[];
    cravingIntensity?: number;
    date?: string;
  };
  onSubmit: (data: {
    content: string;
    mood: MoodType;
    triggers: TriggerType[];
    cravingIntensity?: number;
    date?: string;
  }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const MOOD_OPTIONS: {value: MoodType; emoji: string; label: string}[] = [
  {value: 'very_happy', emoji: '😄', label: 'খুব খুশি'},
  {value: 'happy', emoji: '😊', label: 'খুশি'},
  {value: 'neutral', emoji: '😐', label: 'স্বাভাবিক'},
  {value: 'sad', emoji: '😔', label: 'দুঃখিত'},
  {value: 'very_sad', emoji: '😢', label: 'খুব দুঃখিত'},
  {value: 'anxious', emoji: '😰', label: 'উদ্বিগ্ন'},
  {value: 'stressed', emoji: '😫', label: 'চাপে'},
  {value: 'confident', emoji: '😎', label: 'আত্মবিশ্বাসী'},
];

const TRIGGER_OPTIONS: {value: TriggerType; label: string}[] = [
  {value: 'stress', label: 'মানসিক চাপ'},
  {value: 'social', label: 'সামাজিক'},
  {value: 'boredom', label: 'একঘেয়েমি'},
  {value: 'after_meal', label: 'খাবারের পরে'},
  {value: 'coffee', label: 'কফি'},
  {value: 'alcohol', label: 'অ্যালকোহল'},
  {value: 'work', label: 'কাজ'},
  {value: 'home', label: 'বাড়ি'},
  {value: 'other', label: 'অন্যান্য'},
];

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'সংরক্ষণ করুন',
}) => {
  const [content, setContent] = useState(initialData?.content || '');
  const [mood, setMood] = useState<MoodType>(initialData?.mood || 'neutral');
  const [triggers, setTriggers] = useState<TriggerType[]>(initialData?.triggers || []);
  const [cravingIntensity, setCravingIntensity] = useState<number | undefined>(
    initialData?.cravingIntensity,
  );
  const [selectedDate] = useState(initialData?.date || new Date().toISOString());

  const toggleTrigger = (trigger: TriggerType) => {
    if (triggers.includes(trigger)) {
      setTriggers(triggers.filter(t => t !== trigger));
    } else {
      setTriggers([...triggers, trigger]);
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('ত্রুটি', 'অনুগ্রহ করে আপনার নোট লিখুন');
      return;
    }

    onSubmit({
      content: content.trim(),
      mood,
      triggers,
      cravingIntensity,
      date: selectedDate,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Mood Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>আপনার মেজাজ কেমন? 😊</Text>
        <View style={styles.moodGrid}>
          {MOOD_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.moodOption,
                mood === option.value && styles.moodOptionSelected,
              ]}
              onPress={() => setMood(option.value)}>
              <Text style={styles.moodEmoji}>{option.emoji}</Text>
              <Text style={styles.moodLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trigger Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>কী আপনাকে প্রভাবিত করেছে? 🎯</Text>
        <View style={styles.triggerGrid}>
          {TRIGGER_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.triggerOption,
                triggers.includes(option.value) && styles.triggerOptionSelected,
              ]}
              onPress={() => toggleTrigger(option.value)}>
              <Text
                style={[
                  styles.triggerLabel,
                  triggers.includes(option.value) && styles.triggerLabelSelected,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Craving Intensity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ধূমপানের ইচ্ছা কতটা তীব্র? (ঐচ্ছিক)</Text>
        <View style={styles.intensityContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.intensityButton,
                cravingIntensity === level && styles.intensityButtonSelected,
              ]}
              onPress={() => setCravingIntensity(level)}>
              <Text
                style={[
                  styles.intensityText,
                  cravingIntensity === level && styles.intensityTextSelected,
                ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {cravingIntensity && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setCravingIntensity(undefined)}>
            <Text style={styles.clearButtonText}>মুছে ফেলুন</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>আজকের নোট 📝</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={8}
          placeholder="আজকের অভিজ্ঞতা, চ্যালেঞ্জ বা সাফল্য সম্পর্কে লিখুন..."
          placeholderTextColor={colors.text.disabled}
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{submitLabel}</Text>
        </TouchableOpacity>
        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>বাতিল করুন</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  moodOption: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  moodOptionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '20',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  triggerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  triggerOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.round,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  triggerOptionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main,
  },
  triggerLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  triggerLabelSelected: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semibold,
  },
  intensityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  intensityButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityButtonSelected: {
    borderColor: colors.error,
    backgroundColor: colors.error,
  },
  intensityText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  intensityTextSelected: {
    color: colors.neutral.white,
  },
  clearButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
  },
  textInput: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    minHeight: 150,
  },
  actionButtons: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  cancelButton: {
    backgroundColor: colors.neutral.gray[200],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});

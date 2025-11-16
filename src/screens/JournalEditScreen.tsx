import React from 'react';
import {SafeAreaView, StyleSheet, Alert} from 'react-native';
import {JournalEditScreenProps} from '../types/navigation';
import {useJournal} from '../context/JournalContext';
import {JournalEntryForm} from '../components/journal/JournalEntryForm';
import {colors} from '../constants/theme';
import {Header} from '../components/common/Header';

export const JournalEditScreen: React.FC<JournalEditScreenProps> = ({
  navigation,
  route,
}) => {
  const {entryId} = route.params;
  const {getEntry, addEntry, updateEntry} = useJournal();

  const entry = entryId ? getEntry(entryId) : undefined;
  const isEditing = !!entry;

  const handleSubmit = async (data: {
    content: string;
    mood: any;
    triggers: any[];
    cravingIntensity?: number;
    date?: string;
  }) => {
    let success = false;

    if (isEditing && entry) {
      success = await updateEntry(entry.id, data);
    } else {
      success = await addEntry(data);
    }

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert(
        'ত্রুটি',
        isEditing
          ? 'এন্ট্রি আপডেট করতে ব্যর্থ'
          : 'এন্ট্রি সংরক্ষণ করতে ব্যর্থ',
      );
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isEditing ? 'এন্ট্রি সম্পাদনা করুন' : 'নতুন এন্ট্রি'}
        onBackPress={handleCancel}
      />
      <JournalEntryForm
        initialData={
          entry
            ? {
                content: entry.content,
                mood: entry.mood,
                triggers: entry.triggers,
                cravingIntensity: entry.cravingIntensity,
                date: entry.date,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEditing ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
});

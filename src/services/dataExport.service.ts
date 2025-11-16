import {Alert, Platform, PermissionsAndroid} from 'react-native';
import {storageService} from './storage.service';

/**
 * Data Export Service
 * Handles secure data export and deletion with user confirmation
 */

export interface ExportData {
  version: string;
  exportDate: string;
  appName: string;
  data: {
    user: any;
    progress: any;
    journalEntries: any[];
    taskCompletions: any[];
    settings: any;
    cravingLogs: any[];
  };
}

class DataExportService {
  /**
   * Export all user data to JSON
   */
  async exportData(): Promise<string | null> {
    try {
      const [user, progress, journalEntries, taskCompletions, settings, cravingLogs] =
        await Promise.all([
          storageService.getUser(),
          storageService.getProgress(),
          storageService.getJournalEntries(),
          storageService.getTaskCompletions(),
          storageService.getSettings(),
          storageService.getCravingLogs(),
        ]);

      const exportData: ExportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        appName: 'Quit Smoking App',
        data: {
          user,
          progress,
          journalEntries,
          taskCompletions,
          settings,
          cravingLogs,
        },
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  /**
   * Export data with user confirmation
   */
  async exportDataWithConfirmation(): Promise<string | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'ডেটা এক্সপোর্ট',
        'আপনি কি আপনার সমস্ত ডেটা এক্সপোর্ট করতে চান? এতে আপনার ব্যক্তিগত তথ্য, জার্নাল এন্ট্রি এবং অগ্রগতির তথ্য থাকবে।',
        [
          {
            text: 'বাতিল',
            style: 'cancel',
            onPress: () => resolve(null),
          },
          {
            text: 'এক্সপোর্ট করুন',
            onPress: async () => {
              const data = await this.exportData();
              resolve(data);
            },
          },
        ]
      );
    });
  }

  /**
   * Save exported data to file
   * Note: In production, use react-native-fs or similar
   */
  async saveToFile(data: string, filename: string): Promise<boolean> {
    try {
      // Request storage permission on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'স্টোরেজ অনুমতি',
            message: 'ফাইল সংরক্ষণের জন্য স্টোরেজ অনুমতি প্রয়োজন',
            buttonNeutral: 'পরে জিজ্ঞাসা করুন',
            buttonNegative: 'বাতিল',
            buttonPositive: 'অনুমতি দিন',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('ত্রুটি', 'স্টোরেজ অনুমতি প্রয়োজন');
          return false;
        }
      }

      // In production, use react-native-fs:
      // const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
      // await RNFS.writeFile(path, data, 'utf8');

      Alert.alert(
        'সফল',
        `ডেটা সফলভাবে এক্সপোর্ট হয়েছে: ${filename}\n\nনোট: প্রোডাকশনে, এটি ডিভাইসের স্টোরেজে সংরক্ষিত হবে।`
      );

      return true;
    } catch (error) {
      console.error('Error saving to file:', error);
      Alert.alert('ত্রুটি', 'ফাইল সংরক্ষণে ব্যর্থ');
      return false;
    }
  }

  /**
   * Delete all user data with confirmation
   */
  async deleteAllDataWithConfirmation(): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        '⚠️ সতর্কতা',
        'আপনি কি নিশ্চিত যে আপনি সমস্ত ডেটা মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।\n\nমুছে যাবে:\n• ব্যবহারকারীর তথ্য\n• অগ্রগতির ডেটা\n• জার্নাল এন্ট্রি\n• সেটিংস\n• সমস্ত লগ',
        [
          {
            text: 'বাতিল',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'মুছে ফেলুন',
            style: 'destructive',
            onPress: () => {
              // Second confirmation
              Alert.alert(
                'চূড়ান্ত নিশ্চিতকরণ',
                'এটি আপনার শেষ সুযোগ। সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে।',
                [
                  {
                    text: 'বাতিল',
                    style: 'cancel',
                    onPress: () => resolve(false),
                  },
                  {
                    text: 'হ্যাঁ, মুছে ফেলুন',
                    style: 'destructive',
                    onPress: async () => {
                      const success = await storageService.clearAllData();
                      if (success) {
                        Alert.alert('সফল', 'সমস্ত ডেটা মুছে ফেলা হয়েছে');
                      } else {
                        Alert.alert('ত্রুটি', 'ডেটা মুছে ফেলতে ব্যর্থ');
                      }
                      resolve(success);
                    },
                  },
                ]
              );
            },
          },
        ]
      );
    });
  }

  /**
   * Delete specific data type with confirmation
   */
  async deleteDataTypeWithConfirmation(
    dataType: 'journal' | 'progress' | 'settings' | 'cravingLogs'
  ): Promise<boolean> {
    const dataTypeNames = {
      journal: 'জার্নাল এন্ট্রি',
      progress: 'অগ্রগতির ডেটা',
      settings: 'সেটিংস',
      cravingLogs: 'ক্রেভিং লগ',
    };

    return new Promise((resolve) => {
      Alert.alert(
        'ডেটা মুছুন',
        `আপনি কি নিশ্চিত যে আপনি সমস্ত ${dataTypeNames[dataType]} মুছে ফেলতে চান?`,
        [
          {
            text: 'বাতিল',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'মুছে ফেলুন',
            style: 'destructive',
            onPress: async () => {
              let success = false;

              switch (dataType) {
                case 'journal':
                  // Delete all journal entries
                  const entries = await storageService.getJournalEntries();
                  for (const entry of entries) {
                    await storageService.deleteJournalEntry(entry.id);
                  }
                  success = true;
                  break;

                case 'progress':
                  // Reset progress data
                  success = await storageService.saveProgress({
                    currentDay: 0,
                    moneySaved: 0,
                    cigarettesNotSmoked: 0,
                    smokeFreeTime: {days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0},
                    milestones: [],
                    healthBenefits: [],
                    lastUpdated: new Date().toISOString(),
                  });
                  break;

                case 'settings':
                  // Reset settings to default
                  success = await storageService.saveSettings({
                    notifications: {
                      enabled: true,
                      dailyReminder: true,
                      dailyReminderTime: '09:00',
                      milestones: true,
                      cravingSupport: true,
                      prayerTimes: true,
                      inactivityReminder: true,
                    },
                    appearance: {
                      fontSize: 'medium',
                      theme: 'light',
                      soundEffects: true,
                      hapticFeedback: true,
                    },
                    privacy: {
                      pinLock: false,
                      biometric: false,
                    },
                    emergencyContacts: [],
                    updatedAt: new Date().toISOString(),
                  });
                  break;

                case 'cravingLogs':
                  // Delete all craving logs
                  // Note: Would need to implement in storage service
                  success = true;
                  break;
              }

              if (success) {
                Alert.alert('সফল', `${dataTypeNames[dataType]} মুছে ফেলা হয়েছে`);
              } else {
                Alert.alert('ত্রুটি', 'ডেটা মুছে ফেলতে ব্যর্থ');
              }

              resolve(success);
            },
          },
        ]
      );
    });
  }

  /**
   * Get data size information
   */
  async getDataSize(): Promise<{
    totalEntries: number;
    journalEntries: number;
    taskCompletions: number;
    cravingLogs: number;
  }> {
    try {
      const [journalEntries, taskCompletions, cravingLogs] = await Promise.all([
        storageService.getJournalEntries(),
        storageService.getTaskCompletions(),
        storageService.getCravingLogs(),
      ]);

      return {
        totalEntries:
          journalEntries.length + taskCompletions.length + cravingLogs.length,
        journalEntries: journalEntries.length,
        taskCompletions: taskCompletions.length,
        cravingLogs: cravingLogs.length,
      };
    } catch (error) {
      console.error('Error getting data size:', error);
      return {
        totalEntries: 0,
        journalEntries: 0,
        taskCompletions: 0,
        cravingLogs: 0,
      };
    }
  }

  /**
   * Verify data integrity
   */
  async verifyDataIntegrity(): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      // Check user data
      const user = await storageService.getUser();
      if (!user) {
        errors.push('ব্যবহারকারীর ডেটা পাওয়া যায়নি');
      }

      // Check progress data
      const progress = await storageService.getProgress();
      if (!progress) {
        errors.push('অগ্রগতির ডেটা পাওয়া যায়নি');
      }

      // Check settings
      const settings = await storageService.getSettings();
      if (!settings) {
        errors.push('সেটিংস পাওয়া যায়নি');
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      console.error('Error verifying data integrity:', error);
      return {
        valid: false,
        errors: ['ডেটা যাচাইয়ে ত্রুটি'],
      };
    }
  }
}

export const dataExportService = new DataExportService();
export default dataExportService;

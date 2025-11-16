import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {useSecurity} from '../context/SecurityContext';
import {dataExportService} from '../services/dataExport.service';
import {theme} from '../constants/theme';
import {Card} from '../components/common/Card';
import {Button} from '../components/common/Button';

const SecuritySettingsScreen: React.FC = () => {
  const {
    securitySettings,
    setupPin,
    disablePin,
    enableBiometric,
    disableBiometric,
    refreshSecuritySettings,
  } = useSecurity();

  const [showPinSetup, setShowPinSetup] = useState(false);
  const [dataSize, setDataSize] = useState({
    totalEntries: 0,
    journalEntries: 0,
    taskCompletions: 0,
    cravingLogs: 0,
  });

  useEffect(() => {
    loadDataSize();
  }, []);

  /**
   * Load data size information
   */
  const loadDataSize = async () => {
    const size = await dataExportService.getDataSize();
    setDataSize(size);
  };

  /**
   * Toggle PIN lock
   */
  const handleTogglePin = async (enabled: boolean) => {
    if (enabled) {
      // Show PIN setup screen
      setShowPinSetup(true);
    } else {
      // Disable PIN - Note: Alert.prompt is iOS only
      Alert.alert(
        'পিন নিষ্ক্রিয় করুন',
        'পিন নিষ্ক্রিয় করতে সেটিংসে যান',
        [
          {
            text: 'ঠিক আছে',
            style: 'cancel',
          },
        ]
      );
    }
  };

  /**
   * Toggle biometric authentication
   */
  const handleToggleBiometric = async (enabled: boolean) => {
    if (!securitySettings?.pinEnabled) {
      Alert.alert(
        'পিন প্রয়োজন',
        'বায়োমেট্রিক সক্রিয় করতে প্রথমে পিন সেট করুন'
      );
      return;
    }

    if (enabled) {
      const success = await enableBiometric();
      if (success) {
        Alert.alert('সফল', 'বায়োমেট্রিক সক্রিয় করা হয়েছে');
        await refreshSecuritySettings();
      }
    } else {
      const success = await disableBiometric();
      if (success) {
        Alert.alert('সফল', 'বায়োমেট্রিক নিষ্ক্রিয় করা হয়েছে');
        await refreshSecuritySettings();
      }
    }
  };

  /**
   * Handle data export
   */
  const handleExportData = async () => {
    const data = await dataExportService.exportDataWithConfirmation();
    
    if (data) {
      const filename = `quit_smoking_backup_${new Date().getTime()}.json`;
      await dataExportService.saveToFile(data, filename);
    }
  };

  /**
   * Handle delete all data
   */
  const handleDeleteAllData = async () => {
    await dataExportService.deleteAllDataWithConfirmation();
    await loadDataSize();
  };

  /**
   * Handle delete specific data type
   */
  const handleDeleteDataType = async (
    dataType: 'journal' | 'progress' | 'settings' | 'cravingLogs'
  ) => {
    await dataExportService.deleteDataTypeWithConfirmation(dataType);
    await loadDataSize();
  };

  /**
   * Verify data integrity
   */
  const handleVerifyData = async () => {
    const result = await dataExportService.verifyDataIntegrity();
    
    if (result.valid) {
      Alert.alert('ডেটা যাচাই', 'সমস্ত ডেটা সঠিক আছে ✓');
    } else {
      Alert.alert(
        'ডেটা যাচাই',
        `সমস্যা পাওয়া গেছে:\n${result.errors.join('\n')}`
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Authentication Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 প্রমাণীকরণ</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>পিন লক</Text>
              <Text style={styles.settingDescription}>
                অ্যাপ খোলার সময় পিন চাইবে
              </Text>
            </View>
            <Switch
              value={securitySettings?.pinEnabled || false}
              onValueChange={handleTogglePin}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>বায়োমেট্রিক</Text>
              <Text style={styles.settingDescription}>
                ফিঙ্গারপ্রিন্ট/ফেস আইডি দিয়ে প্রবেশ
              </Text>
            </View>
            <Switch
              value={securitySettings?.biometricEnabled || false}
              onValueChange={handleToggleBiometric}
              disabled={!securitySettings?.pinEnabled}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>

          {securitySettings?.pinEnabled && (
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => setShowPinSetup(true)}
            >
              <Text style={styles.changeButtonText}>পিন পরিবর্তন করুন</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Data Encryption Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 ডেটা এনক্রিপশন</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ✓ জার্নাল এন্ট্রি এনক্রিপ্ট করা হয়
            </Text>
            <Text style={styles.infoText}>
              ✓ কোন ডেটা বাহ্যিক সার্ভারে পাঠানো হয় না
            </Text>
            <Text style={styles.infoText}>
              ✓ সমস্ত ডেটা ডিভাইসে সংরক্ষিত
            </Text>
          </View>
        </Card>

        {/* Data Management Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>💾 ডেটা ম্যানেজমেন্ট</Text>
          
          <View style={styles.dataInfo}>
            <Text style={styles.dataInfoText}>
              মোট এন্ট্রি: {dataSize.totalEntries}
            </Text>
            <Text style={styles.dataInfoText}>
              জার্নাল: {dataSize.journalEntries}
            </Text>
            <Text style={styles.dataInfoText}>
              টাস্ক: {dataSize.taskCompletions}
            </Text>
            <Text style={styles.dataInfoText}>
              ক্রেভিং লগ: {dataSize.cravingLogs}
            </Text>
          </View>

          <Button
            title="ডেটা এক্সপোর্ট করুন"
            onPress={handleExportData}
            variant="outline"
            style={styles.actionButton}
          />

          <Button
            title="ডেটা যাচাই করুন"
            onPress={handleVerifyData}
            variant="outline"
            style={styles.actionButton}
          />
        </Card>

        {/* Data Deletion Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🗑️ ডেটা মুছুন</Text>
          
          <Button
            title="জার্নাল এন্ট্রি মুছুন"
            onPress={() => handleDeleteDataType('journal')}
            variant="outline"
            style={styles.deleteButton}
          />

          <Button
            title="অগ্রগতির ডেটা রিসেট করুন"
            onPress={() => handleDeleteDataType('progress')}
            variant="outline"
            style={styles.deleteButton}
          />

          <Button
            title="সমস্ত ডেটা মুছুন"
            onPress={handleDeleteAllData}
            variant="outline"
            style={[styles.deleteButton, styles.dangerButton]}
          />
        </Card>

        {/* Privacy Notice */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ গোপনীয়তা নীতি</Text>
          
          <Text style={styles.privacyText}>
            এই অ্যাপ আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেয়:
          </Text>
          
          <Text style={styles.privacyPoint}>
            • সমস্ত ডেটা শুধুমাত্র আপনার ডিভাইসে সংরক্ষিত
          </Text>
          <Text style={styles.privacyPoint}>
            • কোন ডেটা ইন্টারনেটে পাঠানো হয় না
          </Text>
          <Text style={styles.privacyPoint}>
            • সংবেদনশীল তথ্য এনক্রিপ্ট করা হয়
          </Text>
          <Text style={styles.privacyPoint}>
            • আপনি যেকোনো সময় ডেটা মুছতে পারবেন
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.text,
  },
  changeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  dataInfo: {
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  dataInfoText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  actionButton: {
    marginTop: 12,
  },
  deleteButton: {
    marginTop: 12,
  },
  dangerButton: {
    borderColor: theme.colors.error,
  },
  privacyText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
  },
  privacyPoint: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
    paddingLeft: 8,
  },
});

export default SecuritySettingsScreen;

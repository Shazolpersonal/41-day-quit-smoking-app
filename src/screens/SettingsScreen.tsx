import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Platform,
  Share,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useUser} from '../context/UserContext';
import {useSettings} from '../context/SettingsContext';
import {notificationService} from '../services/notification.service';
import {storageService} from '../services/storage.service';
import {theme} from '../constants/theme';
import type {SettingsScreenProps} from '../types/navigation';

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const {user, updateQuitDate, updateCigaretteData, clearUser} = useUser();
  const {
    settings,
    updateNotifications,
    updateAppearance,
    updatePrivacy,
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
  } = useSettings();

  // Profile settings state
  const [quitDate, setQuitDate] = useState<Date>(new Date());
  const [showQuitDatePicker, setShowQuitDatePicker] = useState(false);
  const [cigarettesPerDay, setCigarettesPerDay] = useState('');
  const [pricePerPack, setPricePerPack] = useState('');
  const [cigarettesPerPack, setCigarettesPerPack] = useState('');

  // Notification settings state
  const [prayerNotifications, setPrayerNotifications] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [milestoneNotifications, setMilestoneNotifications] = useState(false);

  // Appearance settings state
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // Emergency contacts state
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelationship, setContactRelationship] = useState('');

  // Privacy & Security state
  const [pinLock, setPinLock] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Initialize state from user and settings
  useEffect(() => {
    if (user) {
      setQuitDate(new Date(user.quitDate));
      setCigarettesPerDay(user.cigarettesPerDay.toString());
      setPricePerPack(user.pricePerPack.toString());
      setCigarettesPerPack(user.cigarettesPerPack.toString());
    }

    if (settings) {
      setPrayerNotifications(settings.notifications.prayerTimes);
      setDailyReminders(settings.notifications.dailyReminder);
      setMilestoneNotifications(settings.notifications.milestones);

      // Parse reminder time
      if (settings.notifications.dailyReminderTime) {
        const [hours, minutes] = settings.notifications.dailyReminderTime
          .split(':')
          .map(Number);
        const time = new Date();
        time.setHours(hours, minutes, 0, 0);
        setReminderTime(time);
      }

      // Appearance settings
      setFontSize(settings.appearance.fontSize);
      setSoundEffects(settings.appearance.soundEffects);
      setHapticFeedback(settings.appearance.hapticFeedback);

      // Privacy settings
      setPinLock(settings.privacy.pinLock);
      setBiometric(settings.privacy.biometric);
    }
  }, [user, settings]);

  // Handle quit date change
  const handleQuitDateChange = (event: any, selectedDate?: Date) => {
    setShowQuitDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      setQuitDate(selectedDate);
    }
  };

  // Save quit date
  const handleSaveQuitDate = async () => {
    const success = await updateQuitDate(quitDate.toISOString());

    if (success) {
      Alert.alert('সফল', 'ধূমপান ত্যাগের তারিখ আপডেট হয়েছে');
    } else {
      Alert.alert('ত্রুটি', 'ধূমপান ত্যাগের তারিখ আপডেট করতে ব্যর্থ');
    }
  };

  // Save cigarette data
  const handleSaveCigaretteData = async () => {
    const perDay = parseInt(cigarettesPerDay, 10);
    const price = parseFloat(pricePerPack);
    const perPack = parseInt(cigarettesPerPack, 10);

    if (isNaN(perDay) || isNaN(price) || isNaN(perPack)) {
      Alert.alert('ত্রুটি', 'সঠিক সংখ্যা প্রদান করুন');
      return;
    }

    if (perDay < 0 || price < 0 || perPack < 1) {
      Alert.alert('ত্রুটি', 'সঠিক মান প্রদান করুন');
      return;
    }

    const success = await updateCigaretteData(perDay, price, perPack);

    if (success) {
      Alert.alert('সফল', 'সিগারেটের তথ্য আপডেট হয়েছে');
    } else {
      Alert.alert('ত্রুটি', 'সিগারেটের তথ্য আপডেট করতে ব্যর্থ');
    }
  };

  // Handle prayer notifications toggle
  const handlePrayerNotificationsToggle = async (value: boolean) => {
    setPrayerNotifications(value);

    const success = await updateNotifications({
      prayerTimes: value,
    });

    if (!success) {
      Alert.alert('ত্রুটি', 'নোটিফিকেশন সেটিংস আপডেট করতে ব্যর্থ');
      setPrayerNotifications(!value);
    }
  };

  // Handle daily reminders toggle
  const handleDailyRemindersToggle = async (value: boolean) => {
    if (value) {
      // Request notification permissions
      const hasPermission = await notificationService.requestPermissions();

      if (!hasPermission) {
        Alert.alert(
          'অনুমতি প্রয়োজন',
          'নোটিফিকেশন পাঠাতে অনুমতি প্রয়োজন',
        );
        return;
      }

      // Schedule daily reminder
      const timeStr = `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`;
      const scheduled = await notificationService.scheduleDailyReminder(timeStr);

      if (!scheduled) {
        Alert.alert('ত্রুটি', 'দৈনিক রিমাইন্ডার সেট করতে ব্যর্থ');
        return;
      }
    } else {
      // Cancel daily reminder
      await notificationService.cancelDailyReminder();
    }

    setDailyReminders(value);

    const success = await updateNotifications({
      dailyReminder: value,
    });

    if (!success) {
      Alert.alert('ত্রুটি', 'নোটিফিকেশন সেটিংস আপডেট করতে ব্যর্থ');
      setDailyReminders(!value);
    }
  };

  // Handle reminder time change
  const handleReminderTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');

    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };

  // Save reminder time
  const handleSaveReminderTime = async () => {
    const timeStr = `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`;

    const success = await updateNotifications({
      dailyReminderTime: timeStr,
    });

    if (success) {
      // Reschedule if reminders are enabled
      if (dailyReminders) {
        await notificationService.cancelDailyReminder();
        await notificationService.scheduleDailyReminder(timeStr);
      }

      Alert.alert('সফল', 'রিমাইন্ডার সময় আপডেট হয়েছে');
    } else {
      Alert.alert('ত্রুটি', 'রিমাইন্ডার সময় আপডেট করতে ব্যর্থ');
    }
  };

  // Handle milestone notifications toggle
  const handleMilestoneNotificationsToggle = async (value: boolean) => {
    setMilestoneNotifications(value);

    const success = await updateNotifications({
      milestones: value,
    });

    if (!success) {
      Alert.alert('ত্রুটি', 'নোটিফিকেশন সেটিংস আপডেট করতে ব্যর্থ');
      setMilestoneNotifications(!value);
    }
  };

  // Handle font size change
  const handleFontSizeChange = async (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);

    const success = await updateAppearance({
      fontSize: size,
    });

    if (success) {
      Alert.alert('সফল', 'ফন্ট সাইজ আপডেট হয়েছে');
    } else {
      Alert.alert('ত্রুটি', 'ফন্ট সাইজ আপডেট করতে ব্যর্থ');
      // Revert on failure
      if (settings) {
        setFontSize(settings.appearance.fontSize);
      }
    }
  };

  // Handle sound effects toggle
  const handleSoundEffectsToggle = async (value: boolean) => {
    setSoundEffects(value);

    const success = await updateAppearance({
      soundEffects: value,
    });

    if (!success) {
      Alert.alert('ত্রুটি', 'সাউন্ড ইফেক্ট সেটিংস আপডেট করতে ব্যর্থ');
      setSoundEffects(!value);
    }
  };

  // Handle haptic feedback toggle
  const handleHapticFeedbackToggle = async (value: boolean) => {
    setHapticFeedback(value);

    const success = await updateAppearance({
      hapticFeedback: value,
    });

    if (!success) {
      Alert.alert('ত্রুটি', 'হ্যাপটিক ফিডব্যাক সেটিংস আপডেট করতে ব্যর্থ');
      setHapticFeedback(!value);
    }
  };

  // Handle add/edit emergency contact
  const handleSaveContact = async () => {
    if (!contactName.trim()) {
      Alert.alert('ত্রুটি', 'নাম প্রদান করুন');
      return;
    }

    if (!contactPhone.trim()) {
      Alert.alert('ত্রুটি', 'ফোন নম্বর প্রদান করুন');
      return;
    }

    if (!contactRelationship.trim()) {
      Alert.alert('ত্রুটি', 'সম্পর্ক প্রদান করুন');
      return;
    }

    let success = false;

    if (editingContactId) {
      // Update existing contact
      success = await updateEmergencyContact(editingContactId, {
        name: contactName.trim(),
        phone: contactPhone.trim(),
        relationship: contactRelationship.trim(),
      });
    } else {
      // Add new contact
      success = await addEmergencyContact({
        name: contactName.trim(),
        phone: contactPhone.trim(),
        relationship: contactRelationship.trim(),
      });
    }

    if (success) {
      Alert.alert(
        'সফল',
        editingContactId
          ? 'জরুরি যোগাযোগ আপডেট হয়েছে'
          : 'জরুরি যোগাযোগ যোগ হয়েছে',
      );
      // Reset form
      setContactName('');
      setContactPhone('');
      setContactRelationship('');
      setShowAddContact(false);
      setEditingContactId(null);
    }
  };

  // Handle edit contact
  const handleEditContact = (contactId: string) => {
    const contact = settings?.emergencyContacts.find(c => c.id === contactId);
    if (contact) {
      setContactName(contact.name);
      setContactPhone(contact.phone);
      setContactRelationship(contact.relationship);
      setEditingContactId(contactId);
      setShowAddContact(true);
    }
  };

  // Handle delete contact
  const handleDeleteContact = (contactId: string) => {
    Alert.alert(
      'নিশ্চিত করুন',
      'আপনি কি এই জরুরি যোগাযোগ মুছে ফেলতে চান?',
      [
        {
          text: 'বাতিল',
          style: 'cancel',
        },
        {
          text: 'মুছুন',
          style: 'destructive',
          onPress: async () => {
            const success = await removeEmergencyContact(contactId);
            if (success) {
              Alert.alert('সফল', 'জরুরি যোগাযোগ মুছে ফেলা হয়েছে');
            }
          },
        },
      ],
    );
  };

  // Cancel add/edit contact
  const handleCancelContact = () => {
    setContactName('');
    setContactPhone('');
    setContactRelationship('');
    setShowAddContact(false);
    setEditingContactId(null);
  };

  // Handle export data
  const handleExportData = async () => {
    try {
      const exportData = await storageService.exportAllData();

      if (!exportData) {
        Alert.alert('ত্রুটি', 'ডেটা এক্সপোর্ট করতে ব্যর্থ');
        return;
      }

      // Share the data
      const result = await Share.share({
        message: exportData,
        title: 'ধূমপান ত্যাগ অ্যাপ ডেটা',
      });

      if (result.action === Share.sharedAction) {
        Alert.alert('সফল', 'ডেটা সফলভাবে এক্সপোর্ট হয়েছে');
      }
    } catch (error) {
      Alert.alert('ত্রুটি', 'ডেটা এক্সপোর্ট করতে সমস্যা হয়েছে');
    }
  };

  // Handle reset/clear data
  const handleResetData = () => {
    Alert.alert(
      'সতর্কতা',
      'আপনি কি নিশ্চিত যে আপনি সমস্ত ডেটা মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।',
      [
        {
          text: 'বাতিল',
          style: 'cancel',
        },
        {
          text: 'মুছে ফেলুন',
          style: 'destructive',
          onPress: async () => {
            const success = await clearUser();
            if (success) {
              Alert.alert('সফল', 'সমস্ত ডেটা মুছে ফেলা হয়েছে। অ্যাপ পুনরায় চালু করুন।');
            } else {
              Alert.alert('ত্রুটি', 'ডেটা মুছে ফেলতে ব্যর্থ');
            }
          },
        },
      ],
    );
  };

  // Handle PIN lock toggle
  const handlePinLockToggle = async (value: boolean) => {
    if (value) {
      // Show PIN setup
      setShowPinSetup(true);
    } else {
      // Disable PIN lock
      setPinLock(false);
      const success = await updatePrivacy({
        pinLock: false,
        pin: undefined,
      });

      if (!success) {
        Alert.alert('ত্রুটি', 'পিন লক সেটিংস আপডেট করতে ব্যর্থ');
        setPinLock(true);
      } else {
        Alert.alert('সফল', 'পিন লক বন্ধ করা হয়েছে');
      }
    }
  };

  // Handle PIN setup
  const handleSavePin = async () => {
    // Validate PIN
    if (!newPin || newPin.length < 4 || newPin.length > 6) {
      Alert.alert('ত্রুটি', 'পিন ৪-৬ সংখ্যার হতে হবে');
      return;
    }

    if (!/^\d+$/.test(newPin)) {
      Alert.alert('ত্রুটি', 'পিন শুধুমাত্র সংখ্যা হতে হবে');
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert('ত্রুটি', 'পিন মিলছে না');
      return;
    }

    // Save PIN
    const success = await updatePrivacy({
      pinLock: true,
      pin: newPin,
    });

    if (success) {
      setPinLock(true);
      setShowPinSetup(false);
      setNewPin('');
      setConfirmPin('');
      Alert.alert('সফল', 'পিন সফলভাবে সেট করা হয়েছে');
    } else {
      Alert.alert('ত্রুটি', 'পিন সেট করতে ব্যর্থ');
    }
  };

  // Cancel PIN setup
  const handleCancelPinSetup = () => {
    setShowPinSetup(false);
    setNewPin('');
    setConfirmPin('');
    setPinLock(false);
  };

  // Handle biometric toggle
  const handleBiometricToggle = async (value: boolean) => {
    if (value && !pinLock) {
      Alert.alert(
        'পিন প্রয়োজন',
        'বায়োমেট্রিক সক্রিয় করতে প্রথমে পিন লক সক্রিয় করুন',
      );
      return;
    }

    setBiometric(value);
    const success = await updatePrivacy({
      biometric: value,
    });

    if (!success) {
      Alert.alert('ত্রুটি', 'বায়োমেট্রিক সেটিংস আপডেট করতে ব্যর্থ');
      setBiometric(!value);
    } else {
      Alert.alert(
        'সফল',
        value
          ? 'বায়োমেট্রিক প্রমাণীকরণ সক্রিয় করা হয়েছে'
          : 'বায়োমেট্রিক প্রমাণীকরণ বন্ধ করা হয়েছে',
      );
    }
  };

  // Handle help
  const handleHelp = () => {
    Alert.alert(
      'সাহায্য',
      'এই অ্যাপটি আপনাকে ধূমপান ত্যাগ করতে সাহায্য করার জন্য ডিজাইন করা হয়েছে।\n\n' +
        '• হোম: আপনার অগ্রগতি দেখুন\n' +
        '• দৈনিক: প্রতিদিনের কাজ এবং অনুপ্রেরণা\n' +
        '• জার্নাল: আপনার অনুভূতি লিখুন\n' +
        '• অগ্রগতি: বিস্তারিত পরিসংখ্যান\n' +
        '• SOS: জরুরি সাহায্য\n\n' +
        'যেকোনো সমস্যার জন্য সাপোর্টে যোগাযোগ করুন।',
      [{text: 'ঠিক আছে'}],
    );
  };

  if (!user || !settings) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>প্রোফাইল সেটিংস</Text>

        {/* Quit Date */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>ধূমপান ত্যাগের তারিখ</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowQuitDatePicker(true)}>
            <Text style={styles.dateButtonText}>
              {quitDate.toLocaleDateString('bn-BD')}
            </Text>
          </TouchableOpacity>
          {showQuitDatePicker && (
            <DateTimePicker
              value={quitDate}
              mode="date"
              display="default"
              onChange={handleQuitDateChange}
              maximumDate={new Date()}
            />
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveQuitDate}>
            <Text style={styles.saveButtonText}>সংরক্ষণ করুন</Text>
          </TouchableOpacity>
        </View>

        {/* Cigarettes Per Day */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>প্রতিদিন সিগারেট (সংখ্যা)</Text>
          <TextInput
            style={styles.input}
            value={cigarettesPerDay}
            onChangeText={setCigarettesPerDay}
            keyboardType="numeric"
            placeholder="যেমন: 20"
            placeholderTextColor="#999"
          />
        </View>

        {/* Price Per Pack */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>প্যাকেটের দাম (টাকা)</Text>
          <TextInput
            style={styles.input}
            value={pricePerPack}
            onChangeText={setPricePerPack}
            keyboardType="numeric"
            placeholder="যেমন: 150"
            placeholderTextColor="#999"
          />
        </View>

        {/* Cigarettes Per Pack */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>প্যাকেটে সিগারেট (সংখ্যা)</Text>
          <TextInput
            style={styles.input}
            value={cigarettesPerPack}
            onChangeText={setCigarettesPerPack}
            keyboardType="numeric"
            placeholder="যেমন: 20"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveCigaretteData}>
          <Text style={styles.saveButtonText}>সিগারেটের তথ্য সংরক্ষণ করুন</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>নোটিফিকেশন সেটিংস</Text>

        {/* Prayer Time Notifications */}
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>নামাজের সময় নোটিফিকেশন</Text>
              <Text style={styles.settingDescription}>
                নামাজের সময় হলে নোটিফিকেশন পান
              </Text>
            </View>
            <Switch
              value={prayerNotifications}
              onValueChange={handlePrayerNotificationsToggle}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary.main,
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        {/* Daily Reminders */}
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>দৈনিক রিমাইন্ডার</Text>
              <Text style={styles.settingDescription}>
                প্রতিদিন একটি নির্দিষ্ট সময়ে রিমাইন্ডার পান
              </Text>
            </View>
            <Switch
              value={dailyReminders}
              onValueChange={handleDailyRemindersToggle}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary.main,
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        {/* Reminder Time */}
        {dailyReminders && (
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>রিমাইন্ডার সময়</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateButtonText}>
                {reminderTime.toLocaleTimeString('bn-BD', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={reminderTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={handleReminderTimeChange}
              />
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveReminderTime}>
              <Text style={styles.saveButtonText}>সময় সংরক্ষণ করুন</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Milestone Notifications */}
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>মাইলস্টোন নোটিফিকেশন</Text>
              <Text style={styles.settingDescription}>
                গুরুত্বপূর্ণ মাইলস্টোন অর্জনে নোটিফিকেশন পান
              </Text>
            </View>
            <Switch
              value={milestoneNotifications}
              onValueChange={handleMilestoneNotificationsToggle}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary.main,
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>
      </View>

      {/* Appearance Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>অ্যাপিয়ারেন্স সেটিংস</Text>

        {/* Font Size */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>ফন্ট সাইজ</Text>
          <Text style={styles.settingDescription}>
            অ্যাপের টেক্সট সাইজ পরিবর্তন করুন
          </Text>
          <View style={styles.fontSizeButtons}>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                fontSize === 'small' && styles.fontSizeButtonActive,
              ]}
              onPress={() => handleFontSizeChange('small')}>
              <Text
                style={[
                  styles.fontSizeButtonText,
                  fontSize === 'small' && styles.fontSizeButtonTextActive,
                ]}>
                ছোট
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                fontSize === 'medium' && styles.fontSizeButtonActive,
              ]}
              onPress={() => handleFontSizeChange('medium')}>
              <Text
                style={[
                  styles.fontSizeButtonText,
                  fontSize === 'medium' && styles.fontSizeButtonTextActive,
                ]}>
                মাঝারি
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                fontSize === 'large' && styles.fontSizeButtonActive,
              ]}
              onPress={() => handleFontSizeChange('large')}>
              <Text
                style={[
                  styles.fontSizeButtonText,
                  fontSize === 'large' && styles.fontSizeButtonTextActive,
                ]}>
                বড়
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sound Effects */}
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>সাউন্ড ইফেক্ট</Text>
              <Text style={styles.settingDescription}>
                অ্যাপে সাউন্ড ইফেক্ট চালু/বন্ধ করুন
              </Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={handleSoundEffectsToggle}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary.main,
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        {/* Haptic Feedback */}
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>হ্যাপটিক ফিডব্যাক</Text>
              <Text style={styles.settingDescription}>
                টাচ করার সময় ভাইব্রেশন চালু/বন্ধ করুন
              </Text>
            </View>
            <Switch
              value={hapticFeedback}
              onValueChange={handleHapticFeedbackToggle}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary.main,
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>
      </View>

      {/* Emergency Contacts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>জরুরি যোগাযোগ</Text>
        <Text style={styles.sectionDescription}>
          সংকটের সময় যোগাযোগের জন্য ৫টি পর্যন্ত জরুরি যোগাযোগ যোগ করুন
        </Text>

        {/* Emergency Contacts List */}
        {settings?.emergencyContacts.map(contact => (
          <View key={contact.id} style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
              <Text style={styles.contactRelationship}>
                {contact.relationship}
              </Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.contactActionButton}
                onPress={() => handleEditContact(contact.id)}>
                <Text style={styles.contactActionText}>সম্পাদনা</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactActionButton, styles.deleteButton]}
                onPress={() => handleDeleteContact(contact.id)}>
                <Text style={[styles.contactActionText, styles.deleteText]}>
                  মুছুন
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add Contact Form */}
        {showAddContact ? (
          <View style={styles.contactForm}>
            <Text style={styles.formTitle}>
              {editingContactId ? 'যোগাযোগ সম্পাদনা করুন' : 'নতুন যোগাযোগ যোগ করুন'}
            </Text>

            <TextInput
              style={styles.input}
              value={contactName}
              onChangeText={setContactName}
              placeholder="নাম"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              value={contactPhone}
              onChangeText={setContactPhone}
              placeholder="ফোন নম্বর (যেমন: 01712345678)"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              value={contactRelationship}
              onChangeText={setContactRelationship}
              placeholder="সম্পর্ক (যেমন: বন্ধু, পরিবার)"
              placeholderTextColor="#999"
            />

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={handleCancelContact}>
                <Text style={styles.cancelButtonText}>বাতিল</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={handleSaveContact}>
                <Text style={styles.saveButtonText}>সংরক্ষণ করুন</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addContactButton}
            onPress={() => setShowAddContact(true)}
            disabled={
              settings?.emergencyContacts && settings.emergencyContacts.length >= 5
            }>
            <Text style={styles.addContactButtonText}>
              {settings?.emergencyContacts && settings.emergencyContacts.length >= 5
                ? 'সর্বোচ্চ ৫টি যোগাযোগ যোগ করা হয়েছে'
                : '+ নতুন যোগাযোগ যোগ করুন'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Privacy & Security Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>প্রাইভেসি ও নিরাপত্তা</Text>
        <Text style={styles.sectionDescription}>
          আপনার ডেটা সুরক্ষিত রাখতে পিন লক এবং বায়োমেট্রিক সক্রিয় করুন
        </Text>

        {/* PIN Lock */}
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>পিন লক</Text>
              <Text style={styles.settingDescription}>
                অ্যাপ খোলার সময় পিন প্রয়োজন
              </Text>
            </View>
            <Switch
              value={pinLock}
              onValueChange={handlePinLockToggle}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary.main,
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        {/* PIN Setup Form */}
        {showPinSetup && (
          <View style={styles.contactForm}>
            <Text style={styles.formTitle}>পিন সেট করুন</Text>
            <Text style={styles.sectionDescription}>
              ৪-৬ সংখ্যার একটি পিন তৈরি করুন
            </Text>

            <TextInput
              style={styles.input}
              value={newPin}
              onChangeText={setNewPin}
              placeholder="নতুন পিন (৪-৬ সংখ্যা)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
            />

            <TextInput
              style={styles.input}
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="পিন নিশ্চিত করুন"
              placeholderTextColor="#999"
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
            />

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={handleCancelPinSetup}>
                <Text style={styles.cancelButtonText}>বাতিল</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={handleSavePin}>
                <Text style={styles.saveButtonText}>সংরক্ষণ করুন</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Biometric Authentication */}
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>বায়োমেট্রিক প্রমাণীকরণ</Text>
              <Text style={styles.settingDescription}>
                ফিঙ্গারপ্রিন্ট বা ফেস আইডি ব্যবহার করুন
              </Text>
            </View>
            <Switch
              value={biometric}
              onValueChange={handleBiometricToggle}
              disabled={!pinLock}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary.main,
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        {!pinLock && (
          <Text style={styles.warningText}>
            বায়োমেট্রিক সক্রিয় করতে প্রথমে পিন লক সক্রিয় করুন
          </Text>
        )}
      </View>

      {/* Data Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ডেটা ম্যানেজমেন্ট</Text>
        <Text style={styles.sectionDescription}>
          আপনার ডেটা এক্সপোর্ট বা রিসেট করুন
        </Text>

        {/* Export Data */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleExportData}>
          <Text style={styles.actionButtonText}>📤 ডেটা এক্সপোর্ট করুন</Text>
          <Text style={styles.actionButtonDescription}>
            আপনার সমস্ত ডেটা ব্যাকআপ হিসেবে সংরক্ষণ করুন
          </Text>
        </TouchableOpacity>

        {/* Reset Data */}
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleResetData}>
          <Text style={[styles.actionButtonText, styles.dangerText]}>
            🗑️ সমস্ত ডেটা মুছে ফেলুন
          </Text>
          <Text style={styles.actionButtonDescription}>
            সতর্কতা: এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না
          </Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>অ্যাপ সম্পর্কে</Text>

        {/* App Version */}
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>অ্যাপ ভার্সন</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        {/* Help */}
        <TouchableOpacity style={styles.actionButton} onPress={handleHelp}>
          <Text style={styles.actionButtonText}>❓ সাহায্য</Text>
          <Text style={styles.actionButtonDescription}>
            অ্যাপ ব্যবহারের নির্দেশনা দেখুন
          </Text>
        </TouchableOpacity>
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
    padding: theme.spacing.lg,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  dateButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  dateButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.background,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
    marginBottom: theme.spacing.md,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  fontSizeButton: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  fontSizeButtonActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  fontSizeButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  fontSizeButtonTextActive: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.semibold as any,
  },
  contactItem: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  contactPhone: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  contactRelationship: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
  },
  contactActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  contactActionButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  contactActionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.semibold as any,
  },
  deleteText: {
    color: theme.colors.background,
  },
  contactForm: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  formTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  formButton: {
    flex: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  addContactButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  addContactButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.background,
  },
  actionButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  actionButtonDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
  },
  dangerButton: {
    borderColor: theme.colors.error,
  },
  dangerText: {
    color: theme.colors.error,
  },
  versionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    opacity: 0.7,
  },
  warningText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.warning,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
});

export default SettingsScreen;

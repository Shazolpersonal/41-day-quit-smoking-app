import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { notificationService } from './notification.service';

/**
 * Example component demonstrating NotificationService usage
 * This shows how to integrate notification functionality in your app
 */
const NotificationServiceExample: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    // Initialize notification service when component mounts
    initializeNotifications();
  }, []);

  /**
   * Initialize notification service and check permissions
   */
  const initializeNotifications = async () => {
    // Initialize channels (Android)
    await notificationService.initialize();

    // Check if we already have permission
    const permission = await notificationService.checkPermissions();
    setHasPermission(permission);

    // Get scheduled notifications count
    updateScheduledCount();
  };

  /**
   * Request notification permissions from user
   */
  const handleRequestPermissions = async () => {
    const granted = await notificationService.requestPermissions();
    setHasPermission(granted);

    if (granted) {
      Alert.alert('সফল', 'নোটিফিকেশন অনুমতি দেওয়া হয়েছে');
    } else {
      Alert.alert('ব্যর্থ', 'নোটিফিকেশন অনুমতি প্রত্যাখ্যান করা হয়েছে');
    }
  };

  /**
   * Schedule a daily reminder at 9:00 AM
   */
  const handleScheduleDailyReminder = async () => {
    const success = await notificationService.scheduleDailyReminder(
      '09:00',
      'আজকের কাজ এবং নিশ্চিতকরণ দেখুন। আল্লাহ আপনার সাথে আছেন!',
    );

    if (success) {
      Alert.alert('সফল', 'দৈনিক রিমাইন্ডার সেট করা হয়েছে (সকাল ৯:০০)');
      updateScheduledCount();
    } else {
      Alert.alert('ব্যর্থ', 'রিমাইন্ডার সেট করা যায়নি');
    }
  };

  /**
   * Cancel the daily reminder
   */
  const handleCancelDailyReminder = async () => {
    const success = await notificationService.cancelDailyReminder();

    if (success) {
      Alert.alert('সফল', 'দৈনিক রিমাইন্ডার বাতিল করা হয়েছে');
      updateScheduledCount();
    }
  };

  /**
   * Send a milestone notification for day 7
   */
  const handleSendMilestoneNotification = async () => {
    const success = await notificationService.sendMilestoneNotification(7);

    if (success) {
      Alert.alert('সফল', 'মাইলফলক নোটিফিকেশন পাঠানো হয়েছে');
    } else {
      Alert.alert('ব্যর্থ', 'নোটিফিকেশন পাঠানো যায়নি');
    }
  };

  /**
   * Send a custom milestone notification
   */
  const handleSendCustomMilestone = async () => {
    const success = await notificationService.sendMilestoneNotification(
      21,
      '🎊 ২১ দিন সম্পূর্ণ!',
      'সুবহানাল্লাহ! ৩ সপ্তাহ সম্পূর্ণ। নতুন অভ্যাস তৈরি হয়েছে!',
    );

    if (success) {
      Alert.alert('সফল', 'কাস্টম মাইলফলক নোটিফিকেশন পাঠানো হয়েছে');
    }
  };

  /**
   * Send a motivational notification
   */
  const handleSendMotivationalNotification = async () => {
    const success = await notificationService.sendMotivationalNotification(
      '💪 চালিয়ে যান!',
      'আপনি দুর্দান্ত কাজ করছেন। আল্লাহ আপনার সাথে আছেন!',
    );

    if (success) {
      Alert.alert('সফল', 'অনুপ্রেরণামূলক নোটিফিকেশন পাঠানো হয়েছে');
    }
  };

  /**
   * Schedule a notification for 1 hour from now
   */
  const handleScheduleCustomNotification = async () => {
    const oneHourFromNow = Date.now() + 3600000; // 1 hour in milliseconds

    const notificationId = await notificationService.scheduleNotification(
      '⏰ রিমাইন্ডার',
      'এটি ১ ঘন্টা পরে একটি পরীক্ষা নোটিফিকেশন',
      oneHourFromNow,
      'custom-reminder-1',
    );

    if (notificationId) {
      Alert.alert('সফল', `নোটিফিকেশন সেট করা হয়েছে (ID: ${notificationId})`);
      updateScheduledCount();
    } else {
      Alert.alert('ব্যর্থ', 'নোটিফিকেশন সেট করা যায়নি');
    }
  };

  /**
   * Cancel all notifications
   */
  const handleCancelAllNotifications = async () => {
    Alert.alert(
      'নিশ্চিত করুন',
      'সব নোটিফিকেশন বাতিল করতে চান?',
      [
        { text: 'না', style: 'cancel' },
        {
          text: 'হ্যাঁ',
          onPress: async () => {
            const success = await notificationService.cancelAllNotifications();
            if (success) {
              Alert.alert('সফল', 'সব নোটিফিকেশন বাতিল করা হয়েছে');
              updateScheduledCount();
            }
          },
        },
      ],
    );
  };

  /**
   * Update the count of scheduled notifications
   */
  const updateScheduledCount = async () => {
    const notifications = await notificationService.getScheduledNotifications();
    setScheduledCount(notifications.length);
  };

  /**
   * Show all scheduled notifications
   */
  const handleShowScheduledNotifications = async () => {
    const notifications = await notificationService.getScheduledNotifications();
    
    if (notifications.length === 0) {
      Alert.alert('তথ্য', 'কোন নির্ধারিত নোটিফিকেশন নেই');
      return;
    }

    const notificationList = notifications
      .map((n, index) => `${index + 1}. ${n.notification?.title || 'No title'}`)
      .join('\n');

    Alert.alert('নির্ধারিত নোটিফিকেশন', notificationList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NotificationService Example</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          অনুমতি: {hasPermission ? '✅ দেওয়া হয়েছে' : '❌ দেওয়া হয়নি'}
        </Text>
        <Text style={styles.statusText}>
          নির্ধারিত নোটিফিকেশন: {scheduledCount}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>অনুমতি</Text>
        <Button
          title="নোটিফিকেশন অনুমতি চান"
          onPress={handleRequestPermissions}
          disabled={hasPermission}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>দৈনিক রিমাইন্ডার</Text>
        <Button
          title="দৈনিক রিমাইন্ডার সেট করুন (৯:০০ AM)"
          onPress={handleScheduleDailyReminder}
          disabled={!hasPermission}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="দৈনিক রিমাইন্ডার বাতিল করুন"
          onPress={handleCancelDailyReminder}
          disabled={!hasPermission}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>মাইলফলক নোটিফিকেশন</Text>
        <Button
          title="৭ দিনের মাইলফলক পাঠান"
          onPress={handleSendMilestoneNotification}
          disabled={!hasPermission}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="২১ দিনের কাস্টম মাইলফলক পাঠান"
          onPress={handleSendCustomMilestone}
          disabled={!hasPermission}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>অন্যান্য নোটিফিকেশন</Text>
        <Button
          title="অনুপ্রেরণামূলক নোটিফিকেশন পাঠান"
          onPress={handleSendMotivationalNotification}
          disabled={!hasPermission}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="১ ঘন্টা পরে নোটিফিকেশন সেট করুন"
          onPress={handleScheduleCustomNotification}
          disabled={!hasPermission}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>পরিচালনা</Text>
        <Button
          title="নির্ধারিত নোটিফিকেশন দেখুন"
          onPress={handleShowScheduledNotifications}
          disabled={!hasPermission}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="সব নোটিফিকেশন বাতিল করুন"
          onPress={handleCancelAllNotifications}
          disabled={!hasPermission}
          color="red"
        />
      </View>
    </View>
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
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
  },
  buttonSpacing: {
    height: 10,
  },
});

export default NotificationServiceExample;

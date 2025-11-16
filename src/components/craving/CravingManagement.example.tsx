import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {BreathingExercise} from './BreathingExercise';
import {CopingStrategies} from './CopingStrategies';
import {EmergencyContacts} from './EmergencyContacts';
import {CopingStrategyType, EmergencyContact} from '../../types';
import {spacing} from '../../constants/theme';

/**
 * Example usage of craving management components
 * This demonstrates how to integrate all three components in a Craving SOS screen
 */
export const CravingManagementExample: React.FC = () => {
  // Example emergency contacts
  const [emergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'আহমেদ ভাই',
      phone: '+880 1712-345678',
      relationship: 'বন্ধু',
    },
    {
      id: '2',
      name: 'ডাক্তার রহমান',
      phone: '+880 1812-345678',
      relationship: 'চিকিৎসক',
    },
  ]);

  const handleBreathingComplete = () => {
    Alert.alert(
      'চমৎকার!',
      'আপনি শ্বাস-প্রশ্বাসের ব্যায়াম সম্পন্ন করেছেন। কেমন অনুভব করছেন?',
    );
  };

  const handleStrategySelect = (strategy: CopingStrategyType) => {
    console.log('Selected strategy:', strategy);
    
    // Handle different strategies
    switch (strategy) {
      case 'breathing':
        Alert.alert('শ্বাস-প্রশ্বাস', 'শ্বাস-প্রশ্বাসের ব্যায়াম শুরু করুন');
        break;
      case 'dua':
        Alert.alert('দোয়া', 'দোয়া পড়ার পেজে যাচ্ছি...');
        break;
      case 'dhikr':
        Alert.alert('যিকির', 'যিকির করার পেজে যাচ্ছি...');
        break;
      case 'water':
        Alert.alert('পানি পান', 'এক গ্লাস পানি পান করুন এবং ৫ মিনিট অপেক্ষা করুন');
        break;
      case 'walk':
        Alert.alert('হাঁটুন', '৫ মিনিট হাঁটাহাঁটি করুন এবং ফিরে আসুন');
        break;
      case 'call':
        Alert.alert('কল করুন', 'নিচে থেকে একজন যোগাযোগ বেছে নিন');
        break;
      case 'distraction':
        Alert.alert('মনোযোগ সরান', 'কোনো কাজে ব্যস্ত হয়ে যান');
        break;
      default:
        Alert.alert('অন্যান্য', 'আপনার পছন্দের পদ্ধতি ব্যবহার করুন');
    }
  };

  const handleAddContact = () => {
    Alert.alert(
      'যোগাযোগ যুক্ত করুন',
      'সেটিংস থেকে জরুরি যোগাযোগ যুক্ত করতে পারবেন',
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Breathing Exercise Section */}
      <View style={styles.section}>
        <BreathingExercise onComplete={handleBreathingComplete} />
      </View>

      {/* Coping Strategies Section */}
      <View style={styles.section}>
        <CopingStrategies onStrategySelect={handleStrategySelect} />
      </View>

      {/* Emergency Contacts Section */}
      <View style={styles.section}>
        <EmergencyContacts
          contacts={emergencyContacts}
          onAddContact={handleAddContact}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
});

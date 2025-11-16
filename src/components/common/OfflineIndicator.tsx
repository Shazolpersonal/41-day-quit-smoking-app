/**
 * OfflineIndicator Component
 * Displays a banner when the app is offline
 * Shows offline status to the user
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../constants/colors';
import {useNetworkStatus} from '../../hooks/useNetworkStatus';

interface OfflineIndicatorProps {
  showWhenOnline?: boolean; // Show indicator even when online (for testing)
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  showWhenOnline = false,
}) => {
  const {isConnected} = useNetworkStatus();

  // Don't show if online (unless showWhenOnline is true)
  if (isConnected && !showWhenOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📡</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>অফলাইন মোড</Text>
          <Text style={styles.message}>
            ইন্টারনেট সংযোগ নেই। অ্যাপটি অফলাইনে কাজ করছে।
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default OfflineIndicator;

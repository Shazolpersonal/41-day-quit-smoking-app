/**
 * Islamic Content Card Component
 * Displays quick access to Islamic content (Duas, Quran, Hadith)
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation';
import {colors, spacing, typography} from '../../constants/theme';
import {Card} from '../common/Card';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const IslamicContentCard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const islamicContent = [
    {
      id: 'duas',
      title: 'দোয়া',
      icon: '🤲',
      description: '১০টি দোয়া',
      onPress: () => navigation.navigate('DuaList'),
    },
    {
      id: 'quran',
      title: 'কুরআন',
      icon: '📖',
      description: 'প্রাসঙ্গিক আয়াত',
      onPress: () => navigation.navigate('QuranVerses'),
    },
    {
      id: 'hadith',
      title: 'হাদীস',
      icon: '📜',
      description: 'স্বাস্থ্য ও ধৈর্য',
      onPress: () => navigation.navigate('HadithList'),
    },
  ];

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>ইসলামিক কন্টেন্ট</Text>
      <View style={styles.contentGrid}>
        {islamicContent.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.contentItem}
            onPress={item.onPress}
            activeOpacity={0.7}>
            <Text style={styles.contentIcon}>{item.icon}</Text>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  contentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  contentItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background.default,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  contentIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  contentTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  contentDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

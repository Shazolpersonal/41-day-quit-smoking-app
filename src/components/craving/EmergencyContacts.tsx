import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {colors, spacing, typography, borderRadius, shadows} from '../../constants/theme';
import {EmergencyContact} from '../../types';

export interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onAddContact?: () => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  contacts,
  onAddContact,
}) => {
  const handleCall = (contact: EmergencyContact) => {
    const phoneNumber = contact.phone.replace(/[^0-9+]/g, '');
    
    Alert.alert(
      'কল করুন',
      `${contact.name} কে কল করতে চান?`,
      [
        {
          text: 'বাতিল',
          style: 'cancel',
        },
        {
          text: 'কল করুন',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`).catch(err => {
              Alert.alert('ত্রুটি', 'কল করা সম্ভব হয়নি');
              console.error('Error making call:', err);
            });
          },
        },
      ],
    );
  };

  if (contacts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>জরুরি যোগাযোগ</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📞</Text>
          <Text style={styles.emptyText}>
            কোনো জরুরি যোগাযোগ যুক্ত করা হয়নি
          </Text>
          <Text style={styles.emptySubtext}>
            বিশ্বস্ত কাউকে যুক্ত করুন যাকে আপনি প্রয়োজনে কল করতে পারবেন
          </Text>
          {onAddContact && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddContact}
              activeOpacity={0.7}>
              <Text style={styles.addButtonText}>যোগাযোগ যুক্ত করুন</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>জরুরি যোগাযোগ</Text>
      <Text style={styles.subtitle}>
        কঠিন মুহূর্তে সাহায্যের জন্য কল করুন
      </Text>

      <View style={styles.contactsList}>
        {contacts.map(contact => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRelationship}>
                {contact.relationship}
              </Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(contact)}
              activeOpacity={0.7}>
              <Text style={styles.callButtonText}>📞 কল করুন</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {onAddContact && (
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={onAddContact}
          activeOpacity={0.7}>
          <Text style={styles.addMoreButtonText}>+ আরো যুক্ত করুন</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  contactsList: {
    gap: spacing.md,
  },
  contactCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  contactInfo: {
    marginBottom: spacing.md,
  },
  contactName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  contactRelationship: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  contactPhone: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  callButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  },
  addButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  addMoreButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary.main,
    alignItems: 'center',
  },
  addMoreButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
  },
});

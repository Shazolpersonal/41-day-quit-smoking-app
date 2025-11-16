/**
 * Money Saved Breakdown Component
 * Shows detailed breakdown of money saved (daily, weekly, monthly, yearly)
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from '../common/Card';
import {theme} from '../../constants/theme';

interface MoneySavedBreakdownProps {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

const formatBengaliNumber = (num: number): string => {
  return num.toLocaleString('bn-BD');
};

export const MoneySavedBreakdown: React.FC<MoneySavedBreakdownProps> = ({
  total,
  daily,
  weekly,
  monthly,
  yearly,
}) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>💵 অর্থ সঞ্চয়ের বিস্তারিত</Text>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>মোট সঞ্চয়</Text>
        <Text style={styles.totalAmount}>৳{formatBengaliNumber(total)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.breakdownContainer}>
        <BreakdownItem label="দৈনিক সঞ্চয়" amount={daily} icon="📅" />
        <BreakdownItem label="সাপ্তাহিক সঞ্চয়" amount={weekly} icon="📆" />
        <BreakdownItem label="মাসিক সঞ্চয়" amount={monthly} icon="🗓️" />
        <BreakdownItem label="বার্ষিক সঞ্চয়" amount={yearly} icon="📊" />
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          আলহামদুলিল্লাহ! এই টাকা দিয়ে আপনি আপনার পরিবারের জন্য অনেক ভালো কিছু করতে পারবেন।
        </Text>
      </View>
    </Card>
  );
};

interface BreakdownItemProps {
  label: string;
  amount: number;
  icon: string;
}

const BreakdownItem: React.FC<BreakdownItemProps> = ({label, amount, icon}) => {
  return (
    <View style={styles.breakdownItem}>
      <View style={styles.breakdownLeft}>
        <Text style={styles.breakdownIcon}>{icon}</Text>
        <Text style={styles.breakdownLabel}>{label}</Text>
      </View>
      <Text style={styles.breakdownAmount}>৳{formatBengaliNumber(amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  totalContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.success + '10',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  totalLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  breakdownContainer: {
    gap: theme.spacing.md,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  breakdownIcon: {
    fontSize: 20,
  },
  breakdownLabel: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.success,
  },
  messageContainer: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary.main + '10',
    borderRadius: theme.borderRadius.md,
  },
  message: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

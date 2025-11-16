import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {colors, spacing, borderRadius, typography, shadows} from '../../constants/theme';

export interface AffirmationProps {
  affirmations: string[];
  title?: string;
}

export const Affirmation: React.FC<AffirmationProps> = ({
  affirmations,
  title = 'আজকের ইতিবাচক বাণী',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      {/* Islamic pattern decoration */}
      <View style={styles.decorationTop} />
      
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Affirmations list */}
      <View style={styles.affirmationsList}>
        {affirmations.map((affirmation, index) => (
          <View key={index} style={styles.affirmationItem}>
            {/* Islamic star bullet */}
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>✦</Text>
            </View>
            
            {/* Affirmation text */}
            <Text style={styles.affirmationText}>{affirmation}</Text>
          </View>
        ))}
      </View>

      {/* Islamic pattern decoration */}
      <View style={styles.decorationBottom} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  decorationTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.secondary.main,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  decorationBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.secondary.main,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  affirmationsList: {
    gap: spacing.md,
  },
  affirmationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: spacing.sm,
    paddingTop: 2,
  },
  bullet: {
    fontSize: typography.fontSize.md,
    color: colors.secondary.main,
  },
  affirmationText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.neutral.white,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.md,
  },
});

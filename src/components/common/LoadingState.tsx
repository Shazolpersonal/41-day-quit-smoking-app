/**
 * LoadingState Component
 * 
 * Reusable loading state component with different variants
 */

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

export type LoadingVariant = 'spinner' | 'skeleton' | 'overlay' | 'inline';

export interface LoadingStateProps {
  variant?: LoadingVariant;
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  message,
  size = 'large',
  color = colors.primary.main,
  style,
}) => {
  if (variant === 'spinner') {
    return (
      <View style={[styles.container, styles.spinnerContainer, style]}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  if (variant === 'skeleton') {
    return (
      <View style={[styles.container, style]}>
        <SkeletonLoader />
      </View>
    );
  }

  if (variant === 'overlay') {
    return (
      <View style={[styles.overlay, style]}>
        <View style={styles.overlayContent}>
          <ActivityIndicator size={size} color={color} />
          {message && <Text style={styles.overlayMessage}>{message}</Text>}
        </View>
      </View>
    );
  }

  // inline variant
  return (
    <View style={[styles.inlineContainer, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.inlineMessage}>{message}</Text>}
    </View>
  );
};

/**
 * Skeleton Loader Component
 */
const SkeletonLoader: React.FC = () => {
  return (
    <View style={styles.skeletonContainer}>
      <View style={[styles.skeletonItem, styles.skeletonTitle]} />
      <View style={[styles.skeletonItem, styles.skeletonLine]} />
      <View style={[styles.skeletonItem, styles.skeletonLine]} />
      <View style={[styles.skeletonItem, styles.skeletonLineShort]} />
    </View>
  );
};

/**
 * Skeleton Item for list items
 */
export const SkeletonItem: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.skeletonItemContainer, style]}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonItem, styles.skeletonItemTitle]} />
        <View style={[styles.skeletonItem, styles.skeletonItemSubtitle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  spinnerContainer: {
    minHeight: 200,
  },
  message: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  overlayContent: {
    backgroundColor: colors.neutral.white,
    padding: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 150,
  },
  overlayMessage: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    textAlign: 'center',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  inlineMessage: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  
  // Skeleton styles
  skeletonContainer: {
    padding: spacing.md,
  },
  skeletonItem: {
    backgroundColor: colors.neutral.gray[200],
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  skeletonTitle: {
    height: 24,
    width: '60%',
    marginBottom: spacing.md,
  },
  skeletonLine: {
    height: 16,
    width: '100%',
  },
  skeletonLineShort: {
    height: 16,
    width: '70%',
  },
  
  // Skeleton item styles
  skeletonItemContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral.gray[200],
    marginRight: spacing.md,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonItemTitle: {
    height: 16,
    width: '70%',
    marginBottom: spacing.xs,
  },
  skeletonItemSubtitle: {
    height: 14,
    width: '50%',
  },
});

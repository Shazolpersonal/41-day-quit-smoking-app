/**
 * Splash Screen
 * Displays app logo and name while app initializes
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Animated, StatusBar} from 'react-native';
import {colors, spacing, typography} from '../constants/theme';

export interface SplashScreenProps {
  onFinish: () => void;
  timeout?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  timeout = 2500,
}) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after timeout
    const timer = setTimeout(() => {
      onFinish();
    }, timeout);

    return () => clearTimeout(timer);
  }, [onFinish, timeout]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.primary.main}
        barStyle="light-content"
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {/* App Icon/Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            {/* Islamic Crescent and Star */}
            <Text style={styles.logoIcon}>☪️</Text>
          </View>
        </View>

        {/* App Name in Bangla */}
        <Text style={styles.appName}>৪১ দিনে ধূমপান মুক্তি</Text>
        <Text style={styles.appSubtitle}>ইসলামিক পথনির্দেশনা সহ</Text>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>আল্লাহর সাহায্যে সফলতা</Text>
        </View>
      </Animated.View>

      {/* Version */}
      <Text style={styles.version}>সংস্করণ ১.০.০</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 64,
  },
  appName: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.neutral.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.xl,
  },
  taglineContainer: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  tagline: {
    fontSize: typography.fontSize.md,
    color: colors.secondary.main,
    textAlign: 'center',
    fontWeight: typography.fontWeight.semibold,
  },
  version: {
    position: 'absolute',
    bottom: spacing.xl,
    fontSize: typography.fontSize.xs,
    color: colors.neutral.white,
    opacity: 0.7,
  },
});

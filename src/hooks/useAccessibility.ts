/**
 * useAccessibility Hook
 * Provides accessibility features and font scaling
 */

import {useState, useEffect} from 'react';
import {
  AccessibilityInfo,
  useWindowDimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import {useSettings} from '../context/SettingsContext';

export interface AccessibilityState {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isBoldTextEnabled: boolean;
  fontScale: number;
  scaledFontSize: (baseSize: number) => number;
  minTouchTargetSize: number;
}

export const useAccessibility = (): AccessibilityState => {
  const {settings} = useSettings();
  const {fontScale: systemFontScale} = useWindowDimensions();
  
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isBoldTextEnabled, setIsBoldTextEnabled] = useState(false);

  // Get effective font scale (system + user preference)
  // Convert fontSize setting to scale multiplier
  const getFontSizeMultiplier = (): number => {
    if (!settings) return 1;
    switch (settings.appearance.fontSize) {
      case 'small':
        return 0.85;
      case 'large':
        return 1.15;
      default:
        return 1;
    }
  };

  const effectiveFontScale = Math.min(
    systemFontScale * getFontSizeMultiplier(),
    2.0 // Cap at 200% for layout stability
  );

  useEffect(() => {
    // Check screen reader status
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };

    // Check reduce motion preference
    const checkReduceMotion = async () => {
      if (Platform.OS === 'android') {
        // Android doesn't have a direct API for this
        // We'll use the screen reader as a proxy
        const enabled = await AccessibilityInfo.isScreenReaderEnabled();
        setIsReduceMotionEnabled(enabled);
      } else {
        // iOS has isReduceMotionEnabled
        try {
          const enabled = await (AccessibilityInfo as any).isReduceMotionEnabled?.();
          setIsReduceMotionEnabled(enabled || false);
        } catch {
          setIsReduceMotionEnabled(false);
        }
      }
    };

    // Check bold text preference
    const checkBoldText = async () => {
      if (Platform.OS === 'ios') {
        try {
          const enabled = await (AccessibilityInfo as any).isBoldTextEnabled?.();
          setIsBoldTextEnabled(enabled || false);
        } catch {
          setIsBoldTextEnabled(false);
        }
      }
    };

    checkScreenReader();
    checkReduceMotion();
    checkBoldText();

    // Listen for changes
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged' as any,
      setIsReduceMotionEnabled
    );

    const boldTextListener = AccessibilityInfo.addEventListener(
      'boldTextChanged' as any,
      setIsBoldTextEnabled
    );

    return () => {
      screenReaderListener?.remove();
      reduceMotionListener?.remove();
      boldTextListener?.remove();
    };
  }, []);

  /**
   * Scale font size based on system and user preferences
   */
  const scaledFontSize = (baseSize: number): number => {
    return Math.round(baseSize * effectiveFontScale);
  };

  /**
   * Minimum touch target size (44x44 points)
   */
  const minTouchTargetSize = 44;

  return {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isBoldTextEnabled,
    fontScale: effectiveFontScale,
    scaledFontSize,
    minTouchTargetSize,
  };
};

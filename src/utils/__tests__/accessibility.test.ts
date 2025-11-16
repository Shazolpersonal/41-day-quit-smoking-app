/**
 * Accessibility Utilities Tests
 */

import {
  getProgressLabel,
  getDayCounterLabel,
  getMoneySavedLabel,
  getTimeDurationLabel,
  getTaskCompletionLabel,
  getMilestoneBadgeLabel,
  getCravingIntensityLabel,
  getAccessibilityHint,
  isTouchTargetAccessible,
  formatNumberForAccessibility,
} from '../accessibility';

describe('Accessibility Utilities', () => {
  describe('getProgressLabel', () => {
    it('should return correct progress label', () => {
      const label = getProgressLabel(5, 10);
      expect(label).toContain('5');
      expect(label).toContain('10');
      expect(label).toContain('50');
    });

    it('should handle 100% progress', () => {
      const label = getProgressLabel(10, 10);
      expect(label).toContain('100');
    });
  });

  describe('getDayCounterLabel', () => {
    it('should return correct day counter label', () => {
      const label = getDayCounterLabel(15, 41);
      expect(label).toContain('15');
      expect(label).toContain('41');
    });
  });

  describe('getMoneySavedLabel', () => {
    it('should format money with 2 decimal places', () => {
      const label = getMoneySavedLabel(1234.56);
      expect(label).toContain('1234.56');
      expect(label).toContain('টাকা');
    });
  });

  describe('getTimeDurationLabel', () => {
    it('should format time with all units', () => {
      const label = getTimeDurationLabel(5, 12, 30);
      expect(label).toContain('5 দিন');
      expect(label).toContain('12 ঘন্টা');
      expect(label).toContain('30 মিনিট');
    });

    it('should omit zero values', () => {
      const label = getTimeDurationLabel(5, 0, 30);
      expect(label).not.toContain('0 ঘন্টা');
      expect(label).toContain('5 দিন');
      expect(label).toContain('30 মিনিট');
    });
  });

  describe('getTaskCompletionLabel', () => {
    it('should indicate completed task', () => {
      const label = getTaskCompletionLabel(5, 5, true);
      expect(label).toContain('সম্পূর্ণ হয়েছে');
    });

    it('should indicate incomplete task', () => {
      const label = getTaskCompletionLabel(3, 5, false);
      expect(label).toContain('সম্পূর্ণ হয়নি');
    });
  });

  describe('getMilestoneBadgeLabel', () => {
    it('should indicate achieved milestone', () => {
      const label = getMilestoneBadgeLabel(7, 'প্রথম সপ্তাহ', true);
      expect(label).toContain('অর্জিত');
      expect(label).toContain('7');
    });

    it('should indicate unachieved milestone', () => {
      const label = getMilestoneBadgeLabel(14, 'দুই সপ্তাহ', false);
      expect(label).toContain('এখনও অর্জিত হয়নি');
    });
  });

  describe('getCravingIntensityLabel', () => {
    it('should return correct intensity label for low value', () => {
      const label = getCravingIntensityLabel(1);
      expect(label).toContain('খুব দুর্বল');
    });

    it('should return correct intensity label for high value', () => {
      const label = getCravingIntensityLabel(10);
      expect(label).toContain('অসহনীয়');
    });

    it('should return correct intensity label for mid value', () => {
      const label = getCravingIntensityLabel(5);
      expect(label).toContain('মাঝারি শক্তিশালী');
    });
  });

  describe('getAccessibilityHint', () => {
    it('should return correct hint for press action', () => {
      const hint = getAccessibilityHint('press');
      expect(hint).toBe('চাপুন');
    });

    it('should return correct hint for toggle action', () => {
      const hint = getAccessibilityHint('toggle');
      expect(hint).toBe('টগল করতে ট্যাপ করুন');
    });

    it('should return default hint for unknown action', () => {
      const hint = getAccessibilityHint('unknown');
      expect(hint).toBe('ট্যাপ করুন');
    });
  });

  describe('isTouchTargetAccessible', () => {
    it('should return true for accessible touch target', () => {
      expect(isTouchTargetAccessible(44, 44)).toBe(true);
      expect(isTouchTargetAccessible(48, 48)).toBe(true);
    });

    it('should return false for too small touch target', () => {
      expect(isTouchTargetAccessible(40, 40)).toBe(false);
      expect(isTouchTargetAccessible(44, 40)).toBe(false);
    });
  });

  describe('formatNumberForAccessibility', () => {
    it('should format number with locale', () => {
      const formatted = formatNumberForAccessibility(1234);
      expect(formatted).toBeTruthy();
    });
  });
});

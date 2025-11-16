/**
 * Haptic Feedback Service
 * 
 * Provides haptic feedback functionality throughout the app
 * Respects user's haptic feedback settings
 */

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Platform } from 'react-native';

// Haptic feedback options
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export enum HapticFeedbackType {
  LIGHT = 'impactLight',
  MEDIUM = 'impactMedium',
  HEAVY = 'impactHeavy',
  SUCCESS = 'notificationSuccess',
  WARNING = 'notificationWarning',
  ERROR = 'notificationError',
  SELECTION = 'selection',
  RIGID = 'rigid',
  SOFT = 'soft',
}

class HapticService {
  private isEnabled: boolean = true;

  /**
   * Set whether haptic feedback is enabled
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Get current haptic feedback enabled state
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Trigger haptic feedback
   */
  private trigger(type: HapticFeedbackType): void {
    if (!this.isEnabled) {
      return;
    }

    try {
      ReactNativeHapticFeedback.trigger(type, options);
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  /**
   * Light haptic feedback for button presses
   */
  light(): void {
    this.trigger(HapticFeedbackType.LIGHT);
  }

  /**
   * Medium haptic feedback for selections
   */
  medium(): void {
    this.trigger(HapticFeedbackType.MEDIUM);
  }

  /**
   * Heavy haptic feedback for important actions
   */
  heavy(): void {
    this.trigger(HapticFeedbackType.HEAVY);
  }

  /**
   * Success haptic feedback for task completion
   */
  success(): void {
    this.trigger(HapticFeedbackType.SUCCESS);
  }

  /**
   * Warning haptic feedback
   */
  warning(): void {
    this.trigger(HapticFeedbackType.WARNING);
  }

  /**
   * Error haptic feedback
   */
  error(): void {
    this.trigger(HapticFeedbackType.ERROR);
  }

  /**
   * Selection haptic feedback for UI interactions
   */
  selection(): void {
    this.trigger(HapticFeedbackType.SELECTION);
  }

  /**
   * Rigid haptic feedback
   */
  rigid(): void {
    this.trigger(HapticFeedbackType.RIGID);
  }

  /**
   * Soft haptic feedback
   */
  soft(): void {
    this.trigger(HapticFeedbackType.SOFT);
  }

  /**
   * Haptic feedback for task completion
   */
  taskCompleted(): void {
    this.success();
  }

  /**
   * Haptic feedback for milestone achievement
   * Provides a celebratory pattern
   */
  milestoneAchieved(): void {
    if (!this.isEnabled) {
      return;
    }

    // Create a celebratory pattern
    this.success();
    setTimeout(() => this.medium(), 100);
    setTimeout(() => this.success(), 200);
  }

  /**
   * Haptic feedback for button press
   */
  buttonPress(): void {
    this.light();
  }

  /**
   * Haptic feedback for SOS button press
   */
  sosButtonPress(): void {
    this.heavy();
  }

  /**
   * Haptic feedback for toggle switch
   */
  toggleSwitch(): void {
    this.selection();
  }

  /**
   * Haptic feedback for slider interaction
   */
  sliderChange(): void {
    this.selection();
  }

  /**
   * Haptic feedback for navigation
   */
  navigate(): void {
    this.light();
  }

  /**
   * Haptic feedback for craving logged
   */
  cravingLogged(): void {
    this.medium();
  }

  /**
   * Haptic feedback for journal entry saved
   */
  journalSaved(): void {
    this.success();
  }

  /**
   * Haptic feedback for data deleted
   */
  dataDeleted(): void {
    this.warning();
  }
}

// Export singleton instance
export const hapticService = new HapticService();
export default hapticService;

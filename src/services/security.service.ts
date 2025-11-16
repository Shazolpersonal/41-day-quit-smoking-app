import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

/**
 * Security Service
 * Handles PIN lock, biometric authentication, and security settings
 */

const SECURITY_STORAGE_KEYS = {
  PIN_HASH: '@quit_smoking_pin_hash',
  PIN_ENABLED: '@quit_smoking_pin_enabled',
  BIOMETRIC_ENABLED: '@quit_smoking_biometric_enabled',
  FAILED_ATTEMPTS: '@quit_smoking_failed_attempts',
  LOCKED_UNTIL: '@quit_smoking_locked_until',
  LAST_ACTIVITY: '@quit_smoking_last_activity',
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const AUTO_LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export interface SecuritySettings {
  pinEnabled: boolean;
  biometricEnabled: boolean;
  autoLockEnabled: boolean;
  autoLockTimeout: number;
}

class SecurityService {
  private failedAttempts: number = 0;
  private lockedUntil: number | null = null;

  /**
   * Initialize security service
   */
  async initialize(): Promise<void> {
    try {
      const failedAttemptsStr = await AsyncStorage.getItem(
        SECURITY_STORAGE_KEYS.FAILED_ATTEMPTS
      );
      this.failedAttempts = failedAttemptsStr ? parseInt(failedAttemptsStr, 10) : 0;

      const lockedUntilStr = await AsyncStorage.getItem(
        SECURITY_STORAGE_KEYS.LOCKED_UNTIL
      );
      this.lockedUntil = lockedUntilStr ? parseInt(lockedUntilStr, 10) : null;
    } catch (error) {
      console.error('Error initializing security service:', error);
    }
  }

  /**
   * Hash PIN for secure storage
   */
  private hashPin(pin: string): string {
    // Simple hash function (in production, use bcrypt or similar)
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Set up PIN lock
   */
  async setupPin(pin: string): Promise<boolean> {
    try {
      if (pin.length < 4) {
        throw new Error('PIN must be at least 4 digits');
      }

      const hashedPin = this.hashPin(pin);
      await AsyncStorage.setItem(SECURITY_STORAGE_KEYS.PIN_HASH, hashedPin);
      await AsyncStorage.setItem(SECURITY_STORAGE_KEYS.PIN_ENABLED, 'true');
      
      return true;
    } catch (error) {
      console.error('Error setting up PIN:', error);
      return false;
    }
  }

  /**
   * Verify PIN
   */
  async verifyPin(pin: string): Promise<boolean> {
    try {
      // Check if account is locked
      if (this.isLocked()) {
        const remainingTime = this.getRemainingLockTime();
        Alert.alert(
          'অ্যাকাউন্ট লক',
          `অনেকবার ভুল পিন দেওয়ার কারণে অ্যাকাউন্ট লক হয়েছে। ${Math.ceil(remainingTime / 60000)} মিনিট পর আবার চেষ্টা করুন।`
        );
        return false;
      }

      const storedHash = await AsyncStorage.getItem(SECURITY_STORAGE_KEYS.PIN_HASH);
      if (!storedHash) {
        return false;
      }

      const inputHash = this.hashPin(pin);
      const isValid = inputHash === storedHash;

      if (isValid) {
        // Reset failed attempts on successful login
        await this.resetFailedAttempts();
      } else {
        // Increment failed attempts
        await this.incrementFailedAttempts();
      }

      return isValid;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  }

  /**
   * Change PIN
   */
  async changePin(oldPin: string, newPin: string): Promise<boolean> {
    try {
      // Verify old PIN
      const isOldPinValid = await this.verifyPin(oldPin);
      if (!isOldPinValid) {
        return false;
      }

      // Set new PIN
      return await this.setupPin(newPin);
    } catch (error) {
      console.error('Error changing PIN:', error);
      return false;
    }
  }

  /**
   * Check if PIN is enabled
   */
  async isPinEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(SECURITY_STORAGE_KEYS.PIN_ENABLED);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking PIN status:', error);
      return false;
    }
  }

  /**
   * Disable PIN lock
   */
  async disablePin(pin: string): Promise<boolean> {
    try {
      // Verify PIN before disabling
      const isValid = await this.verifyPin(pin);
      if (!isValid) {
        return false;
      }

      await AsyncStorage.removeItem(SECURITY_STORAGE_KEYS.PIN_HASH);
      await AsyncStorage.setItem(SECURITY_STORAGE_KEYS.PIN_ENABLED, 'false');
      await this.resetFailedAttempts();
      
      return true;
    } catch (error) {
      console.error('Error disabling PIN:', error);
      return false;
    }
  }

  /**
   * Enable biometric authentication
   */
  async enableBiometric(): Promise<boolean> {
    try {
      // Note: Actual biometric implementation would use react-native-touch-id
      // or react-native-biometrics
      await AsyncStorage.setItem(SECURITY_STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
      return true;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometric(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(SECURITY_STORAGE_KEYS.BIOMETRIC_ENABLED, 'false');
      return true;
    } catch (error) {
      console.error('Error disabling biometric:', error);
      return false;
    }
  }

  /**
   * Check if biometric is enabled
   */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(
        SECURITY_STORAGE_KEYS.BIOMETRIC_ENABLED
      );
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return false;
    }
  }

  /**
   * Authenticate with biometrics
   */
  async authenticateWithBiometric(): Promise<boolean> {
    try {
      // Note: This is a placeholder. In production, use:
      // import TouchID from 'react-native-touch-id';
      // const result = await TouchID.authenticate('প্রবেশ করতে যাচাই করুন');
      
      // For now, return true if biometric is enabled
      return await this.isBiometricEnabled();
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return false;
    }
  }

  /**
   * Increment failed login attempts
   */
  private async incrementFailedAttempts(): Promise<void> {
    try {
      this.failedAttempts++;
      await AsyncStorage.setItem(
        SECURITY_STORAGE_KEYS.FAILED_ATTEMPTS,
        this.failedAttempts.toString()
      );

      if (this.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        // Lock the account
        this.lockedUntil = Date.now() + LOCKOUT_DURATION;
        await AsyncStorage.setItem(
          SECURITY_STORAGE_KEYS.LOCKED_UNTIL,
          this.lockedUntil.toString()
        );

        Alert.alert(
          'অ্যাকাউন্ট লক',
          `অনেকবার ভুল পিন দেওয়ার কারণে অ্যাকাউন্ট ${LOCKOUT_DURATION / 60000} মিনিটের জন্য লক হয়েছে।`
        );
      } else {
        const remainingAttempts = MAX_FAILED_ATTEMPTS - this.failedAttempts;
        Alert.alert(
          'ভুল পিন',
          `পিন ভুল হয়েছে। আরও ${remainingAttempts} বার চেষ্টা করতে পারবেন।`
        );
      }
    } catch (error) {
      console.error('Error incrementing failed attempts:', error);
    }
  }

  /**
   * Reset failed login attempts
   */
  private async resetFailedAttempts(): Promise<void> {
    try {
      this.failedAttempts = 0;
      this.lockedUntil = null;
      await AsyncStorage.removeItem(SECURITY_STORAGE_KEYS.FAILED_ATTEMPTS);
      await AsyncStorage.removeItem(SECURITY_STORAGE_KEYS.LOCKED_UNTIL);
    } catch (error) {
      console.error('Error resetting failed attempts:', error);
    }
  }

  /**
   * Check if account is locked
   */
  isLocked(): boolean {
    if (!this.lockedUntil) {
      return false;
    }

    if (Date.now() >= this.lockedUntil) {
      // Lock period has expired
      this.resetFailedAttempts();
      return false;
    }

    return true;
  }

  /**
   * Get remaining lock time in milliseconds
   */
  getRemainingLockTime(): number {
    if (!this.lockedUntil) {
      return 0;
    }

    const remaining = this.lockedUntil - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Update last activity timestamp
   */
  async updateLastActivity(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        SECURITY_STORAGE_KEYS.LAST_ACTIVITY,
        Date.now().toString()
      );
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  }

  /**
   * Check if app should be locked due to inactivity
   */
  async shouldAutoLock(): Promise<boolean> {
    try {
      const isPinEnabled = await this.isPinEnabled();
      if (!isPinEnabled) {
        return false;
      }

      const lastActivityStr = await AsyncStorage.getItem(
        SECURITY_STORAGE_KEYS.LAST_ACTIVITY
      );
      
      if (!lastActivityStr) {
        return false;
      }

      const lastActivity = parseInt(lastActivityStr, 10);
      const timeSinceLastActivity = Date.now() - lastActivity;

      return timeSinceLastActivity >= AUTO_LOCK_TIMEOUT;
    } catch (error) {
      console.error('Error checking auto-lock:', error);
      return false;
    }
  }

  /**
   * Get security settings
   */
  async getSecuritySettings(): Promise<SecuritySettings> {
    try {
      const [pinEnabled, biometricEnabled] = await Promise.all([
        this.isPinEnabled(),
        this.isBiometricEnabled(),
      ]);

      return {
        pinEnabled,
        biometricEnabled,
        autoLockEnabled: pinEnabled,
        autoLockTimeout: AUTO_LOCK_TIMEOUT,
      };
    } catch (error) {
      console.error('Error getting security settings:', error);
      return {
        pinEnabled: false,
        biometricEnabled: false,
        autoLockEnabled: false,
        autoLockTimeout: AUTO_LOCK_TIMEOUT,
      };
    }
  }

  /**
   * Clear all security data
   */
  async clearSecurityData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        SECURITY_STORAGE_KEYS.PIN_HASH,
        SECURITY_STORAGE_KEYS.PIN_ENABLED,
        SECURITY_STORAGE_KEYS.BIOMETRIC_ENABLED,
        SECURITY_STORAGE_KEYS.FAILED_ATTEMPTS,
        SECURITY_STORAGE_KEYS.LOCKED_UNTIL,
        SECURITY_STORAGE_KEYS.LAST_ACTIVITY,
      ]);
      
      this.failedAttempts = 0;
      this.lockedUntil = null;
    } catch (error) {
      console.error('Error clearing security data:', error);
    }
  }
}

export const securityService = new SecurityService();
export default securityService;

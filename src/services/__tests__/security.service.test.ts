import AsyncStorage from '@react-native-async-storage/async-storage';
import {securityService} from '../security.service';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
    prompt: jest.fn(),
  },
}));

describe('SecurityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PIN Management', () => {
    it('should set up PIN successfully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await securityService.setupPin('123456');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('pin_hash'),
        expect.any(String)
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('pin_enabled'),
        'true'
      );
    });

    it('should reject PIN shorter than 4 digits', async () => {
      const result = await securityService.setupPin('123');

      expect(result).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should verify correct PIN', async () => {
      const pin = '123456';
      const hashedPin = 'hashed_pin';

      // Setup PIN first
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(hashedPin);

      await securityService.setupPin(pin);

      // Verify PIN
      const result = await securityService.verifyPin(pin);

      expect(result).toBe(true);
    });

    it('should check if PIN is enabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

      const result = await securityService.isPinEnabled();

      expect(result).toBe(true);
    });

    it('should disable PIN with correct PIN', async () => {
      const pin = '123456';

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('hashed_pin');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await securityService.setupPin(pin);
      const result = await securityService.disablePin(pin);

      expect(result).toBe(true);
    });
  });

  describe('Biometric Authentication', () => {
    it('should enable biometric authentication', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await securityService.enableBiometric();

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('biometric_enabled'),
        'true'
      );
    });

    it('should disable biometric authentication', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await securityService.disableBiometric();

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('biometric_enabled'),
        'false'
      );
    });

    it('should check if biometric is enabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

      const result = await securityService.isBiometricEnabled();

      expect(result).toBe(true);
    });
  });

  describe('Account Locking', () => {
    it('should not be locked initially', () => {
      const result = securityService.isLocked();

      expect(result).toBe(false);
    });

    it('should return remaining lock time', () => {
      const result = securityService.getRemainingLockTime();

      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Activity Tracking', () => {
    it('should update last activity timestamp', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await securityService.updateLastActivity();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('last_activity'),
        expect.any(String)
      );
    });

    it('should check if app should auto-lock', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('true') // PIN enabled
        .mockResolvedValueOnce(Date.now().toString()); // Last activity

      const result = await securityService.shouldAutoLock();

      expect(result).toBe(false);
    });
  });

  describe('Security Settings', () => {
    it('should get security settings', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('true') // PIN enabled
        .mockResolvedValueOnce('true'); // Biometric enabled

      const settings = await securityService.getSecuritySettings();

      expect(settings).toHaveProperty('pinEnabled', true);
      expect(settings).toHaveProperty('biometricEnabled', true);
      expect(settings).toHaveProperty('autoLockEnabled');
      expect(settings).toHaveProperty('autoLockTimeout');
    });
  });

  describe('Data Cleanup', () => {
    it('should clear all security data', async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

      await securityService.clearSecurityData();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.stringContaining('pin_hash'),
          expect.stringContaining('pin_enabled'),
          expect.stringContaining('biometric_enabled'),
        ])
      );
    });
  });
});

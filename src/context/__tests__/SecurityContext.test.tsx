import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {SecurityProvider, useSecurity} from '../SecurityContext';
import {securityService} from '../../services/security.service';
import {encryptionService} from '../../services/encryption.service';

// Mock services
jest.mock('../../services/security.service');
jest.mock('../../services/encryption.service');

// Mock AppState
jest.mock('react-native', () => ({
  AppState: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
}));

describe('SecurityContext', () => {
  const wrapper = ({children}: {children: React.ReactNode}) => (
    <SecurityProvider>{children}</SecurityProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    
    (securityService.initialize as jest.Mock).mockResolvedValue(undefined);
    (encryptionService.initialize as jest.Mock).mockResolvedValue(true);
    (securityService.getSecuritySettings as jest.Mock).mockResolvedValue({
      pinEnabled: false,
      biometricEnabled: false,
      autoLockEnabled: false,
      autoLockTimeout: 300000,
    });
  });

  it('should provide security context', async () => {
    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should initialize security on mount', async () => {
    renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(securityService.initialize).toHaveBeenCalled();
      expect(encryptionService.initialize).toHaveBeenCalled();
    });
  });

  it('should setup PIN successfully', async () => {
    (securityService.setupPin as jest.Mock).mockResolvedValue(true);
    (encryptionService.initialize as jest.Mock).mockResolvedValue(true);

    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success = false;
    await act(async () => {
      success = await result.current.setupPin('123456');
    });

    expect(success).toBe(true);
    expect(securityService.setupPin).toHaveBeenCalledWith('123456');
  });

  it('should verify PIN successfully', async () => {
    (securityService.verifyPin as jest.Mock).mockResolvedValue(true);
    (encryptionService.initialize as jest.Mock).mockResolvedValue(true);

    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let isValid = false;
    await act(async () => {
      isValid = await result.current.verifyPin('123456');
    });

    expect(isValid).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLocked).toBe(false);
  });

  it('should handle incorrect PIN', async () => {
    (securityService.verifyPin as jest.Mock).mockResolvedValue(false);

    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let isValid = false;
    await act(async () => {
      isValid = await result.current.verifyPin('wrong');
    });

    expect(isValid).toBe(false);
  });

  it('should change PIN successfully', async () => {
    (securityService.changePin as jest.Mock).mockResolvedValue(true);
    (encryptionService.changeKey as jest.Mock).mockResolvedValue(true);

    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success = false;
    await act(async () => {
      success = await result.current.changePin('123456', '654321');
    });

    expect(success).toBe(true);
    expect(securityService.changePin).toHaveBeenCalledWith('123456', '654321');
  });

  it('should disable PIN successfully', async () => {
    (securityService.disablePin as jest.Mock).mockResolvedValue(true);
    (encryptionService.clearKey as jest.Mock).mockResolvedValue(undefined);

    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success = false;
    await act(async () => {
      success = await result.current.disablePin('123456');
    });

    expect(success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should enable biometric authentication', async () => {
    (securityService.enableBiometric as jest.Mock).mockResolvedValue(true);

    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success = false;
    await act(async () => {
      success = await result.current.enableBiometric();
    });

    expect(success).toBe(true);
  });

  it('should disable biometric authentication', async () => {
    (securityService.disableBiometric as jest.Mock).mockResolvedValue(true);

    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success = false;
    await act(async () => {
      success = await result.current.disableBiometric();
    });

    expect(success).toBe(true);
  });

  it('should authenticate with biometric', async () => {
    (securityService.authenticateWithBiometric as jest.Mock).mockResolvedValue(
      true
    );

    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success = false;
    await act(async () => {
      success = await result.current.authenticateWithBiometric();
    });

    expect(success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should lock the app', async () => {
    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.lock();
    });

    expect(result.current.isLocked).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should unlock the app', async () => {
    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.lock();
    });

    expect(result.current.isLocked).toBe(true);

    act(() => {
      result.current.unlock();
    });

    expect(result.current.isLocked).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should refresh security settings', async () => {
    const newSettings = {
      pinEnabled: true,
      biometricEnabled: true,
      autoLockEnabled: true,
      autoLockTimeout: 300000,
    };

    (securityService.getSecuritySettings as jest.Mock).mockResolvedValue(
      newSettings
    );

    const {result} = renderHook(() => useSecurity(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshSecuritySettings();
    });

    expect(result.current.securitySettings).toEqual(newSettings);
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useSecurity());
    }).toThrow('useSecurity must be used within a SecurityProvider');

    consoleSpy.mockRestore();
  });
});

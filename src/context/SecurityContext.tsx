import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {securityService, SecuritySettings} from '../services/security.service';
import {encryptionService} from '../services/encryption.service';

interface SecurityContextType {
  isLocked: boolean;
  isAuthenticated: boolean;
  securitySettings: SecuritySettings | null;
  loading: boolean;
  setupPin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  changePin: (oldPin: string, newPin: string) => Promise<boolean>;
  disablePin: (pin: string) => Promise<boolean>;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<boolean>;
  authenticateWithBiometric: () => Promise<boolean>;
  lock: () => void;
  unlock: () => void;
  refreshSecuritySettings: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined
);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
}) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [securitySettings, setSecuritySettings] =
    useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize security service
  useEffect(() => {
    initializeSecurity();
  }, []);

  // Handle app state changes for auto-lock
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  /**
   * Initialize security service
   */
  const initializeSecurity = async () => {
    try {
      setLoading(true);
      await securityService.initialize();
      await encryptionService.initialize();
      
      const settings = await securityService.getSecuritySettings();
      setSecuritySettings(settings);

      // Check if PIN is enabled and lock if needed
      if (settings.pinEnabled) {
        const shouldLock = await securityService.shouldAutoLock();
        setIsLocked(shouldLock);
        setIsAuthenticated(!shouldLock);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error initializing security:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle app state changes
   */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App came to foreground
      if (securitySettings?.pinEnabled) {
        const shouldLock = await securityService.shouldAutoLock();
        if (shouldLock) {
          setIsLocked(true);
          setIsAuthenticated(false);
        }
      }
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App went to background
      await securityService.updateLastActivity();
    }
  };

  /**
   * Set up PIN lock
   */
  const setupPin = async (pin: string): Promise<boolean> => {
    try {
      const success = await securityService.setupPin(pin);
      
      if (success) {
        // Initialize encryption with PIN
        await encryptionService.initialize(pin);
        await refreshSecuritySettings();
        setIsAuthenticated(true);
        setIsLocked(false);
      }
      
      return success;
    } catch (error) {
      console.error('Error setting up PIN:', error);
      return false;
    }
  };

  /**
   * Verify PIN
   */
  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      const isValid = await securityService.verifyPin(pin);
      
      if (isValid) {
        // Initialize encryption with PIN
        await encryptionService.initialize(pin);
        setIsAuthenticated(true);
        setIsLocked(false);
        await securityService.updateLastActivity();
      }
      
      return isValid;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  };

  /**
   * Change PIN
   */
  const changePin = async (
    oldPin: string,
    newPin: string
  ): Promise<boolean> => {
    try {
      const success = await securityService.changePin(oldPin, newPin);
      
      if (success) {
        // Update encryption key
        await encryptionService.changeKey(oldPin, newPin);
        await refreshSecuritySettings();
      }
      
      return success;
    } catch (error) {
      console.error('Error changing PIN:', error);
      return false;
    }
  };

  /**
   * Disable PIN lock
   */
  const disablePin = async (pin: string): Promise<boolean> => {
    try {
      const success = await securityService.disablePin(pin);
      
      if (success) {
        await encryptionService.clearKey();
        await refreshSecuritySettings();
        setIsAuthenticated(true);
        setIsLocked(false);
      }
      
      return success;
    } catch (error) {
      console.error('Error disabling PIN:', error);
      return false;
    }
  };

  /**
   * Enable biometric authentication
   */
  const enableBiometric = async (): Promise<boolean> => {
    try {
      const success = await securityService.enableBiometric();
      
      if (success) {
        await refreshSecuritySettings();
      }
      
      return success;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  };

  /**
   * Disable biometric authentication
   */
  const disableBiometric = async (): Promise<boolean> => {
    try {
      const success = await securityService.disableBiometric();
      
      if (success) {
        await refreshSecuritySettings();
      }
      
      return success;
    } catch (error) {
      console.error('Error disabling biometric:', error);
      return false;
    }
  };

  /**
   * Authenticate with biometric
   */
  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      const success = await securityService.authenticateWithBiometric();
      
      if (success) {
        setIsAuthenticated(true);
        setIsLocked(false);
        await securityService.updateLastActivity();
      }
      
      return success;
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return false;
    }
  };

  /**
   * Lock the app
   */
  const lock = () => {
    setIsLocked(true);
    setIsAuthenticated(false);
  };

  /**
   * Unlock the app
   */
  const unlock = () => {
    setIsLocked(false);
    setIsAuthenticated(true);
  };

  /**
   * Refresh security settings
   */
  const refreshSecuritySettings = async (): Promise<void> => {
    try {
      const settings = await securityService.getSecuritySettings();
      setSecuritySettings(settings);
    } catch (error) {
      console.error('Error refreshing security settings:', error);
    }
  };

  const value: SecurityContextType = {
    isLocked,
    isAuthenticated,
    securitySettings,
    loading,
    setupPin,
    verifyPin,
    changePin,
    disablePin,
    enableBiometric,
    disableBiometric,
    authenticateWithBiometric,
    lock,
    unlock,
    refreshSecuritySettings,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

/**
 * Hook to use SecurityContext
 */
export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);

  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }

  return context;
};

export default SecurityContext;

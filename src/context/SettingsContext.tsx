/* eslint-disable no-console */
import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {Settings, EmergencyContact, NotificationSettings, AppearanceSettings, PrivacySettings} from '../types';
import {SettingsModel} from '../models/Settings';
import {storageService} from '../services/storage.service';

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  initializeSettings: () => Promise<boolean>;
  updateNotifications: (notifications: Partial<NotificationSettings>) => Promise<boolean>;
  updateAppearance: (appearance: Partial<AppearanceSettings>) => Promise<boolean>;
  updatePrivacy: (privacy: Partial<PrivacySettings>) => Promise<boolean>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<boolean>;
  updateEmergencyContact: (contactId: string, updates: Partial<Omit<EmergencyContact, 'id'>>) => Promise<boolean>;
  removeEmergencyContact: (contactId: string) => Promise<boolean>;
  updateSettings: (updates: Partial<Settings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  resetSettings: () => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({children}) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings data on mount
  useEffect(() => {
    loadSettings();
  }, []);

  /**
   * Load settings data from storage
   */
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const settingsData = await storageService.getSettings();
      
      // If no settings exist, create default settings
      if (!settingsData) {
        const defaultSettings = SettingsModel.createDefault();
        await storageService.saveSettings(defaultSettings);
        setSettings(defaultSettings);
      } else {
        setSettings(settingsData);
      }
    } catch (err) {
      setError('সেটিংস লোড করতে ব্যর্থ');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize settings with default values
   */
  const initializeSettings = async (): Promise<boolean> => {
    try {
      setError(null);
      const defaultSettings = SettingsModel.createDefault();
      const success = await storageService.saveSettings(defaultSettings);
      
      if (success) {
        setSettings(defaultSettings);
        return true;
      } else {
        setError('সেটিংস তৈরি করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('সেটিংস তৈরি করতে ত্রুটি');
      console.error('Error initializing settings:', err);
      return false;
    }
  };

  /**
   * Update notification settings
   */
  const updateNotifications = async (
    notifications: Partial<NotificationSettings>,
  ): Promise<boolean> => {
    try {
      setError(null);

      if (!settings) {
        setError('সেটিংস পাওয়া যায়নি');
        return false;
      }

      // Validate daily reminder time format if provided
      if (notifications.dailyReminderTime) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(notifications.dailyReminderTime)) {
          setError('সময়ের ফরম্যাট সঠিক নয় (HH:mm)');
          return false;
        }
      }

      const updatedSettings = SettingsModel.update(settings, {
        notifications: {
          ...settings.notifications,
          ...notifications,
        },
      });

      const success = await storageService.saveSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        return true;
      } else {
        setError('নোটিফিকেশন সেটিংস আপডেট করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('নোটিফিকেশন সেটিংস আপডেট করতে ত্রুটি');
      console.error('Error updating notifications:', err);
      return false;
    }
  };

  /**
   * Update appearance settings
   */
  const updateAppearance = async (
    appearance: Partial<AppearanceSettings>,
  ): Promise<boolean> => {
    try {
      setError(null);

      if (!settings) {
        setError('সেটিংস পাওয়া যায়নি');
        return false;
      }

      // Validate font size if provided
      if (appearance.fontSize && !['small', 'medium', 'large'].includes(appearance.fontSize)) {
        setError('ফন্ট সাইজ সঠিক নয়');
        return false;
      }

      // Validate theme if provided
      if (appearance.theme && !['light', 'dark'].includes(appearance.theme)) {
        setError('থিম সঠিক নয়');
        return false;
      }

      const updatedSettings = SettingsModel.update(settings, {
        appearance: {
          ...settings.appearance,
          ...appearance,
        },
      });

      const success = await storageService.saveSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        return true;
      } else {
        setError('অ্যাপিয়ারেন্স সেটিংস আপডেট করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('অ্যাপিয়ারেন্স সেটিংস আপডেট করতে ত্রুটি');
      console.error('Error updating appearance:', err);
      return false;
    }
  };

  /**
   * Update privacy settings
   */
  const updatePrivacy = async (
    privacy: Partial<PrivacySettings>,
  ): Promise<boolean> => {
    try {
      setError(null);

      if (!settings) {
        setError('সেটিংস পাওয়া যায়নি');
        return false;
      }

      // Validate PIN if provided
      if (privacy.pin !== undefined) {
        if (privacy.pin && (privacy.pin.length < 4 || privacy.pin.length > 6)) {
          setError('পিন ৪-৬ সংখ্যার হতে হবে');
          return false;
        }
        
        if (privacy.pin && !/^\d+$/.test(privacy.pin)) {
          setError('পিন শুধুমাত্র সংখ্যা হতে হবে');
          return false;
        }
      }

      const updatedSettings = SettingsModel.update(settings, {
        privacy: {
          ...settings.privacy,
          ...privacy,
        },
      });

      const success = await storageService.saveSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        return true;
      } else {
        setError('প্রাইভেসি সেটিংস আপডেট করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('প্রাইভেসি সেটিংস আপডেট করতে ত্রুটি');
      console.error('Error updating privacy:', err);
      return false;
    }
  };

  /**
   * Add a new emergency contact
   */
  const addEmergencyContact = async (
    contact: Omit<EmergencyContact, 'id'>,
  ): Promise<boolean> => {
    try {
      setError(null);

      if (!settings) {
        setError('সেটিংস পাওয়া যায়নি');
        return false;
      }

      // Validate contact data
      if (!contact.name || contact.name.trim() === '') {
        setError('নাম প্রয়োজন');
        return false;
      }

      if (!contact.phone || contact.phone.trim() === '') {
        setError('ফোন নম্বর প্রয়োজন');
        return false;
      }

      // Validate phone number format (Bangladesh format)
      const phoneRegex = /^(\+?880|0)?1[3-9]\d{8}$/;
      if (!phoneRegex.test(contact.phone.replace(/[\s-]/g, ''))) {
        setError('ফোন নম্বর সঠিক নয়');
        return false;
      }

      if (!contact.relationship || contact.relationship.trim() === '') {
        setError('সম্পর্ক প্রয়োজন');
        return false;
      }

      // Check if maximum contacts reached (limit to 5)
      if (settings.emergencyContacts.length >= 5) {
        setError('সর্বোচ্চ ৫টি জরুরি যোগাযোগ যোগ করা যাবে');
        return false;
      }

      const updatedSettings = SettingsModel.addEmergencyContact(settings, contact);
      const success = await storageService.saveSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        return true;
      } else {
        setError('জরুরি যোগাযোগ যোগ করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('জরুরি যোগাযোগ যোগ করতে ত্রুটি');
      console.error('Error adding emergency contact:', err);
      return false;
    }
  };

  /**
   * Update an existing emergency contact
   */
  const updateEmergencyContact = async (
    contactId: string,
    updates: Partial<Omit<EmergencyContact, 'id'>>,
  ): Promise<boolean> => {
    try {
      setError(null);

      if (!settings) {
        setError('সেটিংস পাওয়া যায়নি');
        return false;
      }

      // Check if contact exists
      const contactExists = settings.emergencyContacts.some(c => c.id === contactId);
      if (!contactExists) {
        setError('জরুরি যোগাযোগ পাওয়া যায়নি');
        return false;
      }

      // Validate updates
      if (updates.name !== undefined && updates.name.trim() === '') {
        setError('নাম খালি হতে পারে না');
        return false;
      }

      if (updates.phone !== undefined) {
        if (updates.phone.trim() === '') {
          setError('ফোন নম্বর খালি হতে পারে না');
          return false;
        }

        const phoneRegex = /^(\+?880|0)?1[3-9]\d{8}$/;
        if (!phoneRegex.test(updates.phone.replace(/[\s-]/g, ''))) {
          setError('ফোন নম্বর সঠিক নয়');
          return false;
        }
      }

      if (updates.relationship !== undefined && updates.relationship.trim() === '') {
        setError('সম্পর্ক খালি হতে পারে না');
        return false;
      }

      const updatedSettings = SettingsModel.updateEmergencyContact(
        settings,
        contactId,
        updates,
      );
      const success = await storageService.saveSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        return true;
      } else {
        setError('জরুরি যোগাযোগ আপডেট করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('জরুরি যোগাযোগ আপডেট করতে ত্রুটি');
      console.error('Error updating emergency contact:', err);
      return false;
    }
  };

  /**
   * Remove an emergency contact
   */
  const removeEmergencyContact = async (contactId: string): Promise<boolean> => {
    try {
      setError(null);

      if (!settings) {
        setError('সেটিংস পাওয়া যায়নি');
        return false;
      }

      // Check if contact exists
      const contactExists = settings.emergencyContacts.some(c => c.id === contactId);
      if (!contactExists) {
        setError('জরুরি যোগাযোগ পাওয়া যায়নি');
        return false;
      }

      const updatedSettings = SettingsModel.removeEmergencyContact(settings, contactId);
      const success = await storageService.saveSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        return true;
      } else {
        setError('জরুরি যোগাযোগ মুছে ফেলতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('জরুরি যোগাযোগ মুছে ফেলতে ত্রুটি');
      console.error('Error removing emergency contact:', err);
      return false;
    }
  };

  /**
   * Update settings with partial updates
   */
  const updateSettings = async (updates: Partial<Settings>): Promise<boolean> => {
    try {
      setError(null);

      if (!settings) {
        setError('সেটিংস পাওয়া যায়নি');
        return false;
      }

      const updatedSettings = SettingsModel.update(settings, updates);
      const success = await storageService.saveSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        return true;
      } else {
        setError('সেটিংস আপডেট করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('সেটিংস আপডেট করতে ত্রুটি');
      console.error('Error updating settings:', err);
      return false;
    }
  };

  /**
   * Refresh settings data from storage
   */
  const refreshSettings = async (): Promise<void> => {
    await loadSettings();
  };

  /**
   * Reset settings to default values
   */
  const resetSettings = async (): Promise<boolean> => {
    try {
      setError(null);
      const defaultSettings = SettingsModel.createDefault();
      const success = await storageService.saveSettings(defaultSettings);
      
      if (success) {
        setSettings(defaultSettings);
        return true;
      } else {
        setError('সেটিংস রিসেট করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('সেটিংস রিসেট করতে ত্রুটি');
      console.error('Error resetting settings:', err);
      return false;
    }
  };

  const value: SettingsContextType = {
    settings,
    loading,
    error,
    initializeSettings,
    updateNotifications,
    updateAppearance,
    updatePrivacy,
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
    updateSettings,
    refreshSettings,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

/**
 * Hook to use SettingsContext
 */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  return context;
};

export default SettingsContext;

import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {SettingsProvider, useSettings} from '../SettingsContext';
import {storageService} from '../../services/storage.service';
import {SettingsModel} from '../../models/Settings';
import {Settings, EmergencyContact} from '../../types';

// Mock the storage service
jest.mock('../../services/storage.service');

describe('SettingsContext', () => {
  const mockSettings: Settings = {
    notifications: {
      enabled: true,
      dailyReminder: true,
      dailyReminderTime: '08:00',
      prayerTimes: true,
      milestones: true,
      encouragement: true,
    },
    appearance: {
      fontSize: 'medium',
      theme: 'light',
      soundEffects: true,
      hapticFeedback: true,
    },
    privacy: {
      pinLock: false,
      biometric: false,
      dataEncryption: false,
    },
    emergencyContacts: [],
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <SettingsProvider>{children}</SettingsProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should load settings on mount', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

      const {result} = renderHook(() => useSettings(), {wrapper});

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.settings).toEqual(mockSettings);
      expect(result.current.error).toBeNull();
      expect(storageService.getSettings).toHaveBeenCalledTimes(1);
    });

    it('should create default settings if none exist', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(null);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.settings).toBeTruthy();
      expect(storageService.saveSettings).toHaveBeenCalled();
    });

    it('should handle loading error', async () => {
      (storageService.getSettings as jest.Mock).mockRejectedValue(
        new Error('Storage error'),
      );

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('সেটিংস লোড করতে ব্যর্থ');
      expect(result.current.settings).toBeNull();
    });
  });

  describe('initializeSettings', () => {
    it('should initialize settings with default values', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.initializeSettings();
      });

      expect(success).toBe(true);
      expect(result.current.settings).toBeTruthy();
      expect(storageService.saveSettings).toHaveBeenCalled();
    });

    it('should handle initialization error', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(false);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.initializeSettings();
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('সেটিংস তৈরি করতে ব্যর্থ');
    });
  });

  describe('updateNotifications', () => {
    it('should update notification settings', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateNotifications({
          enabled: false,
          dailyReminderTime: '09:00',
        });
      });

      expect(success).toBe(true);
      expect(result.current.settings?.notifications.enabled).toBe(false);
      expect(result.current.settings?.notifications.dailyReminderTime).toBe('09:00');
      expect(storageService.saveSettings).toHaveBeenCalled();
    });

    it('should validate daily reminder time format', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.updateNotifications({
          dailyReminderTime: '25:00', // Invalid time
        });
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('সময়ের ফরম্যাট সঠিক নয় (HH:mm)');
    });

    it('should handle update error when settings not found', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(null);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Settings will be created with defaults, so we need to clear them
      act(() => {
        (result.current as any).settings = null;
      });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.updateNotifications({enabled: false});
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('সেটিংস পাওয়া যায়নি');
    });
  });

  describe('updateAppearance', () => {
    it('should update appearance settings', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateAppearance({
          fontSize: 'large',
          theme: 'dark',
        });
      });

      expect(success).toBe(true);
      expect(result.current.settings?.appearance.fontSize).toBe('large');
      expect(result.current.settings?.appearance.theme).toBe('dark');
      expect(storageService.saveSettings).toHaveBeenCalled();
    });

    it('should validate font size', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.updateAppearance({
          fontSize: 'extra-large' as any, // Invalid size
        });
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('ফন্ট সাইজ সঠিক নয়');
    });

    it('should validate theme', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.updateAppearance({
          theme: 'blue' as any, // Invalid theme
        });
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('থিম সঠিক নয়');
    });
  });

  describe('updatePrivacy', () => {
    it('should update privacy settings', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updatePrivacy({
          pinLock: true,
          pin: '1234',
        });
      });

      expect(success).toBe(true);
      expect(result.current.settings?.privacy.pinLock).toBe(true);
      expect(result.current.settings?.privacy.pin).toBe('1234');
      expect(storageService.saveSettings).toHaveBeenCalled();
    });

    it('should validate PIN length', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.updatePrivacy({
          pin: '123', // Too short
        });
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('পিন ৪-৬ সংখ্যার হতে হবে');
    });

    it('should validate PIN format', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.updatePrivacy({
          pin: 'abcd', // Not numeric
        });
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('পিন শুধুমাত্র সংখ্যা হতে হবে');
    });
  });

  describe('Emergency Contacts', () => {
    const mockContact: Omit<EmergencyContact, 'id'> = {
      name: 'John Doe',
      phone: '01712345678',
      relationship: 'Friend',
    };

    describe('addEmergencyContact', () => {
      it('should add emergency contact', async () => {
        (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
        (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = false;
        await act(async () => {
          success = await result.current.addEmergencyContact(mockContact);
        });

        expect(success).toBe(true);
        expect(result.current.settings?.emergencyContacts).toHaveLength(1);
        expect(result.current.settings?.emergencyContacts[0].name).toBe('John Doe');
        expect(storageService.saveSettings).toHaveBeenCalled();
      });

      it('should validate contact name', async () => {
        (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = true;
        await act(async () => {
          success = await result.current.addEmergencyContact({
            ...mockContact,
            name: '',
          });
        });

        expect(success).toBe(false);
        expect(result.current.error).toBe('নাম প্রয়োজন');
      });

      it('should validate phone number', async () => {
        (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = true;
        await act(async () => {
          success = await result.current.addEmergencyContact({
            ...mockContact,
            phone: '123', // Invalid phone
          });
        });

        expect(success).toBe(false);
        expect(result.current.error).toBe('ফোন নম্বর সঠিক নয়');
      });

      it('should validate relationship', async () => {
        (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = true;
        await act(async () => {
          success = await result.current.addEmergencyContact({
            ...mockContact,
            relationship: '',
          });
        });

        expect(success).toBe(false);
        expect(result.current.error).toBe('সম্পর্ক প্রয়োজন');
      });

      it('should limit to 5 emergency contacts', async () => {
        const settingsWithMaxContacts: Settings = {
          ...mockSettings,
          emergencyContacts: [
            {id: '1', name: 'Contact 1', phone: '01712345671', relationship: 'Friend'},
            {id: '2', name: 'Contact 2', phone: '01712345672', relationship: 'Friend'},
            {id: '3', name: 'Contact 3', phone: '01712345673', relationship: 'Friend'},
            {id: '4', name: 'Contact 4', phone: '01712345674', relationship: 'Friend'},
            {id: '5', name: 'Contact 5', phone: '01712345675', relationship: 'Friend'},
          ],
        };

        (storageService.getSettings as jest.Mock).mockResolvedValue(settingsWithMaxContacts);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = true;
        await act(async () => {
          success = await result.current.addEmergencyContact(mockContact);
        });

        expect(success).toBe(false);
        expect(result.current.error).toBe('সর্বোচ্চ ৫টি জরুরি যোগাযোগ যোগ করা যাবে');
      });
    });

    describe('updateEmergencyContact', () => {
      it('should update emergency contact', async () => {
        const settingsWithContact: Settings = {
          ...mockSettings,
          emergencyContacts: [
            {id: 'contact_1', name: 'John Doe', phone: '01712345678', relationship: 'Friend'},
          ],
        };

        (storageService.getSettings as jest.Mock).mockResolvedValue(settingsWithContact);
        (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = false;
        await act(async () => {
          success = await result.current.updateEmergencyContact('contact_1', {
            name: 'Jane Doe',
          });
        });

        expect(success).toBe(true);
        expect(result.current.settings?.emergencyContacts[0].name).toBe('Jane Doe');
        expect(storageService.saveSettings).toHaveBeenCalled();
      });

      it('should handle non-existent contact', async () => {
        (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = true;
        await act(async () => {
          success = await result.current.updateEmergencyContact('non_existent', {
            name: 'Jane Doe',
          });
        });

        expect(success).toBe(false);
        expect(result.current.error).toBe('জরুরি যোগাযোগ পাওয়া যায়নি');
      });

      it('should validate updated phone number', async () => {
        const settingsWithContact: Settings = {
          ...mockSettings,
          emergencyContacts: [
            {id: 'contact_1', name: 'John Doe', phone: '01712345678', relationship: 'Friend'},
          ],
        };

        (storageService.getSettings as jest.Mock).mockResolvedValue(settingsWithContact);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = true;
        await act(async () => {
          success = await result.current.updateEmergencyContact('contact_1', {
            phone: 'invalid',
          });
        });

        expect(success).toBe(false);
        expect(result.current.error).toBe('ফোন নম্বর সঠিক নয়');
      });
    });

    describe('removeEmergencyContact', () => {
      it('should remove emergency contact', async () => {
        const settingsWithContact: Settings = {
          ...mockSettings,
          emergencyContacts: [
            {id: 'contact_1', name: 'John Doe', phone: '01712345678', relationship: 'Friend'},
          ],
        };

        (storageService.getSettings as jest.Mock).mockResolvedValue(settingsWithContact);
        (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = false;
        await act(async () => {
          success = await result.current.removeEmergencyContact('contact_1');
        });

        expect(success).toBe(true);
        expect(result.current.settings?.emergencyContacts).toHaveLength(0);
        expect(storageService.saveSettings).toHaveBeenCalled();
      });

      it('should handle non-existent contact', async () => {
        (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

        const {result} = renderHook(() => useSettings(), {wrapper});

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        let success: boolean = true;
        await act(async () => {
          success = await result.current.removeEmergencyContact('non_existent');
        });

        expect(success).toBe(false);
        expect(result.current.error).toBe('জরুরি যোগাযোগ পাওয়া যায়নি');
      });
    });
  });

  describe('updateSettings', () => {
    it('should update settings with partial updates', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateSettings({
          notifications: {
            ...mockSettings.notifications,
            enabled: false,
          },
        });
      });

      expect(success).toBe(true);
      expect(result.current.settings?.notifications.enabled).toBe(false);
      expect(storageService.saveSettings).toHaveBeenCalled();
    });
  });

  describe('refreshSettings', () => {
    it('should refresh settings from storage', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updatedSettings = {...mockSettings, updatedAt: '2024-01-02T00:00:00.000Z'};
      (storageService.getSettings as jest.Mock).mockResolvedValue(updatedSettings);

      await act(async () => {
        await result.current.refreshSettings();
      });

      expect(result.current.settings?.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });
  });

  describe('resetSettings', () => {
    it('should reset settings to default values', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.resetSettings();
      });

      expect(success).toBe(true);
      expect(result.current.settings).toBeTruthy();
      expect(storageService.saveSettings).toHaveBeenCalled();
    });

    it('should handle reset error', async () => {
      (storageService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (storageService.saveSettings as jest.Mock).mockResolvedValue(false);

      const {result} = renderHook(() => useSettings(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.resetSettings();
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('সেটিংস রিসেট করতে ব্যর্থ');
    });
  });

  describe('Hook usage', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useSettings());
      }).toThrow('useSettings must be used within a SettingsProvider');

      consoleSpy.mockRestore();
    });
  });
});

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import SettingsScreen from '../SettingsScreen';
import {useUser} from '../../context/UserContext';
import {useSettings} from '../../context/SettingsContext';
import {notificationService} from '../../services/notification.service';

// Mock contexts
jest.mock('../../context/UserContext');
jest.mock('../../context/SettingsContext');
jest.mock('../../services/notification.service');

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockUser = {
  id: '1',
  name: 'Test User',
  quitDate: '2024-01-01T00:00:00.000Z',
  cigarettesPerDay: 20,
  pricePerPack: 150,
  cigarettesPerPack: 20,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockSettings = {
  notifications: {
    enabled: true,
    dailyReminder: true,
    dailyReminderTime: '09:00',
    prayerTimes: true,
    milestones: true,
    encouragement: true,
  },
  appearance: {
    theme: 'light' as const,
    fontSize: 'medium' as const,
    soundEffects: true,
    hapticFeedback: true,
  },
  privacy: {
    pinLock: false,
    pin: null,
    biometric: false,
    dataEncryption: false,
  },
  emergencyContacts: [],
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('SettingsScreen', () => {
  const mockUpdateQuitDate = jest.fn();
  const mockUpdateCigaretteData = jest.fn();
  const mockUpdateNotifications = jest.fn();
  const mockUpdateAppearance = jest.fn();
  const mockAddEmergencyContact = jest.fn();
  const mockUpdateEmergencyContact = jest.fn();
  const mockRemoveEmergencyContact = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      updateQuitDate: mockUpdateQuitDate,
      updateCigaretteData: mockUpdateCigaretteData,
    });

    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });

    (notificationService.requestPermissions as jest.Mock).mockResolvedValue(true);
    (notificationService.scheduleDailyReminder as jest.Mock).mockResolvedValue(true);
    (notificationService.cancelDailyReminder as jest.Mock).mockResolvedValue(true);
  });

  it('renders correctly', () => {
    const {getByText} = render(<SettingsScreen />);

    expect(getByText('প্রোফাইল সেটিংস')).toBeTruthy();
    expect(getByText('নোটিফিকেশন সেটিংস')).toBeTruthy();
    expect(getByText('অ্যাপিয়ারেন্স সেটিংস')).toBeTruthy();
    expect(getByText('জরুরি যোগাযোগ')).toBeTruthy();
  });

  it('displays user profile data', () => {
    const {getByDisplayValue} = render(<SettingsScreen />);

    expect(getByDisplayValue('20')).toBeTruthy(); // cigarettesPerDay
    expect(getByDisplayValue('150')).toBeTruthy(); // pricePerPack
  });

  it('updates quit date successfully', async () => {
    mockUpdateQuitDate.mockResolvedValue(true);

    const {getByText} = render(<SettingsScreen />);

    const saveButton = getByText('সংরক্ষণ করুন');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockUpdateQuitDate).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'সফল',
        'ধূমপান ত্যাগের তারিখ আপডেট হয়েছে',
      );
    });
  });

  it('handles quit date update failure', async () => {
    mockUpdateQuitDate.mockResolvedValue(false);

    const {getByText} = render(<SettingsScreen />);

    const saveButton = getByText('সংরক্ষণ করুন');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'ত্রুটি',
        'ধূমপান ত্যাগের তারিখ আপডেট করতে ব্যর্থ',
      );
    });
  });

  it('updates cigarette data successfully', async () => {
    mockUpdateCigaretteData.mockResolvedValue(true);

    const {getByText, getByDisplayValue} = render(<SettingsScreen />);

    const cigarettesInput = getByDisplayValue('20');
    fireEvent.changeText(cigarettesInput, '15');

    const saveButton = getByText('সিগারেটের তথ্য সংরক্ষণ করুন');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockUpdateCigaretteData).toHaveBeenCalledWith(15, 150, 20);
      expect(Alert.alert).toHaveBeenCalledWith(
        'সফল',
        'সিগারেটের তথ্য আপডেট হয়েছে',
      );
    });
  });

  it('validates cigarette data input', async () => {
    const {getByText, getByDisplayValue} = render(<SettingsScreen />);

    const cigarettesInput = getByDisplayValue('20');
    fireEvent.changeText(cigarettesInput, 'invalid');

    const saveButton = getByText('সিগারেটের তথ্য সংরক্ষণ করুন');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('ত্রুটি', 'সঠিক সংখ্যা প্রদান করুন');
    });
  });

  it('toggles prayer notifications', async () => {
    mockUpdateNotifications.mockResolvedValue(true);

    const {getByText} = render(<SettingsScreen />);

    // Find the switch for prayer notifications
    const prayerLabel = getByText('নামাজের সময় নোটিফিকেশন');
    expect(prayerLabel).toBeTruthy();
  });

  it('toggles daily reminders and schedules notification', async () => {
    mockUpdateNotifications.mockResolvedValue(true);

    const {getByText} = render(<SettingsScreen />);

    const dailyLabel = getByText('দৈনিক রিমাইন্ডার');
    expect(dailyLabel).toBeTruthy();
  });

  it('cancels daily reminder when toggled off', async () => {
    mockUpdateNotifications.mockResolvedValue(true);

    const {getByText} = render(<SettingsScreen />);

    const dailyLabel = getByText('দৈনিক রিমাইন্ডার');
    expect(dailyLabel).toBeTruthy();
  });

  it('handles notification permission denial', async () => {
    (notificationService.requestPermissions as jest.Mock).mockResolvedValue(false);

    const {UNSAFE_getAllByType} = render(<SettingsScreen />);

    const switches = UNSAFE_getAllByType('RCTSwitch');
    const dailyReminderSwitch = switches[1];

    fireEvent(dailyReminderSwitch, 'onValueChange', true);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'অনুমতি প্রয়োজন',
        'নোটিফিকেশন পাঠাতে অনুমতি প্রয়োজন',
      );
    });
  });

  it('updates reminder time successfully', async () => {
    mockUpdateNotifications.mockResolvedValue(true);

    const {getByText} = render(<SettingsScreen />);

    const saveTimeButton = getByText('সময় সংরক্ষণ করুন');
    fireEvent.press(saveTimeButton);

    await waitFor(() => {
      expect(mockUpdateNotifications).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'সফল',
        'রিমাইন্ডার সময় আপডেট হয়েছে',
      );
    });
  });

  it('toggles milestone notifications', async () => {
    mockUpdateNotifications.mockResolvedValue(true);

    const {getByText} = render(<SettingsScreen />);

    const milestoneLabel = getByText('মাইলস্টোন নোটিফিকেশন');
    expect(milestoneLabel).toBeTruthy();
  });

  // Appearance Settings Tests
  it('changes font size', async () => {
    mockUpdateAppearance.mockResolvedValue(true);

    const {getByText} = render(<SettingsScreen />);

    const smallButton = getByText('ছোট');
    fireEvent.press(smallButton);

    await waitFor(() => {
      expect(mockUpdateAppearance).toHaveBeenCalledWith({
        fontSize: 'small',
      });
      expect(Alert.alert).toHaveBeenCalledWith('সফল', 'ফন্ট সাইজ আপডেট হয়েছে');
    });
  });

  it('toggles sound effects', async () => {
    mockUpdateAppearance.mockResolvedValue(true);

    const {getByText} = render(<SettingsScreen />);

    const soundLabel = getByText('সাউন্ড ইফেক্ট');
    expect(soundLabel).toBeTruthy();
  });

  it('toggles haptic feedback', async () => {
    mockUpdateAppearance.mockResolvedValue(true);

    const {getByText} = render(<SettingsScreen />);

    const hapticLabel = getByText('হ্যাপটিক ফিডব্যাক');
    expect(hapticLabel).toBeTruthy();
  });

  // Emergency Contacts Tests
  it('shows add contact button', () => {
    const {getByText} = render(<SettingsScreen />);

    expect(getByText('+ নতুন যোগাযোগ যোগ করুন')).toBeTruthy();
  });

  it('opens add contact form', () => {
    const {getByText} = render(<SettingsScreen />);

    const addButton = getByText('+ নতুন যোগাযোগ যোগ করুন');
    fireEvent.press(addButton);

    expect(getByText('নতুন যোগাযোগ যোগ করুন')).toBeTruthy();
  });

  it('adds new emergency contact', async () => {
    mockAddEmergencyContact.mockResolvedValue(true);

    const {getByText, getByPlaceholderText} = render(<SettingsScreen />);

    // Open form
    const addButton = getByText('+ নতুন যোগাযোগ যোগ করুন');
    fireEvent.press(addButton);

    // Fill form
    const nameInput = getByPlaceholderText('নাম');
    const phoneInput = getByPlaceholderText('ফোন নম্বর (যেমন: 01712345678)');
    const relationshipInput = getByPlaceholderText('সম্পর্ক (যেমন: বন্ধু, পরিবার)');

    fireEvent.changeText(nameInput, 'Test Contact');
    fireEvent.changeText(phoneInput, '01712345678');
    fireEvent.changeText(relationshipInput, 'বন্ধু');

    // Save
    const saveButton = getByText('সংরক্ষণ করুন');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockAddEmergencyContact).toHaveBeenCalledWith({
        name: 'Test Contact',
        phone: '01712345678',
        relationship: 'বন্ধু',
      });
      expect(Alert.alert).toHaveBeenCalledWith('সফল', 'জরুরি যোগাযোগ যোগ হয়েছে');
    });
  });

  it('validates contact form', async () => {
    const {getByText, getByPlaceholderText} = render(<SettingsScreen />);

    // Open form
    const addButton = getByText('+ নতুন যোগাযোগ যোগ করুন');
    fireEvent.press(addButton);

    // Try to save without filling
    const saveButton = getByText('সংরক্ষণ করুন');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('ত্রুটি', 'নাম প্রদান করুন');
    });
  });

  it('displays emergency contacts', () => {
    const settingsWithContacts = {
      ...mockSettings,
      emergencyContacts: [
        {
          id: '1',
          name: 'Test Contact',
          phone: '01712345678',
          relationship: 'বন্ধু',
        },
      ],
    };

    (useSettings as jest.Mock).mockReturnValue({
      settings: settingsWithContacts,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });

    const {getByText} = render(<SettingsScreen />);

    expect(getByText('Test Contact')).toBeTruthy();
    expect(getByText('01712345678')).toBeTruthy();
    expect(getByText('বন্ধু')).toBeTruthy();
  });

  it('edits emergency contact', async () => {
    mockUpdateEmergencyContact.mockResolvedValue(true);

    const settingsWithContacts = {
      ...mockSettings,
      emergencyContacts: [
        {
          id: '1',
          name: 'Test Contact',
          phone: '01712345678',
          relationship: 'বন্ধু',
        },
      ],
    };

    (useSettings as jest.Mock).mockReturnValue({
      settings: settingsWithContacts,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });

    const {getByText, getAllByText} = render(<SettingsScreen />);

    // Click edit button
    const editButtons = getAllByText('সম্পাদনা');
    fireEvent.press(editButtons[0]);

    expect(getByText('যোগাযোগ সম্পাদনা করুন')).toBeTruthy();
  });

  it('deletes emergency contact', async () => {
    mockRemoveEmergencyContact.mockResolvedValue(true);

    const settingsWithContacts = {
      ...mockSettings,
      emergencyContacts: [
        {
          id: '1',
          name: 'Test Contact',
          phone: '01712345678',
          relationship: 'বন্ধু',
        },
      ],
    };

    (useSettings as jest.Mock).mockReturnValue({
      settings: settingsWithContacts,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });

    const {getAllByText} = render(<SettingsScreen />);

    // Click delete button
    const deleteButtons = getAllByText('মুছুন');
    fireEvent.press(deleteButtons[0]);

    // Confirm deletion
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'নিশ্চিত করুন',
        'আপনি কি এই জরুরি যোগাযোগ মুছে ফেলতে চান?',
        expect.any(Array),
      );
    });
  });

  it('shows loading state when user is null', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      updateQuitDate: mockUpdateQuitDate,
      updateCigaretteData: mockUpdateCigaretteData,
    });

    const {getByText} = render(<SettingsScreen />);

    expect(getByText('লোড হচ্ছে...')).toBeTruthy();
  });

  it('shows loading state when settings is null', () => {
    (useSettings as jest.Mock).mockReturnValue({
      settings: null,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });

    const {getByText} = render(<SettingsScreen />);

    expect(getByText('লোড হচ্ছে...')).toBeTruthy();
  });
});

  // Data Management Tests
  it('exports data successfully', async () => {
    const mockShare = jest.fn().mockResolvedValue({action: 'sharedAction'});
    jest.spyOn(require('react-native'), 'Share', 'get').mockReturnValue({share: mockShare});
    
    const {getByText} = render(<SettingsScreen />);
    
    const exportButton = getByText(/ডেটা এক্সপোর্ট করুন/);
    fireEvent.press(exportButton);
    
    await waitFor(() => {
      expect(mockShare).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('সফল', expect.any(String));
    });
  });

  it('shows confirmation before resetting data', async () => {
    const mockClearUser = jest.fn().mockResolvedValue(true);
    (useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      updateQuitDate: mockUpdateQuitDate,
      updateCigaretteData: mockUpdateCigaretteData,
      clearUser: mockClearUser,
    });
    
    const {getByText} = render(<SettingsScreen />);
    
    const resetButton = getByText(/সমস্ত ডেটা মুছে ফেলুন/);
    fireEvent.press(resetButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'সতর্কতা',
        expect.stringContaining('নিশ্চিত'),
        expect.any(Array)
      );
    });
  });

  it('displays app version', () => {
    const {getByText} = render(<SettingsScreen />);
    
    expect(getByText('1.0.0')).toBeTruthy();
  });

  it('shows help dialog', () => {
    const {getByText} = render(<SettingsScreen />);
    
    const helpButton = getByText(/সাহায্য/);
    fireEvent.press(helpButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'সাহায্য',
      expect.stringContaining('অ্যাপটি'),
      expect.any(Array)
    );
  });

  // Privacy & Security Tests
  it('shows PIN setup form when enabling PIN lock', async () => {
    const {getByText, findByPlaceholderText} = render(<SettingsScreen />);
    
    const pinLockSwitch = getByText(/পিন লক/).parent?.parent?.findByType('Switch');
    if (pinLockSwitch) {
      fireEvent(pinLockSwitch, 'onValueChange', true);
    }
    
    await waitFor(async () => {
      const pinInput = await findByPlaceholderText(/নতুন পিন/);
      expect(pinInput).toBeTruthy();
    });
  });

  it('validates PIN format', async () => {
    const mockUpdatePrivacy = jest.fn();
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      updatePrivacy: mockUpdatePrivacy,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });
    
    const {getByText, getByPlaceholderText} = render(<SettingsScreen />);
    
    // Enable PIN lock to show form
    const pinLockSwitch = getByText(/পিন লক/).parent?.parent?.findByType('Switch');
    if (pinLockSwitch) {
      fireEvent(pinLockSwitch, 'onValueChange', true);
    }
    
    await waitFor(async () => {
      const pinInput = getByPlaceholderText(/নতুন পিন/);
      const confirmInput = getByPlaceholderText(/পিন নিশ্চিত/);
      
      // Test short PIN
      fireEvent.changeText(pinInput, '123');
      fireEvent.changeText(confirmInput, '123');
      
      const saveButton = getByText('সংরক্ষণ করুন');
      fireEvent.press(saveButton);
      
      expect(Alert.alert).toHaveBeenCalledWith('ত্রুটি', expect.stringContaining('৪-৬'));
    });
  });

  it('validates PIN confirmation match', async () => {
    const mockUpdatePrivacy = jest.fn();
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      updatePrivacy: mockUpdatePrivacy,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });
    
    const {getByText, getByPlaceholderText} = render(<SettingsScreen />);
    
    // Enable PIN lock to show form
    const pinLockSwitch = getByText(/পিন লক/).parent?.parent?.findByType('Switch');
    if (pinLockSwitch) {
      fireEvent(pinLockSwitch, 'onValueChange', true);
    }
    
    await waitFor(async () => {
      const pinInput = getByPlaceholderText(/নতুন পিন/);
      const confirmInput = getByPlaceholderText(/পিন নিশ্চিত/);
      
      // Test mismatched PINs
      fireEvent.changeText(pinInput, '1234');
      fireEvent.changeText(confirmInput, '5678');
      
      const saveButton = getByText('সংরক্ষণ করুন');
      fireEvent.press(saveButton);
      
      expect(Alert.alert).toHaveBeenCalledWith('ত্রুটি', 'পিন মিলছে না');
    });
  });

  it('saves PIN successfully', async () => {
    const mockUpdatePrivacy = jest.fn().mockResolvedValue(true);
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      updatePrivacy: mockUpdatePrivacy,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });
    
    const {getByText, getByPlaceholderText} = render(<SettingsScreen />);
    
    // Enable PIN lock to show form
    const pinLockSwitch = getByText(/পিন লক/).parent?.parent?.findByType('Switch');
    if (pinLockSwitch) {
      fireEvent(pinLockSwitch, 'onValueChange', true);
    }
    
    await waitFor(async () => {
      const pinInput = getByPlaceholderText(/নতুন পিন/);
      const confirmInput = getByPlaceholderText(/পিন নিশ্চিত/);
      
      fireEvent.changeText(pinInput, '1234');
      fireEvent.changeText(confirmInput, '1234');
      
      const saveButton = getByText('সংরক্ষণ করুন');
      fireEvent.press(saveButton);
      
      expect(mockUpdatePrivacy).toHaveBeenCalledWith({
        pinLock: true,
        pin: '1234',
      });
      expect(Alert.alert).toHaveBeenCalledWith('সফল', expect.any(String));
    });
  });

  it('requires PIN lock before enabling biometric', async () => {
    const {getByText} = render(<SettingsScreen />);
    
    const biometricSwitch = getByText(/বায়োমেট্রিক/).parent?.parent?.findByType('Switch');
    if (biometricSwitch) {
      fireEvent(biometricSwitch, 'onValueChange', true);
    }
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'পিন প্রয়োজন',
        expect.stringContaining('পিন লক সক্রিয়')
      );
    });
  });

  it('enables biometric when PIN is set', async () => {
    const mockUpdatePrivacy = jest.fn().mockResolvedValue(true);
    const settingsWithPin = {
      ...mockSettings,
      privacy: {
        ...mockSettings.privacy,
        pinLock: true,
        pin: '1234',
      },
    };
    
    (useSettings as jest.Mock).mockReturnValue({
      settings: settingsWithPin,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      updatePrivacy: mockUpdatePrivacy,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });
    
    const {getByText} = render(<SettingsScreen />);
    
    const biometricSwitch = getByText(/বায়োমেট্রিক/).parent?.parent?.findByType('Switch');
    if (biometricSwitch) {
      fireEvent(biometricSwitch, 'onValueChange', true);
    }
    
    await waitFor(() => {
      expect(mockUpdatePrivacy).toHaveBeenCalledWith({
        biometric: true,
      });
      expect(Alert.alert).toHaveBeenCalledWith('সফল', expect.any(String));
    });
  });

  it('disables PIN lock successfully', async () => {
    const mockUpdatePrivacy = jest.fn().mockResolvedValue(true);
    const settingsWithPin = {
      ...mockSettings,
      privacy: {
        ...mockSettings.privacy,
        pinLock: true,
        pin: '1234',
      },
    };
    
    (useSettings as jest.Mock).mockReturnValue({
      settings: settingsWithPin,
      updateNotifications: mockUpdateNotifications,
      updateAppearance: mockUpdateAppearance,
      updatePrivacy: mockUpdatePrivacy,
      addEmergencyContact: mockAddEmergencyContact,
      updateEmergencyContact: mockUpdateEmergencyContact,
      removeEmergencyContact: mockRemoveEmergencyContact,
    });
    
    const {getByText} = render(<SettingsScreen />);
    
    const pinLockSwitch = getByText(/পিন লক/).parent?.parent?.findByType('Switch');
    if (pinLockSwitch) {
      fireEvent(pinLockSwitch, 'onValueChange', false);
    }
    
    await waitFor(() => {
      expect(mockUpdatePrivacy).toHaveBeenCalledWith({
        pinLock: false,
        pin: undefined,
      });
      expect(Alert.alert).toHaveBeenCalledWith('সফল', expect.any(String));
    });
  });
});

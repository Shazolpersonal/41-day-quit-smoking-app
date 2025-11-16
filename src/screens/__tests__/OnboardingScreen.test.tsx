import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {OnboardingScreen} from '../OnboardingScreen';
import {storageService} from '../../services/storage.service';
import {UserModel} from '../../models/User';
import {SettingsModel} from '../../models/Settings';

// Mock dependencies
jest.mock('../../services/storage.service');
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

const mockNavigation = {
  replace: jest.fn(),
  navigate: jest.fn(),
  goBack: jest.fn(),
} as any;

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', () => {
    const {getByText} = render(
      <OnboardingScreen navigation={mockNavigation} route={{} as any} />,
    );

    expect(getByText('আসসালামু আলাইকুম')).toBeTruthy();
    expect(getByText('ধূমপান ত্যাগের এই পবিত্র যাত্রায় স্বাগতম')).toBeTruthy();
  });

  it('displays all form fields', () => {
    const {getByText, getByPlaceholderText} = render(
      <OnboardingScreen navigation={mockNavigation} route={{} as any} />,
    );

    expect(getByText('আপনি কবে ধূমপান ছেড়েছেন?')).toBeTruthy();
    expect(getByText('প্রতিদিন কতটি সিগারেট খেতেন?')).toBeTruthy();
    expect(getByText('এক প্যাকেটের দাম কত? (টাকা)')).toBeTruthy();
    expect(getByText('নামাজের সময় রিমাইন্ডার চান?')).toBeTruthy();
    expect(getByPlaceholderText('উদাহরণ: 10')).toBeTruthy();
    expect(getByPlaceholderText('উদাহরণ: 150')).toBeTruthy();
  });

  it('validates cigarettes per day input', () => {
    const {getByPlaceholderText, getByText} = render(
      <OnboardingScreen navigation={mockNavigation} route={{} as any} />,
    );

    const input = getByPlaceholderText('উদাহরণ: 10');
    fireEvent.changeText(input, 'abc');
    expect(input.props.value).toBe('');

    fireEvent.changeText(input, '15');
    expect(input.props.value).toBe('15');
  });

  it('validates price per pack input', () => {
    const {getByPlaceholderText} = render(
      <OnboardingScreen navigation={mockNavigation} route={{} as any} />,
    );

    const input = getByPlaceholderText('উদাহরণ: 150');
    fireEvent.changeText(input, '150.50');
    expect(input.props.value).toBe('150.50');

    fireEvent.changeText(input, 'abc');
    expect(input.props.value).toBe('');
  });

  it('toggles prayer notifications', () => {
    const {getByText} = render(
      <OnboardingScreen navigation={mockNavigation} route={{} as any} />,
    );

    const yesButton = getByText('হ্যাঁ');
    const noButton = getByText('না');

    fireEvent.press(noButton);
    fireEvent.press(yesButton);
    
    expect(yesButton).toBeTruthy();
    expect(noButton).toBeTruthy();
  });

  it('shows validation errors on submit with empty fields', async () => {
    const {getByText} = render(
      <OnboardingScreen navigation={mockNavigation} route={{} as any} />,
    );

    const submitButton = getByText('শুরু করুন');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'ত্রুটি',
        'দয়া করে সব তথ্য সঠিকভাবে পূরণ করুন।',
      );
    });
  });

  it('successfully submits valid form', async () => {
    (storageService.saveUser as jest.Mock).mockResolvedValue(true);
    (storageService.saveSettings as jest.Mock).mockResolvedValue(true);

    const {getByPlaceholderText, getByText} = render(
      <OnboardingScreen navigation={mockNavigation} route={{} as any} />,
    );

    fireEvent.changeText(getByPlaceholderText('উদাহরণ: 10'), '10');
    fireEvent.changeText(getByPlaceholderText('উদাহরণ: 150'), '150');

    const submitButton = getByText('শুরু করুন');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(storageService.saveUser).toHaveBeenCalled();
      expect(storageService.saveSettings).toHaveBeenCalled();
      expect(mockNavigation.replace).toHaveBeenCalledWith('MainTabs', {
        screen: 'Home',
      });
    });
  });

  it('handles storage error gracefully', async () => {
    (storageService.saveUser as jest.Mock).mockResolvedValue(false);
    (storageService.saveSettings as jest.Mock).mockResolvedValue(false);

    const {getByPlaceholderText, getByText} = render(
      <OnboardingScreen navigation={mockNavigation} route={{} as any} />,
    );

    fireEvent.changeText(getByPlaceholderText('উদাহরণ: 10'), '10');
    fireEvent.changeText(getByPlaceholderText('উদাহরণ: 150'), '150');

    const submitButton = getByText('শুরু করুন');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'ত্রুটি',
        'ডেটা সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
      );
    });
  });
});

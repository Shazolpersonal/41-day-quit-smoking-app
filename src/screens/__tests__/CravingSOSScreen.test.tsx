/**
 * CravingSOSScreen Tests
 * 
 * Tests for the Craving SOS Screen component
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {CravingSOSScreen} from '../CravingSOSScreen';
import {storageService} from '../../services/storage.service';
import {Alert} from 'react-native';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
} as any;

// Mock storage service
jest.mock('../../services/storage.service', () => ({
  storageService: {
    saveCravingLog: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('CravingSOSScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render encouragement message', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      expect(getByText('আপনি পারবেন!')).toBeTruthy();
      expect(
        getByText(/এই আকাঙ্ক্ষা সাময়িক/),
      ).toBeTruthy();
    });

    it('should render timer', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      expect(getByText('আকাঙ্ক্ষার সময়কাল')).toBeTruthy();
      expect(getByText(/0:0/)).toBeTruthy();
    });

    it('should render intensity slider', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      expect(getByText(/আকাঙ্ক্ষার তীব্রতা:/)).toBeTruthy();
    });

    it('should render coping strategies', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      expect(getByText('দ্রুত সমাধান')).toBeTruthy();
    });

    it('should render overcome button', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      expect(getByText('আকাঙ্ক্ষা কাটিয়ে উঠেছি ✓')).toBeTruthy();
    });

    it('should render Islamic reminder', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      expect(
        getByText(/নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে/),
      ).toBeTruthy();
    });
  });

  describe('Timer Functionality', () => {
    it('should start timer on mount', async () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      // Wait for timer to update
      await waitFor(
        () => {
          expect(getByText(/0:0/)).toBeTruthy();
        },
        {timeout: 2000},
      );
    });

    it('should format time correctly', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      // Initial time should be 0:00
      expect(getByText('0:00')).toBeTruthy();
    });
  });

  describe('Intensity Slider', () => {
    it('should allow selecting intensity level', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      // Default intensity should be 5
      expect(getByText('আকাঙ্ক্ষার তীব্রতা: 5/10')).toBeTruthy();
    });

    it('should update intensity when button pressed', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      const button8 = getByText('8');
      fireEvent.press(button8);

      expect(getByText('আকাঙ্ক্ষার তীব্রতা: 8/10')).toBeTruthy();
    });
  });

  describe('Strategy Selection', () => {
    it('should show alert for water strategy', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      const waterButton = getByText('পানি পান করুন');
      fireEvent.press(waterButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        '💧 পানি পান করুন',
        expect.any(String),
        expect.any(Array),
      );
    });

    it('should show alert for walk strategy', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      const walkButton = getByText('হাঁটুন');
      fireEvent.press(walkButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        '🚶 হাঁটুন',
        expect.any(String),
        expect.any(Array),
      );
    });

    it('should show alert for distraction strategy', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      const distractionButton = getByText('মনোযোগ সরান');
      fireEvent.press(distractionButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        '🎯 মনোযোগ সরান',
        expect.any(String),
        expect.any(Array),
      );
    });
  });

  describe('Overcome Craving', () => {
    it('should save craving log when overcome button pressed', async () => {
      (storageService.saveCravingLog as jest.Mock).mockResolvedValue(true);

      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      const overcomeButton = getByText('আকাঙ্ক্ষা কাটিয়ে উঠেছি ✓');
      fireEvent.press(overcomeButton);

      await waitFor(() => {
        expect(storageService.saveCravingLog).toHaveBeenCalled();
      });
    });

    it('should show success alert when overcome', async () => {
      (storageService.saveCravingLog as jest.Mock).mockResolvedValue(true);

      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      const overcomeButton = getByText('আকাঙ্ক্ষা কাটিয়ে উঠেছি ✓');
      fireEvent.press(overcomeButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          '🎉 মাশাআল্লাহ!',
          expect.any(String),
          expect.any(Array),
        );
      });
    });

    it('should navigate to home after overcome', async () => {
      (storageService.saveCravingLog as jest.Mock).mockResolvedValue(true);

      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      const overcomeButton = getByText('আকাঙ্ক্ষা কাটিয়ে উঠেছি ✓');
      fireEvent.press(overcomeButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      // Simulate pressing the alert button
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const alertButton = alertCall[2][0];
      alertButton.onPress();

      expect(mockNavigate).toHaveBeenCalledWith('MainTabs', {screen: 'Home'});
    });
  });

  describe('Navigation', () => {
    it('should go back when back button pressed', () => {
      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      const backButton = getByText('← ফিরে যান');
      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Craving Log', () => {
    it('should create craving log with correct data', async () => {
      (storageService.saveCravingLog as jest.Mock).mockResolvedValue(true);

      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      // Set intensity to 7
      const button7 = getByText('7');
      fireEvent.press(button7);

      // Press overcome button
      const overcomeButton = getByText('আকাঙ্ক্ষা কাটিয়ে উঠেছি ✓');
      fireEvent.press(overcomeButton);

      await waitFor(() => {
        expect(storageService.saveCravingLog).toHaveBeenCalledWith(
          expect.objectContaining({
            intensity: 7,
            overcome: true,
            triggers: [],
          }),
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle craving log save error gracefully', async () => {
      (storageService.saveCravingLog as jest.Mock).mockRejectedValue(
        new Error('Save failed'),
      );

      const {getByText} = render(
        <CravingSOSScreen navigation={mockNavigation} route={{} as any} />,
      );

      const overcomeButton = getByText('আকাঙ্ক্ষা কাটিয়ে উঠেছি ✓');
      fireEvent.press(overcomeButton);

      await waitFor(() => {
        expect(storageService.saveCravingLog).toHaveBeenCalled();
      });

      // Should still show success alert even if save fails
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});

/**
 * Tests for PrayerTimeWidget Component
 */

import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {PrayerTimeWidget} from '../PrayerTimeWidget';
import {prayerTimeService} from '../../../services/prayerTime.service';

// Mock prayer time service
jest.mock('../../../services/prayerTime.service', () => ({
  prayerTimeService: {
    getPrayerTimesWithLocation: jest.fn(),
    getNextPrayerTime: jest.fn(),
  },
}));

describe('PrayerTimeWidget', () => {
  const mockPrayerTimes = {
    fajr: '05:00',
    sunrise: '06:15',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:00',
    isha: '19:30',
    date: new Date().toISOString(),
  };

  const mockNextPrayer = {
    name: 'Dhuhr',
    nameArabic: 'الظهر',
    nameBangla: 'যোহর',
    time: '12:30',
    timeRemaining: {
      hours: 2,
      minutes: 30,
      seconds: 45,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (prayerTimeService.getPrayerTimesWithLocation as jest.Mock).mockResolvedValue(
      mockPrayerTimes,
    );
    (prayerTimeService.getNextPrayerTime as jest.Mock).mockReturnValue(
      mockNextPrayer,
    );
  });

  it('renders loading state initially', () => {
    const {getByText} = render(<PrayerTimeWidget />);
    expect(getByText('নামাজের সময় লোড হচ্ছে...')).toBeTruthy();
  });

  it('renders prayer times after loading', async () => {
    const {getByText} = render(<PrayerTimeWidget />);

    await waitFor(() => {
      expect(getByText('আজকের নামাজের সময়')).toBeTruthy();
      expect(getByText('যোহর')).toBeTruthy();
      expect(getByText('12:30')).toBeTruthy();
    });
  });

  it('highlights next prayer', async () => {
    const {getByText} = render(<PrayerTimeWidget />);

    await waitFor(() => {
      expect(getByText('পরবর্তী নামাজ')).toBeTruthy();
      expect(getByText('যোহর')).toBeTruthy();
    });
  });

  it('displays all prayer times', async () => {
    const {getByText} = render(<PrayerTimeWidget />);

    await waitFor(() => {
      expect(getByText('ফজর')).toBeTruthy();
      expect(getByText('যোহর')).toBeTruthy();
      expect(getByText('আসর')).toBeTruthy();
      expect(getByText('মাগরিব')).toBeTruthy();
      expect(getByText('এশা')).toBeTruthy();
    });
  });

  it('renders compact version when compact prop is true', async () => {
    const {getByText} = render(<PrayerTimeWidget compact />);

    await waitFor(() => {
      expect(getByText('পরবর্তী নামাজ')).toBeTruthy();
      expect(getByText('যোহর')).toBeTruthy();
    });
  });

  it('calls onPress when compact widget is pressed', async () => {
    const onPress = jest.fn();
    const {getByText} = render(<PrayerTimeWidget compact onPress={onPress} />);

    await waitFor(() => {
      const widget = getByText('যোহর').parent?.parent;
      if (widget) {
        widget.props.onPress();
        expect(onPress).toHaveBeenCalled();
      }
    });
  });

  it('fetches prayer times on mount', async () => {
    render(<PrayerTimeWidget />);

    await waitFor(() => {
      expect(prayerTimeService.getPrayerTimesWithLocation).toHaveBeenCalled();
    });
  });

  it('calculates next prayer correctly', async () => {
    render(<PrayerTimeWidget />);

    await waitFor(() => {
      expect(prayerTimeService.getNextPrayerTime).toHaveBeenCalledWith(
        mockPrayerTimes,
      );
    });
  });
});

import {renderHook, waitFor} from '@testing-library/react-native';
import {usePrayerNotifications} from '../usePrayerNotifications';
import {useSettings} from '../../context/SettingsContext';
import {notificationService} from '../../services/notification.service';
import {prayerTimeService} from '../../services/prayerTime.service';

// Mock dependencies
jest.mock('../../context/SettingsContext');
jest.mock('../../services/notification.service');
jest.mock('../../services/prayerTime.service');

const mockUseSettings = useSettings as jest.MockedFunction<typeof useSettings>;
const mockNotificationService = notificationService as jest.Mocked<
  typeof notificationService
>;
const mockPrayerTimeService = prayerTimeService as jest.Mocked<
  typeof prayerTimeService
>;

describe('usePrayerNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not sync when settings are null', () => {
    mockUseSettings.mockReturnValue({
      settings: null,
      loading: false,
      error: null,
    } as any);

    renderHook(() => usePrayerNotifications());

    expect(mockNotificationService.checkPermissions).not.toHaveBeenCalled();
  });

  it('should cancel prayer notifications when disabled', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          prayerTimes: false,
        },
      },
      loading: false,
      error: null,
    } as any);

    renderHook(() => usePrayerNotifications());

    await waitFor(() => {
      expect(mockNotificationService.cancelPrayerTimeNotifications).toHaveBeenCalled();
    });
  });

  it('should schedule prayer notifications when enabled', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          prayerTimes: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockNotificationService.checkPermissions.mockResolvedValue(true);
    mockPrayerTimeService.getPrayerTimesWithLocation.mockResolvedValue({
      fajr: '05:00',
      sunrise: '06:30',
      dhuhr: '12:15',
      asr: '15:30',
      maghrib: '18:00',
      isha: '19:30',
      date: new Date().toISOString(),
    });
    mockNotificationService.schedulePrayerTimeNotifications.mockResolvedValue(true);

    renderHook(() => usePrayerNotifications());

    await waitFor(() => {
      expect(mockNotificationService.checkPermissions).toHaveBeenCalled();
      expect(mockPrayerTimeService.getPrayerTimesWithLocation).toHaveBeenCalled();
      expect(mockNotificationService.schedulePrayerTimeNotifications).toHaveBeenCalledWith({
        fajr: '05:00',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '18:00',
        isha: '19:30',
      });
    });
  });

  it('should not schedule when no permission', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          prayerTimes: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockNotificationService.checkPermissions.mockResolvedValue(false);

    renderHook(() => usePrayerNotifications());

    await waitFor(() => {
      expect(mockNotificationService.checkPermissions).toHaveBeenCalled();
      expect(mockPrayerTimeService.getPrayerTimesWithLocation).not.toHaveBeenCalled();
    });
  });

  it('should handle errors gracefully', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          prayerTimes: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockNotificationService.checkPermissions.mockRejectedValue(
      new Error('Permission check failed'),
    );

    // Should not throw
    expect(() => {
      renderHook(() => usePrayerNotifications());
    }).not.toThrow();
  });
});

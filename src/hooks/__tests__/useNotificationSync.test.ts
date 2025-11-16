import {renderHook, waitFor} from '@testing-library/react-native';
import {useNotificationSync} from '../useNotificationSync';
import {useSettings} from '../../context/SettingsContext';
import {useProgress} from '../../context/ProgressContext';
import {notificationService} from '../../services/notification.service';

// Mock dependencies
jest.mock('../../context/SettingsContext');
jest.mock('../../context/ProgressContext');
jest.mock('../../services/notification.service');

const mockUseSettings = useSettings as jest.MockedFunction<typeof useSettings>;
const mockUseProgress = useProgress as jest.MockedFunction<typeof useProgress>;
const mockNotificationService = notificationService as jest.Mocked<
  typeof notificationService
>;

describe('useNotificationSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not sync when settings are null', () => {
    mockUseSettings.mockReturnValue({
      settings: null,
      loading: false,
      error: null,
    } as any);

    mockUseProgress.mockReturnValue({
      progress: null,
      loading: false,
      error: null,
    } as any);

    renderHook(() => useNotificationSync());

    expect(mockNotificationService.checkPermissions).not.toHaveBeenCalled();
  });

  it('should cancel daily reminder when notifications are disabled globally', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: false,
          dailyReminder: true,
          dailyReminderTime: '08:00',
          prayerTimes: true,
          milestones: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockUseProgress.mockReturnValue({
      progress: {currentDay: 5},
      loading: false,
      error: null,
    } as any);

    renderHook(() => useNotificationSync());

    await waitFor(() => {
      expect(mockNotificationService.cancelDailyReminder).toHaveBeenCalled();
    });
  });

  it('should cancel daily reminder when daily reminder is disabled', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          dailyReminder: false,
          dailyReminderTime: '08:00',
          prayerTimes: true,
          milestones: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockUseProgress.mockReturnValue({
      progress: {currentDay: 5},
      loading: false,
      error: null,
    } as any);

    renderHook(() => useNotificationSync());

    await waitFor(() => {
      expect(mockNotificationService.cancelDailyReminder).toHaveBeenCalled();
    });
  });

  it('should schedule daily reminder when enabled and has permission', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          dailyReminder: true,
          dailyReminderTime: '08:00',
          prayerTimes: true,
          milestones: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockUseProgress.mockReturnValue({
      progress: {currentDay: 5},
      loading: false,
      error: null,
    } as any);

    mockNotificationService.checkPermissions.mockResolvedValue(true);
    mockNotificationService.scheduleDailyReminder.mockResolvedValue(true);

    renderHook(() => useNotificationSync());

    await waitFor(() => {
      expect(mockNotificationService.checkPermissions).toHaveBeenCalled();
      expect(mockNotificationService.scheduleDailyReminder).toHaveBeenCalledWith(
        '08:00',
        undefined,
        5,
      );
    });
  });

  it('should not schedule daily reminder when no permission', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          dailyReminder: true,
          dailyReminderTime: '08:00',
          prayerTimes: true,
          milestones: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockUseProgress.mockReturnValue({
      progress: {currentDay: 5},
      loading: false,
      error: null,
    } as any);

    mockNotificationService.checkPermissions.mockResolvedValue(false);

    renderHook(() => useNotificationSync());

    await waitFor(() => {
      expect(mockNotificationService.checkPermissions).toHaveBeenCalled();
      expect(mockNotificationService.scheduleDailyReminder).not.toHaveBeenCalled();
    });
  });

  it('should use default day 1 when progress is null', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          dailyReminder: true,
          dailyReminderTime: '09:30',
          prayerTimes: true,
          milestones: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockUseProgress.mockReturnValue({
      progress: null,
      loading: false,
      error: null,
    } as any);

    mockNotificationService.checkPermissions.mockResolvedValue(true);
    mockNotificationService.scheduleDailyReminder.mockResolvedValue(true);

    renderHook(() => useNotificationSync());

    await waitFor(() => {
      expect(mockNotificationService.scheduleDailyReminder).toHaveBeenCalledWith(
        '09:30',
        undefined,
        1,
      );
    });
  });

  it('should handle errors gracefully', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          dailyReminder: true,
          dailyReminderTime: '08:00',
          prayerTimes: true,
          milestones: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockUseProgress.mockReturnValue({
      progress: {currentDay: 5},
      loading: false,
      error: null,
    } as any);

    mockNotificationService.checkPermissions.mockRejectedValue(
      new Error('Permission check failed'),
    );

    // Should not throw
    expect(() => {
      renderHook(() => useNotificationSync());
    }).not.toThrow();
  });

  it('should re-sync when reminder time changes', async () => {
    const {rerender} = renderHook(() => useNotificationSync(), {
      initialProps: {},
    });

    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          dailyReminder: true,
          dailyReminderTime: '08:00',
          prayerTimes: true,
          milestones: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockUseProgress.mockReturnValue({
      progress: {currentDay: 5},
      loading: false,
      error: null,
    } as any);

    mockNotificationService.checkPermissions.mockResolvedValue(true);
    mockNotificationService.scheduleDailyReminder.mockResolvedValue(true);

    rerender();

    await waitFor(() => {
      expect(mockNotificationService.scheduleDailyReminder).toHaveBeenCalledWith(
        '08:00',
        undefined,
        5,
      );
    });

    // Change time
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          dailyReminder: true,
          dailyReminderTime: '09:00',
          prayerTimes: true,
          milestones: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    rerender();

    await waitFor(() => {
      expect(mockNotificationService.scheduleDailyReminder).toHaveBeenCalledWith(
        '09:00',
        undefined,
        5,
      );
    });
  });
});

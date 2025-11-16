import {renderHook, waitFor} from '@testing-library/react-native';
import {useMilestoneNotifications} from '../useMilestoneNotifications';
import {useProgress} from '../../context/ProgressContext';
import {useSettings} from '../../context/SettingsContext';
import {notificationService} from '../../services/notification.service';

// Mock dependencies
jest.mock('../../context/ProgressContext');
jest.mock('../../context/SettingsContext');
jest.mock('../../services/notification.service');

const mockUseProgress = useProgress as jest.MockedFunction<typeof useProgress>;
const mockUseSettings = useSettings as jest.MockedFunction<typeof useSettings>;
const mockNotificationService = notificationService as jest.Mocked<
  typeof notificationService
>;

describe('useMilestoneNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not send notification when progress is null', () => {
    mockUseProgress.mockReturnValue({
      progress: null,
      loading: false,
      error: null,
    } as any);

    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          milestones: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    renderHook(() => useMilestoneNotifications());

    expect(mockNotificationService.sendMilestoneNotification).not.toHaveBeenCalled();
  });

  it('should not send notification when milestones disabled', () => {
    mockUseProgress.mockReturnValue({
      progress: {
        currentDay: 7,
      },
      loading: false,
      error: null,
    } as any);

    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          milestones: false,
        },
      },
      loading: false,
      error: null,
    } as any);

    renderHook(() => useMilestoneNotifications());

    expect(mockNotificationService.sendMilestoneNotification).not.toHaveBeenCalled();
  });

  it('should send notification on milestone day', async () => {
    mockUseProgress.mockReturnValue({
      progress: {
        currentDay: 7,
      },
      loading: false,
      error: null,
    } as any);

    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          milestones: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockNotificationService.sendMilestoneNotification.mockResolvedValue(true);

    renderHook(() => useMilestoneNotifications());

    await waitFor(() => {
      expect(mockNotificationService.sendMilestoneNotification).toHaveBeenCalledWith(7);
    });
  });

  it('should not send notification on non-milestone day', () => {
    mockUseProgress.mockReturnValue({
      progress: {
        currentDay: 5,
      },
      loading: false,
      error: null,
    } as any);

    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          milestones: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    renderHook(() => useMilestoneNotifications());

    expect(mockNotificationService.sendMilestoneNotification).not.toHaveBeenCalled();
  });

  it('should send notification for all milestone days', async () => {
    const milestoneDays = [1, 3, 7, 14, 21, 28, 35, 41];

    for (const day of milestoneDays) {
      jest.clearAllMocks();

      mockUseProgress.mockReturnValue({
        progress: {
          currentDay: day,
        },
        loading: false,
        error: null,
      } as any);

      mockUseSettings.mockReturnValue({
        settings: {
          notifications: {
            enabled: true,
            milestones: true,
          },
        },
        loading: false,
        error: null,
      } as any);

      mockNotificationService.sendMilestoneNotification.mockResolvedValue(true);

      renderHook(() => useMilestoneNotifications());

      await waitFor(() => {
        expect(mockNotificationService.sendMilestoneNotification).toHaveBeenCalledWith(day);
      });
    }
  });

  it('should not send duplicate notifications for same day', async () => {
    mockUseProgress.mockReturnValue({
      progress: {
        currentDay: 7,
      },
      loading: false,
      error: null,
    } as any);

    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          milestones: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockNotificationService.sendMilestoneNotification.mockResolvedValue(true);

    const {rerender} = renderHook(() => useMilestoneNotifications());

    await waitFor(() => {
      expect(mockNotificationService.sendMilestoneNotification).toHaveBeenCalledTimes(1);
    });

    // Rerender with same day
    rerender();

    // Should not send again
    expect(mockNotificationService.sendMilestoneNotification).toHaveBeenCalledTimes(1);
  });
});

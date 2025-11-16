import {renderHook, waitFor} from '@testing-library/react-native';
import {AppState} from 'react-native';
import {useInactivityTracking, getLastActiveTimestamp, isInactiveFor24Hours} from '../useInactivityTracking';
import {useSettings} from '../../context/SettingsContext';
import {notificationService} from '../../services/notification.service';
import {storageService} from '../../services/storage.service';

// Mock dependencies
jest.mock('../../context/SettingsContext');
jest.mock('../../services/notification.service');
jest.mock('../../services/storage.service');
jest.mock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

const mockUseSettings = useSettings as jest.MockedFunction<typeof useSettings>;
const mockNotificationService = notificationService as jest.Mocked<
  typeof notificationService
>;
const mockStorageService = storageService as jest.Mocked<typeof storageService>;

describe('useInactivityTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update last active timestamp on mount', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockStorageService.saveData.mockResolvedValue(true);
    mockNotificationService.cancelInactivityReminder.mockResolvedValue(true);
    mockNotificationService.scheduleInactivityReminder.mockResolvedValue(true);

    renderHook(() => useInactivityTracking());

    await waitFor(() => {
      expect(mockNotificationService.cancelInactivityReminder).toHaveBeenCalled();
      expect(mockStorageService.saveData).toHaveBeenCalledWith(
        'lastActiveTimestamp',
        expect.any(String),
      );
      expect(mockNotificationService.scheduleInactivityReminder).toHaveBeenCalled();
    });
  });

  it('should not schedule when encouragement disabled', () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          encouragement: false,
        },
      },
      loading: false,
      error: null,
    } as any);

    renderHook(() => useInactivityTracking());

    expect(mockNotificationService.scheduleInactivityReminder).not.toHaveBeenCalled();
  });

  it('should not schedule when notifications disabled', () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: false,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    renderHook(() => useInactivityTracking());

    expect(mockNotificationService.scheduleInactivityReminder).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockUseSettings.mockReturnValue({
      settings: {
        notifications: {
          enabled: true,
          encouragement: true,
        },
      },
      loading: false,
      error: null,
    } as any);

    mockNotificationService.cancelInactivityReminder.mockRejectedValue(
      new Error('Cancel failed'),
    );

    // Should not throw
    expect(() => {
      renderHook(() => useInactivityTracking());
    }).not.toThrow();
  });
});

describe('getLastActiveTimestamp', () => {
  it('should return timestamp when available', async () => {
    mockStorageService.getData.mockResolvedValue('1234567890');

    const timestamp = await getLastActiveTimestamp();

    expect(timestamp).toBe(1234567890);
    expect(mockStorageService.getData).toHaveBeenCalledWith('lastActiveTimestamp');
  });

  it('should return null when no timestamp', async () => {
    mockStorageService.getData.mockResolvedValue(null);

    const timestamp = await getLastActiveTimestamp();

    expect(timestamp).toBeNull();
  });

  it('should return null on error', async () => {
    mockStorageService.getData.mockRejectedValue(new Error('Storage error'));

    const timestamp = await getLastActiveTimestamp();

    expect(timestamp).toBeNull();
  });
});

describe('isInactiveFor24Hours', () => {
  it('should return false when no timestamp', async () => {
    mockStorageService.getData.mockResolvedValue(null);

    const isInactive = await isInactiveFor24Hours();

    expect(isInactive).toBe(false);
  });

  it('should return true when inactive for 24+ hours', async () => {
    const twentyFiveHoursAgo = Date.now() - (25 * 60 * 60 * 1000);
    mockStorageService.getData.mockResolvedValue(twentyFiveHoursAgo.toString());

    const isInactive = await isInactiveFor24Hours();

    expect(isInactive).toBe(true);
  });

  it('should return false when inactive for less than 24 hours', async () => {
    const twentyHoursAgo = Date.now() - (20 * 60 * 60 * 1000);
    mockStorageService.getData.mockResolvedValue(twentyHoursAgo.toString());

    const isInactive = await isInactiveFor24Hours();

    expect(isInactive).toBe(false);
  });
});

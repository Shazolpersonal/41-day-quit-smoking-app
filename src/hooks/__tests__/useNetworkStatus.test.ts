/**
 * Tests for useNetworkStatus Hook
 */

import {renderHook, waitFor} from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import {useNetworkStatus} from '../useNetworkStatus';

// Mock NetInfo
jest.mock('@react-native-community/netinfo');

describe('useNetworkStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial network status', () => {
    const mockUnsubscribe = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockReturnValue(mockUnsubscribe);

    const {result} = renderHook(() => useNetworkStatus());

    expect(result.current).toHaveProperty('isConnected');
    expect(result.current).toHaveProperty('isInternetReachable');
    expect(result.current).toHaveProperty('type');
    expect(result.current.isConnected).toBe(true); // Initial state
  });

  it('should update when network state changes to offline', async () => {
    let listener: ((state: any) => void) | null = null;
    const mockUnsubscribe = jest.fn();

    (NetInfo.addEventListener as jest.Mock).mockImplementation((callback) => {
      listener = callback;
      return mockUnsubscribe;
    });

    const {result} = renderHook(() => useNetworkStatus());

    // Simulate network change to offline
    if (listener) {
      listener({
        isConnected: false,
        isInternetReachable: false,
        type: 'none',
      });
    }

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isInternetReachable).toBe(false);
      expect(result.current.type).toBe('none');
    });
  });

  it('should update when network state changes to online', async () => {
    let listener: ((state: any) => void) | null = null;
    const mockUnsubscribe = jest.fn();

    (NetInfo.addEventListener as jest.Mock).mockImplementation((callback) => {
      listener = callback;
      return mockUnsubscribe;
    });

    const {result} = renderHook(() => useNetworkStatus());

    // Simulate network change to online
    if (listener) {
      listener({
        isConnected: true,
        isInternetReachable: true,
        type: 'wifi',
      });
    }

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
      expect(result.current.isInternetReachable).toBe(true);
      expect(result.current.type).toBe('wifi');
    });
  });

  it('should cleanup subscription on unmount', () => {
    const mockUnsubscribe = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockReturnValue(mockUnsubscribe);

    const {unmount} = renderHook(() => useNetworkStatus());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should handle null values gracefully', async () => {
    let listener: ((state: any) => void) | null = null;
    const mockUnsubscribe = jest.fn();

    (NetInfo.addEventListener as jest.Mock).mockImplementation((callback) => {
      listener = callback;
      return mockUnsubscribe;
    });

    const {result} = renderHook(() => useNetworkStatus());

    // Simulate network state with null values
    if (listener) {
      listener({
        isConnected: null,
        isInternetReachable: null,
        type: null,
      });
    }

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false); // null should be treated as false
    });
  });
});

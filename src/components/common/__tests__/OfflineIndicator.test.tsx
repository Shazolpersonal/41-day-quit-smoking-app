/**
 * Tests for OfflineIndicator Component
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import OfflineIndicator from '../OfflineIndicator';
import * as useNetworkStatusModule from '../../../hooks/useNetworkStatus';

// Mock the useNetworkStatus hook
jest.mock('../../../hooks/useNetworkStatus');

describe('OfflineIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when online', () => {
    jest.spyOn(useNetworkStatusModule, 'useNetworkStatus').mockReturnValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    });

    const {queryByText} = render(<OfflineIndicator />);

    expect(queryByText('অফলাইন মোড')).toBeNull();
  });

  it('should render when offline', () => {
    jest.spyOn(useNetworkStatusModule, 'useNetworkStatus').mockReturnValue({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    });

    const {getByText} = render(<OfflineIndicator />);

    expect(getByText('অফলাইন মোড')).toBeTruthy();
    expect(getByText('ইন্টারনেট সংযোগ নেই। অ্যাপটি অফলাইনে কাজ করছে।')).toBeTruthy();
  });

  it('should render when showWhenOnline is true even if online', () => {
    jest.spyOn(useNetworkStatusModule, 'useNetworkStatus').mockReturnValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    });

    const {getByText} = render(<OfflineIndicator showWhenOnline={true} />);

    expect(getByText('অফলাইন মোড')).toBeTruthy();
  });

  it('should display correct icon', () => {
    jest.spyOn(useNetworkStatusModule, 'useNetworkStatus').mockReturnValue({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    });

    const {getByText} = render(<OfflineIndicator />);

    expect(getByText('📡')).toBeTruthy();
  });

  it('should have correct styling when rendered', () => {
    jest.spyOn(useNetworkStatusModule, 'useNetworkStatus').mockReturnValue({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    });

    const {getByText} = render(<OfflineIndicator />);

    const title = getByText('অফলাইন মোড');
    expect(title).toBeTruthy();
    expect(title.props.style).toMatchObject({
      fontSize: 14,
      fontWeight: '600',
    });
  });
});

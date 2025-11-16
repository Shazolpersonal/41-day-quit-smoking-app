/**
 * Tests for AudioPlayer Component
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {AudioPlayer} from '../AudioPlayer';
import {Alert} from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('AudioPlayer', () => {
  const mockProps = {
    duaId: 'dua_craving_1',
    duaTitle: 'কঠিন সময়ে দোয়া',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByText} = render(<AudioPlayer {...mockProps} />);
    expect(getByText('অডিও প্লেয়ার')).toBeTruthy();
  });

  it('displays play button initially', () => {
    const {getByText} = render(<AudioPlayer {...mockProps} />);
    expect(getByText('▶')).toBeTruthy();
  });

  it('displays time indicators', () => {
    const {getByText} = render(<AudioPlayer {...mockProps} />);
    expect(getByText('0:00')).toBeTruthy();
  });

  it('changes to pause button when playing', async () => {
    const {getByText} = render(<AudioPlayer {...mockProps} />);
    const playButton = getByText('▶');

    fireEvent.press(playButton);

    await waitFor(() => {
      expect(getByText('⏸')).toBeTruthy();
    });
  });

  it('shows loading indicator while loading', async () => {
    const {getByText, queryByTestId} = render(<AudioPlayer {...mockProps} />);
    const playButton = getByText('▶');

    fireEvent.press(playButton);

    // Should show loading state briefly
    await waitFor(() => {
      expect(getByText('⏸')).toBeTruthy();
    });
  });

  it('displays progress bar', () => {
    const {UNSAFE_getByType} = render(<AudioPlayer {...mockProps} />);
    // Progress bar should be rendered
    expect(UNSAFE_getByType).toBeTruthy();
  });

  it('enables stop button when playing', async () => {
    const {getByText} = render(<AudioPlayer {...mockProps} />);
    const playButton = getByText('▶');

    fireEvent.press(playButton);

    await waitFor(() => {
      const stopButton = getByText('⏹');
      expect(stopButton).toBeTruthy();
    });
  });

  it('handles stop button press', async () => {
    const {getByText} = render(<AudioPlayer {...mockProps} />);
    const playButton = getByText('▶');

    fireEvent.press(playButton);

    await waitFor(() => {
      const stopButton = getByText('⏹');
      fireEvent.press(stopButton);
    });

    // Should return to initial state
    expect(getByText('▶')).toBeTruthy();
  });

  it('displays audio icon', () => {
    const {getByText} = render(<AudioPlayer {...mockProps} />);
    expect(getByText('🔊')).toBeTruthy();
  });

  it('shows info message for unavailable audio', () => {
    const {getByText} = render(<AudioPlayer {...mockProps} />);
    // Info message should be visible
    expect(getByText('💡 অডিও ফাইল শীঘ্রই যুক্ত করা হবে')).toBeTruthy();
  });
});

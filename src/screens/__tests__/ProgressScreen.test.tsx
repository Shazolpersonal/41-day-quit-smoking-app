/**
 * ProgressScreen Tests
 */

import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {ProgressScreen} from '../ProgressScreen';
import {ProgressProvider} from '../../context/ProgressContext';
import {UserProvider} from '../../context/UserContext';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

const mockRoute = {
  key: 'Progress',
  name: 'Progress' as const,
  params: undefined,
};

describe('ProgressScreen', () => {
  const renderScreen = () => {
    return render(
      <UserProvider>
        <ProgressProvider>
          <ProgressScreen navigation={mockNavigation as any} route={mockRoute} />
        </ProgressProvider>
      </UserProvider>
    );
  };

  it('renders loading state initially', () => {
    const {getByText} = renderScreen();
    expect(getByText('অগ্রগতি লোড হচ্ছে...')).toBeTruthy();
  });

  it('renders progress overview when data is loaded', async () => {
    const {getByText} = renderScreen();
    
    await waitFor(() => {
      expect(getByText('আপনার অগ্রগতি')).toBeTruthy();
    });
  });
});

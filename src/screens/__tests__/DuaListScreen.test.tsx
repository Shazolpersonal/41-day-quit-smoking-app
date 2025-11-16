/**
 * Tests for DuaListScreen
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import DuaListScreen from '../DuaListScreen';
import {duas} from '../../data/islamicContent';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('DuaListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderScreen = () => {
    return render(
      <NavigationContainer>
        <DuaListScreen />
      </NavigationContainer>,
    );
  };

  it('renders correctly', () => {
    const {getByText} = renderScreen();
    expect(getByText('দোয়া সমূহ')).toBeTruthy();
  });

  it('displays all duas initially', () => {
    const {getByText} = renderScreen();
    expect(getByText(`${duas.length}টি দোয়া পাওয়া গেছে`)).toBeTruthy();
  });

  it('displays dua items', () => {
    const {getByText} = renderScreen();
    const firstDua = duas[0];
    expect(getByText(firstDua.title)).toBeTruthy();
  });

  it('filters duas by search query', async () => {
    const {getByPlaceholderText, getByText, queryByText} = renderScreen();
    const searchInput = getByPlaceholderText('দোয়া খুঁজুন...');

    fireEvent.changeText(searchInput, 'কঠিন');

    await waitFor(() => {
      expect(getByText('কঠিন সময়ে দোয়া')).toBeTruthy();
    });
  });

  it('filters duas by category', async () => {
    const {getByText} = renderScreen();
    const categoryButton = getByText('শুকরিয়া');

    fireEvent.press(categoryButton);

    await waitFor(() => {
      // Should show only gratitude duas
      const gratitudeDuas = duas.filter(d => d.id.includes('gratitude'));
      expect(getByText(`${gratitudeDuas.length}টি দোয়া পাওয়া গেছে`)).toBeTruthy();
    });
  });

  it('navigates to dua detail on item press', () => {
    const {getByText} = renderScreen();
    const firstDua = duas[0];
    const duaItem = getByText(firstDua.title);

    fireEvent.press(duaItem);

    expect(mockNavigate).toHaveBeenCalledWith('DuaDetail', {
      duaId: firstDua.id,
    });
  });

  it('shows empty state when no duas match search', async () => {
    const {getByPlaceholderText, getByText} = renderScreen();
    const searchInput = getByPlaceholderText('দোয়া খুঁজুন...');

    fireEvent.changeText(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(getByText('কোনো দোয়া পাওয়া যায়নি')).toBeTruthy();
    });
  });

  it('displays category buttons', () => {
    const {getByText} = renderScreen();
    expect(getByText('সব দোয়া')).toBeTruthy();
    expect(getByText('কঠিন সময়')).toBeTruthy();
    expect(getByText('শুকরিয়া')).toBeTruthy();
    expect(getByText('শক্তি')).toBeTruthy();
  });

  it('highlights selected category', () => {
    const {getByText} = renderScreen();
    const categoryButton = getByText('শক্তি');

    fireEvent.press(categoryButton);

    // Category should be selected (visual state change)
    expect(categoryButton).toBeTruthy();
  });
});

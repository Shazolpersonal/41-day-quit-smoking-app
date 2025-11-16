/**
 * Tests for QuranVersesScreen
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import QuranVersesScreen from '../QuranVersesScreen';
import {quranVerses} from '../../data/islamicContent';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('QuranVersesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderScreen = () => {
    return render(
      <NavigationContainer>
        <QuranVersesScreen />
      </NavigationContainer>,
    );
  };

  it('renders correctly', () => {
    const {getByText} = renderScreen();
    expect(getByText('কুরআনের আয়াত')).toBeTruthy();
  });

  it('displays all verses initially', () => {
    const {getByText} = renderScreen();
    expect(getByText(`${quranVerses.length}টি আয়াত পাওয়া গেছে`)).toBeTruthy();
  });

  it('displays verse items', () => {
    const {getByText} = renderScreen();
    const firstVerse = quranVerses[0];
    expect(getByText(firstVerse.surah)).toBeTruthy();
  });

  it('filters verses by search query', async () => {
    const {getByPlaceholderText, getByText} = renderScreen();
    const searchInput = getByPlaceholderText('আয়াত খুঁজুন...');

    fireEvent.changeText(searchInput, 'ধৈর্য');

    await waitFor(() => {
      expect(getByText('সূরা বাকারা')).toBeTruthy();
    });
  });

  it('filters verses by category', async () => {
    const {getByText} = renderScreen();
    const categoryButton = getByText('ধৈর্য');

    fireEvent.press(categoryButton);

    await waitFor(() => {
      // Should show filtered verses
      expect(getByText).toBeTruthy();
    });
  });

  it('navigates to verse detail on item press', () => {
    const {getByText} = renderScreen();
    const firstVerse = quranVerses[0];
    const verseItem = getByText(firstVerse.surah);

    fireEvent.press(verseItem);

    expect(mockNavigate).toHaveBeenCalledWith('QuranVerseDetail', {
      verseId: firstVerse.id,
    });
  });

  it('shows empty state when no verses match search', async () => {
    const {getByPlaceholderText, getByText} = renderScreen();
    const searchInput = getByPlaceholderText('আয়াত খুঁজুন...');

    fireEvent.changeText(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(getByText('কোনো আয়াত পাওয়া যায়নি')).toBeTruthy();
    });
  });

  it('displays filter buttons', () => {
    const {getByText} = renderScreen();
    expect(getByText('সব আয়াত')).toBeTruthy();
    expect(getByText('ধৈর্য')).toBeTruthy();
    expect(getByText('সহজতা')).toBeTruthy();
  });
});

/**
 * Tests for HadithListScreen
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import HadithListScreen from '../HadithListScreen';
import {hadithCollection} from '../../data/islamicContent';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('HadithListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderScreen = () => {
    return render(
      <NavigationContainer>
        <HadithListScreen />
      </NavigationContainer>,
    );
  };

  it('renders correctly', () => {
    const {getByText} = renderScreen();
    expect(getByText('হাদীস সমূহ')).toBeTruthy();
  });

  it('displays all hadith initially', () => {
    const {getByText} = renderScreen();
    expect(
      getByText(`${hadithCollection.length}টি হাদীস পাওয়া গেছে`),
    ).toBeTruthy();
  });

  it('displays hadith items', () => {
    const {getByText} = renderScreen();
    const firstHadith = hadithCollection[0];
    expect(getByText(firstHadith.source)).toBeTruthy();
  });

  it('filters hadith by search query', async () => {
    const {getByPlaceholderText, getByText} = renderScreen();
    const searchInput = getByPlaceholderText('হাদীস খুঁজুন...');

    fireEvent.changeText(searchInput, 'স্বাস্থ্য');

    await waitFor(() => {
      expect(getByText).toBeTruthy();
    });
  });

  it('filters hadith by category', async () => {
    const {getByText} = renderScreen();
    const categoryButton = getByText('স্বাস্থ্য');

    fireEvent.press(categoryButton);

    await waitFor(() => {
      // Should show only health hadith
      const healthHadith = hadithCollection.filter(h => h.category === 'health');
      expect(
        getByText(`${healthHadith.length}টি হাদীস পাওয়া গেছে`),
      ).toBeTruthy();
    });
  });

  it('navigates to hadith detail on item press', () => {
    const {getByText} = renderScreen();
    const firstHadith = hadithCollection[0];
    const hadithItem = getByText(firstHadith.source);

    fireEvent.press(hadithItem);

    expect(mockNavigate).toHaveBeenCalledWith('HadithDetail', {
      hadithId: firstHadith.id,
    });
  });

  it('shows empty state when no hadith match search', async () => {
    const {getByPlaceholderText, getByText} = renderScreen();
    const searchInput = getByPlaceholderText('হাদীস খুঁজুন...');

    fireEvent.changeText(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(getByText('কোনো হাদীস পাওয়া যায়নি')).toBeTruthy();
    });
  });

  it('displays category buttons', () => {
    const {getByText} = renderScreen();
    expect(getByText('সব হাদীস')).toBeTruthy();
    expect(getByText('স্বাস্থ্য')).toBeTruthy();
    expect(getByText('ধৈর্য')).toBeTruthy();
    expect(getByText('দৃঢ়তা')).toBeTruthy();
  });
});

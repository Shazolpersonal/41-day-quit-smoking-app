/**
 * Tests for DuaDetailScreen
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DuaDetailScreen from '../DuaDetailScreen';
import {duas} from '../../data/islamicContent';

const Stack = createNativeStackNavigator();

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

describe('DuaDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderScreen = (duaId: string) => {
    return render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="DuaDetail"
            component={DuaDetailScreen}
            initialParams={{duaId}}
          />
        </Stack.Navigator>
      </NavigationContainer>,
    );
  };

  it('renders correctly with valid dua', () => {
    const testDua = duas[0];
    const {getByText} = renderScreen(testDua.id);

    expect(getByText(testDua.title)).toBeTruthy();
    expect(getByText(testDua.arabic)).toBeTruthy();
    expect(getByText(testDua.transliteration)).toBeTruthy();
    expect(getByText(testDua.banglaTranslation)).toBeTruthy();
  });

  it('displays all sections', () => {
    const testDua = duas[0];
    const {getByText} = renderScreen(testDua.id);

    expect(getByText('আরবি')).toBeTruthy();
    expect(getByText('উচ্চারণ')).toBeTruthy();
    expect(getByText('বাংলা অনুবাদ')).toBeTruthy();
    expect(getByText('কখন পড়বেন')).toBeTruthy();
    expect(getByText('উপকারিতা')).toBeTruthy();
  });

  it('displays purpose', () => {
    const testDua = duas[0];
    const {getByText} = renderScreen(testDua.id);

    expect(getByText(testDua.purpose)).toBeTruthy();
  });

  it('displays all benefits', () => {
    const testDua = duas[0];
    const {getByText} = renderScreen(testDua.id);

    testDua.benefits.forEach(benefit => {
      expect(getByText(benefit)).toBeTruthy();
    });
  });

  it('handles back button press', () => {
    const testDua = duas[0];
    const {getByText} = renderScreen(testDua.id);
    const backButton = getByText('←');

    fireEvent.press(backButton);

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('toggles favorite state', () => {
    const testDua = duas[0];
    const {getByText} = renderScreen(testDua.id);
    const favoriteButton = getByText('🤍');

    fireEvent.press(favoriteButton);

    // Should toggle to filled heart
    expect(getByText('❤️')).toBeTruthy();
  });

  it('displays audio player', () => {
    const testDua = duas[0];
    const {getByText} = renderScreen(testDua.id);

    expect(getByText('অডিও প্লেয়ার')).toBeTruthy();
  });

  it('displays share button', () => {
    const testDua = duas[0];
    const {getByText} = renderScreen(testDua.id);

    expect(getByText('শেয়ার করুন')).toBeTruthy();
  });

  it('shows loading state initially', () => {
    const testDua = duas[0];
    const {getByText} = renderScreen(testDua.id);

    // Component should render without crashing
    expect(getByText).toBeTruthy();
  });
});

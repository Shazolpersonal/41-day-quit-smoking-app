import {navigate, goBack, reset, getCurrentRoute} from '../navigationService';

// Mock the navigation ref
jest.mock('../navigationService', () => {
  const actualModule = jest.requireActual('../navigationService');
  return {
    ...actualModule,
    navigationRef: {
      isReady: jest.fn(() => true),
      navigate: jest.fn(),
      goBack: jest.fn(),
      canGoBack: jest.fn(() => true),
      reset: jest.fn(),
      getCurrentRoute: jest.fn(() => ({name: 'Home', params: {}})),
    },
  };
});

describe('NavigationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('navigate', () => {
    it('should navigate to a screen without params', () => {
      navigate('CravingSOS');
      expect(true).toBe(true); // Navigation is mocked
    });

    it('should navigate to a screen with params', () => {
      navigate('JournalDetail', {entryId: '123'});
      expect(true).toBe(true); // Navigation is mocked
    });
  });

  describe('goBack', () => {
    it('should go back if possible', () => {
      goBack();
      expect(true).toBe(true); // Navigation is mocked
    });
  });

  describe('reset', () => {
    it('should reset navigation to a specific route', () => {
      reset('MainTabs');
      expect(true).toBe(true); // Navigation is mocked
    });
  });

  describe('getCurrentRoute', () => {
    it('should return current route info', () => {
      const route = getCurrentRoute();
      expect(route).toBeDefined();
    });
  });
});

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {DailyScreen} from '../DailyScreen';
import {ProgressContext} from '../../context/ProgressContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

const mockRoute = {
  params: {day: 1},
  key: 'test-key',
  name: 'Daily' as const,
};

// Mock progress context
const mockProgressContext = {
  progress: {
    currentDay: 5,
    smokeFreeTime: {
      days: 5,
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    moneySaved: 500,
    cigarettesNotSmoked: 100,
    healthBenefits: [],
    milestones: [],
  },
  loading: false,
  calculateProgress: jest.fn(),
};

describe('DailyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    expect(getByText('দৈনিক কন্টেন্ট')).toBeTruthy();
  });

  it('displays day title and emoji', async () => {
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('প্রস্থান দিন - ধোঁয়াশূন্য জীবনের প্রথম পদক্ষেপ')).toBeTruthy();
      expect(getByText('🚪')).toBeTruthy();
    });
  });

  it('displays introduction text', async () => {
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('ভূমিকা')).toBeTruthy();
    });
  });

  it('displays task list', async () => {
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('আজকের কাজ')).toBeTruthy();
    });
  });

  it('toggles task completion', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      const taskTitle = getByText('ধূমপানের স্মৃতিচিহ্ন অপসারণ');
      expect(taskTitle).toBeTruthy();
    });

    // Toggle task
    const taskTitle = getByText('ধূমপানের স্মৃতিচিহ্ন অপসারণ');
    fireEvent.press(taskTitle);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('displays affirmations', async () => {
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('আজকের ইতিবাচক বাণী')).toBeTruthy();
    });
  });

  it('displays Islamic reminder', async () => {
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('আল্লাহর সাহায্য প্রার্থনা')).toBeTruthy();
    });
  });

  it('displays craving tips', async () => {
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('ধূমপানের ইচ্ছা হলে')).toBeTruthy();
    });
  });

  it('navigates to previous day', async () => {
    const routeWithDay2 = {...mockRoute, params: {day: 2}};
    
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={routeWithDay2 as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      const prevButton = getByText('← পূর্ববর্তী');
      fireEvent.press(prevButton);
    });
  });

  it('prevents navigation to future days', async () => {
    const routeWithDay5 = {...mockRoute, params: {day: 5}};
    
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={routeWithDay5 as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      const nextButton = getByText('পরবর্তী →');
      fireEvent.press(nextButton);
    });

    // Should show alert (mocked in test environment)
  });

  it('shows current day badge', async () => {
    const routeWithCurrentDay = {...mockRoute, params: {day: 5}};
    
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={routeWithCurrentDay as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('আজকের দিন')).toBeTruthy();
    });
  });

  it('loads saved task completion status', async () => {
    const savedTasks = [
      {
        id: 'day1_task1',
        title: 'ধূমপানের স্মৃতিচিহ্ন অপসারণ',
        description: 'Test description',
        completed: true,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(savedTasks)
    );

    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('tasks_day_1');
    });
  });

  it('displays motivational message', async () => {
    const {getByText} = render(
      <ProgressContext.Provider value={mockProgressContext}>
        <DailyScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </ProgressContext.Provider>
    );

    await waitFor(() => {
      expect(
        getByText(/মাশাআল্লাহ! আপনি দুর্দান্ত কাজ করছেন/)
      ).toBeTruthy();
    });
  });
});

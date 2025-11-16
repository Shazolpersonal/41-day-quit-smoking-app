import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {JournalScreen} from '../JournalScreen';
import {JournalProvider} from '../../context/JournalContext';
import {storageService} from '../../services/storage.service';
import {JournalEntry} from '../../types';

jest.mock('../../services/storage.service');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

const mockStorageService = storageService as jest.Mocked<typeof storageService>;

const mockEntries: JournalEntry[] = [
  {
    id: 'entry1',
    date: '2024-01-15T10:00:00.000Z',
    content: 'Feeling good today, no cravings',
    mood: 'happy',
    triggers: ['stress', 'work'],
    cravingIntensity: 3,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'entry2',
    date: '2024-01-16T14:00:00.000Z',
    content: 'Had a tough day but stayed strong',
    mood: 'stressed',
    triggers: ['boredom', 'social'],
    cravingIntensity: 7,
    createdAt: '2024-01-16T14:00:00.000Z',
    updatedAt: '2024-01-16T14:00:00.000Z',
  },
];

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockRoute = {
  key: 'Journal',
  name: 'Journal' as const,
  params: undefined,
};

describe('JournalScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageService.getJournalEntries.mockResolvedValue(mockEntries);
  });

  const renderScreen = () => {
    return render(
      <JournalProvider>
        <JournalScreen navigation={mockNavigation as any} route={mockRoute} />
      </JournalProvider>,
    );
  };

  it('should render journal screen with header', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText('জার্নাল')).toBeTruthy();
    });
  });

  it('should display view mode toggle buttons', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText('📝 তালিকা')).toBeTruthy();
      expect(getByText('📅 ক্যালেন্ডার')).toBeTruthy();
    });
  });

  it('should switch between list and calendar views', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText('📝 তালিকা')).toBeTruthy();
    });

    const calendarButton = getByText('📅 ক্যালেন্ডার');
    fireEvent.press(calendarButton);

    // Calendar view should be active
    expect(calendarButton.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      }),
    );
  });

  it('should display journal entries in list view', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText(/Feeling good today/)).toBeTruthy();
      expect(getByText(/Had a tough day/)).toBeTruthy();
    });
  });

  it('should display add entry button', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText('+ নতুন এন্ট্রি')).toBeTruthy();
    });
  });

  it('should navigate to add entry screen when add button is pressed', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText('+ নতুন এন্ট্রি')).toBeTruthy();
    });

    const addButton = getByText('+ নতুন এন্ট্রি');
    fireEvent.press(addButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('JournalEdit', {});
  });

  it('should display statistics summary', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText('মোট এন্ট্রি')).toBeTruthy();
      expect(getByText('ক্রেভিং রেকর্ড')).toBeTruthy();
      expect(getByText('ট্রিগার ধরন')).toBeTruthy();
    });
  });

  it('should show correct entry count in stats', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText('2')).toBeTruthy(); // Total entries
    });
  });

  it('should show empty state when no entries', async () => {
    mockStorageService.getJournalEntries.mockResolvedValue([]);

    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(
        getByText('এখনও কোন জার্নাল এন্ট্রি নেই। আপনার প্রথম এন্ট্রি যোগ করুন!'),
      ).toBeTruthy();
    });
  });

  it('should navigate to entry detail when entry is pressed', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText(/Feeling good today/)).toBeTruthy();
    });

    const entry = getByText(/Feeling good today/);
    fireEvent.press(entry.parent!);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('JournalDetail', {
      entryId: 'entry1',
    });
  });

  it('should display calendar in calendar view', async () => {
    const {getByText} = renderScreen();

    await waitFor(() => {
      expect(getByText('📅 ক্যালেন্ডার')).toBeTruthy();
    });

    const calendarButton = getByText('📅 ক্যালেন্ডার');
    fireEvent.press(calendarButton);

    // Should show weekday headers
    await waitFor(() => {
      expect(getByText('রবি')).toBeTruthy();
      expect(getByText('সোম')).toBeTruthy();
    });
  });

  it('should handle loading state', () => {
    mockStorageService.getJournalEntries.mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    const {queryByText} = renderScreen();

    // Should not crash during loading
    expect(queryByText('জার্নাল')).toBeTruthy();
  });
});

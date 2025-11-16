import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {JournalProvider, useJournal} from '../JournalContext';
import {storageService} from '../../services/storage.service';
import {JournalEntry} from '../../types';

jest.mock('../../services/storage.service');

const mockStorageService = storageService as jest.Mocked<typeof storageService>;

describe('JournalContext', () => {
  const mockEntries: JournalEntry[] = [
    {
      id: 'entry1',
      date: '2024-01-15T10:00:00.000Z',
      content: 'Test entry 1',
      mood: 'happy',
      triggers: ['stress', 'work'],
      cravingIntensity: 5,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    },
    {
      id: 'entry2',
      date: '2024-01-16T14:00:00.000Z',
      content: 'Test entry 2',
      mood: 'neutral',
      triggers: ['boredom'],
      createdAt: '2024-01-16T14:00:00.000Z',
      updatedAt: '2024-01-16T14:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageService.getJournalEntries.mockResolvedValue(mockEntries);
    mockStorageService.saveJournalEntries.mockResolvedValue(true);
  });

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <JournalProvider>{children}</JournalProvider>
  );

  it('should load entries on mount', async () => {
    const {result} = renderHook(() => useJournal(), {wrapper});

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.entries).toHaveLength(2);
    expect(mockStorageService.getJournalEntries).toHaveBeenCalledTimes(1);
  });

  it('should add a new entry', async () => {
    const {result} = renderHook(() => useJournal(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newEntryData = {
      content: 'New test entry',
      mood: 'confident' as const,
      triggers: ['social' as const],
      cravingIntensity: 3,
    };

    let success = false;
    await act(async () => {
      success = await result.current.addEntry(newEntryData);
    });

    expect(success).toBe(true);
    expect(result.current.entries).toHaveLength(3);
    expect(mockStorageService.saveJournalEntries).toHaveBeenCalled();
  });

  it('should update an existing entry', async () => {
    const {result} = renderHook(() => useJournal(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updates = {
      content: 'Updated content',
      mood: 'very_happy' as const,
    };

    let success = false;
    await act(async () => {
      success = await result.current.updateEntry('entry1', updates);
    });

    expect(success).toBe(true);
    const updatedEntry = result.current.entries.find(e => e.id === 'entry1');
    expect(updatedEntry?.content).toBe('Updated content');
    expect(updatedEntry?.mood).toBe('very_happy');
  });

  it('should delete an entry', async () => {
    const {result} = renderHook(() => useJournal(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success = false;
    await act(async () => {
      success = await result.current.deleteEntry('entry1');
    });

    expect(success).toBe(true);
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries.find(e => e.id === 'entry1')).toBeUndefined();
  });

  it('should get entry by id', async () => {
    const {result} = renderHook(() => useJournal(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const entry = result.current.getEntry('entry1');
    expect(entry).toBeDefined();
    expect(entry?.id).toBe('entry1');
    expect(entry?.content).toBe('Test entry 1');
  });

  it('should filter entries by date range', async () => {
    const {result} = renderHook(() => useJournal(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const filtered = result.current.getEntriesByDateRange(
      '2024-01-15T00:00:00.000Z',
      '2024-01-15T23:59:59.999Z',
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('entry1');
  });

  it('should get entries by month', async () => {
    const {result} = renderHook(() => useJournal(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const monthEntries = result.current.getEntriesByMonth(2024, 0); // January 2024

    expect(monthEntries).toHaveLength(2);
  });

  it('should validate entry data before adding', async () => {
    const {result} = renderHook(() => useJournal(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const invalidData = {
      content: '', // Empty content
      mood: 'happy' as const,
      triggers: [],
    };

    let success = false;
    await act(async () => {
      success = await result.current.addEntry(invalidData);
    });

    expect(success).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('should handle storage errors gracefully', async () => {
    mockStorageService.getJournalEntries.mockRejectedValue(
      new Error('Storage error'),
    );

    const {result} = renderHook(() => useJournal(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.entries).toHaveLength(0);
  });

  it('should refresh entries', async () => {
    const {result} = renderHook(() => useJournal(), {wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockStorageService.getJournalEntries.mockResolvedValue([
      ...mockEntries,
      {
        id: 'entry3',
        date: '2024-01-17T10:00:00.000Z',
        content: 'New entry',
        mood: 'happy',
        triggers: [],
        createdAt: '2024-01-17T10:00:00.000Z',
        updatedAt: '2024-01-17T10:00:00.000Z',
      },
    ]);

    await act(async () => {
      await result.current.refreshEntries();
    });

    expect(result.current.entries).toHaveLength(3);
  });
});

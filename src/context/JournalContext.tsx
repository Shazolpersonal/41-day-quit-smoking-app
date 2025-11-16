import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {JournalEntry, MoodType, TriggerType} from '../types';
import {JournalEntryModel} from '../models/JournalEntry';
import {storageService} from '../services/storage.service';

interface JournalContextType {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: {
    content: string;
    mood: MoodType;
    triggers: TriggerType[];
    cravingIntensity?: number;
    date?: string;
  }) => Promise<boolean>;
  updateEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<boolean>;
  getEntry: (id: string) => JournalEntry | undefined;
  getEntriesByDateRange: (startDate: string, endDate: string) => JournalEntry[];
  getEntriesByMonth: (year: number, month: number) => JournalEntry[];
  refreshEntries: () => Promise<void>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

interface JournalProviderProps {
  children: ReactNode;
}

export const JournalProvider: React.FC<JournalProviderProps> = ({children}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const journalData = await storageService.getJournalEntries();
      const sortedEntries = JournalEntryModel.sortByDate(journalData);
      setEntries(sortedEntries);
    } catch (err) {
      setError('জার্নাল এন্ট্রি লোড করতে ব্যর্থ');
      // eslint-disable-next-line no-console
      console.error('Error loading journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (data: {
    content: string;
    mood: MoodType;
    triggers: TriggerType[];
    cravingIntensity?: number;
    date?: string;
  }): Promise<boolean> => {
    try {
      setError(null);

      const validation = JournalEntryModel.validate(data);
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        return false;
      }

      const newEntry = JournalEntryModel.create(data);
      const success = await storageService.saveJournalEntry(newEntry);

      if (success) {
        const updatedEntries = [...entries, newEntry];
        setEntries(JournalEntryModel.sortByDate(updatedEntries));
        return true;
      } else {
        setError('জার্নাল এন্ট্রি সংরক্ষণ করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('জার্নাল এন্ট্রি যোগ করতে ত্রুটি');
      // eslint-disable-next-line no-console
      console.error('Error adding journal entry:', err);
      return false;
    }
  };

  const updateEntry = async (
    id: string,
    updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>,
  ): Promise<boolean> => {
    try {
      setError(null);

      const entry = entries.find(e => e.id === id);
      if (!entry) {
        setError('জার্নাল এন্ট্রি পাওয়া যায়নি');
        return false;
      }

      const validation = JournalEntryModel.validate({...entry, ...updates});
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        return false;
      }

      const updatedEntry = JournalEntryModel.update(entry, updates);
      const success = await storageService.saveJournalEntry(updatedEntry);

      if (success) {
        const updatedEntries = entries.map(e => (e.id === id ? updatedEntry : e));
        setEntries(JournalEntryModel.sortByDate(updatedEntries));
        return true;
      } else {
        setError('জার্নাল এন্ট্রি আপডেট করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('জার্নাল এন্ট্রি আপডেট করতে ত্রুটি');
      // eslint-disable-next-line no-console
      console.error('Error updating journal entry:', err);
      return false;
    }
  };

  const deleteEntry = async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const success = await storageService.deleteJournalEntry(id);

      if (success) {
        const updatedEntries = entries.filter(e => e.id !== id);
        setEntries(updatedEntries);
        return true;
      } else {
        setError('জার্নাল এন্ট্রি মুছে ফেলতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('জার্নাল এন্ট্রি মুছে ফেলতে ত্রুটি');
      // eslint-disable-next-line no-console
      console.error('Error deleting journal entry:', err);
      return false;
    }
  };

  const getEntry = (id: string): JournalEntry | undefined => {
    return entries.find(e => e.id === id);
  };

  const getEntriesByDateRange = (startDate: string, endDate: string): JournalEntry[] => {
    return JournalEntryModel.filterByDateRange(entries, startDate, endDate);
  };

  const getEntriesByMonth = (year: number, month: number): JournalEntry[] => {
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    return getEntriesByDateRange(startDate, endDate);
  };

  const refreshEntries = async (): Promise<void> => {
    await loadEntries();
  };

  const value: JournalContextType = {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    getEntriesByDateRange,
    getEntriesByMonth,
    refreshEntries,
  };

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
};

export const useJournal = (): JournalContextType => {
  const context = useContext(JournalContext);

  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }

  return context;
};

export default JournalContext;

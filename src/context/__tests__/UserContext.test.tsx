import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {UserProvider, useUser} from '../UserContext';
import {storageService} from '../../services/storage.service';
import {User} from '../../types';

// Mock the storage service
jest.mock('../../services/storage.service');

const mockStorageService = storageService as jest.Mocked<typeof storageService>;

describe('UserContext', () => {
  const mockUser: User = {
    id: 'user_123',
    quitDate: '2024-01-01T00:00:00.000Z',
    cigarettesPerDay: 20,
    pricePerPack: 350,
    cigarettesPerPack: 20,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <UserProvider>{children}</UserProvider>
  );

  describe('Initial State', () => {
    it('should load user data on mount', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);

      const {result} = renderHook(() => useUser(), {wrapper});

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.error).toBeNull();
    });

    it('should handle no user data', async () => {
      mockStorageService.getUser.mockResolvedValue(null);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should handle loading error', async () => {
      mockStorageService.getUser.mockRejectedValue(new Error('Storage error'));

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe('ব্যবহারকারীর তথ্য লোড করতে ব্যর্থ');
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      mockStorageService.getUser.mockResolvedValue(null);
      mockStorageService.saveUser.mockResolvedValue(true);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const userData = {
        quitDate: '2024-01-01T00:00:00.000Z',
        cigarettesPerDay: 20,
        pricePerPack: 350,
        cigarettesPerPack: 20,
      };

      let success: boolean = false;
      await act(async () => {
        success = await result.current.createUser(userData);
      });

      expect(success).toBe(true);
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.cigarettesPerDay).toBe(20);
      expect(result.current.error).toBeNull();
    });

    it('should reject invalid user data', async () => {
      mockStorageService.getUser.mockResolvedValue(null);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const invalidData = {
        quitDate: '2024-01-01T00:00:00.000Z',
        cigarettesPerDay: -5, // Invalid
        pricePerPack: 350,
        cigarettesPerPack: 20,
      };

      let success: boolean = false;
      await act(async () => {
        success = await result.current.createUser(invalidData);
      });

      expect(success).toBe(false);
      expect(result.current.error).toContain('০ এর কম হতে পারে না');
    });

    it('should handle storage failure', async () => {
      mockStorageService.getUser.mockResolvedValue(null);
      mockStorageService.saveUser.mockResolvedValue(false);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const userData = {
        quitDate: '2024-01-01T00:00:00.000Z',
        cigarettesPerDay: 20,
        pricePerPack: 350,
        cigarettesPerPack: 20,
      };

      let success: boolean = false;
      await act(async () => {
        success = await result.current.createUser(userData);
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('ব্যবহারকারী তৈরি করতে ব্যর্থ');
    });
  });

  describe('updateUser', () => {
    it('should update user data successfully', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);
      mockStorageService.saveUser.mockResolvedValue(true);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateUser({cigarettesPerDay: 15});
      });

      expect(success).toBe(true);
      expect(result.current.user?.cigarettesPerDay).toBe(15);
      expect(result.current.error).toBeNull();
    });

    it('should reject invalid updates', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateUser({pricePerPack: -100});
      });

      expect(success).toBe(false);
      expect(result.current.error).toContain('০ এর কম হতে পারে না');
    });

    it('should fail when no user exists', async () => {
      mockStorageService.getUser.mockResolvedValue(null);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateUser({cigarettesPerDay: 15});
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('কোন ব্যবহারকারী পাওয়া যায়নি');
    });
  });

  describe('updateQuitDate', () => {
    it('should update quit date successfully', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);
      mockStorageService.saveUser.mockResolvedValue(true);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newQuitDate = '2024-02-01T00:00:00.000Z';
      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateQuitDate(newQuitDate);
      });

      expect(success).toBe(true);
      expect(result.current.user?.quitDate).toBe(newQuitDate);
    });

    it('should reject future quit date', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateQuitDate(futureDate.toISOString());
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('ধূমপান ত্যাগের তারিখ ভবিষ্যতে হতে পারে না');
    });
  });

  describe('updateCigaretteData', () => {
    it('should update cigarette data successfully', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);
      mockStorageService.saveUser.mockResolvedValue(true);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateCigaretteData(15, 400, 20);
      });

      expect(success).toBe(true);
      expect(result.current.user?.cigarettesPerDay).toBe(15);
      expect(result.current.user?.pricePerPack).toBe(400);
    });

    it('should reject negative cigarettes per day', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateCigaretteData(-5, 350, 20);
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('প্রতিদিন সিগারেটের সংখ্যা ০ এর কম হতে পারে না');
    });

    it('should reject negative price per pack', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateCigaretteData(20, -100, 20);
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('প্যাকেটের দাম ০ এর কম হতে পারে না');
    });

    it('should reject invalid cigarettes per pack', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateCigaretteData(20, 350, 0);
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('প্যাকেটে সিগারেটের সংখ্যা কমপক্ষে ১ হতে হবে');
    });
  });

  describe('refreshUser', () => {
    it('should reload user data from storage', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updatedUser = {...mockUser, cigarettesPerDay: 10};
      mockStorageService.getUser.mockResolvedValue(updatedUser);

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.user?.cigarettesPerDay).toBe(10);
    });
  });

  describe('clearUser', () => {
    it('should clear user data successfully', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);
      mockStorageService.clearAllData.mockResolvedValue(true);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.clearUser();
      });

      expect(success).toBe(true);
      expect(result.current.user).toBeNull();
    });

    it('should handle clear failure', async () => {
      mockStorageService.getUser.mockResolvedValue(mockUser);
      mockStorageService.clearAllData.mockResolvedValue(false);

      const {result} = renderHook(() => useUser(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.clearUser();
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('ব্যবহারকারীর তথ্য মুছে ফেলতে ব্যর্থ');
    });
  });

  describe('Hook Usage', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useUser());
      }).toThrow('useUser must be used within a UserProvider');

      console.error = originalError;
    });
  });
});
